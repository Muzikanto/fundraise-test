import md5 from 'md5'
import { CONFIG } from '../config'

export function anonymiseValue(value: string): string {
    return md5(value + CONFIG.ANONYMISE_SALT).slice(0, 8)
}
