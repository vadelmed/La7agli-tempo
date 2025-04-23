import React from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  Heart,
  Share2,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  date: string;
  comment: string;
}

interface ContentDetailViewProps {
  id?: string;
  name?: string;
  image?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: string;
  distance?: string;
  cuisine?: string;
  address?: string;
  description?: string;
  menuItems?: MenuItem[];
  reviews?: Review[];
}

const ContentDetailView: React.FC<ContentDetailViewProps> = ({
  id = "1",
  name = "Delicious Restaurant",
  image = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  rating = 4.8,
  deliveryTime = "25-35 min",
  deliveryFee = "$2.99",
  distance = "1.2 miles",
  cuisine = "Italian",
  address = "123 Main St, City",
  description = "Authentic Italian cuisine with fresh ingredients and traditional recipes. Our chefs prepare each dish with care and attention to detail.",
  menuItems = [
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
    },
    {
      id: "2",
      name: "Pasta Carbonara",
      description: "Creamy pasta with pancetta, eggs, and parmesan cheese",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
    },
    {
      id: "3",
      name: "Tiramisu",
      description:
        "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80",
    },
    {
      id: "4",
      name: "Caprese Salad",
      description:
        "Fresh tomatoes, mozzarella, and basil with olive oil and balsamic glaze",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&q=80",
    },
  ],
  reviews = [
    {
      id: "1",
      userName: "John Doe",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      rating: 5,
      date: "2 days ago",
      comment: "Amazing food and quick delivery! Will definitely order again.",
    },
    {
      id: "2",
      userName: "Sarah Smith",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rating: 4,
      date: "1 week ago",
      comment:
        "Food was delicious but delivery took a bit longer than expected.",
    },
    {
      id: "3",
      userName: "Mike Johnson",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Best Italian food in the area! The pasta carbonara is to die for.",
    },
  ],
}) => {
  return (
    <div className="flex flex-col w-full h-full bg-background">
      {/* Header Image */}
      <div className="relative w-full h-64 md:h-80">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 md:px-6 py-6">
        {/* Restaurant Info */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Badge variant="secondary" className="mr-2">
                  {cuisine}
                </Badge>
                <div className="flex items-center">
                  <Star
                    className="h-4 w-4 text-yellow-500 mr-1"
                    fill="currentColor"
                  />
                  <span className="mr-2">{rating}</span>
                </div>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span className="mr-2">{deliveryTime}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{distance}</span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-green-600 border-green-600"
            >
              {deliveryFee} delivery
            </Badge>
          </div>
          <p className="mt-3 text-muted-foreground">{description}</p>
          <div className="mt-2 text-sm">
            <MapPin className="h-4 w-4 inline mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{address}</span>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Tabs */}
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                      <Button size="sm" variant="outline">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to cart
                      </Button>
                    </div>
                  </div>
                  <div className="w-full md:w-32 h-24 md:h-auto">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star
                  className="h-6 w-6 text-yellow-500 mr-2"
                  fill="currentColor"
                />
                <span className="text-xl font-semibold">{rating}</span>
                <span className="text-muted-foreground ml-2">
                  ({reviews.length} reviews)
                </span>
              </div>
              <Button variant="outline" size="sm">
                Write a Review
              </Button>
            </div>

            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center mb-2">
                  <img
                    src={review.userImage}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{review.userName}</h4>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky Order Button */}
      <div className="sticky bottom-0 w-full p-4 bg-background border-t shadow-md">
        <Button className="w-full" size="lg">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Start Order
        </Button>
      </div>
    </div>
  );
};

export default ContentDetailView;
