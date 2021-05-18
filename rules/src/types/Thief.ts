import Card from "./Card"
import Partner from "./Partner"
import Token from "./Token"

type Thief = {
    gold:number
    partner:Partner[]
    deck:Card[]
    played:Card[]
    tokens:Token[]
}

export default Thief