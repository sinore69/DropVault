package routes

import (
	"context"
	"fmt"
	"gdc/config"
	"net/http"

	"github.com/minio/minio-go/v7"
)

func DeleteAllHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx := context.Background()

	objectCh := config.MinioClient.ListObjects(ctx, config.BucketName, minio.ListObjectsOptions{
		Recursive: true,
	})

	var objectsToDelete []minio.ObjectInfo
	for object := range objectCh {
		if object.Err != nil {
			http.Error(w, fmt.Sprintf("Failed to list object: %v", object.Err), http.StatusInternalServerError)
			return
		}
		objectsToDelete = append(objectsToDelete, object)
	}

	if len(objectsToDelete) == 0 {
		fmt.Fprintln(w, "Bucket is already empty")
		return
	}

	for _, obj := range objectsToDelete {
		err := config.MinioClient.RemoveObject(ctx, config.BucketName, obj.Key, minio.RemoveObjectOptions{})
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to delete '%s': %v", obj.Key, err), http.StatusInternalServerError)
			return
		}
	}

	fmt.Fprintf(w, "Deleted all %d objects successfully\n", len(objectsToDelete))
}
