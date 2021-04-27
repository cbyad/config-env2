import { config, DotenvConfigOutput } from "dotenv"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"
import * as io from "io-ts"
import { resolve } from "path"
import { Reporter } from "io-ts/lib/Reporter"

export namespace EnvConfigValidator {

    class CustomReporter implements Reporter<string> {
        public report = (validation: io.Validation<string>): string => pipe(
            validation,
            E.fold(
                (errors) => {
                    const fields = errors.map((error) => error.context.map(({ key }) => key).join(', '))
                    return ['Required Fields:', ...fields].join('').replace(':,', ':')
                },
                _ => 'no errors'
            )
        )
    }
    const reporter =  new CustomReporter()
    const SERVICE_SEPARATOR = '_'

    export const load = <T>(codecs: io.Type<T, unknown, unknown>, envPath?: string): T => {
        const result = pipe(
            envPath ? config({ path: resolve(__dirname, envPath) }) : config(),
            fromEnvToJson,
            E.map(candidate => validate(candidate, codecs)),
            E.map(E.map(_ => _))
        )
        if (E.isLeft(result)) throw new Error(String(result.left.message))
        if (E.isLeft(result.right)) throw new Error(reporter.report(result.right))
        return result.right.right
    }

    const validate = <T, I>(input: I, codecs: io.Type<T, unknown, I>) => codecs.decode(input)

    const fromEnvToJson = (fromEnv: DotenvConfigOutput, groupBy: boolean = false): E.Either<Error, unknown> => {
        const { error, parsed } = fromEnv
        if (error) return E.throwError(error)
        if (parsed) {
            if (groupBy) {
                // Now group key by concern
                const parsedGroupBy = Object.keys(parsed).reduce((acc, key) => {
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
        return E.throwError(new Error())
    }

}