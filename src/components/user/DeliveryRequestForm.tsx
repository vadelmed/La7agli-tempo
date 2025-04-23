import React, { useState, useEffect } from "react";
import { createDeliveryRequest } from "@/services/deliveryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MapPin, Bike } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeliveryRequestFormProps {
  userId: string;
}

const DeliveryRequestForm: React.FC<DeliveryRequestFormProps> = ({
  userId,
}) => {
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickupLocation, setPickupLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          // Set pickup location to current location by default
          setPickupLocation(location);
          // Try to get address for current location
          reverseGeocode(location.lat, location.lng, "pickup");
        },
        (err) => {
          console.error("Error getting location:", err);
          setError(
            "Unable to get your location. Please enable location services.",
          );
        },
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }

    // Load Google Maps API
    const loadGoogleMapsAPI = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBxXQ4KffIsymQ1EmhgirbzUEjb37uu5x8&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  const reverseGeocode = async (
    lat: number,
    lng: number,
    type: "pickup" | "delivery",
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBxXQ4KffIsymQ1EmhgirbzUEjb37uu5x8`,
      );
      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        if (type === "pickup") {
          setPickupAddress(address);
        } else {
          setDeliveryAddress(address);
        }
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const geocodeAddress = async (
    address: string,
    type: "pickup" | "delivery",
  ) => {
    if (!mapLoaded) return;

    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };

          if (type === "pickup") {
            setPickupLocation(location);
          } else {
            setDeliveryLocation(location);
          }
        } else {
          setError(`Could not find location for ${type} address`);
        }
      });
    } catch (error) {
      console.error("Error geocoding address:", error);
      setError(`Error finding location for ${type} address`);
    }
  };

  const handlePickupAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPickupAddress(e.target.value);
  };

  const handleDeliveryAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDeliveryAddress(e.target.value);
  };

  const handlePickupBlur = () => {
    if (pickupAddress) {
      geocodeAddress(pickupAddress, "pickup");
    }
  };

  const handleDeliveryBlur = () => {
    if (deliveryAddress) {
      geocodeAddress(deliveryAddress, "delivery");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!userId) {
      setError("You must be logged in to request a delivery");
      setLoading(false);
      return;
    }

    if (!pickupAddress || !deliveryAddress) {
      setError("Please provide both pickup and delivery addresses");
      setLoading(false);
      return;
    }

    if (!pickupLocation || !deliveryLocation) {
      setError(
        "Unable to determine location coordinates. Please check your addresses.",
      );
      setLoading(false);
      return;
    }

    try {
      const result = await createDeliveryRequest(
        userId,
        pickupLocation.lat,
        pickupLocation.lng,
        pickupAddress,
        deliveryLocation.lat,
        deliveryLocation.lng,
        deliveryAddress,
      );

      if (result) {
        setSuccess(
          "Delivery request submitted successfully! Nearby drivers will be notified.",
        );
        // Reset form
        setDeliveryAddress("");
        setDeliveryLocation(null);
        // Keep pickup address as current location
      } else {
        throw new Error("Failed to create delivery request");
      }
    } catch (error: any) {
      setError(error.message || "Failed to create delivery request");
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (currentLocation) {
      setPickupLocation(currentLocation);
      reverseGeocode(currentLocation.lat, currentLocation.lng, "pickup");
    } else {
      setError("Current location is not available");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bike className="h-5 w-5 mr-2" />
          Request a Delivery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={useCurrentLocation}
                className="text-xs"
              >
                Use Current Location
              </Button>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-500" />
              <Input
                id="pickupAddress"
                placeholder="Enter pickup address"
                value={pickupAddress}
                onChange={handlePickupAddressChange}
                onBlur={handlePickupBlur}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery Address</Label>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-500" />
              <Input
                id="deliveryAddress"
                placeholder="Enter delivery address"
                value={deliveryAddress}
                onChange={handleDeliveryAddressChange}
                onBlur={handleDeliveryBlur}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Request Delivery"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeliveryRequestForm;
