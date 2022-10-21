package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Issues struct {
	ID               primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name             string             `json:"name" bson:"name"`
	Email            string             `json:"email" bson:"email"`
	Mobile           string             `json:"mobile" bson:"mobile"`
	IssueType        string             `json:"issueType" bson:"issueType"`
	IssueTitle       string             `json:"issueTitle" bson:"issueTitle"`
	IssueDescription string             `json:"issueDescription" bson:"issueDescription"`
	Status           string             `json:"status" bson:"status"`
	Comments         string             `json:"comments" bson:"comments"`
	Created          time.Time          `json:"createdAt" bson:"createdAt"`
	InprogressDate   time.Time          `json:"inprogressDate" bson:"inprogressDate"`
	ClosedDate       time.Time          `json:"closedDate" bson:"closedDate"`
}

type IssueCounts struct {
	Open       int64 `json:"open"`
	InProgress int64 `json:"inProgress"`
	Closed     int64 `json:"closed"`
}

type Comments struct {
	Comments string `json:"comments" bson:"comments"`
}

type IssueTypes struct {
	IssueType string `json:"issue_type" bson:"issue_type"`
}
