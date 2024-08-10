# from project root, run
# docker build -t tjbindseil/picture_service -f picture_service/Dockerfile .   --progress=plain --no-cache
# then
# docker run --name picture_service -p 8080:8080 -d tjbindseil/picture_service

# also for the record, I was making postgres with:
# docker run --name local-postgres -p 5432:5432 -e POSTGRES_PASSWORD=mypassword -e POSTGRES_USER=admin -d postgres

FROM node:18-alpine

RUN mkdir -p /home/node/app/api/node_modules
RUN mkdir -p /home/node/app/app_config/node_modules
RUN mkdir -p /home/node/app/raster/node_modules
RUN mkdir -p /home/node/app/models/node_modules
RUN mkdir -p /home/node/app/picture_service/node_modules
RUN chown -R node:node /home/node/app

# this is like a local library place to hold linked moduels
RUN mkdir -p /usr/local/lib/node_modules/dwf-3-api-tjb
RUN mkdir -p /usr/local/lib/node_modules/dwf-3-app-config-tjb
RUN mkdir -p /usr/local/lib/node_modules/dwf-3-raster-tjb
RUN mkdir -p /usr/local/lib/node_modules/dwf-3-models-tjb
RUN chown -R node:node /usr/local/lib/node_modules

# this is for aws calls locally
# TODO remove this when it actually goes to the cloud
RUN mkdir -p /home/node/.aws/sso
RUN chown -R node:node /home/node/.aws/

USER node

# Note, all RUN commands will begin at this director
# But, our docker context is the project root in order
# to access the shared modules.
# So, commands relative to project root are
# in the context of the host, and commands relative
# to the workdir are in the context of the docker.
WORKDIR /home/node/app/picture_service

# copy and build api library
COPY --chown=node:node ./api/package*.json ../api
RUN cd ../api && npm install
COPY --chown=node:node ./api ../api
RUN cd ../api && npm run tsc

# copy and build app_config library
COPY --chown=node:node ./app_config/package*.json ../app_config
RUN cd ../app_config && npm install
COPY --chown=node:node ./app_config ../app_config
RUN cd ../app_config && npm run tsc

# copy and build raster library
COPY --chown=node:node ./raster/package*.json ../raster
RUN cd ../raster && npm install
COPY --chown=node:node ./raster ../raster
RUN cd ../raster && npm run tsc

# copy and build models library
COPY --chown=node:node ./models/package*.json ../models
RUN cd ../models && npm install && npm link ../raster
COPY --chown=node:node ./models ../models
RUN cd ../models && npm run tsc

# actual picture_service
COPY --chown=node:node ./picture_service/package*.json .
RUN npm install && npm link ../api ../raster ../models # not sure why we have to install before linking..
COPY --chown=node:node ./picture_service .

EXPOSE 8081

CMD [ "npm", "run", "start-dev" ]
