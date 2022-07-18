import {assertEqual} from "../../../utils/general";
import {encodeNum} from "../algos/encodePolyline";

assertEqual(encodeNum(-179.9832104), '`~oia@')
assertEqual(encodeNum(38.5), '_p~iF',)
assertEqual(encodeNum(-120.2), '~ps|U',)
assertEqual(encodeNum(40.7), '_ulL')
assertEqual(encodeNum(-120.95), 'nnqC')
assertEqual(encodeNum(43.252), '_mqN')
assertEqual(encodeNum(-126.453), 'vxq`@')