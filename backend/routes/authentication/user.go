package authentication

import (
	"context"
	"net/http"
	"time"

	"github.com/abhishek-Rj/Collabnote/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func User(c *gin.Context) {
	userId := c.MustGet("userId").(string)	
	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()

	user, err := gorm.G[database.User](database.DB).Where("id = ?", userId).First(ctx)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "user fetched successfully", "user": user})
}