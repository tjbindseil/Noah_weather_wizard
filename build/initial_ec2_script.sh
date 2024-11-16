#!/bin/bash

set -e
set -x

sudo dnf update
sudo dnf upgrade
sudo dnf install git -y
git clone https://github.com/tjbindseil/Noah_weather_wizard.git ww_staging
git clone https://github.com/tjbindseil/Noah_weather_wizard.git ww_prod
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
sudo dnf install postgresql15 -y
sudo dnf install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
docker pull postgres
docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=ww-docker-unit-test -d -p 5432:5432 postgres
cd ww_prod/utilities && export WW_ENV='docker_unit_test' && node -e 'require("./build/src/index.js").initializeTables()' && cd ../../
docker stop my-postgres
sudo dnf install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
# TODO copy over .conf changes


# bash stuff
echo "alias gs='git status'" >> ~/.bashrc
echo "set -o vi" >> ~/.bashrc
