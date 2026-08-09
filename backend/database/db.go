package database

import (
	"log"

	"github.com/abhishek-Rj/Collabnote/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DatabaseConnection() {
	database_url := "host=" + config.App.DBHost + " " + "user=" + config.App.DBUser +  " " + "password=" + config.App.DBPassword + " " + "dbname=" + config.App.DBName + " " + "port=" + config.App.DBPort

	var err error

	DB, err = gorm.Open(postgres.Open(database_url), &gorm.Config{})
	if err != nil {
		log.Fatal("Database connection Failed: ", err)
	}

	log.Println("Database connection successful")
}