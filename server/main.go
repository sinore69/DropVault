package main

import (
	"bytes"
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

var (
	minioClient *minio.Client
	bucketName  string
)

func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or failed to load it")
	}

	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	secretKey := os.Getenv("MINIO_SECRET_KEY")
	bucketName = os.Getenv("MINIO_BUCKET")

	if endpoint == "" || accessKey == "" || secretKey == "" || bucketName == "" {
		log.Fatal("One or more required environment variables are missing")
	}

	// Retry logic
	for {
		minioClient, err = minio.New(endpoint, &minio.Options{
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

	// Ensure bucket exists
	ctx := context.Background()
	for i := 0; i < 10; i++ {
		exists, err := minioClient.BucketExists(ctx, bucketName)
		if err == nil {
			if !exists {
				err := minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
				if err != nil {
					log.Fatalf("MakeBucket error: %v", err)
				}
				log.Printf("Created bucket: %s\n", bucketName)
			} else {
				log.Printf("Bucket already exists: %s\n", bucketName)
			}
			break
		}
		log.Printf("BucketExists error: %v (attempt %d/10). Retrying in 2s...", err, i+1)
		time.Sleep(2 * time.Second)

		if i == 9 {
			log.Fatalf("Failed to connect to MinIO after 10 attempts: %v", err)
		}
	}

	http.HandleFunc("/upload", uploadHandler)
	http.HandleFunc("/download", downloadHandler)
	http.HandleFunc("/list", listHandler)
	http.HandleFunc("/delete", deleteHandler)
	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// Handle CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	ctx := context.Background()
	objectName := r.URL.Query().Get("key")
	if objectName == "" {
		http.Error(w, "Missing 'key' query parameter", http.StatusBadRequest)
		return
	}

	// Read the entire request body into memory
	data, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	// Detect content type
	contentType := http.DetectContentType(data)

	// Upload to MinIO
	reader := bytes.NewReader(data)
	_, err = minioClient.PutObject(ctx, bucketName, objectName, reader, int64(len(data)), minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		http.Error(w, fmt.Sprintf("Upload failed: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Uploaded %s successfully\n", objectName)
}

func downloadHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	objectName := r.URL.Query().Get("key")
	if objectName == "" {
		http.Error(w, "Missing 'key' query parameter", http.StatusBadRequest)
		return
	}

	object, err := minioClient.GetObject(ctx, bucketName, objectName, minio.GetObjectOptions{})
	if err != nil {
		http.Error(w, fmt.Sprintf("Download failed: %v", err), http.StatusInternalServerError)
		return
	}
	defer object.Close()

	// Get object stat to get content-type
	stat, err := object.Stat()
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to stat object: %v", err), http.StatusInternalServerError)
		return
	}

	// Set proper headers
	w.Header().Set("Content-Type", stat.ContentType) // This tells browser it's an image/video/etc.
	w.Header().Set("Content-Disposition", fmt.Sprintf("inline; filename=\"%s\"", objectName))
	w.Header().Set("Content-Length", fmt.Sprintf("%d", stat.Size))
	w.WriteHeader(http.StatusOK)

	// Stream the object directly
	if _, err := io.Copy(w, object); err != nil {
		http.Error(w, fmt.Sprintf("Failed to send object: %v", err), http.StatusInternalServerError)
		return
	}
}

func listHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	for obj := range minioClient.ListObjects(ctx, bucketName, minio.ListObjectsOptions{Recursive: true}) {
		if obj.Err != nil {
			http.Error(w, obj.Err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Fprintln(w, obj.Key)
	}
}

func deleteHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	objectName := r.URL.Query().Get("key")
	if objectName == "" {
		http.Error(w, "Missing 'key' query parameter", http.StatusBadRequest)
		return
	}

	// Check if the object exists
	_, err := minioClient.StatObject(ctx, bucketName, objectName, minio.StatObjectOptions{})
	if err != nil {
		http.Error(w, fmt.Sprintf("Object '%s' does not exist or cannot be accessed: %v", objectName, err), http.StatusNotFound)
		return
	}

	err = minioClient.RemoveObject(ctx, bucketName, objectName, minio.RemoveObjectOptions{})
	if err != nil {
		http.Error(w, fmt.Sprintf("Delete failed: %v", err), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Deleted %s successfully\n", objectName)
}
