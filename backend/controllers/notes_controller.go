package controllers

import (
	"backend/database"
	"backend/models"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetAllNotes(w http.ResponseWriter, r *http.Request) {

	collection := database.GetCollection("notes")
	cursor, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		http.Error(w, "Error Retrieving notes from DB", http.StatusInternalServerError)
	}
	defer cursor.Close(context.Background())
	var notes []models.Note
	for cursor.Next(context.Background()) {
		var note models.Note
		err := cursor.Decode(&note)
		if err != nil {
			http.Error(w, "Error decoding notes", http.StatusInternalServerError)
		}
		notes = append(notes, note)
	}
	if len(notes) == 0 {
		w.Write([]byte(`{"message":"No notes Found}`))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notes)

}

func GetNoteByID(w http.ResponseWriter, r *http.Request) {
	noteID, err := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	if err != nil {
		log.Fatal("Invalid note ID format:", err)
		return
	}
	collection := database.GetCollection("notes")
	filter := bson.M{"_id": noteID}

	var note models.Note
	err = collection.FindOne(context.Background(), filter).Decode(&note)
	if err == mongo.ErrNoDocuments {
		http.Error(w, "Note not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "Error retrieving note", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(note)
}

func CreateNote(w http.ResponseWriter, r *http.Request) {
	var note models.Note
	err := json.NewDecoder(r.Body).Decode(&note)
	if err != nil {
		log.Println(err)
		http.Error(w, "Error decoding Json", http.StatusBadRequest)
		return
	}
	note.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	note.UpdatedAt = note.CreatedAt

	collection := database.GetCollection("notes")
	_, err = collection.InsertOne(context.Background(), note)
	if err != nil {
		http.Error(w, "Error Inserting Note", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"message":"Note created successfully"}`))

}

func UpdateNote(w http.ResponseWriter, r *http.Request) {
	noteID, err := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	if err != nil {
		log.Fatal("Invalid note ID format:", err)
		return
	}
	var updateNote models.Note
	err = json.NewDecoder(r.Body).Decode(&updateNote)
	if err != nil {
		http.Error(w, "Error Decodinh JSON", http.StatusInternalServerError)
		return
	}

	updateNote.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	collection := database.GetCollection("notes")
	filter := bson.M{"_id": noteID}
	update := bson.M{
		"$set": updateNote,
	}
	result := collection.FindOneAndUpdate(context.Background(), filter, update, options.FindOneAndUpdate().SetReturnDocument(options.After))
	if result.Err() != nil {
		http.Error(w, "Error Updating Note", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message":"Note updated sucessfully"}`))
}

func DeleteNote(w http.ResponseWriter, r *http.Request) {
	noteID, err := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	if err != nil {
		log.Fatal("Invalid note ID format:", err)
		return
	}
	collection := database.GetCollection("notes")
	filter := bson.M{"_id": noteID}

	result, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error deleting note", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Note not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Note deleted successfully"}`))
}
