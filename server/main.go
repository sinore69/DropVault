package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"gdc/config"
	"gdc/routes"

	"github.com/joho/godotenv"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or failed to load it")
	}

	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	secretKey := os.Getenv("MINIO_SECRET_KEY")
	config.BucketName = os.Getenv("MINIO_BUCKET")

	if endpoint == "" || accessKey == "" || secretKey == "" || config.BucketName == "" {
		log.Fatal("One or more required environment variables are missing")
	}

	// Retry logic
	for {
		config.MinioClient, err = minio.New(endpoint, &minio.Options{
			Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
			Secure: false,
		})
		if err == nil {
			break
		}
		log.Println("Waiting for MinIO to be ready:", err)
		time.Sleep(2 * time.Second)
	}
	log.Println("Connected to MinIO")

	ctx := context.Background()
	for i := 0; i < 10; i++ {
		exists, err := config.MinioClient.BucketExists(ctx, config.BucketName)
		if err == nil {
			if !exists {
				err := config.MinioClient.MakeBucket(ctx, config.BucketName, minio.MakeBucketOptions{})
				if err != nil {
					log.Fatalf("MakeBucket error: %v", err)
				}
				log.Printf("Created bucket: %s\n", config.BucketName)
			} else {
				log.Printf("Bucket already exists: %s\n", config.BucketName)
			}
			break
		}
		log.Printf("BucketExists error: %v (attempt %d/10). Retrying in 2s...", err, i+1)
		time.Sleep(2 * time.Second)

		if i == 9 {
			log.Fatalf("Failed to connect to MinIO after 10 attempts: %v", err)
		}
	}

	http.HandleFunc("/upload", routes.UploadHandler)
	http.HandleFunc("/download", routes.DownloadHandler)
	http.HandleFunc("/list", routes.ListHandler)
	http.HandleFunc("/delete", routes.DeleteAllHandler)
	http.HandleFunc("/delete-all", routes.DeleteAllHandler)
	http.HandleFunc("/metadata", routes.GetMetadataHandler)
	http.HandleFunc("/getfile", routes.GetFileHandler)
	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
