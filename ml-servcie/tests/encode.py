import os
from sentence_transformers import SentenceTransformer, CrossEncoder
from transformers import RobertaTokenizerFast, RobertaModel
import torch
import re
import warnings
from PyPDF2 import PdfReader
from ebooklib import epub, ITEM_DOCUMENT
import psycopg2

class SentenceModel:
    def __init__(self):
        """
        Initializes the tokenizer and model with the specified model name.
        """
        self.model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')
        self.ce = CrossEncoder('cross-encoder/stsb-TinyBERT-L-4')

    def encode(self, text):
        """
        Encodes the input text into a fixed-size tensor representation.
        
        Args:
        - text (str or list of str): Input text or list of texts to encode.

        Returns:
        - encodings 2D Array.
        """
        encodings = self.model.encode(sentences=text, batch_size=16, show_progress_bar=True).tolist()

        return encodings
    
    def generate_augmented_prompt(self, query, connection, doc_id):

        query_encoding = self.encode(text=query)

        cursor = connection.cursor()

        try:
            cursor.execute(f"""SELECT para_id,
                           para_encodings <=> '{list(query_encoding)}' as cos_distance,
                           para_text 
                           FROM paragraphs 
                           WHERE doc_id = '{doc_id}' 
                           ORDER BY para_encodings <=> '{list(query_encoding)}'
                           LIMIT 64;""")

            results = cursor.fetchall()
        except psycopg2.Error as e:
            print(f"Error executing SELECT query: {e}")

        finally:
            cursor.close()
            connection.close()

        # Extract paragraph texts for ranking
        context = [text for _, _, text in results]

        # Rank paragraphs using the CrossEncoder
        scores = self.ce.predict([(query, para) for para in context], batch_size=8)

        # Combine paragraphs with their scores
        ranked_contexts = sorted(zip(context, scores), key=lambda x: x[1], reverse=True)

        # Extract the top 10 contexts
        top_contexts = [ctx for ctx, _ in ranked_contexts[:15]]

        prompt = f"""You are a helpful Assistant. Given the context below,
        Context Started

        {'. '.join(top_contexts)}
        Context Ended
        Now answer the following question by confering to the given context only. If the answer is not present in the context, say so.
        Question: {query}
        """

        return prompt

class RobertaModel:
    def __init__(self, model_name="roberta-base", truncation=False):
        """
        Initializes the tokenizer and model with the specified model name.
        """
        self.tokenizer = RobertaTokenizerFast.from_pretrained(model_name)
        self.model = RobertaModel.from_pretrained(model_name)
        self.truncation = truncation
    
    def encode(self, text, max_length=512, padding=True):
        """
        Encodes the input text into a fixed-size tensor representation.
        
        Args:
        - text (str or list of str): Input text or list of texts to encode.
        - max_length (int): Maximum sequence length.
        - padding (bool or str): Whether to pad the sequences ('longest' or True for padding to longest sequence in batch).
        - truncation (bool): Whether to truncate sequences longer than `max_length`.

        Returns:
        - encodings (torch.Tensor): Tensor of sentence encodings.
        """
        # Validate input text length to avoid truncation
        inputs = self.tokenizer(
            text,
            max_length=max_length,
            padding=padding,
            truncation=self.truncation,
            return_tensors="pt"  # Return PyTorch tensors
        )

        if len(inputs["input_ids"][0]) > max_length:
            raise ValueError(
                f"Input text exceeds the maximum token length of {max_length}. "
                f"Tokenized length: {len(inputs['input_ids'][0])}. Please truncate or shorten the input."
            )

        # Tokenize input text
        inputs = self.tokenizer(
            text,
            max_length=max_length,
            padding=padding,
            truncation=self.truncation,
            return_tensors="pt"
        )

        # Compute model outputs without gradient tracking
        with torch.no_grad():
            outputs = self.model(**inputs)

        # Extract the last hidden state
        last_hidden_state = outputs.last_hidden_state

        # Average the hidden states across the sequence length (dim=1)
        encodings = torch.mean(last_hidden_state, dim=1).squeeze().tolist()

        return encodings
    
class Chunkify:
    def __init__(self, chunk_size=300):
        self.chunk_size = chunk_size

    @staticmethod
    def extract_text_from_file(input_file_path):
        """
        Extracts text from a file based on its extension and saves it to a .txt file.
        
        Args:
            input_file_path (str): Path to the input file (.pdf or .epub).
        Returns:
            str: Path to the created text file or None if there was an error.
        """
        file_extension = os.path.splitext(input_file_path)[1].lower()
        output_file_path = os.path.splitext(input_file_path)[0] + "_content.txt"

        if file_extension == ".pdf":
            # Extract text from PDF
            try:
                reader = PdfReader(input_file_path)
                pdf_text = ""
                for page in reader.pages:
                    pdf_text += page.extract_text()
                with open(output_file_path, "w", encoding="utf-8") as output_file:
                    output_file.write(pdf_text)
                print(f"PDF text extracted and saved to {output_file_path}")
            except Exception as e:
                print(f"Error processing PDF: {e}")
                return None

        elif file_extension == ".epub":
            # Extract text from EPUB
            try:
                # Suppress warnings temporarily
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    book = epub.read_epub(input_file_path)

                epub_text = ""
                for item in book.get_items():
                    if item.get_type() == ITEM_DOCUMENT:
                        epub_text += item.get_content().decode("utf-8")
                with open(output_file_path, "w", encoding="utf-8") as output_file:
                    output_file.write(epub_text)
                print(f"EPUB text extracted and saved to {output_file_path}")
            except Exception as e:
                print(f"Error processing EPUB: {e}")
                return None
        else:
            print(f"Unsupported file format: {file_extension}")
            return None

        return output_file_path

    @staticmethod
    def split_into_sentences(text):
        """
        Splits text into sentences using regular expressions.
        Handles common sentence-ending punctuations like '.', '!', and '?'.
        """
        sentence_endings = re.compile(r'(?<=[.!?])\s+')
        sentences = sentence_endings.split(text.strip())
        return sentences
    
    def chunkify(self, text):
        """
        Ensuring no sentence is broken and each chunk has approximately the specified word count.
        
        :param file_path: Path to the PDF file.
        :param chunk_size: Approximate number of words in each chunk.
        :return: List of text chunks.
        """

        text = re.sub(r'\s\.\s', ' ', text)
        text = re.sub(r'\b[A-Z]\b', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        text = re.sub(r'\d+', '', text)
        text = re.sub(r'\.{3,}', '.', text)

        sentences = self.split_into_sentences(text)
        chunks = []
        current_chunk = []
        current_word_count = 0

        for sentence in sentences:
            word_count = len(sentence.split())
            if current_word_count + word_count <= self.chunk_size:
                current_chunk.append(sentence)
                current_word_count += word_count
            else:
                chunks.append(" ".join(current_chunk))
                current_chunk = [sentence]
                current_word_count = word_count
        
        # Add the last chunk if it contains any sentences
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        print("Chunks Created!\nTotal Chunks ", len(chunks))
        
        return chunks