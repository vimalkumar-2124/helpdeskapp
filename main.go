package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/vimalkumar-2124/helpdeskapp/db"
	"github.com/vimalkumar-2124/helpdeskapp/repositories"
	"github.com/vimalkumar-2124/helpdeskapp/routes"
	"github.com/vimalkumar-2124/helpdeskapp/services"
)

// Middleware function

// To avoid CORS error
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-control-allow-origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func main() {
	log.Println("Starting...")
	dbName := "helpdesk"
	client, err := db.CreateDbConnection(dbName)
	if err != nil {
		log.Println("Failed to connect DB")
		panic(err)
	}
	defer client.Disconnect(context.TODO())
	db := client.Database(dbName)

	// Repositories
	issueRepo := repositories.NewInstanceOfIssueRepo(db)

	// Services
	issueService := services.NewInstanceOfIssueService(issueRepo)

	// Handlers
	issueHandler := routes.NewInstanceOfIssueRoutes(issueService)

	router := gin.Default()
	router.Use(CORSMiddleware())

	issues := router.Group("/")
	{
		issues.POST("/issues", issueHandler.AddIssues)
		issues.GET("/issues/:id", issueHandler.IssueById)
	}

	router.GET("/issues-counts", issueHandler.IssueCounts)
	router.GET("/issues-by-status/:status", issueHandler.IssuesByStatus)
	router.PUT("/change-status/:id", issueHandler.ChangeStatusById)
	issueTypesApi := router.Group("/")
	{
		issueTypesApi.GET("/issue-types", issueHandler.AllIssueTypes)
		issueTypesApi.POST("/issue-types", issueHandler.AddIssueType)
		issueTypesApi.PUT("/issue-types/:id", issueHandler.UpdateIssueType)
		issueTypesApi.DELETE("/issue-types/:id", issueHandler.DeleteIssueType)
	}

	router.Run(":8000")

}
