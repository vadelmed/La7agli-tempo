import React, { useState } from "react";
import { Search, Filter, X, Clock, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface SearchResult {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  priceRange: string;
  cuisine: string;
}

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Pizza",
    "Burger",
    "Sushi",
    "Salad",
  ]);

  // Mock data for search results
  const [searchResults, setSearchResults] = useState<SearchResult[]>([
    {
      id: "1",
      name: "Delicious Pizza Place",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
      rating: 4.5,
      deliveryTime: "25-35 min",
      priceRange: "$$",
      cuisine: "Italian",
    },
    {
      id: "2",
      name: "Burger Kingdom",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
      rating: 4.2,
      deliveryTime: "15-25 min",
      priceRange: "$",
      cuisine: "American",
    },
    {
      id: "3",
      name: "Sushi Master",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",
      rating: 4.8,
      deliveryTime: "30-40 min",
      priceRange: "$$$",
      cuisine: "Japanese",
    },
    {
      id: "4",
      name: "Healthy Greens",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      rating: 4.3,
      deliveryTime: "20-30 min",
      priceRange: "$$",
      cuisine: "Healthy",
    },
  ]);

  const popularCategories = [
    { id: "1", name: "Fast Food", icon: "🍔" },
    { id: "2", name: "Pizza", icon: "🍕" },
    { id: "3", name: "Sushi", icon: "🍣" },
    { id: "4", name: "Healthy", icon: "🥗" },
    { id: "5", name: "Dessert", icon: "🍰" },
    { id: "6", name: "Coffee", icon: "☕" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)]);
    }
    // In a real app, you would fetch search results here
  };

  const handleClearRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter((item) => item !== search));
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery(category);
    // In a real app, you would trigger a search here
  };

  return (
    <div className="flex flex-col h-full w-full bg-background p-4 overflow-auto">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="sticky top-0 z-10 bg-background pb-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for restaurants, dishes..."
            className="pl-10 pr-10 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-2.5"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && !searchQuery && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="flex items-center bg-muted rounded-full px-3 py-1"
              >
                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                <span
                  className="text-sm cursor-pointer"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </span>
                <button
                  onClick={() => handleClearRecentSearch(search)}
                  className="ml-1 text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Categories */}
      {!searchQuery && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Popular Categories</h3>
          <div className="grid grid-cols-3 gap-2">
            {popularCategories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="flex flex-col h-20 justify-center items-center"
                onClick={() => handleCategoryClick(category.name)}
              >
                <span className="text-2xl mb-1">{category.icon}</span>
                <span className="text-xs">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {(searchQuery || searchResults.length > 0) && (
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Results</h3>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>

          <Tabs defaultValue="all" className="mb-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                All
              </TabsTrigger>
              <TabsTrigger
                value="restaurants"
                onClick={() => setActiveTab("restaurants")}
              >
                Restaurants
              </TabsTrigger>
              <TabsTrigger
                value="dishes"
                onClick={() => setActiveTab("dishes")}
              >
                Dishes
              </TabsTrigger>
              <TabsTrigger
                value="grocery"
                onClick={() => setActiveTab("grocery")}
              >
                Grocery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {searchResults.map((result) => (
                <Card key={result.id} className="overflow-hidden">
                  <div className="flex h-24">
                    <img
                      src={result.image}
                      alt={result.name}
                      className="h-full w-24 object-cover"
                    />
                    <CardContent className="flex-1 p-3">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{result.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm">{result.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {result.cuisine}
                      </p>
                      <div className="flex mt-2 gap-2">
                        <Badge variant="outline" className="text-xs">
                          {result.deliveryTime}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {result.priceRange}
                        </Badge>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="restaurants">
              <div className="text-center py-8 text-muted-foreground">
                Restaurant-specific results would appear here
              </div>
            </TabsContent>

            <TabsContent value="dishes">
              <div className="text-center py-8 text-muted-foreground">
                Dish-specific results would appear here
              </div>
            </TabsContent>

            <TabsContent value="grocery">
              <div className="text-center py-8 text-muted-foreground">
                Grocery-specific results would appear here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* No Results State */}
      {searchQuery && searchResults.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 py-12">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground text-center max-w-xs">
            We couldn't find anything matching "{searchQuery}". Try a different
            search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
