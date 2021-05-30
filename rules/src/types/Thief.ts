import { ThiefState } from "../PlayerState"
import Partner, { PartnerView } from "./Partner"
import Token from "./Token"

type Thief = {
    gold:number
    partner:Partner[]
    tokens:Token
}

export type ThiefView = Omit<ThiefState, 'gold'|'partner'> & {
    partner:(PartnerView | Partner)[]
}

export function isNotThiefView(thief:ThiefState | ThiefView):thief is ThiefState{
    return typeof (thief as ThiefState).gold === 'number'
}

export default Thief