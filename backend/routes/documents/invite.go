package documents

import (
	"context"
	"crypto/rand"
	"fmt"
	"math/big"
	"net/http"
	"time"

	"github.com/abhishek-Rj/Collabnote/database"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type inviteRequest struct {
	NoteId     string `json:"note_id"`
	Permission string `json:"permission"`
}

func generateRandomCode() (string, error) {
	max := big.NewInt(900000)

	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}

	code := n.Int64() + 100000

	return fmt.Sprintf("%d", code), nil
}

func Invite(c *gin.Context) {
	userId := c.MustGet("userId").(string)
	user_id, err := uuid.Parse(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "error": "Invalid user ID"})
		return
	}

	var request inviteRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "error": err.Error()})
		return
	}

	if request.Permission != "read" && request.Permission != "write" {
		request.Permission = "write"
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()

	db := gorm.G[database.Note](database.DB)
	note, err := db.Where("id = ? OR public_id = ?", request.NoteId, request.NoteId).First(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "Not Found", "error": "Document not found"})
		return
	}

	if note.OwnerId.String() != userId {
		var writeUser database.NoteWriteOnlyUser
		_, err := gorm.G[database.NoteWriteOnlyUser](database.DB).Where("note_id = ? AND user_id = ?", note.ID, user_id).First(ctx)
		if err != nil {
			c.JSON(http.StatusForbidden, gin.H{"status": "Forbidden", "error": "Only document owner or editors can invite co-authors"})
			return
		}
		_ = writeUser
	}

	inviteDb := gorm.G[database.NoteInvite](database.DB)
	existingInvite, err := inviteDb.Where("note_id = ? AND permission = ?", note.ID, request.Permission).First(ctx)

	var code string
	if err == nil && existingInvite.Code != "" {
		code = existingInvite.Code
	} else {
		newCode, err := generateRandomCode()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "error": "Failed to generate invite code"})
			return
		}
		code = newCode

		invite := database.NoteInvite{
			NoteId:     note.ID,
			Code:       code,
			Permission: request.Permission,
			CreatedBy:  user_id,
		}

		err = inviteDb.Create(ctx, &invite)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "error": "Failed to store invite code"})
			return
		}
	}

	url := "http://localhost:3000/join/" + code

	c.JSON(http.StatusOK, gin.H{
		"status": "Successful",
		"code":   code,
		"url":    url,
	})
}