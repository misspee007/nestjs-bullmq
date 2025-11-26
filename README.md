## Description

This project was built to gain a basic understanding of how background workers work using BullMQ in a NestJS application. It follows a tutorial that focuses on offloading heavy tasks to background queues to keep APIs responsive and scalable.

## Project setup

```bash
$ npm install
```

## Redis setup (Docker)

This app uses BullMQ with Redis. The simplest way to run Redis alongside WSL/Linux is via Docker. Redis Insight is used for monitoring and managing Redis instances.

```bash
# Create the network (once)
docker network create redis-net

# Start (or restart) Redis on Docker with port published
docker run -d --name redis-server --network redis-net -p 6379:6379 redis:7-alpine

# Optional: Redis Insight on same network
docker run -d --name redis-insight --network redis-net -p 5540:5540 redis/redisinsight:latest
```

### View Redis Insight

After starting Redis Insight, open:

```text
http://localhost:5540
```

Add a database connection pointing to:

```text
Host: redis-server
Port: 6379
```

If your app and Redis do not run in Docker on the same network, you can use `127.0.0.1` instead of the container hostname (e.g., `redis-server`).

Environment variables used by the app (with safe defaults):

```bash
export REDIS_HOST=127.0.0.1
export REDIS_PORT=6379
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Troubleshooting

- Redis connect timeout (`ETIMEDOUT`): usually means the app cannot reach Redis.

  - Ensure the Docker container is running and the port is published:
    ```bash
    docker ps --filter name=redis-server
    docker port redis-server       # should show 0.0.0.0:6379->6379/tcp
    ```
  - Test connectivity from WSL:
    ```bash
    nc -vz 127.0.0.1 6379
    redis-cli -h 127.0.0.1 -p 6379 PING
    ```
  - Stop any local Redis service that may conflict with Docker:
    ```bash
    systemctl status redis         # if active
    sudo systemctl stop redis
    ```
  - Recreate Redis container cleanly:
    ```bash
    docker rm -f redis-server
    docker run -d --name redis-server --network redis-net -p 6379:6379 redis:7-alpine
    ```

- Using container hostname `redis-server` from the host won’t work unless the app also runs in Docker on the same network. From WSL, use `127.0.0.1:6379` with the port published.

- If you prefer Docker Compose, create a compose file to run both app and Redis on the same network, then set `REDIS_HOST=redis-server`.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

- Video: Building a Scalable Queue System with NestJS & BullMQ & Redis: https://youtu.be/vFI_Nf2PWFQ?si=5QbSUI0DAZK0bpAi
- Redis Stack on Docker: https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/docker/
- Redis Insight on Docker: https://redis.io/docs/latest/operate/redisinsight/install/install-on-docker/
- BullMQ docs: https://docs.bullmq.io/
- Queues/BullMQ on Nesjs: https://docs.nestjs.com/techniques/queues#bullmq-installation
- Nestjs TypeScript starter repository: https://github.com/nestjs/nest