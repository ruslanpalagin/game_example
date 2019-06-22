yarn build
gsutil rsync -d -r build gs://gcloud.stage-env.info
rm -rf build
