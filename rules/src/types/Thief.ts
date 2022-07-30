import {ThiefState} from '../PlayerState'
import Partner, {PartnerView} from './Partner'

type Thief = {
  gold: number
  partners: Partner[]
}

export type ThiefView = Omit<ThiefState, 'partners'> & {
  partners: (PartnerView | Partner)[]
}

export default Thief