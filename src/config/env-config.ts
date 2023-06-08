import dotenv from 'dotenv'

const RAW_CONFIG = dotenv.config({}).parsed || {}

export class EnvConfig {
    public static getValue(key: string): string | undefined {
        return RAW_CONFIG[key]
    }

    public static getString(key: string): string {
        const value = EnvConfig.getValue(key)

        if (!value) {
            throw new Error(`${key} is not defined in env`)
        }

        return value
    }
}
