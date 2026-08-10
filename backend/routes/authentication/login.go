package authentication

import (
	"context"
	"net/http"
	"time"

	"github.com/abhishek-Rj/Collabnote/database"
	"github.com/abhishek-Rj/Collabnote/tokens"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type loginRequestData struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var loginRequestData loginRequestData
	if err := c.ShouldBindJSON(&loginRequestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()

	user, err := gorm.G[database.User](database.DB).Where("username = ?", loginRequestData.Username).First(ctx)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "user not found"})
		return
	}
	
	var tokenFunctions tokens.TokenFunctions
	refreshToken, accessToken, err := func() (*string, *string, error) {
		accessToken, err := tokenFunctions.GenerateAccessToken(user.ID.String(), user.Username)
		if err != nil {
			return nil, nil, err
		}
		refreshToken, err := tokenFunctions.GenerateRefreshToken(user.ID.String(), user.Username)
		if err != nil {
			return nil, nil, err
		}
		return &refreshToken, &accessToken, nil
	}()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "token generation failed"})
		return
	}

	c.SetCookie("access_token", *accessToken, int((time.Hour*24*7).Seconds()), "/", "", false, true)
	c.SetCookie("refresh_token", *refreshToken, int((time.Hour*24*30).Seconds()), "/auth/refresh", "", false, true)

	c.JSON(http.StatusOK, gin.H{"user": user, "status": "Login successful"})
}