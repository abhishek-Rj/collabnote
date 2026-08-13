package documents

import (
	"context"
	"net/http"
	"time"

	"github.com/abhishek-Rj/Collabnote/database"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DocumentCreation struct {
	Title   string `json:"title" validate:"required,min=3,max=255"`
	Content string `json:"content"`
}

func Create(c *gin.Context) {
	userId := c.MustGet("userId").(string)
	var document DocumentCreation

	if err := c.ShouldBindJSON(&document); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()

	newPublicId := uuid.NewString()

	newDocument := database.Note{
		OwnerId: uuid.MustParse(userId),
		Title:   document.Title,
		Content: document.Content,
		PublicId: newPublicId,
	}

	_, err := gorm.G[database.Note](database.DB).Where("public_id = ?", newPublicId).First(ctx)
	if err == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error"})
		return
	}

	err = gorm.G[database.Note](database.DB).Create(ctx, &newDocument)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "Document created successfully", "document" : newDocument})
}