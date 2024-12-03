package controllers

import (
	"backend/models"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func GetAllNotes(w http.ResponseWriter, r *http.Request) {
	notes := models.GetAllNotes()
	w.Header().Set("Content-Type", "appliction/json")
	json.NewEncoder(w).Encode(notes)
}

func GetNoteByID(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]
	note, err := models.GetNoteByID(id)
	if err != nil {
		http.Error(w, "Note not found!!!", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(note)
}

func CreateNote(w http.ResponseWriter, r *http.Request) {
	var note models.Note
	_ = json.NewDecoder(r.Body).Decode(&note)
	models.CreateNote(note)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(note)
}
