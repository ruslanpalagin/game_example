#!/bin/bash -l

# paths can be relative to the current user that owns the crontab configuration

# $(which node) returns the path to the current node version
# either the one specified as `default` alias in NVM or a specific version set above
# executing `nvm use 4 1> /dev/null` here won't work!

export NVM_DIR="/home/dev/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm


cd ~/production/game_example/common && npm i
cd ~/production/game_example/server && npm i
cd ~/production/game_example/server && git pull
sudo reboot