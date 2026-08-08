package database

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Model struct {
	Id 			uuid.UUID 			`json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt	time.Time 			`json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt	time.Time 			`json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt	gorm.DeletedAt		`json:"deleted_at" gorm:"index"`	
}

type User struct {
	Model
	Name		string 				`json:"name"`
	Email		string				`json:"email" gorm:"not null;unique"`	
	Password	string				`json:"-" gorm:"not null"`
	Notes		[]Note				`json:"notes" gorm:"foreignKey:UserId;references:id;not null"`
}

type Note struct {
	Model
	Title			string				`json:"title" gorm:"not null"`
	Content			string				`json:"content"`
	OwnerId			uuid.UUID			`json:"owner_id" gorm:"type:uuid;not null"`
	Collaboraters	[]User				`json:"collaboraters" gorm:"constraint:OnDelete:CASCADE;many2many:note_collaboraters"`
	ReadOnlyUsers	[]User				`json:"read_only_users" gorm:"constraint:OnDelete:CASCADE;many2many:note_read_only_users"`
	WriteOnlyUsers	[]User				`json:"write_only_users" gorm:"constraint:OnDelete:CASCADE;many2many:note_write_only_users"`
}