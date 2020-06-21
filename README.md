# abme-api

[![Build Status](https://drone.dayler.dev/api/badges/402kg/abme-api/status.svg)](https://drone.dayler.dev/402kg/abme-api)

### Environment variables
- `HOST` Application host, used for generate links (required)
- `LOGS_ACCESS` Access locs file name
- `LOGS_ERROR` Error locs file name
- `LOGS_PATH` Logs path directory
- `MAIL_DOMAIN` Mailgun domain
- `MAIL_FROM` Mailgun sender email
- `MAIL_HOST` Mailgun host
- `MAIL_KEY` Mailgun key (required)
- `MONGODB_COLLECTION` MongoDB collection (required)
- `MONGODB_HOST` MongoDB connection host (required)
- `MONGODB_PORT` MongoDB connection port
- `NAME` Application name
- `PORT` Rest server port
- `REDIS_HOST` Redis host (required)
- `REDIS_PORT` Redis port
- `SENTRY_DSN` Sentry dsn

### Running example
```bash
docker run \
    -e MAIL_KEY=[string] \
    -e MONGODB_COLLECTION=[string] \
    -e MONGODB_HOST=[string] \
    -e REDIS_HOST=[string] \
    -e PORT=3000
    -p [number]:3000 \
    iknpx/abme-api
```
