FROM node:20-alpine

WORKDIR /usr/src/app

# Add Python and other build dependencies
RUN apk add --no-cache python3 make g++ pkgconfig cairo-dev pango-dev libjpeg-turbo-dev giflib-dev

COPY package*.json ./

RUN npm install

COPY . .

# Set environment variables for email from build args or runtime environment
ARG EMAIL_USER
ARG EMAIL_PASS

ENV EMAIL_USER=$EMAIL_USER
ENV EMAIL_PASS=$EMAIL_PASS

EXPOSE 5000

CMD ["npm", "run", "dev"]
