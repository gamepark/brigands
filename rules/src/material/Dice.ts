const dice:number[] = [2,2,3,3,4,4]

export default dice

export function rollDice(numberOfRolls:number):number[]{
    const result:number[] = []
    for (let i=0;i<numberOfRolls;i++){
        result.push(dice[Math.floor(Math.random()*dice.length)])
    }
    return result
}
