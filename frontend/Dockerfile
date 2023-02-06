# pull base image
FROM node:19

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_OPTIONS --openssl-legacy-provider
# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps




# add app
COPY . ./

# start app
ENTRYPOINT [ "npm" ]
CMD ["run", "web"]



