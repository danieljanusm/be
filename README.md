## Description

The application is used to measure current solar panel output based on the current weather for the current region and current hourly market rates.

## Installation

```bash
$ npm install
```

Configure your env file. Fill up all envs for postgres connection and additionally you have to fill ApiKey to weather provider described here: www.weatherapi.com.

```bash
WEATHER_API_KEY=
```

Do not change "DATABASE_URL" variable.

## Running the app

```bash
# database
$ docker-compose up

# development
$ npm run start

# watch mode
$ npm run start:dev
```
