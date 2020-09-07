build:
	cd frontend && \
	npm run build && \
	mv build/ ../app/ && \
	cd .. && \
	npm run build && \
	rm -r app/

start-dev:
	cd frontend && \
	xfce4-terminal -e "npm start" && \
	cd .. && npm start

clear:
	rm -r enhanced-rich-presence*