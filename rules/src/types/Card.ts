import DistrictName from "./DistrictName";
import Token from "./Token";

type Card = {
    color:number
    district:DistrictName
    partner?:number
    token?:Token
}

export default Card