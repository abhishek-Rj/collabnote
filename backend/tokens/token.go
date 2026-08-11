package tokens

import (
	"fmt"
	"time"

	"github.com/abhishek-Rj/Collabnote/config"
	"github.com/golang-jwt/jwt/v5"
)

type TokenFunctions struct{}

func (f *TokenFunctions) GenerateAccessToken(userId string, username string) (string, error) {
	claims := config.UserDataClaims{
		UserId:   userId,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "collabnote_backend",
		},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := []byte(config.App.JWTAccessToken)	

	signedToken, err := accessToken.SignedString(secret)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func (f *TokenFunctions) VerifyAccessToken(accessToken string) (*config.UserDataClaims, error) {
	claims := &config.UserDataClaims{}

	token, err := jwt.ParseWithClaims(accessToken, claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(config.App.JWTAccessToken), nil
	})
		
	if err != nil || !token.Valid {
		return nil, err
	}

	return claims, nil 
}

func (f *TokenFunctions) GenerateRefreshToken(userId string, username string) (string, error) {
	claims := config.UserDataClaims{
		UserId:   userId,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 30)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "collabnote_backend",
		},
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := []byte(config.App.JWTRefreshToken)	

	signedToken, err := refreshToken.SignedString(secret)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func (f *TokenFunctions) VerifyRefreshToken(refreshToken string) (*config.UserDataClaims, error) {
	claims := &config.UserDataClaims{}

	token, err := jwt.ParseWithClaims(refreshToken, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(config.App.JWTRefreshToken), nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	return claims, nil
}


