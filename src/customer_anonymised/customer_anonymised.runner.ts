import { CustomerRepository, ICustomer } from '../customer'
import { anonymiseCustomer } from './customer_anonymised.utils'
import { CustomerAnonymisedRepository } from './customer_anonymised.repository'
import { loadJson, saveJson } from '../utils/fs'
import path from 'path'
import { getLogger } from '../utils/logger'
import { setWaitingInterval } from '../utils/common.functions'

const logger = getLogger('Sync')
const CUSTOMERS_CACHE: Map<string, ICustomer> = new Map<string, ICustomer>()

const FETCH_CUSTOMERS_LIMIT = 500
const CUSTOMERS_COUNT_FOR_SAVE = 1000

// sync information
type ISyncInfo = {
    offset: number
}
const pathToSyncInfo = path.resolve('sync-info.json')
let syncInfo =
    loadJson<ISyncInfo>(pathToSyncInfo) ||
    saveJson(pathToSyncInfo, { offset: 0 })

async function runnerLoadCustomers(): Promise<{
    offset: number
    rows: number
}> {
    const repo = new CustomerRepository()

    // fetch data
    const offset = syncInfo.offset
    const customers: ICustomer[] = await repo.find({
        limit: FETCH_CUSTOMERS_LIMIT,
        skip: offset,
    })

    // skip if no rows
    if (!customers.length) {
        return { offset, rows: 0 }
    }

    // process
    for (const customer of customers) {
        const anonymisedCustomer = anonymiseCustomer(customer)

        CUSTOMERS_CACHE.set(anonymisedCustomer._id, anonymisedCustomer)
    }

    logger.debug(
        `${customers.length} customers added to cache, current cache size: ${CUSTOMERS_CACHE.size}`
    )

    // update local info
    syncInfo = {
        offset: offset + customers.length,
    }

    return { offset, rows: customers.length }
}
async function runnerSaveCustomers(opts: {
    isSaveSyncInfo?: boolean
}): Promise<void> {
    const customersAnonymisedRepo = new CustomerAnonymisedRepository()

    const customersAnonymised = Array.from(CUSTOMERS_CACHE.values())

    // save by parts of array
    for (
        let i = 0;
        i < customersAnonymised.length;
        i += CUSTOMERS_COUNT_FOR_SAVE
    ) {
        const customersForSave = customersAnonymised.slice(
            i,
            i + CUSTOMERS_COUNT_FOR_SAVE
        )

        await customersAnonymisedRepo.saveMany(customersForSave)

        // clear sync cache
        for (const customerForSave of customersForSave) {
            CUSTOMERS_CACHE.delete(customerForSave._id)
        }

        // update local file with sync info
        if (opts.isSaveSyncInfo) {
            saveJson(pathToSyncInfo, syncInfo)
        }

        logger.debug(
            `${customersForSave.length} anonymised customers saved, current offset: ${syncInfo.offset}`
        )
    }
}

export async function scheduleAnonymiseCustomers(opts: {
    intervalLoading: number
    intervalSave: number
    isReindex?: boolean
}): Promise<void> {
    if (opts.isReindex) {
        syncInfo = { offset: 0 }
        const repo = new CustomerRepository()
        const total = await repo.findCount()
        let isLoading = true

        logger.debug(`start reindex ${total} customers`)

        const stopLoadInterval = setWaitingInterval(() => {
            return runnerLoadCustomers().then((result) => {
                if (result.offset + result.rows >= total) {
                    stopLoadInterval()
                    isLoading = false
                }
            })
        }, opts.intervalLoading)
        const stopSaveInterval = setWaitingInterval(() => {
            return runnerSaveCustomers({ isSaveSyncInfo: false }).then(() => {
                if (!isLoading && CUSTOMERS_CACHE.size === 0) {
                    stopSaveInterval()

                    logger.debug(`finish reindex ${total} customers`)

                    process.exit(0)
                }
            })
        }, opts.intervalSave)
    } else {
        setWaitingInterval(() => runnerLoadCustomers(), opts.intervalLoading)
        setWaitingInterval(() => runnerSaveCustomers({}), opts.intervalSave)
    }
}
