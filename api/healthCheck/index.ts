import * as express from 'express'
// import { config } from '../dep-config'
import {getConfigValue} from '../configuration'
import {
  SERVICES_CCD_COMPONENT_API_PATH,
} from '../configuration/references'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'

export const router = express.Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

const that = this

router.get('/', healthCheckRoute)

/*
    Any feature that requires a health check
    will need to have its path declared as a
    property in the healthCheckEndpointDictionary.
    Then this property will need to have an array
    of api url's assigned to it.
*/

const healthCheckEndpointDictionary = {
    '/cases': ['ccdComponentApi'], // keep parent paths on top of children
    '/cases/case-create': ['ccdComponentApi'],
    '/cases/case-details': ['ccdComponentApi'],
    '/cases/case-filter': ['ccdComponentApi'],
    '/cases/case-search': ['ccdComponentApi'],
}

/*
    Health check endpoints are retrieved from
    environment json files. The "health" property
    inside an environment file is the exact copy
    of the "service" property, apart from the fact
    that an "/health" path is added at the end of
    each api url. The "service" property is not used
    in health check, because the url for a healthcheck
    endpoint may be different from a regular endpoint
*/

export function getPromises(path): any[] {
    const Promises = []

    /* Checking whether path can be simplified, ie route has parameters*/
    const dictionaryKeys = Object.keys(healthCheckEndpointDictionary).reverse()
    for (const key of dictionaryKeys)  {
        if (path.indexOf(key) > -1) {
            path = key
            break
        }
    }

    // TODO: New logic TEST
    const health = getConfigValue('health')

    if (healthCheckEndpointDictionary[path]) {
        healthCheckEndpointDictionary[path].forEach(endpoint => {
            // TODO: New logic TEST
            Promises.push(http.get(health[endpoint]))
        })
    }
    return Promises
}

export async function healthCheckRoute(req, res) {
    try {
        const path = req.query.path
        let PromiseArr = []
        let response = { healthState: true }

        if (path !== '') {
            PromiseArr = that.getPromises(path)
        }

        // comment out following block to bypass actual check
        await Promise.all(PromiseArr).then().catch(() => {
            response = { healthState: false }
        })

        logger.info('response::', response)
        res.send(response)
    } catch (error) {
        console.log(error)
        logger.info('error', { healthState: false })
        res.status(error.status).send({ healthState: false })
    }
}
export default router
