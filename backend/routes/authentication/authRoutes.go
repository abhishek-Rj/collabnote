package authentication

import "github.com/gin-gonic/gin"

func AuthRoutes(auth *gin.RouterGroup) {
	auth.POST("/login", Login)
	auth.POST("/signin", Signin)
	auth.POST("/refresh", Refresh)
}