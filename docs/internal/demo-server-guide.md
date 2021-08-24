# mFlow Demo Server build and install using Docker

## Prep

- Add token to githubtoken.txt (for downloading expression-evaluator)
  - requires token that has read access to packages on server repo
- Edit `dockerise.sh` and update `SERVER_BRANCH`, `WEB_APP_BRANCH` and `IMAGE_NAME`

## Build

`cd docker`  
`./dockerise.sh`

Should take a while to run, will build a local image

## Test locally

- Edit `run.sh`
  - include correct `SMTP_PASSWORD`(from Bitwarden or your personal .env file)
  - Change test build to name of image created
- Run it: `./run.sh`

## Upload to Docker hub

- Login to docker hub (web site) to see the images in there:
  - msupplyfoundation - password in Bitwarden (Shared-Admin)
- List local images to get the “image ID” and "tag name"  
  `docker image ls`
- Create tag:  
  `docker tag <image_id> <account-name>/<docker-repo>:<tag-name>`
- Push new tag:  
   `docker push <image_id> <account-name>/<docker-repo>:<tag-name>`  
  Image will upload to Docker hub

Example:

- account-name: `msupplyfoundation`
- docker-repo: `mflow-demo`
- tag-name: `front-demo-19-08-2021_back-demo-19-08-2021_pg-12_node-14`

```
docker tag dbb2111d56e9 msupplyfoundation/mflow-demo:front-demo-19-08-2021_back-demo-19-08-2021_pg-12_node-14

docker push msupplyfoundation/mflow-demo:front-demo-19-08-2021_back-demo-19-08-2021_pg-12_node-14
```

## Log in to demo server with ssh

- Get key file from Bitwarden (openstack-irims-demo-keypair) and save locally
- SSH login to server:  
  `sudo ssh -i <path/to/keyfile> ubuntu@irims-demo.msupply.org`
- View commit hashes of currently running images:  
  `sudo docker container ls`
- Stop all instances:  
  `sudo docker stop <hashes… >`
- Pull image from docker hub:  
  `sudo docker pull <full-image-name>`
- Run image:  
  `sudo docker run -dti -p 8000:3000 -e 'SMTP_PASSWORD=<password>' -e 'WEB_HOST=https://irims-demo.msupply.org:50000' --name mflow-demo-on-8000 msupplyfoundation/mflow-demo:front-demo-19-08-2021_back-demo-19-08-2021_pg-12_node-14`  
   This will launch one instance. To launch other instances in their own container, run the same command, but change:

  - name
  - port 8000
  - WEB_HOST url

  The system will be launched with “basic_snapshot” data. Upload and run a new snapshot as required

## To restart an instance

- Run `sudo docker stop <name>` (name from above, or can use container id)
- Remove container: `sudo docker rm <name>`
- Re-run as above. Note: this resets the container to initial state, including database reset. If you want to preserve existing data, you’ll need to take a snapshot first, then reload after restart.

### Other:

You can access the command line of a particular container instance with the following:

`sudo docker exec -ti <name-or-container-id> /bin/bash`

From there the following commands might be useful:

- view environment variables: `printenv`
- check the server log: `tail -n 100 /var/log/application_manager/server.log`