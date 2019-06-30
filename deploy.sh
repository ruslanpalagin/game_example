yarn build
gsutil rsync -d -r build gs://time-lancer.stage-env.info
rm -rf build
