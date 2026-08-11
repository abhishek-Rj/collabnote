package authentication

import (
	"net/http"
	"time"

	"github.com/abhishek-Rj/Collabnote/tokens"
	"github.com/gin-gonic/gin"
)

func Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Unauthorized"})
		return
	}

	var tokenFunctions tokens.TokenFunctions
	user, err := tokenFunctions.VerifyRefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "Unauthorized"})
		return
	}

	accessToken, err := tokenFunctions.GenerateAccessToken(user.UserId, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal server error"})
		return
	}

	c.SetCookie("access_token", accessToken, int((time.Hour*24*7).Seconds()), "/", "localhost", false, true)	
	c.JSON(http.StatusOK, gin.H{"user": user, "status": "Token refreshed successfully"})
}