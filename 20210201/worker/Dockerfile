FROM node:12
WORKDIR /usr/src/app
COPY ./package.json ./
RUN yarn install --productions
EXPOSE 3000
ENV DB_USER kitty_user
ENV DB_PASS kitty_password
ENV DB_NAME kitty_items
ENV DB_HOST host.docker.internal
ENV FLOW_NODE https://access-testnet.onflow.org
COPY . .
CMD ["yarn","run","start"]