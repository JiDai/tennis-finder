import { useEffect, useRef, useState } from 'react';
import mapboxgl, { MapboxOptions } from 'mapbox-gl';

import styles from './TennisMap.module.css';

const TennisMap = () => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [mapInitilized, setMapInitilized] = useState(false);

    useEffect(() => {
        if (mapRef.current) {
            return; // initialize map only once
        }

        const configuration: MapboxOptions = {
            container: containerRef.current,
            // style: 'mapbox://styles/jidai/ckthnag405dsa17pp46xu144c',
            style: 'mapbox://styles/jidai/ckthonb0025sy18nye95b1x8x',
            center: { lng: 2.364532893300833, lat: 48.87160778669573 },
            zoom: 11,
        };

        mapRef.current = new mapboxgl.Map(configuration);
        const map = mapRef.current;
        map.showTileBoundaries = true;
        ///

        map.on('load', function () {
            console.log('load');
            setMapInitilized(true);
        });

        let mousemouveTimeout = 0;
        map.on('zoomend', (e) => {
            const zoom = Math.floor(map.getZoom());
            console.log('zoom: ', zoom);
            console.log('zoom: ', map.getCenter());
        });
    });

    useEffect(
        function () {
            if (!mapInitilized) {
                return; // initialize map only once
            }

            const map = mapRef.current!;

            fetch('/data/traces-du-reseau-ferre-idf.geojson').then(function (responses) {
                responses.json().then(function (json) {
                    const source = map.getSource('metro-source');
                    if (!source) {
                        map.addSource('metro-source', {
                            type: 'geojson',
                            data: json,
                        });
                    } else {
                        source.setData(json);
                    }

                    const layer = map.getLayer('metro');
                    if (layer) {
                        map.removeLayer('metro');
                    }
                    map.addLayer(
                        {
                            id: 'metro',
                            type: 'line',
                            source: 'metro-source',
                            layout: {},
                            filter: ['==', ['get', 'metro'], 1],
                            paint: {
                                'line-color': ['concat', '#', ['get', 'colourweb_hexa']],
                                'line-width': 1,
                            },
                        },
                        'transit-line-placeholder',
                    );
                });
            });

            fetch('/data/courts.geojson').then(function (responses) {
                responses.json().then(function (json) {
                    const newFeatures = json.features.map(function (feature) {
                        return {
                            ...feature,
                            properties: Object.entries(feature.properties).reduce(function (
                                currentValue,
                                previousValue,
                            ) {
                                const [key, value] = previousValue;
                                let parsed;
                                try {
                                    parsed = JSON.parse(value);
                                } catch (e) {
                                    parsed = value;
                                }
                                currentValue[key] = parsed;
                                return currentValue;
                            },
                            {}),
                        };
                    });

                    const source = map.getSource('courts-source');
                    if (!source) {
                        map.addSource('courts-source', {
                            type: 'geojson',
                            data: {
                                ...json,
                                features: newFeatures,
                            },
                        });
                    } else {
                        source.setData({
                            ...json,
                            features: newFeatures,
                        });
                    }

                    const layer = map.getLayer('courts');
                    if (layer) {
                        console.log('remove');
                        map.removeLayer('courts');
                    }
                    map.addLayer({
                        id: 'courts',
                        type: 'symbol',
                        source: 'courts-source',
                        layout: {
                            'icon-image': 'tennis-ball', // reference the image
                            'icon-size': 1,
                            'text-field': [
                                'concat',
                                ['get', '_nomSrtm', ['get', 'general']],
                                ' (',
                                ['length', ['get', 'courts']],
                                ')',
                            ],
                            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                            'text-radial-offset': 1.5,
                            'text-justify': 'auto',
                        },
                        paint: {
                            'text-color': '#000000',
                        },
                    });
                });
            });
        },
        [mapInitilized],
    );

    return <div ref={containerRef} className={styles.TennisMap} />;
};

export default TennisMap;
