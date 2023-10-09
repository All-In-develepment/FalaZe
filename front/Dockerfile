FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm update --save

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

#FROM nginx:alpine
#RUN apk add --no-cache jq openssl

#ENV DOCKERIZE_VERSION v0.6.1
#RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

#ENV PUBLIC_HTML=/var/www/public/

#COPY .docker/nginx /etc/nginx/
#COPY --from=build-deps /usr/src/app/build ${PUBLIC_HTML}
#EXPOSE 80

#COPY .docker/add-env-vars.sh /docker-entrypoint.d/01-add-env-vars.sh
#RUN chmod +x /docker-entrypoint.d/01-add-env-vars.sh
