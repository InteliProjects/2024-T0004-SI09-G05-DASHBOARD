FROM node:18-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN npm install -g @angular/cli@^17.2.0

RUN npm install

RUN ng build --configuration=production

CMD ["ng", "serve", "--host", "0.0.0.0"]
