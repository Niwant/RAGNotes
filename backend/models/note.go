package models

import (
	"errors"
)

type Note struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

var notes = []Note{
	{ID: "1", Title: "Meeting Notes", Content: "Discuss timelines."},
	{ID: "2", Title: "Grocery List", Content: "Milk, Eggs, Bread."},
}

func GetAllNotes() []Note {
	return notes
}

func GetNoteByID(id string) (Note, error) {
	for _, note := range notes {
		if note.ID == id {
			return note, nil
		}
	}
	return Note{}, errors.New("Note not Found !!!")
}

func CreateNote(note Note) {
	note.ID = "3"
	notes = append(notes, note)
}
