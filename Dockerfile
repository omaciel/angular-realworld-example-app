FROM docker.io/cypress/base:10.18.1

RUN mkdir /app
WORKDIR /app

COPY . /app
RUN npm install -g yarn
RUN yarn install
RUN $(npm bin)/cypress verify
RUN ["npm", "run", "cypress:run"]
