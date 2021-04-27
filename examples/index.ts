import * as io from "io-ts"
import * as E from "fp-ts/lib/Either"
import { EnvConfigValidator } from "../src/configvalidator"

const EnvPayload = io.strict({
    SQL_SERVER: io.string,
    SQL_DATABASE: io.string,
    SQL_USER: io.string,
    SQL_PASSWORD: io.string,
    SQL_CONNECTION_TIMEOUT: io.string,
    SQL_REQUEST_TIMEOUT: io.string
})
type EnvPayload = io.TypeOf<typeof EnvPayload>

const result = EnvConfigValidator.unsafeLoad(EnvPayload)
E.fold(console.error, console.log)(EnvConfigValidator.load(EnvPayload))
