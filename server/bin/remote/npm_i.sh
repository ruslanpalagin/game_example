#!/bin/bash -l

# paths can be relative to the current user that owns the crontab configuration

# $(which node) returns the path to the current node version
# either the one specified as `default` alias in NVM or a specific version set above
# executing `nvm use 4 1> /dev/null` here won't work!

export NVM_DIR="/home/dev/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

# USAGE: cd server && ./bin/remote/npm_i.sh
cd ..
echo $(pwd)
cd server && npm i
cd ..
cd core && npm i
