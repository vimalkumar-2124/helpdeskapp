package services

import (
	"errors"
	"time"

	"github.com/vimalkumar-2124/helpdeskapp/models"
	"github.com/vimalkumar-2124/helpdeskapp/repositories"
)

type UserService struct {
	userRepo repositories.UserRepo
}

type UserServiceRoutes interface {
	AllIssueTypes() error
	AddIssueType(body models.IssueTypes) error
	UpdateIssueType(body models.IssueTypes, id string) error
	DeleteIssueType(id string) error
	AddIssues(body models.Issues) (string, error)
	IssueById(id string) (models.Issues, error)
	IssueCounts() error
	IssuesByStatus(status string) ([]models.Issues, error)
	ChangeStatusById(body models.Comments, id string) (models.Issues, error)
}

func NewInstanceOfIssueService(userRepo repositories.UserRepo) UserService {
	return UserService{userRepo: userRepo}
}

func (u *UserService) AllIssueTypes() ([]models.IssueTypes, error) {
	allIssueTypes, err := u.userRepo.ShowIssueTypes()
	if err != nil {
		return []models.IssueTypes{}, err
	}
	return allIssueTypes, nil

}

func (u *UserService) AddIssueType(body models.IssueTypes) error {
	newIssueType := models.IssueTypes{
		IssueType: body.IssueType,
	}
	err := u.userRepo.SaveIssueType(newIssueType)
	if err != nil {
		return err
	}
	return nil
}
func (u *UserService) UpdateIssueType(body models.IssueTypes, id string) error {
	found, issueType, err := u.userRepo.GetIssueTypeById(id)
	if err != nil {
		return err
	}
	if found {
		err = u.userRepo.UpdateIssueType(issueType.IssueType, body.IssueType)
		if err != nil {
			return err
		}

		return nil

	} else {
		return errors.New("Issue not found!!!")
	}
	// return nil
}

func (u *UserService) DeleteIssueType(id string) error {
	found, issueType, err := u.userRepo.GetIssueTypeById(id)
	if err != nil {
		return err
	}
	if !found {
		return errors.New("Issue type not found")
	}
	err = u.userRepo.DeleteIssueType(issueType.IssueType)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserService) AddIssues(body models.Issues) (string, error) {
	newIssue := models.Issues{
		Name:             body.Name,
		Email:            body.Email,
		Mobile:           body.Mobile,
		IssueType:        body.IssueType,
		IssueTitle:       body.IssueTitle,
		IssueDescription: body.IssueDescription,
		Comments:         "This issue will be addressed shortly!",
		Status:           "Open",
		Created:          time.Now(),
		InprogressDate:   time.Time{},
		ClosedDate:       time.Time{},
	}
	id, err := u.userRepo.SaveIssues(newIssue)
	if err != nil {
		return "", err
	}
	return id, nil
}

func (u *UserService) IssueById(id string) (models.Issues, error) {
	issue, err := u.userRepo.GetIssueById(id)
	if err != nil {
		return models.Issues{}, err
	}
	return issue, nil

}

func (u *UserService) IssueCounts() (models.IssueCounts, error) {
	counts, err := u.userRepo.IssueCounts()
	if err != nil {
		return models.IssueCounts{}, err
	}
	return counts, nil
}

func (u *UserService) IssuesByStatus(status string) ([]models.Issues, error) {
	issues, err := u.userRepo.GetIssuesByStatus(status)
	if err != nil {
		return []models.Issues{}, err
	}
	return issues, nil
}

func (u *UserService) ChangeStatusById(body models.Comments, id string) (models.Issues, error) {
	issue, err := u.userRepo.ChangeStatusById(id)
	if err != nil {
		return models.Issues{}, err
	}
	newComment := models.Comments{
		Comments: body.Comments,
	}
	switch issue.Status {
	case "Open":
		issue.Status = "Inprogress"
		issue.InprogressDate = time.Now()
		issue.Comments = newComment.Comments
	case "Inprogress":
		issue.Status = "Closed"
		issue.ClosedDate = time.Now()
		issue.Comments = newComment.Comments
	default:
		return models.Issues{}, errors.New("invalid status")
	}
	err = u.userRepo.IssueStatusUpdate(issue)
	if err != nil {
		return models.Issues{}, err
	}
	return issue, nil
}
