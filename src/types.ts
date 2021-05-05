import * as io from "io-ts"

/**
 * NonEmptyString
 */
interface NonEmptyStringBrand {
    readonly NonEmptyString: unique symbol
}
const NonEmptyString = io.brand(
    io.string,
    (s): s is io.Branded<string, NonEmptyStringBrand> => s.length > 0,
    'NonEmptyString'
)
type NonEmptyString = io.TypeOf<typeof NonEmptyString>

/**
 * Number from env
 */
interface NumberStringBrand {
    readonly NumberString: unique symbol
}
const NumberString = io.brand(
    NonEmptyString,
    (s): s is io.Branded<NonEmptyString, NumberStringBrand> => /^\d+$/.test(s),
    'NumberString'
)
// const NumberString = NonEmptyString
type NumberString = io.TypeOf<typeof NumberString>

/**
 * URL
 */
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
interface UrlBrand {
    readonly Url: unique symbol
}
const URL = io.brand(
    NonEmptyString,
    (s): s is io.Branded<NonEmptyString, UrlBrand> => urlRegex.test(s),
    'Url'
)
type URL = io.TypeOf<typeof URL>

export {
    NonEmptyStringBrand, NumberStringBrand, UrlBrand,
    NonEmptyString, NumberString, URL
}
