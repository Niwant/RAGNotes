package routes

import (
	"backend/controllers"
	"log"

	"github.com/gorilla/mux"
)

func InitializeRoutes() *mux.Router {

	router := mux.NewRouter()

	notesRouter := router.PathPrefix("/api/notes").Subrouter()

	notesRouter.HandleFunc("/", controllers.GetAllNotes).Methods("GET")
	notesRouter.HandleFunc("/{id}", controllers.GetNoteByID).Methods("GET")
	notesRouter.HandleFunc("/", controllers.CreateNote).Methods("POST")
	// notesRouter.HandleFunc("/{id}", controllers.UpdateNote).Methods("PUT")
	// notesRouter.HandleFunc("/{id}", controllers.DeleteNote).Methods("DELETE")

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
