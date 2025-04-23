import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { getUserById, getUserDeliveryHistory } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Package, User, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import DeliveryRequestForm from "./DeliveryRequestForm";

const UserDashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("request");

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const data = await getUserById(user.id);
        setUserData(data);

        const history = await getUserDeliveryHistory(user.id);
        setDeliveries(history);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">La7agli Delivery</h1>
        <p className="text-muted-foreground">Welcome back, {userData?.name}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request">Request Delivery</TabsTrigger>
          <TabsTrigger value="history">Delivery History</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="mt-4">
          <DeliveryRequestForm userId={user?.id} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {deliveries.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              You haven't made any delivery requests yet.
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery) => (
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
                      <div className="flex items-start mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                        <p className="text-sm">{delivery.pickup_address}</p>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <p className="text-sm">{delivery.delivery_address}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Distance:</span>{" "}
                          {delivery.distance_km.toFixed(1)} km
                        </p>
                      </div>
                      {delivery.drivers && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {delivery.drivers.name}
                          </span>
                        </div>
                      )}
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

export default UserDashboard;
