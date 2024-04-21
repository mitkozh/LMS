FROM node:16 as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install -g @angular/cli@16.2.3

RUN npm install

RUN ng build

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/local/app/dist/acs-lms-frontend /usr/share/nginx/html

EXPOSE 80
