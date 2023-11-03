# --- Build Stage ---
FROM node:16.17.0 AS build

LABEL maintainer="Dennis Baksheev <dbaksheev@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Set environment variables
ENV NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install && \
    npm cache clean --force  # Clean NPM cache after install

# Copy source files in a single layer
COPY ./src ./src
COPY tests/.htpasswd tests/.htpasswd

# --- Release Stage ---
FROM node:16.17.0-alpine

# We default to use port 8080 in our service
ENV PORT=8080

WORKDIR /app

# Copy node_modules and other necessary files from the build stage in one layer
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/src /app/src
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/tests/.htpasswd /app/tests/.htpasswd

# Start the container by running our server
CMD ["npm", "start"]

EXPOSE 8080
