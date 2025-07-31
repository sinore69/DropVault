package routes

import (
	"context"
	"fmt"
	"net/http"
"gdc/config"
	"github.com/minio/minio-go/v7"
)

func ListHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	for obj := range config.MinioClient.ListObjects(ctx, config.BucketName, minio.ListObjectsOptions{Recursive: true}) {
		if obj.Err != nil {
			http.Error(w, obj.Err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Fprintln(w, obj.Key)
	}
}
