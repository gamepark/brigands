import PlayerColor from "../PlayerColor";
import DistrictName from "./DistrictName";
import TokenAction from "./TokenAction";

type Token = {
    color:PlayerColor
    position:DistrictName
    action : TokenAction
}

export default Token