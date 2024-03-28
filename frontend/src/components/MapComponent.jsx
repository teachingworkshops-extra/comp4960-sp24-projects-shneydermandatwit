import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ROOT } from '../config';


const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [data, setData] = useState([]);
  const [highlightedMarker, setHighlightedMarker] = useState(null);
  const [showMapKey, setShowMapKey] = useState(false); // State to toggle map key visibility
  const [infoWindows, setInfoWindows] = useState({}); // Store the info windows by marker title
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRefs = useRef({});
  

  useEffect(() => {
    const initMap = () => {
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(42.33436995317759, -71.09884163233488),
        new google.maps.LatLng(42.33854320333202, -71.09085283322084)
      );

      const newMap = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 42.33612470204511, lng: -71.09531573419756 },
        zoom: 18,
        mapId: 'f46081d6aab889bc',
        mapTypeId: 'satellite',
        mapTypeControl: false,
        fullscreenControl: false,
        tilt: 20,
        restriction: {
          latLngBounds: bounds,
          strictBounds: true
        }
        
      });
      setMap(newMap);
    };

    const fetchMarkers = async () => {
      try {
        const response = await axios.get(`${ROOT}/marker/`);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (window.google) {
      initMap();
      fetchMarkers();
    } else {
      console.error('Error loading Google Maps API.');
    }
  }, []);

  useEffect(() => {
    if (map && data.length > 0) {
      const newInfoWindows = {};
      data.forEach((marker, index) => {
        const popupContent = `<div id=popup><h1>${marker.building}</h1></div>`;
        const mapMarker = new google.maps.Marker({
          position: { lat: parseFloat(marker.lat), lng: parseFloat(marker.lon) },
          map: map,
          title: marker.building,
        });

        mapMarker.addListener('click', () => {
          navigate('/review', { state: { buildingParam: marker.building } });
        });

        mapMarker.addListener('mouseover', () => {
          setHighlightedMarker(marker);
          showInfoWindow(mapMarker);
        });

        mapMarker.addListener('mouseout', () => {
          setHighlightedMarker(null);
          hideInfoWindow(mapMarker);
        });

        markerRefs.current[marker.building] = mapMarker;
        newInfoWindows[marker.building] = new google.maps.InfoWindow({
          content: popupContent,
        });
      });
      setInfoWindows(newInfoWindows);
    }
  }, [map, data, navigate]);

  const showInfoWindow = (marker) => {
    const title = marker.getTitle();
    if (infoWindows[title]) {
      Object.values(infoWindows).forEach(infoWindow => infoWindow.close());
      infoWindows[title].open(map, marker);
    }
  };

  const hideInfoWindow = (marker) => {
    const title = marker.getTitle();
    if (infoWindows[title]) {
      infoWindows[title].close();
    }
  };

  const toggleMapKey = () => {
    setShowMapKey(!showMapKey);
  };

  const MapKey = () => {
    const mapElement = mapRef.current;
    if (!mapElement || !showMapKey) return null;

    // Extracting pin names from data
    const pinNames = data.map(marker => marker.building);

    const handlePinHover = (marker) => {
      if (marker) {
        setHighlightedMarker(marker);
        showInfoWindow(markerRefs.current[marker.building]);
      } else {
        setHighlightedMarker(null);
        Object.values(infoWindows).forEach(infoWindow => infoWindow.close());
      }
    };

    return (
      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', padding: '20px', border: '2px solid #ccc', borderRadius: '10px', zIndex: '1000' }}>
        <button onClick={toggleMapKey} style={{ color: 'white', backgroundColor: 'black' }}>Close Map Key</button>
        <h3 style={{ marginBottom: '10px' }}>Map Key</h3>
        {/* Displaying pin names */}
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {pinNames.map((name, index) => (
            <li 
              key={index} 
              onMouseEnter={() => handlePinHover(data[index])} 
              onMouseLeave={() => handlePinHover(null)} 
              onClick={() => {
                const correspondingMarker = data.find(item => item.building === name);
                if (correspondingMarker) {
                  navigate('/review', { state: { buildingParam: correspondingMarker.building } });
                }
              }} 
              style={{ cursor: 'pointer', fontWeight: highlightedMarker === data[index] ? 'bold' : 'normal', marginBottom: '5px', height: '30px' }}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '87vh' }}>
      <button onClick={toggleMapKey} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: '1000', color: 'white', backgroundColor: 'black' }}>{showMapKey ? 'Hide Map Key' : 'Show Map Key'}</button>
      <MapKey />
      <div id="map" ref={mapRef} style={{ width: '100%', height: '100%', margin: 'auto'}}></div>
    </div>
  );
};

export default MapComponent;