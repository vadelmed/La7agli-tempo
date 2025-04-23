import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DeliveryRequest } from "@/models/Driver";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  Navigation,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";

interface DriverDeliveriesProps {
  driverId: string;
}

const DriverDeliveries: React.FC<DriverDeliveriesProps> = ({ driverId }) => {
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryRequest[]>(
    [],
  );
  const [pastDeliveries, setPastDeliveries] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchDeliveries();

    // Set up real-time subscription for delivery updates
    const deliverySubscription = supabase
      .channel("delivery-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "delivery_requests",
          filter: `driver_id=eq.${driverId}`,
        },
        () => {
          fetchDeliveries();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(deliverySubscription);
    };
  }, [driverId]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);

      // Fetch active deliveries (pending, accepted, picked_up)
      const { data: activeData, error: activeError } = await supabase
        .from("delivery_requests")
        .select("*")
        .eq("driver_id", driverId)
        .in("status", ["accepted", "picked_up"])
        .order("created_at", { ascending: false });

      if (activeError) throw activeError;
      setActiveDeliveries(activeData as DeliveryRequest[]);

      // Fetch past deliveries (delivered, cancelled)
      const { data: pastData, error: pastError } = await supabase
        .from("delivery_requests")
        .select("*")
        .eq("driver_id", driverId)
        .in("status", ["delivered", "cancelled"])
        .order("created_at", { ascending: false })
        .limit(10);

      if (pastError) throw pastError;
      setPastDeliveries(pastData as DeliveryRequest[]);
    } catch (err: any) {
      setError(err.message || "Failed to load deliveries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("delivery_requests")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", deliveryId);

      if (error) throw error;
      fetchDeliveries();
    } catch (err: any) {
      setError(err.message || "Failed to update delivery status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "accepted":
        return <Badge variant="secondary">Accepted</Badge>;
      case "picked_up":
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      case "delivered":
        return <Badge className="bg-green-500 text-white">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActionButtons = (delivery: DeliveryRequest) => {
    switch (delivery.status) {
      case "accepted":
        return (
          <Button
            size="sm"
            className="w-full mt-2"
            onClick={() => handleStatusUpdate(delivery.id, "picked_up")}
          >
            <Package className="h-4 w-4 mr-2" />
            Mark as Picked Up
          </Button>
        );
      case "picked_up":
        return (
          <Button
            size="sm"
            className="w-full mt-2 bg-green-500 hover:bg-green-600"
            onClick={() => handleStatusUpdate(delivery.id, "delivered")}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Delivery
          </Button>
        );
      default:
        return null;
    }
  };

  const getNavigationLink = (lat: number, lng: number) => {
    // Create a Google Maps navigation link
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  if (loading) {
    return <div className="p-4 text-center">Loading deliveries...</div>;
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          <TabsTrigger value="past">Past Deliveries</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {activeDeliveries.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No active deliveries at the moment.
            </div>
          ) : (
            <div className="space-y-4">
              {activeDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          Delivery #{delivery.id.substring(0, 8)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDistanceToNow(new Date(delivery.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {getStatusBadge(delivery.status)}
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Pickup Location</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.pickup_address}
                          </p>
                          <a
                            href={getNavigationLink(
                              delivery.pickup_latitude,
                              delivery.pickup_longitude,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 flex items-center mt-1"
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Navigate
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Delivery Location
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.delivery_address}
                          </p>
                          <a
                            href={getNavigationLink(
                              delivery.delivery_latitude,
                              delivery.delivery_longitude,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 flex items-center mt-1"
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Navigate
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Distance:</span>{" "}
                          {delivery.distance_km.toFixed(1)} km
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Points:</span>{" "}
                          {delivery.points_cost}
                        </p>
                      </div>
                      {getActionButtons(delivery)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {pastDeliveries.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No past deliveries found.
            </div>
          ) : (
            <div className="space-y-4">
              {pastDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          Delivery #{delivery.id.substring(0, 8)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDistanceToNow(new Date(delivery.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {getStatusBadge(delivery.status)}
                    </div>

                    <div className="mt-3">
                      <p className="text-sm">
                        <span className="font-medium">From:</span>{" "}
                        {delivery.pickup_address}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">To:</span>{" "}
                        {delivery.delivery_address}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Distance:</span>{" "}
                        {delivery.distance_km.toFixed(1)} km
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Points:</span>{" "}
                        {delivery.points_cost}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverDeliveries;
