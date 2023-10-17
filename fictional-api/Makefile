all: vet
vet: go.sum
	go vet ./...
fmt:
	go fmt ./...
build: go.sum
	go build -o out
go.sum: go.mod
	go mod tidy
	go mod download
