#setup websockets for GCloud
https://medium.com/google-cloud/a-node-js-websocket-server-on-google-app-engine-c6c32a486e9a

network:
  forwarded_ports:
  - 8081
  instance_tag: websocket
  
$ gcloud compute firewall-rules create default-allow-websockets --allow tcp:8081 --target-tags websocket

# deploy
ssh dev@35.240.39.143 "cd ~/production/game_example/server && git pull && sudo reboot"

# TODO deploy without reboot
http://fibrevillage.com/sysadmin/237-ways-to-kill-parent-and-child-processes-in-one-command

ps -o pid,ppid,pgid,gid,sess,cmd -U dev
pkill -9 -g $PGID
