import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { registerDriver } from "@/services/driverService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DriverRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleType, setVehicleType] = useState<"motorcycle" | "tuktuk">(
    "motorcycle",
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!user) {
      setError("You must be logged in to register as a driver");
      setLoading(false);
      return;
    }

    if (!name || !phone || !licenseNumber) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const result = await registerDriver(
        user.id,
        name,
        phone,
        user.email || null,
        vehicleType,
        licenseNumber,
      );

      if (result) {
        setSuccess(
          "Registration successful! Your account will be reviewed by an admin.",
        );
        setTimeout(() => {
          navigate("/driver/dashboard");
        }, 3000);
      } else {
        throw new Error("Failed to register as a driver");
      }
    } catch (error: any) {
      setError(error.message || "Failed to register as a driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Driver Registration
          </CardTitle>
          <CardDescription>
            Register as a driver for La7agli delivery service
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                placeholder="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <RadioGroup
                value={vehicleType}
                onValueChange={(value) =>
                  setVehicleType(value as "motorcycle" | "tuktuk")
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="motorcycle" id="motorcycle" />
                  <Label htmlFor="motorcycle" className="cursor-pointer">
                    Motorcycle
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tuktuk" id="tuktuk" />
                  <Label htmlFor="tuktuk" className="cursor-pointer">
                    TukTuk
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Register as Driver"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default DriverRegistration;
