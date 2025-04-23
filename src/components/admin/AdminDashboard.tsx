import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { supabase } from "@/lib/supabase";
import { addDriverPoints } from "@/services/driverService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, User, Motorcycle, Coins, Package } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";

const AdminDashboard = () => {
  const { user, userRole } = useAuth();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("drivers");

  // For adding points
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [addingPoints, setAddingPoints] = useState(false);
  const [pointsSuccess, setPointsSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user || userRole !== "admin") return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch drivers
        const { data: driversData, error: driversError } = await supabase
          .from("drivers")
          .select("*")
          .order("created_at", { ascending: false });

        if (driversError) throw driversError;
        setDrivers(driversData);

        // Fetch deliveries
        const { data: deliveriesData, error: deliveriesError } = await supabase
          .from("delivery_requests")
          .select(
            `
            *,
            users:user_id (*),
            drivers:driver_id (*)
          `,
          )
          .order("created_at", { ascending: false })
          .limit(50);

        if (deliveriesError) throw deliveriesError;
        setDeliveries(deliveriesData);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const driversSubscription = supabase
      .channel("admin-drivers")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drivers",
        },
        () => {
          fetchData();
        },
      )
      .subscribe();

    const deliveriesSubscription = supabase
      .channel("admin-deliveries")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "delivery_requests",
        },
        () => {
          fetchData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(driversSubscription);
      supabase.removeChannel(deliveriesSubscription);
    };
  }, [user, userRole]);

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPointsSuccess(null);
    setAddingPoints(true);

    if (!selectedDriver) {
      setError("Please select a driver");
      setAddingPoints(false);
      return;
    }

    if (pointsToAdd <= 0) {
      setError("Points must be greater than 0");
      setAddingPoints(false);
      return;
    }

    try {
      const success = await addDriverPoints(
        selectedDriver,
        pointsToAdd,
        notes || "Admin added points",
      );

      if (success) {
        setPointsSuccess(`Successfully added ${pointsToAdd} points to driver`);
        setPointsToAdd(0);
        setNotes("");
      } else {
        throw new Error("Failed to add points");
      }
    } catch (err: any) {
      setError(err.message || "Failed to add points");
    } finally {
      setAddingPoints(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">قيد الانتظار</Badge>;
      case "accepted":
        return <Badge variant="secondary">تم القبول</Badge>;
      case "picked_up":
        return <Badge className="bg-blue-500 text-white">قيد التنفيذ</Badge>;
      case "delivered":
        return <Badge className="bg-green-500 text-white">تم التوصيل</Badge>;
      case "cancelled":
        return <Badge variant="destructive">ملغي</Badge>;
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

  if (userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => (window.location.href = "/")}>
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage drivers, deliveries, and points
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {pointsSuccess && (
        <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            {pointsSuccess}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="h-5 w-5 mr-2" />
            Add Points to Driver
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPoints} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="driverId">Select Driver</Label>
                <select
                  id="driverId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedDriver || ""}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  required
                >
                  <option value="">Select a driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.points} points)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="points">Points to Add</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={pointsToAdd || ""}
                  onChange={(e) =>
                    setPointsToAdd(parseInt(e.target.value) || 0)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Reason for adding points"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" disabled={addingPoints}>
              {addingPoints ? "Adding Points..." : "Add Points"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((driver) => (
              <Card key={driver.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {driver.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {driver.phone}
                      </p>
                    </div>
                    <Badge
                      variant={driver.is_available ? "success" : "secondary"}
                      className={driver.is_available ? "bg-green-500" : ""}
                    >
                      {driver.is_available ? "Online" : "Offline"}
                    </Badge>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center">
                      <Motorcycle className="h-4 w-4 mr-1" />
                      <p className="text-sm capitalize">
                        {driver.vehicle_type}
                      </p>
                    </div>
                    <div className="flex items-center mt-1">
                      <Coins className="h-4 w-4 mr-1" />
                      <p className="text-sm">
                        <span className="font-medium">{driver.points}</span>{" "}
                        points
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Registered{" "}
                      {formatDistanceToNow(new Date(driver.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                    <Badge
                      variant={driver.is_active ? "outline" : "destructive"}
                    >
                      {driver.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deliveries" className="mt-4">
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
                        {formatDistanceToNow(new Date(delivery.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {getStatusBadge(delivery.status)}
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">User:</span>{" "}
                        {delivery.users?.name || "Unknown"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">From:</span>{" "}
                        {delivery.pickup_address}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">To:</span>{" "}
                        {delivery.delivery_address}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Driver:</span>{" "}
                        {delivery.drivers?.name || "Not assigned"}
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
