package main

import (
	"backend/middleware"
	"backend/routes"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	router := routes.InitializeRoutes()

	corshandler := middleware.CorsMiddleware()

	port := os.Getenv("PORT")

	if port == "" {
		port = "8000"
	}
	log.Printf("Bitch I'm runnning on %s", port)
	log.Fatal((http.ListenAndServe(":"+port, corshandler(router))))
}
