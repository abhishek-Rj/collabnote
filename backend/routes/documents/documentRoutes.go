package documents

import (
	"github.com/abhishek-Rj/Collabnote/middleware"
	"github.com/gin-gonic/gin"
)

func DocumentRoutes(document *gin.RouterGroup) {
	protected := document.Group("/")
	protected.Use(middleware.UserAuthentication)
	protected.POST("/create", Create)
	protected.GET("/fetch", Fetch)
	protected.PUT("/update", Update)
	protected.GET("/fetch-all-docs", JoinedDocuments)
}