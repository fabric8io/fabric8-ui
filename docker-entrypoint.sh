#!/bin/bash


echo -n Updating Webdriver and Selenium...
webdriver-manager update
webdriver-manager update --versions.chrome 2.24

## FIXME: Firefox complains about a missing machine-id file. So I set a random one
echo 8636d9aff3933f48b95ad94891cd1839 > /var/lib/dbus/machine-id

echo -n Running Xvfb...
/usr/bin/Xvfb :99 -screen 0 1024x768x24
