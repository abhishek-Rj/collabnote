package middleware

import (
	"net/http"
	"strings"

	"github.com/abhishek-Rj/Collabnote/tokens"
	"github.com/gin-gonic/gin"
)

func UserAuthentication(c *gin.Context) {
	var accessToken string

	if cookieToken, err := c.Cookie("access_token"); err == nil && cookieToken != "" {
		accessToken = cookieToken
	} else {
		authHeader := c.GetHeader("Authorization")
		if strings.HasPrefix(authHeader, "Bearer ") {
			accessToken = strings.TrimPrefix(authHeader, "Bearer ")
		}
	}

	if accessToken == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
		return
	}

	var tokenFunction tokens.TokenFunctions
	user, err := tokenFunction.VerifyAccessToken(accessToken)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
		return
	}

	c.Set("userId", user.UserId)
	c.Next()
}