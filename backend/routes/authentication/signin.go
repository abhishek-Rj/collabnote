package authentication

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/abhishek-Rj/Collabnote/config"
	"github.com/abhishek-Rj/Collabnote/database"
	"github.com/abhishek-Rj/Collabnote/tokens"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type signinRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Signin(c *gin.Context) {
	var req signinRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Invalid request"})
		return
	}	
	
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7 * time.Second)
	defer cancel()

	user, err := gorm.G[database.User](database.DB).Where("username = ?", req.Username).First(ctx)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{user.Username: "User already exist"})
		return
	}
	
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal server error"})
		return
	}
	
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), config.App.BcryptSalt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Error in hashing password"})
		return
	}

	newUser := database.User{
		Username: req.Username,
		Password: string(hashPassword),
	}
	
	result := gorm.WithResult()
	err = gorm.G[database.User](database.DB, result).Create(ctx, &newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Error in creating user"})
		return
	}

	var tokenFunctions tokens.TokenFunctions
	token, err := tokenFunctions.GenerateAccessToken(newUser.ID.String(), newUser.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Error in generating token"})
		return
	}
	refreshToken, err := tokenFunctions.GenerateRefreshToken(newUser.ID.String(), newUser.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Error in generating token"})
		return
	}
	c.SetCookie("access_token", token, int(time.Hour*24*7), "/", "", false, true)
	c.SetCookie("refresh_token", refreshToken, int(time.Hour*24*30), "/auth/refresh", "", false, true)
	c.JSON(http.StatusOK, gin.H{"status": "Signin successful"})
}
