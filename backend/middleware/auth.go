package middleware

import (
	"fmt"
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
)

// WithHeaderAuth is a middleware that checks for the presence of a valid session token in the Authorization header
func WithHeaderAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get session claims from the context
		claims, ok := clerk.SessionClaimsFromContext(r.Context())
		if !ok {
			// If claims are not found, return Unauthorized status
			http.Error(w, `{"access": "unauthorized"}`, http.StatusUnauthorized)
			return
		}

		// Optionally, you can log the user info or perform additional checks based on the claims
		fmt.Println("User authenticated:", claims.Subject)

		// Proceed with the next handler if the session is valid
		next.ServeHTTP(w, r)
	})
}

// RequireHeaderAuth is similar to WithHeaderAuth but automatically responds with a 403 Forbidden error
// if no valid session token is found.
func RequireHeaderAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check for valid session claims
		claims, ok := clerk.SessionClaimsFromContext(r.Context())
		if !ok {
			// If no valid session, return Forbidden status
			http.Error(w, `{"access": "forbidden"}`, http.StatusForbidden)
			return
		}

		// You can log the user info or handle claims in other ways
		fmt.Println("User authenticated:", claims.Subject)

		// Proceed to the next handler if session claims are valid
		next.ServeHTTP(w, r)
	})
}
