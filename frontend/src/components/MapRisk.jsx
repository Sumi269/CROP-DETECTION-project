import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapRisk({ data, lat, lon }) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={8}
      style={{ height: "400px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {data.map((d, i) => {
        let color = "green";

        if (d.risk === "HIGH") color = "red";
        else if (d.risk === "MEDIUM") color = "orange";

        return (
          <Circle
            key={i}
            center={[lat, lon]}
            radius={20000 + i * 10000}
            pathOptions={{ color }}
          >
            <Popup>
              {d.day} <br />
              Risk: {d.risk}
            </Popup>
          </Circle>
        );
      })}
    </MapContainer>
  );
}