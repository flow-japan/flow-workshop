# tokens-js

API that sends transactions to the Flow Blockchain, using the [flow-js-sdk](https://github.com/onflow/flow-js-sdk/).
This API currently supports:

- Minting Kibbles (fungible token)
- Minting Kitty Items (non-fungible token)
- Creating Sale Offers for Kitty Items

### Setup

- Install npm dependencies:

```
npm install
```

- Development with containered db

```
docker-compose up -d
```
- Development with cloud sql
Save service account key at ./cloudSQLKey.json

execute
```
./cloud_sql_proxy -instances=flow-demo-302104:asia-northeast1:yugo-db=tcp:5432  -credential_file=cloudSQLKey.json
```

- Start app:

```
npm run start:dev
```

Note that when the API starts, it will automatically run the database migrations for the configured `DATABASE_URL` url.

- Start workers / flow event handlers:

```
npm run workers:dev
```

### Creating a new Flow Account on Testnet

In order to create an account on Testnet to deploy the smart contracts and mint Kibbles or Kitty Items, follow these steps:

- Head to https://testnet-faucet.onflow.org/
- Sign up for `Creating an account`

### Creating a new database migration:

```shell
npm run migrate:make
```

Migrations are run automatically when the app initializes



### GCP SETTING
for osx, execute below.
export GOOGLE_APPLICATION_CREDENTIALS="gcpkey.json"

### Todo