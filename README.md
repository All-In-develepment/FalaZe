## FalaZe

#CRM com whatsapp

Para executar o projeto, inicialmente deve-se criar o arquivo .env baseado no .env.example, preencher o arquivo .env, com o campo DB_HOST=db-mysql, o restante com suas informações.

Em seguida rode o comando

```docker-compose up -d

```

esse comando gerará as imagens e executará o docker automaticamente.

No docker:

- [ ] Para conferir se o docker está rodando use,

  ```docker-compose ps

  ```

- [ ] Agora precisa acessar o docker, use,

  ```docker exec -it whatsapp_bot /bin/bash

  ```

- [ ] Dentro da máquina linux do docker precisamos gerar as migrations

  ```npx sequelize db:migrate
  npx sequelize db:seed:all

  ```
