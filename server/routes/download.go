package routes

import (
	"context"
	"fmt"
	"gdc/config"
	"io"
	"net/http"

	"github.com/minio/minio-go/v7"
)

func DownloadHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	objectName := r.URL.Query().Get("key")
	if objectName == "" {
		http.Error(w, "Missing 'key' query parameter", http.StatusBadRequest)
		return
	}

	object, err := config.MinioClient.GetObject(ctx, config.BucketName, objectName, minio.GetObjectOptions{})
	if err != nil {
		http.Error(w, fmt.Sprintf("Download failed: %v", err), http.StatusInternalServerError)
		return
	}
	defer object.Close()

	stat, err := object.Stat()
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to stat object: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", stat.ContentType) // This tells browser it's an image/video/etc.
	w.Header().Set("Content-Disposition", fmt.Sprintf("inline; filename=\"%s\"", objectName))
	w.Header().Set("Content-Length", fmt.Sprintf("%d", stat.Size))
	w.WriteHeader(http.StatusOK)

	if _, err := io.Copy(w, object); err != nil {
		http.Error(w, fmt.Sprintf("Failed to send object: %v", err), http.StatusInternalServerError)
		return
	}
}
