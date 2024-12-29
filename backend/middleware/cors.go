package middleware

import (
	"net/http"

	"github.com/rs/cors"
)

func CorsMiddleware() func(http.Handler) http.Handler {
	c := cors.New(cors.Options{
    AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "content-type"},
		AllowCredentials: true,
		Debug:            true,
	})

	return c.Handler
}
