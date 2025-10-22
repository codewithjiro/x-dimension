"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { 
  Gamepad2, 
  Zap, 
  Search, 
  Filter,
  Plus,
  Download,
  Upload,
  Shield,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Crown,
  Gem,
  Star,
  Sword,
  Shield as ShieldIcon,
  Option,
  Scroll
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { UserButton } from "@clerk/nextjs";

interface GameItem {
  id: number;
  name: string;
  category: string;
  type: string;
  power: number;
  effect: string;
  rarity: string;
  description: string;
  imageUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  fileName: string;
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    fetchGameItems();
  }, []);

  const fetchGameItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/items");
      const data = await response.json();
      setGameItems(data);
    } catch (error) {
      console.error("Error fetching game items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchGameItems();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: searchTerm }),
      });
      const data = await response.json();
      setGameItems(data);
    } catch (error) {
      console.error("Error searching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case "common": return "bg-gray-500";
      case "uncommon": return "bg-green-500";
      case "rare": return "bg-blue-500";
      case "epic": return "bg-purple-500";
      case "legendary": return "bg-yellow-500";
      case "mythic": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "weapon": return <Sword className="h-4 w-4" />;
      case "armor": return <ShieldIcon className="h-4 w-4" />;
      case "potion": return <Option className="h-4 w-4" />;
      case "artifact": return <Gem className="h-4 w-4" />;
      default: return <Scroll className="h-4 w-4" />;
    }
  };

  const filteredItems = gameItems.filter(item => {
    if (selectedCategory === "all") return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const categories = ["all", ...new Set(gameItems.map(item => item.category).filter(Boolean))];

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 opacity-75 blur-lg"></div>
            <div className="relative rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-6 shadow-2xl">
              <Gamepad2 className="h-12 w-12 text-white animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-300">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 opacity-75 blur-lg"></div>
                <div className="relative rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-3 shadow-2xl">
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-2xl font-black text-transparent">
                  xDimension
                </h1>
                <p className="text-xs font-medium text-gray-400">Dashboard</p>
              </div>
            </motion.div>

            {/* User Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="text-right">
                <p className="font-medium text-white">Welcome back, {user?.firstName}</p>
                <p className="text-sm text-gray-400">Game Master</p>
              </div>
              <UserButton afterSignOutUrl="/" />
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4"
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-3">
                    <Gamepad2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{gameItems.length}</p>
                    <p className="text-gray-400">Total Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {gameItems.filter(item => item.rarity?.toLowerCase() === "legendary").length}
                    </p>
                    <p className="text-gray-400">Legendary</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {gameItems.filter(item => item.power && item.power > 80).length}
                    </p>
                    <p className="text-gray-400">High Power</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {new Set(gameItems.map(item => item.userId)).size}
                    </p>
                    <p className="text-gray-400">Creators</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search game items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="bg-gray-700/50 border-gray-600 pl-10 text-white placeholder-gray-400"
                      />
                    </div>
                    <Button 
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-red-500 to-yellow-500 font-bold text-white"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={fetchGameItems}
                      className="border-gray-600 text-gray-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "secondary"}
                      className={`cursor-pointer ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {getCategoryIcon(category)}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Game Items Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-gray-800/50 border-gray-700 backdrop-blur-xl animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl hover:border-yellow-500/30 transition-all duration-300 group">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-gradient-to-r from-red-500 to-yellow-500 p-2">
                              {getCategoryIcon(item.category)}
                            </div>
                            <div>
                              <CardTitle className="text-white group-hover:text-yellow-400 transition-colors">
                                {item.name}
                              </CardTitle>
                              <CardDescription className="text-gray-400">
                                {item.category} • {item.type}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={getRarityColor(item.rarity)}>
                            {item.rarity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Power:</span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(item.power || 0, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-white font-medium">{item.power}</span>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-400">Effect:</span>
                            <p className="text-white font-medium truncate">{item.effect}</p>
                          </div>
                        </div>

                        {item.imageUrl && (
                          <div className="mt-4 rounded-lg overflow-hidden border border-gray-600">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm ? `No results for "${searchTerm}"` : "No game items available"}
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      fetchGameItems();
                    }}
                    className="bg-gradient-to-r from-red-500 to-yellow-500 font-bold text-white"
                  >
                    View All Items
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}