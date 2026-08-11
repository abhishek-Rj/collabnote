package middleware

import (
	"net/http"

	"github.com/abhishek-Rj/Collabnote/tokens"
	"github.com/gin-gonic/gin"
)

func UserAuthentication(c *gin.Context) {
	access_token, err := c.Cookie("access_token")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
		return
	}

	var tokenFunction tokens.TokenFunctions
	user, err := tokenFunction.VerifyAccessToken(access_token)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
		return
	}

	c.Set("userId", user.UserId)
	c.Next()
}