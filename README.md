# part13-relational-databases

## This repository is exercise 13 for Helsinki Open university  | Full Stack Open MOOC https://fullstackopen.com

### requires .env file with content:
DATABASE_URL=postgres://username:password@localhost:5439/postgres
PORT=3001
SECRET=secret


### Maybe some useful commands:

run the docker-compose.yml
```docker compose up```

check running containers
```docker ps```

Access Postgres CLI from in docker GUI exec:
```psql -U username databasename```

or in cli:
```docker exec -it CONTAINER_ID psql -U username databasename```





