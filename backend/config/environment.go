package config

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	AppPort string `envconfig:"APP_PORT" required:"true"`
	DBPort string `envconfig:"DB_PORT" required:"true"`
	DBHost string `envconfig:"DB_HOST" required:"true"`
	DBUser string `envconfig:"DB_USER" required:"true"`
	DBPassword string `envconfig:"DB_PASSWORD" required:"true"`
	DBName string `envconfig:"DB_NAME" required:"true"`
	JWTAccessToken string `envconfig:"JWT_ACCESS_TOKEN" required:"true"`
	JWTRefreshToken string `envconfig:"JWT_REFRESH_TOKEN" required:"true"`
}

var App Config

func Load() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	err = envconfig.Process("", &App)
	if err != nil {
		log.Fatal("Error processing environment variables:", err)
	}
}

