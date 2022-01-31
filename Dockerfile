FROM node

WORKDIR /app

COPY . /app

RUN yarn install

EXPOSE 8080

CMD ["node", "bin/server"]