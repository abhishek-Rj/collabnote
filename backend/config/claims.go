package config

import (
	"github.com/golang-jwt/jwt/v5"
)

type UserDataClaims struct {
	UserId 		string `json:"userId"`
	Username 	string `json:"username"`
	jwt.RegisteredClaims	
}