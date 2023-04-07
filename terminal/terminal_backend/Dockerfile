FROM node:14.17.3
WORKDIR /app
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install
COPY . .
EXPOSE 5050
CMD [ "npm", "start" ]
