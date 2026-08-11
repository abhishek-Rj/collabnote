package tokens

import (
	"testing"

	"github.com/abhishek-Rj/Collabnote/config"
)

func TestTokenGenerationAndVerification(t *testing.T) {
	// Setup dummy keys for config
	config.App.JWTAccessToken = "test_access_token_secret"
	config.App.JWTRefreshToken = "test_refresh_token_secret"

	var f TokenFunctions

	userId := "user-123"
	username := "testuser"

	// 1. Test Access Token
	accessToken, err := f.GenerateAccessToken(userId, username)
	if err != nil {
		t.Fatalf("Failed to generate access token: %v", err)
	}

	claims, err := f.VerifyAccessToken(accessToken)
	if err != nil {
		t.Fatalf("Failed to verify access token: %v", err)
	}

	if claims.UserId != userId {
		t.Errorf("Expected UserId %s, got %s", userId, claims.UserId)
	}
	if claims.Username != username {
		t.Errorf("Expected Username %s, got %s", username, claims.Username)
	}

	// 2. Test Refresh Token
	refreshToken, err := f.GenerateRefreshToken(userId, username)
	if err != nil {
		t.Fatalf("Failed to generate refresh token: %v", err)
	}

	refreshClaims, err := f.VerifyRefreshToken(refreshToken)
	if err != nil {
		t.Fatalf("Failed to verify refresh token: %v", err)
	}

	if refreshClaims.UserId != userId {
		t.Errorf("Expected UserId %s, got %s", userId, refreshClaims.UserId)
	}
	if refreshClaims.Username != username {
		t.Errorf("Expected Username %s, got %s", username, refreshClaims.Username)
	}
}
