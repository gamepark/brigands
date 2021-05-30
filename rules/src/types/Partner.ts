import PlayerColor from "../PlayerColor"
import DistrictName from "./DistrictName"
import Token from "./Token"
import TokenAction from "./TokenAction"

type Partner = {
    district?: DistrictName  
}

export type PartnerView = {
    card:number
}

export function isPartnerView(partner:Partner | PartnerView):partner is PartnerView{
    return typeof (partner as PartnerView).card === 'number'
}

export function getPartnersView(partners:Partner[]):(PartnerView | Partner)[] {
    const cards : DistrictName[] = []
    const partnersView : (PartnerView | Partner)[] = []
    for (const partner of partners){
        if (partner.district === undefined || partner.district === DistrictName.Jail){
            partnersView.push(partner)          // Objet Vide
        } else {
            const cardIndex = cards.indexOf(partner.district)
            if (cardIndex === -1){                                  // Dépendance Temporelle !
                partnersView.push({card:cards.length})
                cards.push(partner.district)
            } else {
                partnersView.push({card:cardIndex})
            }
        }
    }
    return partnersView
}

export default Partner

