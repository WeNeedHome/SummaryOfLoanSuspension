import {Pos} from "../ds";
import {Circle} from "@react-google-maps/api";

export interface MyCircleProps {
    pos: Pos
    radius: number
}

export const MyCircle = (props: MyCircleProps) => {
    const options = {
        fillColor: "red",
        fillOpacity: 0.5,
        strokeColor: "red",
        strokeOpacity: 0,
        strokeWeight: 1,
        clickable: false,
        draggable: false,
        editable: false,
        geodesic: false,
        zIndex: 1
    }
    return (
        <Circle
            center={props.pos}
            radius={props.radius}
            options={options}
        />
    )
}