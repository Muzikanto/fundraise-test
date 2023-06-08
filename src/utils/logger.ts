import { Logger, format, createLogger, transports } from 'winston'
import { TransformableInfo } from 'logform'

const { combine, timestamp, label, printf } = format

const myFormat = printf(
    ({
        level,
        message,
        label,
        timestamp,
    }: TransformableInfo & { label?: string; timestamp?: string }) => {
        return `${timestamp} [${label}] ${level}: ${message}`
    }
)

export function getLogger(context: string): Logger {
    const logger = createLogger({
        level: 'debug',
        format: combine(label({ label: context }), timestamp(), myFormat),
        transports: [new transports.Console()],
    })

    return logger
}
