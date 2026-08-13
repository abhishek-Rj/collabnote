package documents

import (
	"context"
	"net/http"
	"time"

	"github.com/abhishek-Rj/Collabnote/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DocumentUpdation struct {
	ID      string `json:"id" validate:"required"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

func Update(c *gin.Context) {
	userId := c.MustGet("userId").(string)
	var documentUpdation DocumentUpdation

	if err := c.ShouldBindJSON(&documentUpdation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()

	var note database.Note
	db := gorm.G[database.Note](database.DB)

	note, err := db.Where("id = ? AND ( owner_id = ? OR EXISTS ( SELECT 1 FROM note_write_only_users WHERE note_id = notes.id AND user_id = ?)", documentUpdation.ID, userId, userId).First(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "Not Found", "error": "document not found"})
		return
	}

	if documentUpdation.Title != "" {
		_, err = db.Where("id = ?", note.ID).Update(ctx, "title", documentUpdation.Title)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "error": err.Error()})
			return
		}
		note.Title = documentUpdation.Title
	}

	_, err = db.Where("id = ?", note.ID).Update(ctx, "content", documentUpdation.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "error": err.Error()})
		return
	}
	note.Content = documentUpdation.Content

	c.JSON(http.StatusOK, gin.H{"status": "Document updated successfully", "document": note})
}