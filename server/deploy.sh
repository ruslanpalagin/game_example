ssh dev@35.240.39.143 "cd ~/production/game_example && git add -A && git reset --hard && git pull && git checkout feature/infra"
# && ./server_restart.sh