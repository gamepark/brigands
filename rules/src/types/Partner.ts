import DistrictName from '../districts/DistrictName'
import {isThiefState, ThiefState} from '../PlayerState'
import PlayerRole from './PlayerRole'
import {ThiefView} from './Thief'

type Partner = {
  district?: DistrictName
  kickOrNot?: false | PlayerRole
  solvingDone?: boolean
  goldForTavern?: number
  tokensTaken?: number
}

export type PartnerView = {
  card: number
  solvingDone?: boolean
  goldForTavern?: number
  tokensTaken?: number
}

export function isPartner(partner: Partner | PartnerView): partner is Partner {
  return (partner as PartnerView).card === undefined
}

export function isPartnerView(partner: Partner | PartnerView): partner is PartnerView {
  return (partner as PartnerView).card !== undefined
}

export function getPartners(thief: ThiefState | ThiefView) {
  return isThiefState(thief) ? thief.partners : thief.partners
}

export function getPartnersView(partners: Partner[]): (PartnerView | Partner)[] {
  const cards: DistrictName[] = []
  const partnersView: (PartnerView | Partner)[] = []
  for (const partner of partners) {
    if (partner.district === undefined || partner.district === DistrictName.Jail) {
      partnersView.push(partner)          // Objet Vide
    } else {
      const cardIndex = cards.indexOf(partner.district)
      if (cardIndex === -1) {                                  // Dépendance Temporelle !
        partnersView.push({card: cards.length})
        cards.push(partner.district)
      } else {
        partnersView.push({card: cardIndex})
      }
    }
  }
  return partnersView
}

export default Partner

