FROM registry.centos.org/kbsingh/openshift-nginx:latest

ENV LANG=en_US.utf8

USER root
ADD deploy/nginx.conf /etc/nginx/nginx.conf
USER 997

RUN rm /usr/share/nginx/html/*

COPY runtime/dist /usr/share/nginx/html
