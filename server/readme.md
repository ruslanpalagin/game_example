#setup websockets for GCloud
https://medium.com/google-cloud/a-node-js-websocket-server-on-google-app-engine-c6c32a486e9a

network:
  forwarded_ports:
  - 8081
  instance_tag: websocket
  
$ gcloud compute firewall-rules create default-allow-websockets --allow tcp:8081 --target-tags websocket


cd ~/production/game_example/server && git pull && 
