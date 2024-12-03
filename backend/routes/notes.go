package routes

import (
	"backend/controllers"
	"log"

	"github.com/gorilla/mux"
)

func InitializeRoutes() *mux.Router {

	router := mux.NewRouter()

	notesRouter := router.PathPrefix("/api/notes").Subrouter()

	// Handle OPTIONS preflight requests
	notesRouter.HandleFunc("/api/notes/{id:[a-fA-F0-9]{24}}", controllers.GetNoteByID).Methods("OPTIONS")
	notesRouter.HandleFunc("/api/notes", controllers.CreateNote).Methods("OPTIONS")
	notesRouter.HandleFunc("/api/notes/{id:[a-fA-F0-9]{24}}", controllers.UpdateNote).Methods("OPTIONS")
	notesRouter.HandleFunc("/api/notes/{id:[a-fA-F0-9]{24}}", controllers.DeleteNote).Methods("OPTIONS")

	notesRouter.HandleFunc("/", controllers.GetAllNotes).Methods("GET")
	notesRouter.HandleFunc("/{id:[a-fA-F0-9]{24}}", controllers.GetNoteByID).Methods("GET")
	notesRouter.HandleFunc("/", controllers.CreateNote).Methods("POST")
	notesRouter.HandleFunc("/{id:[a-fA-F0-9]{24}}", controllers.UpdateNote).Methods("PUT")
	notesRouter.HandleFunc("/{id:[a-fA-F0-9]{24}}", controllers.DeleteNote).Methods("DELETE")

	log.Println("Registered routes:")
	router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		path, err := route.GetPathTemplate()
		if err == nil {
			log.Println(path)
		}
		return nil
	})

	return router

}
