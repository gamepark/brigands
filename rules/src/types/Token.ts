import PlayerColor from "../PlayerColor";
import DistrictName from "./DistrictName";
import TokenAction from "./TokenAction";

type Token = {
    action : TokenAction
    isOwned : boolean
}

export default Token