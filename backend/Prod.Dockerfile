# syntax=docker/dockerfile:1

FROM node:18.15.0-alpine
WORKDIR /app

# ARE ALL THOSE PACKAGES NEEDED FOR THE FINAL IMAGE?
# Install node-gyp for our sharp dependency (Image processing)
RUN apk add --update --no-cache \
  make \
  g++ \
  automake \
  autoconf \
  libtool \
  nasm \
  libjpeg-turbo-dev
RUN chown node:node /app
RUN npm install jpegtran-bin

ARG PORT
ARG BUILD_DATE
ARG VERSION
ARG VCS_REF
LABEL org.label-schema.schema-version="1.0" \
      org.label-schema.name="node-gyp" \
      org.label-schema.version=${VERSION} \
      org.label-schema.build-date=${BUILD_DATE} \
      org.label-schema.description="node-gyp with toolchain on the NodeJS image" \
      org.label-schema.url="https://github.com/nodejs/node-gyp/" \
      org.label-schema.vcs-url="https://github.com/AndreySenov/node-gyp-docker/" \
      org.label-schema.vcs-ref=${VCS_REF}
ENV NODE_GYP_VERSION=${VERSION}
ENV HOME=/home/node
RUN apk add --no-cache python3 make g++ && \
    yarn global add node-gyp@${VERSION} && \
    yarn cache clean && \
    node-gyp help && \
    mkdir $HOME/.cache && \
    chown -R node:node $HOME

WORKDIR /app

# ARE ALL THOSE PACKAGES NEEDED FOR THE FINAL IMAGE?
# Installs latest Chromium (92) package (for use in puppeteer/ppt generation).
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# IS THIS NEEDED DOWN HERE?
# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# DO WE NEED THOSE LINES?
# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Instalar tzdata
RUN apk add --no-cache tzdata

# Definir o fuso horário desejado
ENV TZ=America/Sao_Paulo

COPY ["package.json", "package-lock.json*", "./"]
RUN chown -R node:node .
RUN npm install

# Cria a pasta public
RUN mkdir public
# adiciona permissao ao node para que os downloads sejam salvos
RUN chown -R node:node ./public

COPY --chown=node:node . .

RUN npm run build

EXPOSE $PORT

RUN chown -R 1000:1000 /home/node/.npm
USER node:node
CMD [ "npm", "start" ]
