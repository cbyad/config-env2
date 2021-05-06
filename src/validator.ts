import { config } from "dotenv"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"
import * as io from "io-ts"
import { Reporter } from "io-ts/lib/Reporter"
import nconf from "nconf"

import Either = E.Either

const SERVICE_SEPARATOR = '_'
enum LoadMode { None, Grouped }

class CustomReporter implements Reporter<string> {
    public report = <T>(validation: io.Validation<T>): string => pipe(
        validation,
        E.fold(
            errors => {
                const fields = errors.map(error => error.context.map(({ key }) => key).join(', '))
                return ['Required Fields:', ...fields].join('').replace(':,', ':')
            },
            _ => 'no errors'
        )
    )
}
export const reporter = new CustomReporter()

/**
 * Raise error in case of invalid matching, not found env file, parsing error
 * @param codecs 
 * @param mode 
 * @param envPath 
 * @returns env content
 */
const load = <T>(codecs: io.Type<T, unknown, unknown>, mode: LoadMode = LoadMode.None, envPath?: string): T => {
    const result = safeLoad(codecs, mode, envPath)
    if (E.isLeft(result)) throw new Error(String(result.left))
    return result.right
}

/**
 * Don't raise error in case of invalid matching, not found env file, parsing error
 * @param codecs 
 * @param mode 
 * @param envPath 
 * @returns Either monad
 */
const safeLoad = <T>(codecs: io.Type<T, unknown, unknown>, mode: LoadMode = LoadMode.None, envPath?: string): Either<string, T> => pipe(
    envPath ? config({ path: envPath }) : config(),
    _ => fromEnvToJson(mode, []),
    E.map(candidate => validate(candidate, codecs)),
    E.fold<string, io.Validation<T>, Either<string, T>>(
        E.left,
        validation => E.fold<io.Errors, T, Either<string, T>>(
            _ => E.left(reporter.report(validation)),
            (result: T) => E.right(result)
        )(validation)
    )
)

const validate = <T>(input: unknown, codecs: io.Type<T, unknown, unknown>) => codecs.decode(input)

const fromEnvToJson = (mode: LoadMode, fields: string[]): Either<string, unknown> => {
    const parsed = nconf.env().env({
        parseValues: true,
        whitelist: fields
    }).stores.env.store

    if (parsed) {
        if (mode == LoadMode.Grouped) {
            const parsedGroupBy: unknown = Object.keys(parsed).reduce((acc, key) => {
                const prefix = key.split(SERVICE_SEPARATOR)
                if (prefix.length > 0) {
                    const [groupBy, remains] = [prefix[0], prefix.slice(1).join(SERVICE_SEPARATOR)]
                    acc[groupBy] = { ...acc[groupBy], [remains]: parsed[key] }
                }
                else acc[key] = parsed[key]
                return acc
            }, Object())
            return E.right(parsedGroupBy)
        }
        return E.right(parsed)
    }
    return E.left('No content parsed')
}

export {
    LoadMode,
    load,
    safeLoad
}
