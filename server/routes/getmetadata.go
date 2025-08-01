package routes

import (
	"context"
	"gdc/config"
	"github.com/minio/minio-go/v7"
	"io"
	"net/http"
	"strings"
)

func GetMetadataHandler(w http.ResponseWriter, r *http.Request) {
	// Extract filename from URL path
	filename := strings.TrimPrefix(r.URL.Path, "/metadata/")
	if filename == "" {
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	// Get the metadata object from MinIO
	object, err := config.MinioClient.GetObject(context.Background(), "files", filename+".metadata", minio.GetObjectOptions{})
	if err != nil {
		http.Error(w, "Metadata not found", http.StatusNotFound)
		return
	}
	defer object.Close()

	// Read the metadata
	metadataBytes, err := io.ReadAll(object)
	if err != nil {
		http.Error(w, "Failed to read metadata", http.StatusInternalServerError)
		return
	}

	// Return the metadata as JSON
	w.Header().Set("Content-Type", "application/json")
	w.Write(metadataBytes)
}
