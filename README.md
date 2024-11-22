# RAGNotes
This projects aims to create a  RAG based Notes App


### Referenced folder structure 

RAGNote/
├── frontend/                     # Frontend React-based application
│   ├── public/                   # Static assets (images, icons, fonts)
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ChatInterface/    # Chat-based interaction
│   │   │   ├── FileUploader/     # Upload functionality
│   │   │   ├── NotesViewer/      # Display notes and content
│   │   └── pages/                # Pages (e.g., Home, Notes, Chat)
│   │   ├── App.js                # Main React component
│   │   ├── index.js              # Entry point
│   ├── package.json              # Frontend dependencies
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── webpack.config.js         # Webpack configuration
│
├── backend/                      # CRUD and API Backend in Node.js
│   ├── controllers/              # API controllers
│   │   ├── notesController.js    # CRUD operations for notes
│   │   ├── fileController.js     # File upload/download logic
│   │   ├── userController.js     # User authentication and management
│   ├── models/                   # MongoDB models (using Mongoose)
│   │   ├── notesModel.js         # Schema for notes
│   │   ├── fileModel.js          # Schema for uploaded files
│   │   └── userModel.js          # Schema for user authentication
│   ├── routes/                   # API routes
│   │   ├── notesRoutes.js        # Endpoints for notes CRUD
│   │   ├── fileRoutes.js         # Endpoints for file handling
│   │   └── userRoutes.js         # Endpoints for user management
│   ├── services/                 # Helper services (logic and utilities)
│   │   ├── fileProcessor.js      # Handles raw file parsing and preprocessing
│   │   └── database.js           # MongoDB connection logic
│   ├── utils/                    # Utility functions
│   │   ├── logger.js             # Logging utility
│   │   └── config.js             # Configuration (e.g., environment variables)
│   ├── app.js                    # Main Node.js server file
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Environment variables
│   └── tests/                    # Unit and integration tests
│       ├── testNotes.js          # Tests for notes CRUD
│       ├── testFiles.js          # Tests for file handling
│       └── testAuth.js           # Tests for user authentication
│
├── ml-service/                   # Python-based Machine Learning Service
│   ├── models/                   # Pre-trained or fine-tuned ML models
│   │   ├── summarization.py      # Summarization model logic
│   │   ├── embedding.py          # Embedding generation for semantic search
│   │   └── nlp_pipeline.py       # End-to-end NLP pipeline (classification, tagging)
│   ├── routes/                   # Flask routes for ML API
│   │   ├── summarize.py          # Endpoint for summarization
│   │   ├── search.py             # Semantic search endpoint
│   │   └── classify.py           # Text classification endpoint
│   ├── services/                 # Logic for preprocessing and inference
│   │   ├── text_preprocessor.py  # Text cleaning and preprocessing
│   │   ├── query_engine.py       # Query handling and response generation
│   │   └── embedding_utils.py    # Utilities for embedding generation and storage
│   ├── requirements.txt          # Python dependencies
│   ├── app.py                    # Flask server entry point
│   ├── config.py                 # Configuration for Flask and ML models
│   └── tests/                    # Tests for ML endpoints and logic
│       ├── testSummarization.py  # Tests for summarization
│       ├── testSearch.py         # Tests for semantic search
│       └── testClassify.py       # Tests for classification
│
├── data/                         # Central data repository
│   ├── raw_files/                # Uploaded files (PDFs, PPTs, etc.)
│   ├── processed_files/          # Processed and structured files
│   ├── embeddings/               # Embedding vectors for semantic search
│   ├── logs/                     # System logs for debugging
│   └── database/                 # Local database for testing
│
├── scripts/                      # Utility scripts for setup and maintenance
│   ├── initialize_db.js          # Script to initialize MongoDB schemas
│   ├── train_models.py           # Script to train or fine-tune models
│   └── ingest_data.py            # Script to process and index data
│
├── docker/                       # Docker configurations
│   ├── backend.Dockerfile        # Dockerfile for Node.js backend
│   ├── ml-service.Dockerfile     # Dockerfile for Python ML service
│   ├── docker-compose.yml        # Orchestrates backend, ML service, and database
│
├── README.md                     # Project documentation
├── .gitignore                    # Files to ignore in version control
├── .env                          # Global environment variables
└── LICENSE                       # Project license
