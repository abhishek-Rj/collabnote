package main

import (
	"github.com/abhishek-Rj/Collabnote/config"
	"github.com/abhishek-Rj/Collabnote/database"
	"github.com/abhishek-Rj/Collabnote/routes/authentication"
	"github.com/abhishek-Rj/Collabnote/routes/documents"
	"github.com/abhishek-Rj/Collabnote/websockets"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.Load()
	database.DatabaseConnection()
	server := gin.Default()

	cors_config := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://localhost:3000", "http://127.0.0.1:3000"},
		AllowMethods:     []string{"GET", "PUT", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		AllowCredentials: true,
	}

	server.Use(cors.New(cors_config))

	server.GET("/check-health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "OK",
		})
	})

	auth := server.Group("/auth")
	authentication.AuthRoutes(auth)

	document := server.Group("/document")
	documents.DocumentRoutes(document)

	websocket := server.Group("/")
	websockets.WebSocketRoutes(websocket)
	
	server.Run(":" + config.App.AppPort)
}