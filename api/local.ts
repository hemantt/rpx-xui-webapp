/**
 * Local.ts used to run the application locally.
 */
import { app } from './application'
import { applicationConfiguration } from './configuration/appConfig'
import { appInsights } from './lib/appInsights'

/**
 * Show the developer the application configuration when they are developing locally.
 */
console.log(applicationConfiguration())

app.use(appInsights)

app.listen(3001, () => console.log('Dev server listening on port 3001!'))
