ARG NODE_VERSION=22.12.0
FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app
COPY ./package*.json .
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
COPY . .
RUN mkdir -p /usr/src/app/reports && \
    mkdir -p /usr/src/app/avatars && \
    chown -R node:node /usr/src/app/reports && \
    chown -R node:node /usr/src/app/avatars
USER node
VOLUME ["/usr/src/app/reports"]
EXPOSE 3004
CMD ["node", "index.js"]
