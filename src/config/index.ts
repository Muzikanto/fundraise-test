import { EnvConfig } from './env-config'

export const CONFIG = {
    DB_URI: EnvConfig.getString('DB_URI'),
    DB_NAME: EnvConfig.getValue('DB_NAME') || 'default',
    ANONYMISE_SALT: EnvConfig.getValue('ANONYMISE_SALT') || 'test',
}
