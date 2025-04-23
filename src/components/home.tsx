import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bike, Package, MapPin, TrendingUp, Navigation } from "lucide-react";
import DeliveryRequestForm from "@/components/user/DeliveryRequestForm";
import Map from "@/components/map/Map";

function Home() {
  const { user, userRole } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [mapMarkers, setMapMarkers] = useState<
    Array<{
      position: { lat: number; lng: number };
      title?: string;
      icon?: string;
    }>
  >([]);

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
          setMapMarkers([{ position: location, title: "Your Location" }]);
        },
        (err) => {
          console.error("Error getting location:", err);
        },
      );
    }
  }, []);

  // Show map automatically if user is logged in
  useEffect(() => {
    if (user && userRole) {
      setShowMap(true);
    }
  }, [user, userRole]);

  const handleRequestDelivery = () => {
    setShowMap(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Hero Section - Show only if map is not displayed */}
      {!showMap && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-8 mb-8 text-white shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            La7agli Delivery
          </h1>
          <p className="text-xl mb-6">
            Fast and reliable motorcycle & tuktuk delivery services
          </p>
          <div className="flex flex-wrap gap-4">
            {userRole === "user" && (
              <Button
                className="bg-white text-purple-700 hover:bg-purple-50"
                size="lg"
                onClick={handleRequestDelivery}
              >
                <Package className="mr-2 h-5 w-5" /> Request Delivery
              </Button>
            )}
            {userRole === "driver" && (
              <Button
                className="bg-white text-purple-700 hover:bg-purple-50"
                size="lg"
                onClick={() => (window.location.href = "/driver/dashboard")}
              >
                <Bike className="mr-2 h-5 w-5" /> Driver Dashboard
              </Button>
            )}
            {!userRole && (
              <Button
                className="bg-white text-purple-700 hover:bg-purple-50"
                size="lg"
                onClick={() => (window.location.href = "/login")}
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Map View - Show when user is logged in and map is toggled */}
      {showMap && user && userRole && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-purple-700 flex items-center">
              <Navigation className="mr-2 h-6 w-6" /> La7agli Map
            </h2>
            {userRole === "user" && (
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setShowMap(false)}
              >
                Back to Home
              </Button>
            )}
          </div>
          <Map
            center={currentLocation || undefined}
            markers={mapMarkers}
            className="h-[60vh] w-full rounded-xl shadow-xl"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          {userRole === "user" && user && !showMap && (
            <DeliveryRequestForm userId={user.id} />
          )}

          {userRole === "user" && user && showMap && (
            <Card className="border-2 border-purple-100 shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2 text-purple-700">
                  Request a Delivery
                </h3>
                <p className="text-gray-600 mb-4">
                  Use the map to select your pickup and delivery locations or
                  fill out the form below.
                </p>
                <DeliveryRequestForm userId={user.id} />
              </CardContent>
            </Card>
          )}

          {!userRole && (
            <Card className="mb-6 border-2 border-purple-100 shadow-md">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-700">
                  Welcome to La7agli
                </h2>
                <p className="mb-4">
                  Please log in to request deliveries or manage your driver
                  account.
                </p>
                <Button
                  onClick={() => (window.location.href = "/login")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Log In
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Features */}
        {!showMap && (
          <div className="space-y-6">
            <Card className="border-2 border-purple-100 shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Bike className="h-6 w-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Fast Delivery</h3>
                    <p className="text-gray-600">
                      Our drivers will pick up and deliver your items quickly
                      and safely.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">
                      Real-time Tracking
                    </h3>
                    <p className="text-gray-600">
                      Track your delivery in real-time from pickup to
                      destination.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <TrendingUp className="h-6 w-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Point System</h3>
                    <p className="text-gray-600">
                      Our drivers use a point system to ensure fair and
                      efficient service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
