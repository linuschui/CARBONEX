# backend/Dockerfile

# use official node image
FROM node:18

# set working directory inside container
WORKDIR /app

# copy package files first (better caching)
COPY package*.json ./

# install dependencies
RUN npm install

# copy rest of the source code
COPY . .

# expose backend port
EXPOSE 5001

# start the server
CMD ["npm", "start"]
