FROM node:12
WORKDIR /usr/src/app
COPY ./package.json ./
RUN yarn install
EXPOSE 3000
ENV DB_USER kitty_user
ENV DB_PASS kitty_password
ENV DB_NAME kitty_items
ENV DB_HOST host.docker.internal
RUN ls
CMD ["yarn","run","start"]