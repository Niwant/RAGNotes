import axios from "axios";

export interface Note {
    ID ?: string
    title: string
    content?:string
    createdAt?: string
    updatedAt?:string
}
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000", // Use environment variable or default to localhost
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials : true
  });

export const createNote = async(newNote : Note)=>{
    try{
        const response = await axiosInstance.post('/api/notes/' ,newNote,{
            headers: {
              'Content-Type': 'application/json',
            },
          })
        return response.data
    }catch(err){
        console.error('Error creating Note', err)
    }
}

export const getNotes = async () => {
    try {
      const response = await axiosInstance.get('/api/notes/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  };


  export const updateNote = async (note : Note) => {
    try {
      const response = await axiosInstance.put(`/api/notes/${note.ID}`, note ,{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  export const deleteNote = async(ID: string)=>{
    try {
        const response = await axiosInstance.delete(`/api/notes/${ID}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
      }
  }