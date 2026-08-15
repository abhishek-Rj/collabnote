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
	NoteId	string	`json:"note_id;required"`
	Permission	string	`json:"permission;required"`
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
		c.JSON(http.StatusBadRequest, gin.H{"status": "Internal Server Error"})
		return
	}
	var request inviteRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Internal Server Error"})
		return
	}
	if request.Permission != "read" && request.Permission != "write" {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error"})
		return
	}
	
	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()
	
	db := gorm.G[database.Note](database.DB)
	note, err := db.Where("id = ?", request.NoteId).First(ctx)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Internal Server Error"})
		return
	}
	ownerId := note.OwnerId.String()
	if ownerId != userId {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Unauthorized"})
		return
	}

	parseUUID, err := uuid.Parse(request.NoteId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Internal Server Error"})
		return
	}

	code, err := generateRandomCode()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Internal Server Error"})
		return
	}

	invite := database.NoteInvite{
		NoteId: parseUUID,
		Code: code,
		Permission: request.Permission,
		CreatedBy: user_id,
	}
	
	err = gorm.G[database.NoteInvite](database.DB).Create(ctx, &invite)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Internal Server Error"})
		return
	}
	url := "http://localhost:3000/join/" + code
	
	c.JSON(http.StatusOK, gin.H{"status": "Successfull", url: url})
}