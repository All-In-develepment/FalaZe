FROM node:16.3.0-alpine

WORKDIR /app

RUN chown node:node /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]