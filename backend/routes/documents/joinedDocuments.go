package documents

import (
	"context"
	"net/http"
	"time"

	"github.com/abhishek-Rj/Collabnote/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func JoinedDocuments(c *gin.Context) {
	userId := c.MustGet("userId").(string)
	
	ctx, cancel := context.WithTimeout(c.Request.Context(), time.Second*7)
	defer cancel()

	db := gorm.G[database.Note](database.DB)
	notes, err := db.
    Where(`
        owner_id = ?
        OR EXISTS (
            SELECT 1
            FROM note_read_only_users ro
            WHERE ro.note_id = notes.id
              AND ro.user_id = ?
        )
        OR EXISTS (
            SELECT 1
            FROM note_write_only_users wo
            WHERE wo.note_id = notes.id
              AND wo.user_id = ?
        )
    `, userId, userId, userId).
	Order("updated_at DESC").
	Order("created_at DESC").
    Find(ctx)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "Internal Server Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Succesfull", "notes": notes})
}