import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    icon?: string;
  }>;
  onMapClick?: (location: { lat: number; lng: number }) => void;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  center = { lat: 30.0444, lng: 31.2357 }, // Cairo, Egypt as default
  zoom = 13,
  markers = [],
  onMapClick,
  className = "",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBxXQ4KffIsymQ1EmhgirbzUEjb37uu5x8&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    // Check if Google Maps API is already loaded
    if (!window.google || !window.google.maps) {
      loadGoogleMapsAPI();
    } else {
      initializeMap();
    }

    return () => {
      // Clean up markers when component unmounts
      mapMarkers.forEach((marker) => marker.setMap(null));
    };
  }, []);

  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    setMapInstance(map);

    // Add click event listener
    if (onMapClick) {
      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          onMapClick(clickedLocation);
        }
      });
    }
  };

  // Update markers when props change
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing markers
    mapMarkers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: mapInstance,
        title: markerData.title,
        icon: markerData.icon,
      });
      newMarkers.push(marker);
    });

    setMapMarkers(newMarkers);
  }, [mapInstance, markers]);

  // Update center and zoom when props change
  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.setCenter(center);
    mapInstance.setZoom(zoom);
  }, [mapInstance, center, zoom]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%", minHeight: "400px" }}
      />
    </Card>
  );
};

export default Map;
