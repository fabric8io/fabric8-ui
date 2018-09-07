#!/bin/bash

# Removes Open Sans font definitions from patternfly.min.css
sed '/\@font-face{font-family:\"Open Sans\"/d' "node_modules/patternfly/dist/css/patternfly.min.css" > "node_modules/patternfly/dist/css/patternfly.fontless.min.css"

# Removes the line importing fonts.less
sed '/\@import \"fonts.less\";/d' "node_modules/patternfly/dist/less/patternfly.less" > "node_modules/patternfly/dist/less/patternfly.fontless.less"
