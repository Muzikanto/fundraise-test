import { getLogger } from './utils/logger'
import { initDatabase } from './utils/db'
import { CONFIG } from './config'
import { scheduleGenerateCustomers } from './customer/customer.runner'

// ===== Configuration =====
const MIN_GENERATED_CUSTOMERS = 1
const MAX_GENERATED_CUSTOMERS = 10
const GENERATION_INTERVAL = 200

const logger = getLogger('Bootstrap')

// ===== Bootstrap =====
async function bootstrap(): Promise<void> {
    await initDatabase({ uri: CONFIG.DB_URI, dbName: CONFIG.DB_NAME })

    await scheduleGenerateCustomers({
        interval: GENERATION_INTERVAL,
        minCount: MIN_GENERATED_CUSTOMERS,
        maxCount: MAX_GENERATED_CUSTOMERS,
    })
    logger.info(`Service is running!`)
}

bootstrap().then()
