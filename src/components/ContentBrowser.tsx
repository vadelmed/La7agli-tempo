import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  priceRange: string;
  cuisine: string;
}

interface ContentBrowserProps {
  restaurants?: Restaurant[];
  categories?: string[];
  promotions?: { id: string; image: string; title: string }[];
}

const ContentBrowser = ({
  restaurants = [
    {
      id: "1",
      name: "Shawarma Palace",
      image:
        "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&q=80",
      rating: 4.8,
      deliveryTime: "25-35",
      distance: "1.2",
      priceRange: "$$",
      cuisine: "Middle Eastern",
    },
    {
      id: "2",
      name: "Falafel House",
      image:
        "https://images.unsplash.com/photo-1593001872095-7d5b3868dd29?w=800&q=80",
      rating: 4.5,
      deliveryTime: "15-25",
      distance: "0.8",
      priceRange: "$",
      cuisine: "Middle Eastern",
    },
    {
      id: "3",
      name: "Kabsa King",
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80",
      rating: 4.7,
      deliveryTime: "30-40",
      distance: "1.5",
      priceRange: "$$",
      cuisine: "Saudi",
    },
    {
      id: "4",
      name: "Hummus Express",
      image:
        "https://images.unsplash.com/photo-1541518763669-27fef9b49644?w=800&q=80",
      rating: 4.3,
      deliveryTime: "20-30",
      distance: "1.0",
      priceRange: "$",
      cuisine: "Lebanese",
    },
    {
      id: "5",
      name: "Biryani House",
      image:
        "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80",
      rating: 4.6,
      deliveryTime: "35-45",
      distance: "2.0",
      priceRange: "$$",
      cuisine: "Indian",
    },
    {
      id: "6",
      name: "Mandi Corner",
      image:
        "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=800&q=80",
      rating: 4.4,
      deliveryTime: "30-40",
      distance: "1.7",
      priceRange: "$$",
      cuisine: "Yemeni",
    },
  ],
  categories = [
    "All",
    "Middle Eastern",
    "Saudi",
    "Lebanese",
    "Indian",
    "Yemeni",
    "Fast Food",
    "Desserts",
    "Beverages",
  ],
  promotions = [
    {
      id: "promo1",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      title: "Special Ramadan Offers!",
    },
    {
      id: "promo2",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      title: "Free Delivery Weekend!",
    },
    {
      id: "promo3",
      image:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80",
      title: "20% Off on Selected Restaurants",
    },
  ],
}: ContentBrowserProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const filteredRestaurants =
    selectedCategory === "All"
      ? restaurants
      : restaurants.filter(
          (restaurant) => restaurant.cuisine === selectedCategory,
        );

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className="w-full h-full bg-background overflow-hidden flex flex-col">
      {/* Promotions Carousel */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-3">Promotions</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="relative min-w-[280px] h-[150px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => console.log(`Clicked on promotion ${promo.id}`)}
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                <p className="text-white font-semibold">{promo.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-4">
        <h2 className="text-xl font-bold mb-3">Categories</h2>
        <ScrollArea className="whitespace-nowrap pb-2">
          <div className="flex gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Restaurants */}
      <div className="flex-1 p-4 overflow-hidden">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Restaurants</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="fast">Fast Delivery</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRestaurants.map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleRestaurantClick(restaurant.id)}
                  >
                    <div className="relative h-[180px]">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2">
                        {restaurant.priceRange}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{restaurant.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {restaurant.cuisine}
                      </p>
                      <div className="flex justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {restaurant.deliveryTime} min
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {restaurant.distance} km
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRestaurants
                  .filter((r) => r.rating >= 4.5)
                  .map((restaurant) => (
                    <Card
                      key={restaurant.id}
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleRestaurantClick(restaurant.id)}
                    >
                      <div className="relative h-[180px]">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2">
                          {restaurant.priceRange}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {restaurant.cuisine}
                        </p>
                        <div className="flex justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{restaurant.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {restaurant.deliveryTime} min
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {restaurant.distance} km
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="nearby" className="mt-0">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRestaurants
                  .filter((r) => parseFloat(r.distance) <= 1.2)
                  .map((restaurant) => (
                    <Card
                      key={restaurant.id}
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleRestaurantClick(restaurant.id)}
                    >
                      <div className="relative h-[180px]">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2">
                          {restaurant.priceRange}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {restaurant.cuisine}
                        </p>
                        <div className="flex justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{restaurant.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {restaurant.deliveryTime} min
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {restaurant.distance} km
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="fast" className="mt-0">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRestaurants
                  .filter((r) => {
                    const [min] = r.deliveryTime.split("-").map(Number);
                    return min <= 25;
                  })
                  .map((restaurant) => (
                    <Card
                      key={restaurant.id}
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleRestaurantClick(restaurant.id)}
                    >
                      <div className="relative h-[180px]">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2">
                          {restaurant.priceRange}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {restaurant.cuisine}
                        </p>
                        <div className="flex justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{restaurant.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {restaurant.deliveryTime} min
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {restaurant.distance} km
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentBrowser;
