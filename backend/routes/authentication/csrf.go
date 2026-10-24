package authentication

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CSRF(c *gin.Context) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate CSRF token"})
		return
	}

	token := hex.EncodeToString(bytes)

	// Set cookie named "csrf" with 32-byte cryptographic token
	c.SetCookie("csrf", token, int((time.Hour * 24).Seconds()), "/", "", false, false)

	c.JSON(http.StatusOK, gin.H{
		"csrfToken": token,
		"status":    "CSRF token generated",
	})
}
