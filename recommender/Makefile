SOURCE_DIR = $(shell pwd)
IMAGE_NAME = recommender
HOST = carried.ru
DEST_DIR = projects/$(IMAGE_NAME)

all: build run
build:
	docker build -t $(IMAGE_NAME) .
run:
	docker run --name $(IMAGE_NAME) --rm -d -p 5000:5000 --mount type=bind,source=$(SOURCE_DIR)/model.pkl,target=/app/model.pkl $(IMAGE_NAME)
deploy_run:
	rsync -rtvzP . $(HOST):$(DEST_DIR)
	ssh $(HOST) 'cd $(DEST_DIR); make'
deploy_stop:
	ssh $(HOST) 'docker stop $(IMAGE_NAME)'
ci: deploy_stop deploy_run
