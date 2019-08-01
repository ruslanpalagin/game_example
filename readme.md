# Production URL 
http://time-lancer.stage-env.info/

# ALL: Update packages, start server & client
yarn dev

# ALL: deploy
./deploy.sh [GIT_BRANCH]

# Server: run
cd core && npm i 
cd server && npm i 
yarn dev

# Server: deploy
cd server && ./deploy.sh [GIT_BRANCH]

# Client: run 
cd client
yarn start

# Client: deploy
cd client && ./deploy.sh [GIT_BRANCH]

# Roadmap 

"S" - server
"UI" - UI
"I" - Infrastructure

- UI hp bar 
- UI/S target units
- UI/S implement cameras
- UI/S bulk WS actions transport

