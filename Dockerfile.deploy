FROM fabric8/fabric8-openshift-nginx:v5c81e3e
MAINTAINER "Pete Muir <pmuir@bleepbleep.org.uk>"

USER root

RUN rm -rf /usr/share/nginx/html/
COPY dist /usr/share/nginx/html
RUN chmod -R 777 /usr/share/nginx/html/


USER ${FABRIC8_USER_NAME}
