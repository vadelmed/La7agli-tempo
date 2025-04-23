import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Settings,
  LogOut,
  Edit,
  Clock,
  Star,
  Package,
  CreditCard,
  Heart,
  HelpCircle,
} from "lucide-react";

interface UserProfileScreenProps {
  user?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
  };
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  user = {
    name: "محمد أحمد",
    email: "mohammed@example.com",
    phone: "+966 50 123 4567",
    address: "الرياض، المملكة العربية السعودية",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
  },
}) => {
  const [activeTab, setActiveTab] = useState("orders");

  const recentOrders = [
    {
      id: "1",
      restaurant: "مطعم الشرق",
      date: "منذ يومين",
      status: "تم التوصيل",
      total: "75 ريال",
    },
    {
      id: "2",
      restaurant: "برجر كينج",
      date: "منذ 5 أيام",
      status: "تم التوصيل",
      total: "89 ريال",
    },
    {
      id: "3",
      restaurant: "كودو",
      date: "منذ أسبوع",
      status: "تم التوصيل",
      total: "62 ريال",
    },
    {
      id: "4",
      restaurant: "البيك",
      date: "منذ أسبوعين",
      status: "تم التوصيل",
      total: "55 ريال",
    },
  ];

  const savedRestaurants = [
    { id: "1", name: "مطعم الشرق", cuisine: "شرقي", rating: 4.8 },
    { id: "2", name: "برجر كينج", cuisine: "برجر", rating: 4.5 },
    { id: "3", name: "كودو", cuisine: "دجاج", rating: 4.3 },
    { id: "4", name: "البيك", cuisine: "دجاج", rating: 4.7 },
    { id: "5", name: "كنتاكي", cuisine: "دجاج", rating: 4.2 },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Profile Header */}
      <div className="flex flex-col items-center p-6 bg-card">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-muted-foreground">{user.email}</p>
        <p className="text-muted-foreground">{user.phone}</p>
        <div className="flex items-center mt-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{user.address}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            تعديل الملف
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            الإعدادات
          </Button>
        </div>
      </div>

      <Separator />

      {/* Profile Content */}
      <Tabs
        defaultValue="orders"
        className="flex-1"
        onValueChange={setActiveTab}
      >
        <div className="px-4">
          <TabsList className="w-full justify-start my-4">
            <TabsTrigger value="orders" className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              طلباتي
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              المفضلة
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              الدفع
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              المساعدة
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 px-4 pb-20">
          <TabsContent value="orders" className="mt-0">
            <h3 className="text-lg font-medium mb-4">طلباتي الأخيرة</h3>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{order.restaurant}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{order.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{order.status}</Badge>
                        <p className="mt-1 font-medium">{order.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              عرض جميع الطلبات
            </Button>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <h3 className="text-lg font-medium mb-4">المطاعم المفضلة</h3>
            <div className="space-y-4">
              {savedRestaurants.map((restaurant) => (
                <Card key={restaurant.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{restaurant.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {restaurant.cuisine}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-0">
            <h3 className="text-lg font-medium mb-4">طرق الدفع</h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">بطاقات الدفع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <div className="h-8 w-12 bg-blue-500 rounded mr-2"></div>
                      <div>
                        <p className="font-medium">فيزا ****4582</p>
                        <p className="text-xs text-muted-foreground">
                          تنتهي في 05/25
                        </p>
                      </div>
                    </div>
                    <Badge>افتراضي</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <div className="h-8 w-12 bg-red-500 rounded mr-2"></div>
                      <div>
                        <p className="font-medium">ماستركارد ****7891</p>
                        <p className="text-xs text-muted-foreground">
                          تنتهي في 08/24
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  إضافة بطاقة جديدة
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="mt-0">
            <h3 className="text-lg font-medium mb-4">مركز المساعدة</h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="p-3 border rounded-md hover:bg-accent cursor-pointer">
                    <h4 className="font-medium">الأسئلة الشائعة</h4>
                  </div>
                  <div className="p-3 border rounded-md hover:bg-accent cursor-pointer">
                    <h4 className="font-medium">سياسة الخصوصية</h4>
                  </div>
                  <div className="p-3 border rounded-md hover:bg-accent cursor-pointer">
                    <h4 className="font-medium">شروط الاستخدام</h4>
                  </div>
                  <div className="p-3 border rounded-md hover:bg-accent cursor-pointer">
                    <h4 className="font-medium">اتصل بنا</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
};

export default UserProfileScreen;
