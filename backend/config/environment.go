package config

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	AppPort string `envconfig:"APP_PORT" required:"true"`
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

