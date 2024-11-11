# DB Unit tests
1. set up docker (install, start, enable, add user to docker group)
2. pull postgres (`docker pull postgres`)
3. start db container: `docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=ww-docker-unit-test -d -p 5432:5432 postgres `
4. create tables: (from utilities dir) `export WW_ENV='docker_unit_test' && node -e 'require("./build/src/index.js").initializeTables()'`
5. the unit tests should "just work". The container will be started and stopped so as not to nuke the computer too much
