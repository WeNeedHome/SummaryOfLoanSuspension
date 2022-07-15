import React, {useEffect, useState} from 'react';
import {render} from 'react-dom';
import StaticMap from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';

// Source region CSV
const DATA_URL =
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'; // eslint-disable-line

const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0
});

const pointLight1 = new PointLight({
    color: [255, 255, 255],
    intensity: 0.8,
    position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
    color: [255, 255, 255],
    intensity: 0.8,
    position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = {
    ambient: 0.64,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [51, 51, 51]
};

const INITIAL_VIEW_STATE = {
    longitude: -1.415727,
    latitude: 52.232395,
    zoom: 6.6,
    minZoom: 5,
    maxZoom: 15,
    pitch: 40.5,
    bearing: -27
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

export const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
];

function getTooltip({object}) {
    if (!object) {
        return null;
    }
    const lat = object.position[1];
    const lng = object.position[0];
    const count = object.points.length;

    return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
    ${count} Accidents`;
}

/* eslint-disable react/no-deprecated */
export function AppDeckGL({
                        data,
                        mapStyle = MAP_STYLE,
                        radius = 1000,
                        upperPercentile = 100,
                        coverage = 1
                    }) {
    const layers = [
        new HexagonLayer({
            id: 'heatmap',
            colorRange,
            coverage,
            data,
            elevationRange: [0, 3000],
            elevationScale: data && data.length ? 50 : 0,
            extruded: true,
            getPosition: d => d,
            pickable: true,
            radius,
            upperPercentile,
            material,

            transitions: {
                elevationScale: 3000
            }
        })
    ];

    return (
        <DeckGL
            layers={layers}
            effects={[lightingEffect]}
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            getTooltip={getTooltip}
        >
            <StaticMap reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} height={600} width={800}/>
        </DeckGL>
    );
}

export default () => {

    const [data, setData] = useState([])
    useEffect(() => {
        require('d3-request').csv(DATA_URL, (error, response) => {
            if (!error) {
                const data = response.map(d => [Number(d.lng), Number(d.lat)]);
                setData(data)
            }
        });
    }, [])

    return <AppDeckGL data={data}/>

}
