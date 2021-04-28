import * as E from "fp-ts/lib/Either"
import { EnvConfigValidator } from "env-config-validator"
import { EnvDef, EnvDefGrouped } from "./src/envdef"

// Simple
EnvConfigValidator.unsafeLoad(EnvDef)
E.fold(console.error, console.log)(EnvConfigValidator.load(EnvDef))

// Grouped by concern by using _ 
EnvConfigValidator.unsafeLoad(EnvDefGrouped, true)
E.fold(console.error, console.log)(EnvConfigValidator.load(EnvDefGrouped, true))
