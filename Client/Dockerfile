FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Accept build args for environment variables
ARG REACT_APP_API_URL
ARG CHOKIDAR_USEPOLLING
ARG WATCHPACK_POLLING
ARG FAST_REFRESH

# Create .env file inside container for React app
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env && \
    echo "CHOKIDAR_USEPOLLING=$CHOKIDAR_USEPOLLING" >> .env && \
    echo "WATCHPACK_POLLING=$WATCHPACK_POLLING" >> .env && \
    echo "FAST_REFRESH=$FAST_REFRESH" >> .env

COPY . .

EXPOSE 3000

ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

CMD ["npm", "start"]
