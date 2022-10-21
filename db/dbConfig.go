package db

import (
	"context"
	"fmt"
	"log"

	"github.com/vimalkumar-2124/helpdeskapp/config"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Create mongoDb connection
func CreateDbConnection(dbName string) (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI(fmt.Sprintf("mongodb+srv://%s:%s@cluster0.lowctzs.mongodb.net/%s", config.Config("DB_USER"), config.Config("DB_PASS"), dbName))

	// Connect to MongoDb
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Connected to MongoDb")
	return client, err
}
