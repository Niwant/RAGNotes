package controllers


  import (
	//"backend/database"
	//"backend/models"
	//"context"
	//"encoding/json"
	//"log"
	"net/http"
	//"time"

	//"github.com/gorilla/mux"
	//"go.mongodb.org/mongo-driver/bson"
	//"go.mongodb.org/mongo-driver/bson/primitive"
	//"go.mongodb.org/mongo-driver/mongo"
	//"go.mongodb.org/mongo-driver/mongo/options"
)

func ChatResponse(w http.ResponseWriter, r *http.Request) {

  w.Header().Set("Content-Type", "application/json")
  w.Write([]byte(`{"message":"Chat response"}`))
}
