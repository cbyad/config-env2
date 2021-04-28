import { config, DotenvConfigOutput } from "dotenv"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"
import * as io from "io-ts"
import { resolve } from "path"
import { Reporter } from "io-ts/lib/Reporter"

export namespace EnvConfigValidator {

    class CustomReporter implements Reporter<string> {
        public report = <T>(validation: io.Validation<T>): string => pipe(
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
    export const reporter = new CustomReporter()
    const SERVICE_SEPARATOR = '_'

    export const unsafeLoad = <T>(codecs: io.Type<T, unknown, unknown>, groupBy: boolean = false, envPath?: string): T => {
        const result = load(codecs, groupBy, envPath)
        if (E.isLeft(result)) throw new Error(String(result.left))
        return result.right
    }

    export const load = <T>(codecs: io.Type<T, unknown, unknown>, groupBy: boolean = false, envPath?: string): E.Either<string, T> => pipe(
        envPath ? config({ path: resolve(__dirname, envPath) }) : config(),
        fromEnvToJson(groupBy),
        E.map(candidate => validate(candidate, codecs)),
        E.fold<string, io.Validation<T>, E.Either<string, T>>(
            E.left,
            validation => E.fold<io.Errors, T, E.Either<string, T>>(
                _ => E.left(reporter.report(validation)),
                (result: T) => E.right(result)
            )(validation)
        )
    )

    const validate = <T>(input: unknown, codecs: io.Type<T, unknown, unknown>) => codecs.decode(input)

    const fromEnvToJson = (groupBy: boolean = false) => (fromEnv: DotenvConfigOutput): E.Either<string, unknown> => {
        const { error, parsed } = fromEnv
        if (error) return E.left(error.message)
        if (parsed) {
            if (groupBy) {
                const parsedGroupBy: unknown = Object.keys(parsed).reduce((acc, key) => {
                    const prefix = key.split(SERVICE_SEPARATOR)
                    if (prefix.length > 0) {
                        const [groupBy, remains] = [prefix[0], prefix.slice(1).join(SERVICE_SEPARATOR)]
                        acc[groupBy] = { ...acc[groupBy], [remains]: parsed[key].trim() }
                    }
                    else acc[key] = parsed[key].trim()
                    return acc
                }, Object())
                return E.right(parsedGroupBy)
            }
            return E.right(parsed)
        }
        return E.left('No content parsed')
    }

}
