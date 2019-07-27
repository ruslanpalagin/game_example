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

- UI?Server Fix ping effect
- UI/Server make controlling by server 
- UI/Server spawn units
- UI Fix isDead units loader
- UI hp bar 
- S target units
- UI target units