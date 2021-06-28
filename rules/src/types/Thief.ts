import {ThiefState} from '../PlayerState'
import Partner, {PartnerView} from './Partner'
import Token from './Token'

type Thief = {
  gold: number
  partners: Partner[]
  tokens: Token
}

export type ThiefView = Omit<ThiefState, 'gold' | 'partners'> & {
  partners: (PartnerView | Partner)[]
}

export default Thief