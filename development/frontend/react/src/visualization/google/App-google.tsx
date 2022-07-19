import {GoogleMap, LoadScript, OverlayView} from "@react-google-maps/api"

import {GOOGLE_MAP_API_KEY} from "../const";
import {AddressWithCount} from "../ds";
import {MyCircle} from "./MyCircle";

import theme from "../../data/google-theme.json" // custom style, ref: https://mapstyle.withgoogle.com/
import citiesForVisualization from "../../data/cities-for-visualization.json" // a symbol link to city data

import './google-map.css' // disable google footnote, ref: https://stackoverflow.com/a/22581969/9422455


export const App = () => {
    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY || GOOGLE_MAP_API_KEY as string}>
            <GoogleMap
                onLoad={(mapInstance) => {
                    // set custom theme (via mapTypeId): http://jsfiddle.net/upsidown/Lt2Ey/
                    const mapTypeId = "theme"
                    mapInstance.mapTypes.set(mapTypeId, new window.google.maps.StyledMapType(theme))
                    mapInstance.setMapTypeId(mapTypeId)
                }}
                mapContainerStyle={{width: "1200px", height: "800px"}}
                zoom={5}
                center={{lat: 35, lng: 110}}
                options={{disableDefaultUI: true}}

            >

                {/* markers */}
                {
                    citiesForVisualization.map((address: AddressWithCount) => {
                        const id = [address.province, address.city, address.district].join("-")
                        return <MyCircle key={id} pos={address.pos} radius={1e4 * (Math.log(address.count) + 1) * 2}/>
                    })
                }

                {/* title */}
                <OverlayView position={{lat: 36, lng: 83}} mapPaneName={'floatPane'}>
                    <div style={{
                        width: "350px", padding: 12,
                        backgroundColor: 'red', color: "white", opacity: 0.75,
                        textAlign: "center"
                    }}>
                        <div style={{fontSize: 30, color: "yellow", fontWeight: 800, fontStyle: "italic"}}>
                            We Need Home !
                        </div>

                        <div style={{fontWeight: 600, marginTop: "5px"}}>
                            SummaryOfLoanSuspension, {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </OverlayView>

                {/* footnote */}
                <OverlayView position={{lat: 20.5, lng: 112}} mapPaneName={'floatPane'}>
                    <div style={{color: "gray", textDecoration: "underline", fontStyle: "italic"}}>
                        https://github.com/WeNeedHome/SummaryOfLoanSuspension
                    </div>
                </OverlayView>

            </GoogleMap>
        </LoadScript>
    )
}


export default App
