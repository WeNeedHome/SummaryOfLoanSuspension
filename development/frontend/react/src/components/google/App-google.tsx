import {Circle, GoogleMap, LoadScript, OverlayView} from "@react-google-maps/api"


// ref: https://mapstyle.withgoogle.com/
import theme from "./theme-dark-simple-2.json"

// ref: https://stackoverflow.com/a/22581969/9422455
import './google-map.css'

import {AddressWithCount} from "../../ds";
import citiesForVisualization_ from "../../data/cities-for-visualization.json"

const citiesForVisualization: AddressWithCount[] = citiesForVisualization_

const mapContainerStyle = {
    height: "800px",
    width: "1200px"
}

const center: google.maps.LatLngLiteral = {lat: 35, lng: 100}


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


export const App = () => {
    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY as string}>
            <GoogleMap
                onLoad={(mapInstance) => {
                    const mapTypeId = "theme"
                    // ref: http://jsfiddle.net/upsidown/Lt2Ey/
                    mapInstance.mapTypes.set(mapTypeId, new window.google.maps.StyledMapType(theme))
                    mapInstance.setMapTypeId(mapTypeId)
                }}
                mapContainerStyle={mapContainerStyle}
                zoom={5}
                center={center}
                options={{disableDefaultUI: true}}

            >

                {
                    citiesForVisualization.map((address: AddressWithCount) => {
                        const id = [address.province, address.city, address.district].join("-")
                        return (
                            <Circle
                                key={id}
                                center={address.pos}
                                radius={1e4 * (Math.log(address.count) + 1) * 2}
                                options={options}
                            />
                        )
                    })
                }

                <OverlayView position={{lat: 36, lng: 83}} mapPaneName={'floatPane'}>
                    <div style={{
                        width: "350px", padding: 12,
                        backgroundColor: 'red', color: "white", opacity: 0.75,
                        textAlign: "center"
                    }}>
                        <div style={{fontSize: 30, color: "yellow", fontWeight: 800, fontStyle: "italic"}}>We Need Home
                            !
                        </div>
                        <div style={{
                            fontWeight: 600,
                            marginTop: "5px"
                        }}>SummaryOfLoanSuspension, {new Date().toLocaleDateString()}</div>
                    </div>
                </OverlayView>

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
