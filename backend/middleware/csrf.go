package middleware

import (
	"crypto/subtle"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CSRF(c *gin.Context) {
	method := c.Request.Method
	// GET, HEAD, OPTIONS get a free pass
	if method == http.MethodGet || method == http.MethodHead || method == http.MethodOptions {
		c.Next()
		return
	}

	path := c.Request.URL.Path
	if strings.HasSuffix(path, "/auth/csrf") {
		c.Next()
		return
	}

	cookieToken, err := c.Cookie("csrf")
	if err != nil || cookieToken == "" {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Missing CSRF cookie", "status": "CSRF check failed"})
		return
	}

	headerToken := c.GetHeader("X-CSRF-Token")
	if headerToken == "" {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Missing CSRF token header"})
		return
	}

	if subtle.ConstantTimeCompare([]byte(cookieToken), []byte(headerToken)) != 1 {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid CSRF token"})
		return
	}

	c.Next()
}

func CSRFMiddleware() gin.HandlerFunc {
	return CSRF
}
