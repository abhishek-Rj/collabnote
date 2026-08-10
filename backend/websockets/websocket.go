package websockets

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
}

func WebSocketConnection(c *gin.Context) {
	 conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)	
	 if err != nil {
		log.Fatal("Error upgrating to websockets")
		return
	 }
	 defer conn.Close()
}