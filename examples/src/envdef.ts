import * as io from "io-ts"
import { NonEmptyString, NumberString, URL } from 'env-config-validator'

const EnvDef = io.strict({
    SQL_SERVER: NonEmptyString,
    SQL_DATABASE: NonEmptyString,
    SQL_USER: NonEmptyString,
    SQL_PASSWORD: NonEmptyString,
    SQL_CONNECTION_TIMEOUT: NumberString,
    SQL_REQUEST_TIMEOUT: NumberString,
    APP_HOST: URL
})
type EnvDef = io.TypeOf<typeof EnvDef>

const EnvDefGrouped = io.strict({
    SQL: io.strict({
        SERVER: NonEmptyString,
        DATABASE: NonEmptyString,
        USER: NonEmptyString,
        PASSWORD: NonEmptyString,
        CONNECTION_TIMEOUT: NumberString,
        REQUEST_TIMEOUT: NumberString,
    }),
    APP: io.strict({
        HOST: URL
    })
})
type EnvDefGrouped = io.TypeOf<typeof EnvDefGrouped>

export { EnvDef, EnvDefGrouped }
