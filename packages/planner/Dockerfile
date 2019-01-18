FROM centos:7
ENV LANG=en_US.utf8

# load the gpg keys
COPY deploy/gpg /gpg

# gpg keys listed at https://github.com/nodejs/node
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
  ; do \
    gpg --import "/gpg/${key}.gpg" ; \
  done

#ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 8.3.0
# Get latest version of git. Default repository has git version 1.8.2
RUN rpm -U http://opensource.wandisco.com/centos/7/git/x86_64/wandisco-git-release-7-2.noarch.rpm

RUN yum -y update && \
    yum install -y bzip2 git epel-release libappindicator python-devel\
      java-1.8.0-openjdk wget unzip which gcc-c++ && \
      yum -y clean all

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Uncomment it if you want to use firefox
#RUN  wget https://github.com/mozilla/geckodriver/releases/download/v0.14.0/geckodriver-v0.14.0-linux64.tar.gz \
#  && tar -xvf geckodriver-v0.14.0-linux64.tar.gz \
#  && chmod +x geckodriver \
#  && rm geckodriver-v0.14.0-linux64.tar.gz \
#  && mv geckodriver /usr/bin \
#  && yum install -y firefox \
#  && npm install -g karma-firefox-launcher

COPY tests/google-chrome.repo /etc/yum.repos.d/google-chrome.repo

RUN yum install -y google-chrome-stable

ENV FABRIC8_USER_NAME=fabric8

RUN useradd --user-group --create-home --shell /bin/false ${FABRIC8_USER_NAME}

ENV HOME=/home/${FABRIC8_USER_NAME}
ENV WORKSPACE=$HOME/fabric8-planner
RUN mkdir $WORKSPACE

COPY . $WORKSPACE

WORKDIR $WORKSPACE/
