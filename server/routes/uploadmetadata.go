package routes

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"gdc/config"
	"github.com/minio/minio-go/v7"
	"net/http"
	"time"
)

type Metadata struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	Type       string  `json:"type"` // "file" or "folder"
	CreatedAt  string  `json:"createdAt"`
	ModifiedAt string  `json:"modifiedAt"`
	ParentID   *string `json:"parentId"` // Nullable in Go
	Shared     bool    `json:"shared"`
	Starred    bool    `json:"starred"`
	Owner      string  `json:"owner"`
}

func UploadMetadataHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	ctx := context.Background()

	err := r.ParseMultipartForm(10 << 20) // Max 10MB
	if err != nil {
		http.Error(w, "Could not parse multipart form", http.StatusBadRequest)
		return
	}

	// Get the file from the "file" field
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Could not get file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	fmt.Println("Image file received:", fileHeader.Filename)

	// Get the metadata file from the "metadata" field
	metadataFile, _, err := r.FormFile("metadata")
	if err != nil {
		http.Error(w, "Could not get metadata", http.StatusBadRequest)
		return
	}
	defer metadataFile.Close()

	var metadata Metadata
	err = json.NewDecoder(metadataFile).Decode(&metadata)
	if err != nil {
		http.Error(w, "Invalid metadata format", http.StatusBadRequest)
		return
	}

	// Set timestamps if not provided
	if metadata.CreatedAt == "" {
		metadata.CreatedAt = time.Now().UTC().Format(time.RFC3339)
	}
	if metadata.ModifiedAt == "" {
		metadata.ModifiedAt = time.Now().UTC().Format(time.RFC3339)
	}

	// Generate object name for metadata
	objectName := fmt.Sprintf("metadata/%s.json", metadata.ID)

	// Convert metadata back to JSON for storage
	metadataBytes, err := json.Marshal(metadata)
	if err != nil {
		http.Error(w, "Failed to marshal metadata", http.StatusInternalServerError)
		return
	}

	// Upload metadata JSON to MinIO
	_, err = config.MinioClient.PutObject(ctx, config.BucketName, objectName, bytes.NewReader(metadataBytes), int64(len(metadataBytes)), minio.PutObjectOptions{
		ContentType: "application/json",
	})
	if err != nil {
		http.Error(w, fmt.Sprintf("Metadata upload failed: %v", err), http.StatusInternalServerError)
		return
	}

	fmt.Println("Metadata uploaded successfully for:", metadata.ID)
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Metadata uploaded successfully: %s\n", objectName)

	// Generate object name for the file
	fileObjectName := fmt.Sprintf("files/%s_%s", metadata.ID, fileHeader.Filename)

	// Upload the image file to MinIO
	_, err = config.MinioClient.PutObject(ctx, config.BucketName, fileObjectName, file, fileHeader.Size, minio.PutObjectOptions{
		ContentType: fileHeader.Header.Get("Content-Type"),
	})
	if err != nil {
		http.Error(w, fmt.Sprintf("File upload failed: %v", err), http.StatusInternalServerError)
		return
	}

	fmt.Println("File uploaded successfully for:", metadata.ID)

}
