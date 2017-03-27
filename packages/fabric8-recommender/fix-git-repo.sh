#!/bin/bash

git show-ref --head --heads | while IFS=' ' read -r hash name; do test ! -e "${GIT_DIR:-.git}/$name" && echo $hash > "${GIT_DIR:-.git}/$name"; done

exit 0
