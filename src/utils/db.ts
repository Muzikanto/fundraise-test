import { Db, MongoClient } from 'mongodb'
import { getLogger } from './logger'

// Connection URL
let client: MongoClient
let db: Db

const logger = getLogger('DB')

// Database Name
export async function initDatabase(opts: { uri: string; dbName: string }) {
    client = new MongoClient(opts.uri)

    // Use connect method to connect to the server
    await client.connect()
    logger.debug('Connected successfully to db')

    db = client.db(opts.dbName)

    return db
}

export function getDatabase(): Db {
    if (!db) {
        throw new Error('DB does not initialized')
    }

    return db
}
