import * as E from "fp-ts/lib/Either"
import { EnvConfigValidator } from ".."
import { EnvDef, EnvDefGrouped } from "./envdef"

// Simple
const result = EnvConfigValidator.unsafeLoad(EnvDef)
E.fold(console.error, console.log)(EnvConfigValidator.load(EnvDef))

// Grouped by concern by using _ 
const result2 = EnvConfigValidator.unsafeLoad(EnvDefGrouped, true)
E.fold(console.error, console.log)(EnvConfigValidator.load(EnvDefGrouped, true))