# portyx-api

[![Build Status](https://drone.dayler.dev/api/badges/iknpx/portyx-api/status.svg)](https://drone.dayler.dev/iknpx/portyx-api)

### Environment variables
- `HOST` Application host, used for generate links
- `LOGS_ACCESS` Access locs file name
- `LOGS_ERROR` Error locs file name
- `LOGS_PATH` Logs path directory
- `MAIL_DOMAIN` Mailgun domain
- `MAIL_FROM` Mailgun sender email
- `MAIL_HOST` Mailgun host
- `MAIL_KEY` Mailgun key
- `MONGODB_COLLECTION` MongoDB collection
- `MONGODB_HOST` MongoDB connection host
- `MONGODB_PORT` MongoDB connection port
- `NAME` Application name
- `PORT` Rest server port
- `REDIS_HOST` Redis host
- `REDIS_PORT` Redis port
- `SENTRY_DSN` Sentry dsn

### API
- [Postman](https://www.getpostman.com/collections/b89d387c6a6dae59d0db)

### Running example
```bash
docker run \
    -e MAIL_KEY=[string] \
    -e MONGODB_URL=[string] \
    -e REDIS_HOST=[string] \
    -e SENTRY_DSN=[string] \
    -p [number]:3000 \
    iknpx/portyx-api
```

### TODO
- [ ] Api specification
- [x] Download as MD service
- [x] Download as PDF service
- [ ] Stylize emails
