FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --silent

COPY . ./

EXPOSE 8080
EXPOSE 443

CMD [ "npm", "run","preview" ]