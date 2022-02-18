import './App.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet'
// import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
// import { FaMapMarker} from 'react-icons/fa'
import {  icon } from 'leaflet';

function App() {
  const [latitute_now, setLatitueNow] = useState(null)
  const [longitude_now, setLongitudeNow] = useState(null)

  var myIcon = icon({
    iconUrl: '/marker.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

//   const myIcon = new L.Icon({
//     iconUrl: FaMapMarker,
//     iconRetinaUrl: FaMapMarker,
//     popupAnchor:  [-0, -0],
//     iconSize: [32,45],     
// });

// const customMarkerIcon = divIcon({
//   // html: FaMapMarker,
//   iconUrl: "/marker.png",
//   popupAnchor:  [-0, -0],
//       iconSize: [32,30],   

// });

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


  useEffect(() => {
    if ("geolocation" in navigator) {
      console.log("Available");
    } else {
      console.log("Not Available");
    }
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitueNow(position.coords.latitude)
      setLongitudeNow(position.coords.longitude)
      console.log(position)
    },
      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      }, options);
  }, [])

  
  useEffect(() => {
    console.log(latitute_now)
    console.log(longitude_now)
    console.log(getDistanceFromLatLonInKm(-8.7915551, -63.8928622, -8.7696809, -63.9210139 ))
    vibrate()
  }, [latitute_now,longitude_now ])

  const vibrate = () => {
    if(getDistanceFromLatLonInKm(-8.7915551, -63.8928622, -8.7916085, -63.8924504 ) < 1){
      navigator.vibrate(200); // 
      console.log('vibrou')
    }  
  }
  
  
  // const location = [latitute_now, longitude_now]

  function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        console.log(e)
        setPosition(e.latlng)
        console.log(position)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  
    return position === null ? null : (
      <Marker position={position} icon={myIcon} >
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  return (
    <>
    {latitute_now  ?
      <div className="leaflet-container">
      {/* <MapContainer center={location} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={location}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer> */}
       <MapContainer center={{ lat: -8.7718723, lng: -63.8939376 }} zoom={14}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
    </div>
      :
       null
    } 
  </>
  );
}

export default App;
