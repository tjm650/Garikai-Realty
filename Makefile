.PHONY: frontend lint build

frontend:
	cd frontend && npm run dev

lint:
	cd frontend && npm run lint

build:
	cd frontend && npm run build
