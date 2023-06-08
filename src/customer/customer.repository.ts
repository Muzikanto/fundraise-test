import { Collection, Db, InsertManyResult } from 'mongodb'
import { getDatabase } from '../utils/db'
import { ICustomer } from './customer.types'

export class CustomerRepository {
    protected readonly collection: Collection<ICustomer>

    constructor() {
        this.collection = getDatabase().collection('customers')
    }

    public async saveMany(
        rows: ICustomer[]
    ): Promise<InsertManyResult<ICustomer>> {
        const insertResult = await this.collection.insertMany(rows)
        return insertResult
    }

    public async find(opts: {
        limit: number
        skip: number
    }): Promise<ICustomer[]> {
        const findResult = await this.collection
            .find({}, { limit: opts.limit, skip: opts.skip })
            .toArray()
        return findResult
    }

    public async findCount(): Promise<number> {
        const findCountResult = await this.collection.countDocuments()
        return findCountResult
    }
}
