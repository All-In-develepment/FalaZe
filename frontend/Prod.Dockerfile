# Use uma imagem Node.js como base
FROM node:16.3.0-alpine as build

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências do Node.js
RUN npm install

# Copie o restante dos arquivos do aplicativo
COPY . .

# Construa o aplicativo React
RUN npm run build

# Use uma imagem Nginx para servir o aplicativo construído
FROM nginx:alpine

# Copie o conteúdo construído do aplicativo React para o diretório do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponha a porta 80 para fora do contêiner
EXPOSE 80

# O comando de inicialização padrão do Nginx é suficiente para iniciar o servidor
