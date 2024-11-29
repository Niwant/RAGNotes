package middleware

import (
	"net/http"

	"github.com/rs/cors"
)

func CorsMiddleware() func(http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"https://localhost:300"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Conntent-Type", "Authorization"},
		AllowCredentials: true,
	})

	return c.Handler
}
