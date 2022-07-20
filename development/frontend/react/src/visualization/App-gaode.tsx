import {Map} from "react-amap";

export default () => (
    <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>

        <div style={{width: 1400, height: 1000}}>
            <Map zoom={5} center={{longitude: 105, latitude: 38}} scrollWheel={true}/>
        </div>
    </div>
)