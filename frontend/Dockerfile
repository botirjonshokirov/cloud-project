FROM node:14.18.1

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app
CMD ["npm", "start"]
