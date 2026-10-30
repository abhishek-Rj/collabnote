package database

import (
	"log"
	"time"

	"github.com/abhishek-Rj/Collabnote/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DatabaseConnection() {
	database_url := "host=" + config.App.DBHost + " " + "user=" + config.App.DBUser + " " + "password=" + config.App.DBPassword + " " + "dbname=" + config.App.DBName + " " + "port=" + config.App.DBPort

	var err error
	for attempts := 1; attempts <= 10; attempts++ {
		DB, err = gorm.Open(postgres.Open(database_url), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Database connection attempt %d/10 failed: %v. Retrying in 2 seconds...", attempts, err)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Fatal("Database connection Failed: ", err)
	}

	log.Println("Database connection successful")

	if err := DB.AutoMigrate(&User{}, &Note{}, &NoteInvite{}); err != nil {
		log.Println("Database auto-migration warning:", err)
	}
}