export const getRandomFloat = (max: number, min = 0): number => {
    return Math.random() * (max - min) + min
}
export const getRandomInt = (max: number, min = 0): number => {
    return Math.floor(getRandomFloat(max, min))
}
