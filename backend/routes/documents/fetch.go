package documents

import (
	"context"
	"net/http"
	"time"

	"github.com/abhishek-Rj/Collabnote/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DocumentFetch struct {
	ID	string	`json:"id" validate:"required"`
}

func Fetch(c *gin.Context) {
	userId := c.MustGet("userId")
	id := c.Query("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "error": "id parameter is required"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()

	document, err := gorm.G[database.Note](database.DB).
    Where(`
        (id = ? OR public_id = ?)
        AND (
            owner_id = ?
            OR EXISTS (
                SELECT 1
                FROM note_write_only_users w
                WHERE w.note_id = notes.id
                  AND w.user_id = ?
            )
            OR EXISTS (
                SELECT 1
                FROM note_read_only_users r
                WHERE r.note_id = notes.id
                  AND r.user_id = ?
            )
        )
    `, id, id, userId, userId, userId).
    First(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "Not Found", "error": "document not found"})
		return
	}

	response := map[string]string {
		"id":        document.ID.String(),
		"title":     document.Title,
		"content":   document.Content,
		"public_id": document.PublicId,
	}

	c.JSON(http.StatusOK, gin.H{"status": "Document Fetched successfully", "document": response})
}