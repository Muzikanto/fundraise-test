import { Collection, InsertManyResult } from 'mongodb'
import { getDatabase } from '../utils/db'
import { ICustomerAnonymised } from './customer_anonymised.types'

export class CustomerAnonymisedRepository {
    protected readonly collection: Collection<ICustomerAnonymised>

    constructor() {
        this.collection = getDatabase().collection('customers_anonymised')
    }

    public async saveMany(rows: ICustomerAnonymised[]): Promise<void> {
        await this.collection.bulkWrite(
            rows.map((row) => ({
                updateOne: {
                    filter: { _id: row._id },
                    update: { $set: { ...row } },
                    upsert: true,
                },
            }))
        )
    }

    public async find(opts: {
        limit: number
        skip: number
    }): Promise<ICustomerAnonymised[]> {
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
