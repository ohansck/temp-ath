ARG NODE_VERSION=node:alpine3.17
ARG ENV=production

FROM $NODE_VERSION As production

WORKDIR /app

ENV NODE_ENV=$ENV

COPY --chown=node:node package*.json ./

RUN npm ci --only=production

COPY --chown=node:node ./dist ./dist

RUN ls

EXPOSE 3000

CMD [ "node", "dist/main.js" ]