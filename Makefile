build:
	@if [ ! -d backend/api/.env ]; then\
  	echo ".env Directory not exists."; \
		cp -r backend/api/.env.sample backend/api/.env; \
	fi
	docker-compose up --build

restart:
	docker-compose up

format_frontend:
	docker-compose exec frontend npm run format

down:
	docker-compose down

image_clean:
	docker rmi $$(docker images -a -q)

volume_clean:
	docker volume prune -f

clean:
	docker system prune -f

fclean: clean volume_clean image_clean
