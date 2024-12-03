package main

import (
	"backend/database"
	"backend/middleware"
	"backend/routes"
	"log"
	"net/http"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize Clerk with API key (replace with your actual API key)
	clerk.SetKey(os.Getenv("CLERK_API_KEY"))

	// Connect to database
	database.Connect()

	// Initialize routes
	router := routes.InitializeRoutes()

	// Add CORS middleware
	corsHandler := middleware.CorsMiddleware()

	// Define the protected routes using Clerk authentication middleware
	protectedHandler := http.HandlerFunc(protectedRoute)
	router.Handle("/api/notes", clerkhttp.WithHeaderAuthorization()(protectedHandler))

	// Set port for the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	// Start the server
	log.Printf("Server running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler(router)))
}

// Protected route handler (requires Clerk authentication)
func protectedRoute(w http.ResponseWriter, r *http.Request) {
	// Get the session claims from the request context
	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Respond with user data
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"user_id": "` + claims.Subject + `"}`))
}
