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

type joinDetails struct {
	Code string `json:"code"`
}

func Join(c *gin.Context) {
	userId := c.MustGet("userId").(string)

	var request joinDetails
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "error": err.Error()})
		return
	}

	if request.Code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "error": "Invite code is required"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()

	user_id, err := uuid.Parse(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "error": "Invalid user ID"})
		return
	}

	invite, err := gorm.G[database.NoteInvite](database.DB).Where("code = ?", request.Code).First(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "Not Found", "error": "Invalid or expired invite code"})
		return
	}

	note, err := gorm.G[database.Note](database.DB).Where("id = ?", invite.NoteId).First(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "Not Found", "error": "Associated document not found"})
		return
	}

	if note.OwnerId == user_id {
		c.JSON(http.StatusOK, gin.H{
			"status":    "Successful",
			"message":   "User is document owner",
			"public_id": note.PublicId,
			"title":     note.Title,
		})
		return
	}

	if invite.Permission == "read" {
		_, err := gorm.G[database.NoteReadOnlyUser](database.DB).Where("note_id = ? AND user_id = ?", note.ID, user_id).First(ctx)
		if err != nil {
			err = gorm.G[database.NoteReadOnlyUser](database.DB).Create(ctx, &database.NoteReadOnlyUser{
				NoteId: note.ID,
				UserId: user_id,
			})
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "error": "Failed to join document"})
				return
			}
		}
	} else {
		_, err := gorm.G[database.NoteWriteOnlyUser](database.DB).Where("note_id = ? AND user_id = ?", note.ID, user_id).First(ctx)
		if err != nil {
			err = gorm.G[database.NoteWriteOnlyUser](database.DB).Create(ctx, &database.NoteWriteOnlyUser{
				NoteId: note.ID,
				UserId: user_id,
			})
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "error": "Failed to join document"})
				return
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "Successful",
		"public_id": note.PublicId,
		"title":     note.Title,
	})
}