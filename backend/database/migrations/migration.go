package main

import (
	"log"

	"github.com/abhishek-Rj/Collabnote/config"
	"github.com/abhishek-Rj/Collabnote/database"
)

func main() {
	config.Load()
	database.DatabaseConnection()

	var err error

	if err = database.DB.AutoMigrate(&database.User{}, &database.Note{}, &database.NoteInvite{}); err != nil {
		log.Fatal("Error in migration: ", err)
	}

	log.Println("Migration successful")
}