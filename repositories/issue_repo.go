package repositories

import (
	"context"

	"github.com/vimalkumar-2124/helpdeskapp/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserRepo struct {
	db *mongo.Database
}

func NewInstanceOfIssueRepo(db *mongo.Database) UserRepo {
	return UserRepo{db: db}
}

// Issue types

func (u *UserRepo) ShowIssueTypes() ([]models.IssueTypes, error) {
	findOptions := options.Find()
	var users []models.IssueTypes
	cur, err := u.db.Collection("issue-types").Find(context.TODO(), bson.D{{}}, findOptions)
	if err != nil {
		return []models.IssueTypes{}, err
	}
	for cur.Next(context.TODO()) {
		var ele models.IssueTypes
		err := cur.Decode(&ele)
		if err != nil {
			return []models.IssueTypes{}, err
		}
		users = append(users, ele)
	}
	if err := cur.Err(); err != nil {
		return []models.IssueTypes{}, err
	}
	cur.Close(context.TODO())
	return users, nil
}

func (u *UserRepo) SaveIssueType(issueType models.IssueTypes) error {
	_, err := u.db.Collection("issue-types").InsertOne(context.TODO(), issueType)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserRepo) GetIssueTypeById(id string) (bool, models.IssueTypes, error) {
	var issueType models.IssueTypes
	docId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return false, models.IssueTypes{}, err
	}
	filter := bson.M{"_id": docId}
	count, err := u.db.Collection("issue-types").CountDocuments(context.TODO(), filter)
	if err != nil {
		return false, models.IssueTypes{}, err
	}
	if count != 1 {
		return false, models.IssueTypes{}, nil
	}
	err = u.db.Collection("issue-types").FindOne(context.TODO(), filter).Decode(&issueType)
	if err != nil {
		return false, models.IssueTypes{}, err
	}
	return true, issueType, nil
}

func (u *UserRepo) UpdateIssueType(oldIssueType string, newIssueType string) error {
	filter := bson.M{"issue_type": oldIssueType}
	update := bson.M{"$set": bson.M{"issue_type": newIssueType}}
	_, err := u.db.Collection("issue-types").UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserRepo) DeleteIssueType(issueType string) error {
	filter := bson.M{"issue_type": issueType}
	_, err := u.db.Collection("issue-types").DeleteOne(context.TODO(), filter)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserRepo) SaveIssues(issues models.Issues) (string, error) {
	insertedData, err := u.db.Collection("issues").InsertOne(context.TODO(), issues)
	if err != nil {
		return "", err
	}
	return (insertedData.InsertedID.(primitive.ObjectID)).Hex(), nil

}

func (u *UserRepo) GetIssueById(id string) (models.Issues, error) {
	var issue models.Issues
	docId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.Issues{}, err
	}
	filter := bson.M{"_id": docId}
	count, err := u.db.Collection("issues").CountDocuments(context.TODO(), filter)
	if err != nil {
		return models.Issues{}, err
	}
	if count != 1 {
		return models.Issues{}, nil
	}
	err = u.db.Collection("issues").FindOne(context.TODO(), filter).Decode(&issue)
	if err != nil {
		return models.Issues{}, err
	}
	return issue, nil
}

func (u *UserRepo) IssueCounts() (models.IssueCounts, error) {
	openFilter := bson.M{"status": "Open"}
	openCount, err := u.db.Collection("issues").CountDocuments(context.TODO(), openFilter)
	if err != nil {
		return models.IssueCounts{}, err
	}
	inprogressFilter := bson.M{"status": "Inprogress"}
	inprogressCount, err := u.db.Collection("issues").CountDocuments(context.TODO(), inprogressFilter)
	if err != nil {
		return models.IssueCounts{}, err
	}
	closedFilter := bson.M{"status": "Closed"}
	closedCount, err := u.db.Collection("issues").CountDocuments(context.TODO(), closedFilter)
	if err != nil {
		return models.IssueCounts{}, err
	}
	return models.IssueCounts{
		Open:       openCount,
		InProgress: inprogressCount,
		Closed:     closedCount,
	}, nil
}

func (u *UserRepo) GetIssuesByStatus(status string) ([]models.Issues, error) {
	findOptions := options.Find()
	var issues []models.Issues
	cur, err := u.db.Collection("issues").Find(context.TODO(), bson.M{"status": status}, findOptions)
	if err != nil {
		return []models.Issues{}, err
	}
	for cur.Next(context.TODO()) {
		var ele models.Issues
		err := cur.Decode(&ele)
		if err != nil {
			return []models.Issues{}, err
		}
		issues = append(issues, ele)
	}
	if err := cur.Err(); err != nil {
		return []models.Issues{}, err
	}
	cur.Close(context.TODO())
	return issues, nil
}

func (u *UserRepo) ChangeStatusById(id string) (models.Issues, error) {
	var issue models.Issues
	docId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.Issues{}, err
	}
	filter := bson.M{"_id": docId}
	count, err := u.db.Collection("issues").CountDocuments(context.TODO(), filter)
	if err != nil {
		return models.Issues{}, err
	}
	if count != 1 {
		return models.Issues{}, nil
	}
	err = u.db.Collection("issues").FindOne(context.TODO(), filter).Decode(&issue)
	if err != nil {
		return models.Issues{}, err
	}
	return issue, nil
}

func (u *UserRepo) IssueStatusUpdate(issue models.Issues) error {
	// log.Println(issue.Id)
	filter := bson.M{"name": issue.Name}
	update := bson.M{"$set": bson.M{"status": issue.Status, "comments": issue.Comments, "inprogressDate": issue.InprogressDate, "closedDate": issue.ClosedDate}}
	_, err := u.db.Collection("issues").UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}
	return nil
}
