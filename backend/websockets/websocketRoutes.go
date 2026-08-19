package websockets

import "github.com/gin-gonic/gin"

func WebSocketRoutes(ws *gin.RouterGroup) {
	ws.GET("/document/:public_id", WebSocketHandler)
}