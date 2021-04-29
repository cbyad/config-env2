type SqlConf = {
    server: string
    database: string
    password: string
}
const connect = (_: SqlConf) => console.log("connected")

export { SqlConf, connect }
