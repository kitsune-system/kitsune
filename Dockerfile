FROM node:11-alpine

WORKDIR /app

ADD package.json .
RUN npm install --only=production

ADD dist/main.js kitsune.js

CMD node kitsune.js
