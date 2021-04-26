import { config, DotenvConfigOutput } from "dotenv"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"
import * as io from "io-ts"
import { resolve } from "path"

const fromEnvToJson = (fromEnv: DotenvConfigOutput): E.Either<Error, unknown> => {
    const SERVICE_SEPARATOR = '_'
    const { error, parsed } = fromEnv
    if (error) E.throwError(error)

    // Now group key by concern
    const newParsed = { ...parsed }!

    const toto = Object.keys(newParsed).reduce((acc, key) => {
        const prefix = key.split(SERVICE_SEPARATOR)
        if (prefix.length > 0) {
            const [groupBy, remains] = [prefix[0], prefix.slice(1).join(SERVICE_SEPARATOR)]
            acc[groupBy] = { ...acc[groupBy], [remains]: newParsed[key] }
        }
        else acc[key] = newParsed[key]
        return acc
    }, Object())

    return parsed ? E.right(parsed) : E.throwError(new Error())
}

const loadEnv = <T>(codecs: io.Type<T, unknown, unknown>, envPath?: string): T => {
    const result = pipe(
        envPath ? config({ path: resolve(__dirname, envPath) }) : config(),
        fromEnvToJson,
        E.map(candidate => validate(candidate, codecs)),
        E.map(E.map(_ => _))
    )
    if (E.isLeft(result)) throw new Error("Env File Parsing Failed")
    if (E.isLeft(result.right)) throw new Error("Type mismatch")
    return result.right.right
}

const validate = <T, I>(input: I, codecs: io.Type<T, unknown, I>) => codecs.decode(input)

export {
    loadEnv
}
