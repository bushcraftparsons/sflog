# base image
FROM node:10.16.3

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json

# Install packages
RUN npm install --no-optional
RUN npm update

# start app
CMD ["npm", "start"]
