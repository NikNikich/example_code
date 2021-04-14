FROM node:14.15.0 as builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn && yarn install --production --modules-folder ./modules
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY config ./config
COPY src ./src
RUN yarn build
RUN cp -R ./src/application/views/email/ ./dist/src/application/views/email/

FROM node:14.15.0
WORKDIR /app
COPY --from=0 /app/modules /app/node_modules
COPY --from=0 /app/dist /app/
EXPOSE 3000
CMD node src/main.js
