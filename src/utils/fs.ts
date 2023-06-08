import fs from 'fs'

export function loadJson<T extends object>(pathname: string): T | undefined {
    if (!fs.existsSync(pathname)) {
        return undefined
    }

    return JSON.parse(fs.readFileSync(pathname, { encoding: 'utf-8' }))
}
export function saveJson<T extends object>(pathname: string, value: T): T {
    fs.writeFileSync(pathname, JSON.stringify(value), {
        encoding: 'utf-8',
    })

    return value
}
