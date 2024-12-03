package middleware

import (
	"net/http"

	"github.com/rs/cors"
)

func CorsMiddleware() func(http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Conntent-Type", "Authorization", "content-type"},
		AllowCredentials: true,
		Debug:            true,
	})

	return c.Handler
}
