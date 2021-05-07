# ENV2 (WIP)
## About
`env2` stands for en**V**ironment **V**alidator. A tiny library to validate environment variables at runtime and extract content.

It's backed by [fp-ts](https://github.com/gcanti/fp-ts) for functional prog utilities and [io-ts](https://github.com/gcanti/io-ts) for runtime validation and define custom types.
For those who are unfamiliar with functional programming **No Worries** you need to only import `npm i io-ts` and follow `example` supplied

## Usage
- Basic usage => `npm i io-ts env2`
- FP usage => `npm i io-ts fp-ts env2` 

## Example
1. Define your environment schema

```ts
import * as io from "io-ts"
import { NonEmptyString, NumberString, URL } from 'env2'

const MyEnvironment = io.strict({
    SQL_SERVER: NonEmptyString,
    SQL_DATABASE: NonEmptyString,
    SQL_USER: NonEmptyString,
    SQL_PASSWORD: NonEmptyString,
    SQL_CONNECTION_TIMEOUT: NumberString,
    SQL_REQUEST_TIMEOUT: NumberString,
    APP_HOST: URL
})
type MyEnvironment = io.TypeOf<typeof MyEnvironment>
```

2. validate and extract content
```ts
import { load } from "env2"
import { MyEnvironment } from "./src/environment"

const myConf = load(MyEnvironment)
const { SQL_SERVER: server, SQL_DATABASE: database, SQL_PASSWORD: password } = myConf

type SqlConf = {
    server: string
    database: string
    password: string
}
const connect = (_: SqlConf) => console.log("connected")

const sqlConf: SqlConf = { server, database, password }
connect(sqlConf)
```
If your env file is located in other place => `load(MyEnvironment,customPath)`

## Contribution
__TODO__

## License
The MIT License (MIT)