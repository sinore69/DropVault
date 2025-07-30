package routes

import (
	"context"
	"fmt"
	"gdc/config"
	"net/http"

	"github.com/minio/minio-go/v7"
)

func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	objectName := r.URL.Query().Get("key")
	if objectName == "" {
		http.Error(w, "Missing 'key' query parameter", http.StatusBadRequest)
		return
	}

	// Check if the object exists
	_, err := config.MinioClient.StatObject(ctx, config.BucketName, objectName, minio.StatObjectOptions{})
	if err != nil {
		http.Error(w, fmt.Sprintf("Object '%s' does not exist or cannot be accessed: %v", objectName, err), http.StatusNotFound)
		return
	}

	err = config.MinioClient.RemoveObject(ctx, config.BucketName, objectName, minio.RemoveObjectOptions{})
	if err != nil {
		http.Error(w, fmt.Sprintf("Delete failed: %v", err), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Deleted %s successfully\n", objectName)
}
