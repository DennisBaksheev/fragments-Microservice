FROM node:16.17.0

LABEL maintainer="Dennis Baksheev <dbaksheev@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./src ./src

COPY tests/.htpasswd tests/.htpasswd


# Start the container by running our server
CMD ["npm", "start"]

EXPOSE 8080


