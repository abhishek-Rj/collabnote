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

type ClientsList = []*websocket.Conn
type Message struct {
	chamberId   string
	senderConn  *websocket.Conn
	messageType int
	message     []byte
}

var chambers = make(map[string]ClientsList)
var pipe = make(chan Message)
var mutex = &sync.Mutex{}

func WebSocketHandler(c *gin.Context) {
	publicId := c.Param("public_id")
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error upgrading to websockets:", err)
		return
	}
	defer conn.Close()

	mutex.Lock()
	chambers[publicId] = append(chambers[publicId], conn)
	mutex.Unlock()

	for {
		msgType, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)

			mutex.Lock()
			var new_client ClientsList
			for i, client := range chambers[publicId] {
				if conn == client {
					new_client = append(chambers[publicId][:i], chambers[publicId][i+1:]...)
					break
				}
			}

			if len(new_client) == 0 {
				delete(chambers, publicId)
			} else {
				chambers[publicId] = new_client
			}
			mutex.Unlock()
			break
		}

		pipe <- Message{
			chamberId:   publicId,
			senderConn:  conn,
			messageType: msgType,
			message:     message,
		}
	}
}

func HandleMessages() {
	for {
		message := <-pipe
		mutex.Lock()
		var new_client ClientsList
		for i, client := range chambers[message.chamberId] {
			if client != message.senderConn {
				if err := client.WriteMessage(message.messageType, message.message); err != nil {
					new_client = append(chambers[message.chamberId][:i], chambers[message.chamberId][i+1:]...)

					if len(new_client) == 0 {
						delete(chambers, message.chamberId)
					} else {
						chambers[message.chamberId] = new_client
					}
					break
				}
			}
		}
		mutex.Unlock()
	}
}