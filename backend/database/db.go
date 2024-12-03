package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var db *mongo.Database

// Load environment variables and establish a MongoDB connection
func Connect() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get MongoDB connection URI from the environment variables
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI environment variable not set")
	}

	// Connect to MongoDB
	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err = mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
	}

	// Check the connection
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal("Error pinging MongoDB:", err)
	} else {
		fmt.Println("Connected to MongoDB!")
	}

	// Select the database (change "your_database_name" to the actual name)
	db = client.Database("your_database_name")
}

// GetCollection returns the specified collection from the database
func GetCollection(collectionName string) *mongo.Collection {
	return db.Collection(collectionName)
}

// Disconnect closes the connection to MongoDB
func Disconnect() {
	if err := client.Disconnect(context.Background()); err != nil {
		log.Fatal("Error disconnecting from MongoDB:", err)
	} else {
		fmt.Println("Disconnected from MongoDB.")
	}
}

// Example of a function to check for collections (optional)
func ListCollections() {
	collections, err := db.ListCollectionNames(context.Background(), bson.M{})
	if err != nil {
		log.Fatal("Error listing collections:", err)
	}
	fmt.Println("Collections in the database:", collections)
}
