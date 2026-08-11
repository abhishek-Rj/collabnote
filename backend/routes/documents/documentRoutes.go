package documents

import "github.com/gin-gonic/gin"

func DocumentRoutes(document *gin.RouterGroup) {
	document.POST("/create", Create)
	document.GET("/fetch", Fetch)
}