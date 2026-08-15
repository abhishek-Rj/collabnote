package database

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Model struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

type User struct {
	Model
	Name     string `json:"name"`
	Username string `json:"username" gorm:"not null;unique"`
	Email    *string `json:"email" gorm:"unique"`
	Password string `json:"-" gorm:"not null"`
	Notes    []Note `json:"notes" gorm:"foreignKey:OwnerId;references:Id"`
}

type Note struct {
	Model
	Title          string    `json:"title" gorm:"not null"`
	Content        string    `json:"content"`
	OwnerId        uuid.UUID `json:"owner_id" gorm:"type:uuid;not null"`
	PublicId		string		`json:"public_id" gorm:"not null;unique"`
	ReadOnlyUsers  []User    `json:"read_only_users" gorm:"constraint:OnDelete:CASCADE;many2many:note_read_only_users"`
	WriteOnlyUsers []User    `json:"write_only_users" gorm:"constraint:OnDelete:CASCADE;many2many:note_write_only_users"`
}

type NoteInvite struct {
	Model
	NoteId		uuid.UUID	`json:"note_id" gorm:"type:uuid;not null"`
	Code 		string		`json:"code" gorm:"not null;uniqueIndex"`
	Permission 	string		`json:"permission" gorm:"not null"`
	CreatedBy	uuid.UUID	`json:"created_by" gorm:"type:uuid;not null"`
	User		User		`gorm:"foreignKey:CreatedBy"`
}

type NoteWriteOnlyUser struct {
	NoteId	uuid.UUID 		`gorm:"type:uuid;primaryKey"`
	UserId 	uuid.UUID 		`gorm:"type:uuid;primaryKey"`
}

type NoteReadOnlyUser struct {
	NoteId	uuid.UUID 		`gorm:"type:uuid;primaryKey"`
	UserId 	uuid.UUID 		`gorm:"type:uuid;primaryKey"`
}