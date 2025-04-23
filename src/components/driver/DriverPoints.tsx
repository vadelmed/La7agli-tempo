import React, { useState, useEffect } from "react";
import { getDriverTransactions } from "@/services/driverService";
import { PointTransaction } from "@/models/Driver";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, Minus, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";

interface DriverPointsProps {
  driverId: string;
}

const DriverPoints: React.FC<DriverPointsProps> = ({ driverId }) => {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [driverId]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getDriverTransactions(driverId);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load point transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (transaction: PointTransaction) => {
    if (transaction.amount > 0) {
      return <Plus className="h-5 w-5 text-green-500" />;
    } else {
      return <Minus className="h-5 w-5 text-red-500" />;
    }
  };

  const getTransactionType = (type: string) => {
    switch (type) {
      case "admin_add":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Admin Added
          </Badge>
        );
      case "delivery_deduction":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Delivery
          </Badge>
        );
      case "system":
        return <Badge variant="outline">System</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading point history...</div>;
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {transactions.length === 0 ? (
        <div className="text-center p-6 text-muted-foreground">
          No point transactions found.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {getTransactionIcon(transaction)}
                    <div className="ml-3">
                      <div className="flex items-center">
                        <p className="font-medium">
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount} Points
                        </p>
                        <p className="text-xs text-muted-foreground ml-2">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDistanceToNow(
                            new Date(transaction.created_at),
                            { addSuffix: true },
                          )}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {transaction.notes ||
                          (transaction.transaction_type === "delivery_deduction"
                            ? "Points deducted for delivery"
                            : "Points transaction")}
                      </p>
                    </div>
                  </div>
                  {getTransactionType(transaction.transaction_type)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverPoints;
