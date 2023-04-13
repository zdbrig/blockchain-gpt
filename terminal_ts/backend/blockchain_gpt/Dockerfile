FROM node:16.10.0
WORKDIR /app
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install
COPY . .
EXPOSE 3040
CMD [ "npm", "start" ]
