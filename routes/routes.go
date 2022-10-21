package routes

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/vimalkumar-2124/helpdeskapp/models"
	"github.com/vimalkumar-2124/helpdeskapp/services"
)

type UserRoutes struct {
	UserService services.UserService
}

func NewInstanceOfIssueRoutes(userService services.UserService) *UserRoutes {
	return &UserRoutes{UserService: userService}
}

func (u *UserRoutes) AddIssueType(c *gin.Context) {
	var body models.IssueTypes
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	v := validator.New()
	if err := v.Struct(body); err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	err := u.UserService.AddIssueType(body)
	if err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	c.JSON(200, gin.H{"statusCode": 200, "message": "New issue type added"})
	return
}

func (u *UserRoutes) DeleteIssueType(c *gin.Context) {
	id := c.Param("id")
	err := u.UserService.DeleteIssueType(id)
	if err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	c.JSON(200, gin.H{"statusCode": 200, "message": "Issue type deleted successfully !!"})
}

func (u *UserRoutes) UpdateIssueType(c *gin.Context) {
	id := c.Param("id")
	var body models.IssueTypes
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	err := u.UserService.UpdateIssueType(body, id)
	if err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	c.JSON(200, gin.H{"statusCode": 200, "message": "Issue type updated"})
	return
}

func (u *UserRoutes) AllIssueTypes(c *gin.Context) {
	arrIssueTypes := make([]string, 0)
	allIssueTypes, err := u.UserService.AllIssueTypes()
	if err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	for _, val := range allIssueTypes {
		arrIssueTypes = append(arrIssueTypes, val.IssueType)
	}
	c.JSON(200, gin.H{"statusCode": 200, "message": "Types of issues", "issueTypes": arrIssueTypes})
	return
}

func (u *UserRoutes) AddIssues(c *gin.Context) {
	var body models.Issues
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	id, err := u.UserService.AddIssues(body)
	if err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	c.JSON(200, gin.H{"statusCode": 200, "message": "Issue raised successfully", "issue_id": id})
	return
}

func (u *UserRoutes) IssueCounts(c *gin.Context) {
	counts, err := u.UserService.IssueCounts()
	if err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	c.JSON(200, gin.H{"statusCode": 200, "message": "Issue Counts", "data": counts})
	return
}

func (u *UserRoutes) IssueById(c *gin.Context) {
	id := c.Param("id")
	issue, err := u.UserService.IssueById(id)
	if err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	c.JSON(200, gin.H{"statusCode": 200, "message": "Find the requested issue detail", "issue": issue})
	return
}

func (u *UserRoutes) IssuesByStatus(c *gin.Context) {
	status := c.Param("status")
	issues, err := u.UserService.IssuesByStatus(status)
	if err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	c.JSON(200, gin.H{"statusCode": 200, "message": fmt.Sprintf("%s issues", status), "issues": issues})
	return
}

func (u *UserRoutes) ChangeStatusById(c *gin.Context) {
	id := c.Param("id")
	var body models.Comments
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	issue, err := u.UserService.ChangeStatusById(body, id)
	if err != nil {
		c.JSON(400, gin.H{"statusCode": 400, "message": err.Error()})
		return
	}
	c.JSON(200, gin.H{"statusCode": 200, "message": "Status changed successfullyy", "data": issue})
	return
}
