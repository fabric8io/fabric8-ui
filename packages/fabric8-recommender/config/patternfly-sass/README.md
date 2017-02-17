This directory exists to provide the ruby environment to generate the patternfly SASS.

## Install Ruby
Instructions taken from https://github.com/redhat-developer/developers.redhat.com/blob/master/README.md on 10th November 2016 by Pete Muir.

#### Pre-requisites for Ruby installation
Mac:

      brew install openssl libyaml libffi

Ubuntu/Debian/Mint:

      apt-get install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm3 libgdbm-dev

Centos/Fedora:

      yum install -y gcc openssl-devel bzip2 libyaml-devel libffi-devel readline-devel zlib-devel gdbm-devel ncurses-devel

#### Installation of rbenv
Mac: 

      git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
      echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
      echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
      source ~/.bash_profile

Linux:

      git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
      echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
      echo 'eval "$(rbenv init -)"' >> ~/.bashrc
      source ~/.bashrc

#### Installation of rbenv-build

      git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build

#### Install and Setup ruby

      rbenv install 2.1.2
      rbenv global 2.1.2
      gem update --system
      gem install bundler
      rbenv rehash
      bundle install

## Generate Patternfly SASS and copy over

Run `rake upgrade` to build and copy over, or `rake collect` to generate in this directory.
