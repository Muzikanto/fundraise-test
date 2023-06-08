import { getRandomInt } from '../utils/random'
import { ICustomer } from './customer.types'
import { getCustomersFixtures } from './customer.fixture'
import { CustomerRepository } from './customer.repository'
import { getLogger } from '../utils/logger'
import { setWaitingInterval } from '../utils/common.functions'

const logger = getLogger('App')

async function runner(opts: {
    minCount: number
    maxCount: number
}): Promise<void> {
    const customersCount = getRandomInt(opts.maxCount, opts.minCount)

    const customersFixtures: ICustomer[] = getCustomersFixtures(customersCount)

    const repo = new CustomerRepository()
    await repo.saveMany(customersFixtures)

    logger.debug(`${customersCount} customers generated`)
}

export async function scheduleGenerateCustomers(opts: {
    minCount: number
    maxCount: number
    interval: number
}): Promise<void> {
    const func = () => runner(opts)
    setWaitingInterval(func, opts.interval)
}
