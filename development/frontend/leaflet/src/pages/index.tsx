import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

type DataInfo = {
    province: string
    city: string
    pos: {
        lng: number
        lat: number
    }
    count: number
}

const App = () => {
    const [data, setData] = useState<DataInfo[]>([])
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/robothot/SummaryOfLoanSuspension/main/data/generated/cities-for-visualization.json')
            .then((resp) => resp.json())
            .then((jsonData) => {
                console.log(jsonData)
                setData(jsonData)
            })
    }, [])

    const renderMarkers = () => {
        return data.map(ele => (
            <Marker position={[ele.pos.lat, ele.pos.lng]} key={`${ele.pos.lat}-${ele.pos.lng}`}/>
        ))
    }

    return (
        <MapContainer
            center={[30.592849, 114.305539]}
            zoom={5}
            scrollWheelZoom
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {renderMarkers()}
        </MapContainer>
    )

}

export default App