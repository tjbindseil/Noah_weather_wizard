import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
// const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';
// const geoUrl = 'https://github.com/BolajiBI/topojson-maps/raw/refs/heads/master/world-countries.json';
// const geoUrl = '/map.json';

//
// so, having issues here
// it seems like any map with enough detail to be useful would be too big and need tiling
//
// on the otherhand, we could just show the points and move on
//

// const geoUrl = 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer';

export default function MapChart() {
  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
        }
      </Geographies>
    </ComposableMap>
  );
}
