import { getLogger } from './utils/logger'
import { initDatabase } from './utils/db'
import { CONFIG } from './config'
import { scheduleAnonymiseCustomers } from './customer_anonymised/customer_anonymised.runner'

// ===== Configuration =====
const isFullReindex = process.argv.includes('--full-reindex')

const logger = getLogger('Bootstrap')

// ===== Bootstrap =====
async function bootstrap(): Promise<void> {
    await initDatabase({ uri: CONFIG.DB_URI, dbName: CONFIG.DB_NAME })

    await scheduleAnonymiseCustomers({
        intervalLoading: 500,
        intervalSave: 1000,
        isReindex: isFullReindex,
    })
    logger.info(
        `Sync service is running!${isFullReindex ? ' (with full-reindex)' : ''}`
    )
}

bootstrap().then()
