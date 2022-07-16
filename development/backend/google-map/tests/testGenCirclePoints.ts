import {assertEqual} from "../../utils/general";
import {polylineEncodeFromNum} from "../encodePolyline";

assertEqual(polylineEncodeFromNum(-179.9832104), '`~oia@')
assertEqual(polylineEncodeFromNum(38.5), '_p~iF',)
assertEqual(polylineEncodeFromNum(-120.2), '~ps|U',)
assertEqual(polylineEncodeFromNum(40.7), '_ulL')
assertEqual(polylineEncodeFromNum(-120.95), 'nnqC')
assertEqual(polylineEncodeFromNum(43.252), '_mqN')
assertEqual(polylineEncodeFromNum(-126.453), 'vxq`@')