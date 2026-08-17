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

func Fetch(c *gin.Context) {
	userId := c.MustGet("userId").(string)
	id := c.Query("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "error": "id parameter is required"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()

	user_uuid, err := uuid.Parse(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "error": "Invalid user ID"})
		return
	}

	// 1. Check if document exists
	db := gorm.G[database.Note](database.DB)
	note, err := db.Where("id = ? OR public_id = ?", id, id).First(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "Not Found", "error": "Document does not exist"})
		return
	}

	// 2. Verify user has permission to view this document (Owner, ReadUser, or WriteUser)
	if note.OwnerId != user_uuid {
		_, errRead := gorm.G[database.NoteReadOnlyUser](database.DB).Where("note_id = ? AND user_id = ?", note.ID, user_uuid).First(ctx)
		_, errWrite := gorm.G[database.NoteWriteOnlyUser](database.DB).Where("note_id = ? AND user_id = ?", note.ID, user_uuid).First(ctx)

		if errRead != nil && errWrite != nil {
			c.JSON(http.StatusForbidden, gin.H{"status": "Forbidden", "error": "You are not permitted to view this document"})
			return
		}
	}

	response := map[string]string{
		"id":        note.ID.String(),
		"title":     note.Title,
		"content":   note.Content,
		"public_id": note.PublicId,
	}

	c.JSON(http.StatusOK, gin.H{"status": "Document Fetched successfully", "document": response})
}