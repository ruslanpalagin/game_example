ssh dev@35.240.39.143 "cd ~/production/game_example && git add -A && git reset --hard && git pull && git checkout $1"

scp ./bin/remote/npm_i.sh dev@35.240.39.143:~/production/game_example/server/bin/remote/npm_i.sh
scp ./bin/remote/server_restart.sh dev@35.240.39.143:~/production/game_example/server/bin/remote/server_restart.sh
scp ./bin/remote/server_start.sh.sh dev@35.240.39.143:~/production/game_example/server/bin/remote/server_start.sh.sh

ssh dev@35.240.39.143 "cd ~/production/game_example/server && ./bin/remote/npm_i.sh"
ssh dev@35.240.39.143 "cd ~/production/game_example/server && ./bin/remote/server_restart.sh"

echo "$1 deployment done with success"
