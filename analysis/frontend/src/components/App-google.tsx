import {Circle, GoogleMap, LoadScript, Polygon} from "@react-google-maps/api"

import citiesOnMap from "../data/citiesOnMap.json"

const mapContainerStyle = {
    height: "800px",
    width: "1200px"
}

const lat = 35
const lng = 100
const center: google.maps.LatLngLiteral = {lat, lng}

const K = 3
const paths = [
    {lat: lat - K, lng: lng - K},
    {lat: lat - K, lng: lng + K},
    {lat: lat + K, lng: lng + K},
    {lat: lat + K, lng: lng - K},
]

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

    console.log({citiesOnMap})

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY as string}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={5}
                center={center}
                onLoad={map => {
                    console.log({map})
                }}
                options={{
                    streetViewControl: false
                }}


            >

                {
                    Object.values(citiesOnMap).map(address => (
                        <Circle
                            center={address.pos}
                            radius={1e4 * (Math.log(address.count) + 1) * 2}
                            options={options}
                        />
                    ))
                }

            </GoogleMap>
        </LoadScript>
    )
}


export default App
