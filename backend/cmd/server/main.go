package main

import (
	"github.com/abhishek-Rj/Collabnote/config"
	"github.com/abhishek-Rj/Collabnote/database"
	"github.com/abhishek-Rj/Collabnote/routes/authentication"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.Load()
	database.DatabaseConnection()
	server := gin.Default()

	cors_config := cors.Config{
		AllowOrigins: []string{"https://localhost:3000"},
		AllowMethods: []string{"GET", "PUT", "POST", "DELETE", "QUERY"},
		AllowHeaders: []string{"Content-Type", "Authorization"}, 
	}

	server.Use(cors.New(cors_config));

	server.GET("/check-health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "OK",
		})
	})

	auth := server.Group("/auth")
	authentication.AuthRoutes(auth)

	server.Run(":" + config.App.AppPort)
}