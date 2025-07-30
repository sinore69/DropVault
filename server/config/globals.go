package config

import (
	"github.com/minio/minio-go/v7"
)

var (
	MinioClient *minio.Client
	BucketName  string
)
