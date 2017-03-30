all: docker

docker:
	docker build . -t chat-server
	docker run -d -p 3000:3000 chat-server
