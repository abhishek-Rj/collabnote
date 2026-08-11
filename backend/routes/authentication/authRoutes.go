package authentication

import (
	"github.com/abhishek-Rj/Collabnote/middleware"
	"github.com/gin-gonic/gin"
)

func AuthRoutes(auth *gin.RouterGroup) {
	auth.POST("/login", Login)
	auth.POST("/signin", Signin)
	auth.POST("/refresh", Refresh)

	protected := auth.Group("/")
	protected.Use(middleware.UserAuthentication)
	protected.GET("/me", User)
	protected.GET("/logout", Logout)
}