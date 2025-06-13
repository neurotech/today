FROM node:alpine

RUN deluser --remove-home node

WORKDIR /frontend

ENV NODE_ENV=development

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ENV NODE_ENV=production

CMD [ "npm", "run", "build" ]
