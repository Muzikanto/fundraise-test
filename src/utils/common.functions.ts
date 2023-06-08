export function setWaitingInterval(
    func: () => Promise<any>,
    intervalMs: number
): () => void {
    let timeoutId: NodeJS.Timeout

    const runner = () => {
        func().then(() => {
            timeoutId = setTimeout(() => {
                runner()
            }, intervalMs)
        })
    }

    runner()

    return (): void => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
    }
}
