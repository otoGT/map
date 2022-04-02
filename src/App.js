import React, { useRef, useEffect, useState, useMemo} from 'react';
import mapboxgl from 'mapbox-gl';
import Map, {Popup ,ScaleControl ,FullscreenControl , GeolocateControl , Marker , NavigationControl} from 'react-map-gl';
import Pin from './components/pin';
import CITIES from './components/data.json';


mapboxgl.accessToken = 'pk.eyJ1IjoiZGF0bzIwNyIsImEiOiJjbDE3b3Fic3QwcnVqM2JzMXlzeW83cDRkIn0.f5yKQuQBcHfxs4CRwZXI-g';




function App() {

  const [showPopup, setShowPopup] = useState(true);
  const [weather, setWeather] = useState({})
  const [correctCor, setCorrectCor] = useState(false)
  const [popupInfo, setPopupInfo] = useState(null);
  const [lng, setlng] = useState(-1)
  const [lat, setlat] = useState(-1)

  const pins = useMemo(
    () =>
      CITIES.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.lng}
          latitude={city.lat}
          anchor="bottom"
        >
          <Pin onClick={() => setPopupInfo(city)} />
        </Marker>
      )),
    []
  );

 function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
     console.log("Geolocation is not supported by this browser.");
    }
  }

 function showPosition(position) {
    fetchData(position.coords.latitude, position.coords.longitude);
    setlng(position.coords.longitude)
    setlat(position.coords.latitude)
  }

  async function fetchData(latitude, longitude){
    const key = "2ab63bb70d8b7661c220ecea6ce0408b"
    const data = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`); 
    if(data.status == 200){
      const res = await data.json();
      setWeather({
       temperature : Math.floor(res.main.temp ),
       description : res.weather[0].description,
       iconId : res.weather[0].icon,
       city : res.name,
       country : res.sys.country,
       competition : res.visibility
      })
      setCorrectCor(true)
    } else{
      return []
    } 

  }

  useEffect(()=>{
    getLocation()
  },[correctCor])

  return ( 
 
     <Map
      initialViewState={{
      longitude: 42.25, 
      latitude: 42.7,
      zoom: 8
    }}
    style={{width:FullscreenControl, height:600}}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    {pins}
    {popupInfo && (
      <Popup longitude={popupInfo.lng} latitude={popupInfo.lat}
        closeOnClick={false}
        anchor="bottom"
        onClose={() => setPopupInfo(null)}>
       <p className='location-text'>{popupInfo.city}</p> 
      </Popup>)}

      <ScaleControl />
      <GeolocateControl position="top-left" />
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
  
      {correctCor &&
      <div className="container">
        <div className="app-title">
            <p>Weather</p>
        </div>
        <div className="weather-container">
          
            <div className="weather-icon">
            <img src={`icons/${weather.iconId }.png`}/>
            </div>
            <div className="temperature-value">
                <p>{weather.temperature} - °<span>C</span></p>
            </div>
            <div className="temperature-description">
                <p> {weather.description} </p>
            </div>
            <div className="location">
      
                <p>{weather.city}, {weather.country}</p>
            </div>
        </div>
    </div>}
  </Map>
  
  
    
  );
}
/*
 
  

{ correctCor &&
      }*/
export default App;
