package routes

import (
	"context"
	"fmt"
	"gdc/config"
	"github.com/minio/minio-go/v7"
	"io"
	"net/http"
	"net/url"
	"strings"
)

func GetFileHandler(w http.ResponseWriter, r *http.Request) {
	// Extract filename from URL path
	filename := strings.TrimPrefix(r.URL.Path, "/files/")
	if filename == "" {
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	// URL decode the filename if needed
	decodedFilename, err := url.PathUnescape(filename)
	if err != nil {
		http.Error(w, "Invalid filename encoding", http.StatusBadRequest)
		return
	}

	// Get the file from MinIO
	object, err := config.MinioClient.GetObject(context.Background(), "files", decodedFilename, minio.GetObjectOptions{})
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	defer object.Close()

	// Get file stats
	stat, err := object.Stat()
	if err != nil {
		http.Error(w, "Failed to get file info", http.StatusInternalServerError)
		return
	}

	// Set response headers
	w.Header().Set("Content-Type", stat.ContentType)
	w.Header().Set("Content-Length", fmt.Sprint(stat.Size))
	w.Header().Set("Content-Disposition", fmt.Sprintf("inline; filename=\"%s\"", decodedFilename))

	// Stream file to client
	_, err = io.Copy(w, object)
	if err != nil {
		http.Error(w, "Failed to stream file", http.StatusInternalServerError)
		return
	}
}
