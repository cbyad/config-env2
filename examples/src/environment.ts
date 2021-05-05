import * as io from "io-ts"
import { NonEmptyString, NumberString, URL } from 'env2'

/**
 * Here we define schema of our environment variables by using io-ts utilities
 * We use custom types provided by env2
 * @typedef NonEmptyString -> check that value can't be empty
 * @typedef NumberString -> check that value is a valid number even if it's provided from string
 * @typedef URL -> check that value match a conform url
 */
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

export { MyEnvironment }
