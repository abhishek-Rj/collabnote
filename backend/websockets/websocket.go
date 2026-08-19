package websockets

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func (r *http.Request) bool {
		return true
	},
}

type ClientsLis = []*websocket.Conn

var clients ClientsLis
var chambers map[string]ClientsLis
var pipe = make(chan []byte)
var mutex = &sync.Mutex{}

func WebSocketHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)	
	if err != nil {
		log.Fatal("Error upgrating to websockets")
		return
	}
	defer conn.Close()
	
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error Reading message", err)
			break
		}

		fmt.Println("Message:", message)

		pipe <- message

	}
}

func HandleMessages(conn *websocket.Conn) {
	for {
		if err := conn.WriteMessage(websocket.TextMessage, ); err != nil {
			fmt.Println("Error writing message", err)
			break
		}
	}
}