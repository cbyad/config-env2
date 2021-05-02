import { load } from "env2"
import { MyEnvironment } from "./src/environment"
import { connect, SqlConf } from "./src/sql"

/**
 * In real app, loading conf is the first thing we do. So we must accept 
 * failure to be sure to run with valid content at runtime
 */
const myConf = load(MyEnvironment)
const { SQL_SERVER: server, SQL_DATABASE: database, SQL_PASSWORD: password } = myConf

const sqlConf: SqlConf = { server, database, password }
connect(sqlConf) // connected
