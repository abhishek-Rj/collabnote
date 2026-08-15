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
	Permission	string	`json:"permission;required"`
	Code 	string	`json:"code;required"`
	NoteId	string	`json:"note_id;required"`
}

func Join(c *gin.Context) {
	userId := c.MustGet("userId").(string)	
	
	var request joinDetails
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error"})
		return
	}
	
	if request.Permission != "read" && request.Permission != "write" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Internal Server Error"})	
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()

	userId, err := uuid.Parse(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Internal Server Error"})
		return
	}

	if request.Permission == "read" {
		err := gorm.G[database.NoteReadOnlyUser](database.DB).Create(ctx, &database.NoteReadOnlyUser{UserId: userId, NoteId: request.NoteId})

		
	}

}