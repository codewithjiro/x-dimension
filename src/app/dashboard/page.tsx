"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Search,
  Filter,
  RefreshCw,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  Send,
  User,
  Calendar,
  Upload,
  Database,
  Users,
  ChevronUp,
  ChevronDown,
  Share,
  Bookmark,
  MoreHorizontal,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useUser, UserButton } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";

// Types
type GameItem = {
  id: number;
  name: string;
  category: string;
  type: string;
  power: string;
  effect: string;
  rarity: string;
  description: string;
  imageUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  fileName: string;
  isUserCreated?: boolean;
  uploaderId?: string;
  source?: string;
};

type Comment = {
  id: number;
  itemId: number;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  };
};

// Filter options
const CATEGORIES = [
  "All Categories",
  "Character",
  "Power Up",
  "Weapon",
  "Armor",
  "Consumable",
  "Collectible",
  "Special",
];
const TYPES = [
  "All Types",
  "Hero",
  "Enemy",
  "Speed",
  "Fire",
  "Water",
  "Earth",
  "Air",
  "Ice",
  "Lightning",
];
const RARITIES = [
  "All Rarities",
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
];

const POWER_LEVELS = [
  "None",
  "Level 1",
  "Level 2",
  "Level 3",
  "Level 4",
  "Level 5",
  "Level MAX",
  "Super",
  "Ultra",
  "Mega",
  "Hyper",
];

const EFFECTS = [
  "None",
  "Damage Boost",
  "Speed Boost",
  "Health Regeneration",
  "Invincibility",
  "Size Change",
  "Elemental Attack",
  "Defense Up",
  "Special Ability",
  "Transformation",
  "Combo Enhancer",
];

// Fixed Rarity color mapping
const RARITY_COLORS = {
  Common: "bg-gray-500 text-white",
  Uncommon: "bg-green-500 text-white",
  Rare: "bg-blue-500 text-white",
  Epic: "bg-purple-500 text-white",
  Legendary: "bg-yellow-500 text-black",
  Mythic: "bg-pink-500 text-white",
  Divine: "bg-cyan-500 text-white",
};

// Form data type for create/edit
type ItemFormData = {
  name: string;
  category: string;
  type: string;
  power: string;
  effect: string;
  rarity: string;
  description: string;
  imageUrl: string;
};

export default function DashboardPage() {
  const [apiItems, setApiItems] = useState<GameItem[]>([]);
  const [userItems, setUserItems] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    category: "All Categories",
    type: "All Types",
    rarity: "All Rarities",
    search: "",
  });

  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    category: "",
    type: "",
    power: "None",
    effect: "None",
    rarity: "",
    description: "",
    imageUrl: "",
  });

  const { user, isLoaded } = useUser();
  const [uploading, setUploading] = useState(false);

  // Load items from both sources
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      // Load API items
      const apiRes = await fetch("/api/items");
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        setApiItems(apiData);
      }

      // Load user items if logged in
      if (user) {
        const userRes = await fetch("/api/user-items");
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserItems(userData);
        }
      }
    } catch (error) {
      console.error("Error loading items:", error);
      toast.error("⚠️ Rate limit exceeded");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load comments for selected item
  const loadComments = useCallback(async (itemId: number) => {
    try {
      const res = await fetch(`/api/comments?itemId=${itemId}`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    }
  }, []);

  // Handle item click
  const handleItemClick = async (item: GameItem) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
    await loadComments(item.id);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      type: "",
      power: "None",
      effect: "None",
      rarity: "",
      description: "",
      imageUrl: "",
    });
  };

  const handleUploadComplete = useCallback((res?: { url: string }[]) => {
    const firstUrl = res?.[0]?.url;
    if (firstUrl) {
      setFormData((prev) => ({
        ...prev,
        imageUrl: firstUrl,
      }));
      toast.success("Image uploaded successfully!");
    } else {
      toast.error("Image upload failed.");
    }
    setUploading(false);
  }, []);

  // UploadThing upload error handler
  const handleUploadError = useCallback((error: Error) => {
    setUploading(false);
    toast.error(`Upload failed: ${error.message}`);
  }, []);

  // Remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  // Create new item
  const handleCreateItem = async () => {
    if (!user) {
      toast.error("You must be logged in to create items");
      return;
    }

    try {
      const res = await fetch("/api/user-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create item");

      toast.success("Item created successfully!");
      setCreateDialogOpen(false);
      resetForm();
      await loadItems();
    } catch (error) {
      console.error("Error creating item:", error);
      toast.error("Failed to create item");
    }
  };

  // Update item
  const handleUpdateItem = async () => {
    if (!selectedItem || !user) return;

    try {
      const res = await fetch(`/api/user-items/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update item");

      toast.success("Item updated successfully!");
      setEditDialogOpen(false);
      resetForm();
      await loadItems();
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    }
  };

  // Delete item
  const handleDeleteItem = async (item: GameItem) => {

    try {
      const res = await fetch(`/api/user-items/${item.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete item");

      toast.success("Item deleted successfully!");
      if (selectedItem?.id === item.id) {
        setViewDialogOpen(false);
        setSelectedItem(null);
      }
      await loadItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  // Start editing item
  const handleEditClick = (item: GameItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      type: item.type,
      power: item.power || "None",
      effect: item.effect || "None",
      rarity: item.rarity,
      description: item.description,
      imageUrl: item.imageUrl,
    });
    setEditDialogOpen(true);
  };

  // Add new comment
  const handleAddComment = async () => {
    if (!selectedItem || !newComment.trim() || !user) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedItem.id,
          userId: user.id,
          content: newComment.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      setNewComment("");
      await loadComments(selectedItem.id);
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  // Update comment
  const handleUpdateComment = async (comment: Comment) => {
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment.content,
        }),
      });

      if (!res.ok) throw new Error("Failed to update comment");

      setEditingComment(null);
      if (selectedItem) await loadComments(selectedItem.id);
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      if (selectedItem) await loadComments(selectedItem.id);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  // Filter items based on active tab and filters
  const allItems = [...apiItems, ...userItems].map((item) => ({
    ...item,
    source: item.source || (item.isUserCreated ? "user" : "api"),
  }));

  const filteredItems = allItems.filter((item) => {
    // Filter by tab
    if (activeTab === "api" && item.source !== "api") return false;
    if (activeTab === "user" && item.source !== "user") return false;

    // Filter by search and other criteria
    const matchesSearch =
      filters.search === "" ||
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory =
      filters.category === "All Categories" ||
      item.category === filters.category;
    const matchesType =
      filters.type === "All Types" || item.type === filters.type;
    const matchesRarity =
      filters.rarity === "All Rarities" || item.rarity === filters.rarity;

    return matchesSearch && matchesCategory && matchesType && matchesRarity;
  });

  // Get badge color class for rarity
  const getRarityBadgeClass = (rarity: string) => {
    return (
      RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] ||
      "bg-gray-500 text-white"
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Get upload input data
  const getUploadInput = () => ({
    name: formData.name || "Untitled Item",
    category: formData.category || "Misc",
    type: formData.type || "Generic",
    power: formData.power || "None",
    effect: formData.effect || "None",
    rarity: formData.rarity || "Common",
    description: formData.description || "",
    isUserCreated: true,
    source: "user",
  });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <span className="text-sm font-bold text-white">XD</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  XDimension
                </span>
              </div>

              {/* Navigation */}
              <div className="hidden md:flex md:items-center md:gap-6">
                <Button
                  asChild
                  variant="ghost"
                  className="text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Link href="/dashboard">Home</Link>
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-1 items-center justify-center px-8">
              <div className="w-full max-w-2xl">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                  <Input
                    placeholder="Search XDimension..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="w-full border-slate-300 bg-slate-50 pr-4 pl-10 focus:border-orange-300 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-orange-600"
                  />
                </div>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setCreateDialogOpen(true)}
                disabled={!user}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>

              {isLoaded && user ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              ) : (
                <Button
                  variant="outline"
                  className="border-slate-300 dark:border-slate-700"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Main Content Grid - Reddit Style */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Create Card */}
              <Card className="overflow-hidden border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
                <CardContent className="p-4">
                  <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                    Create Content
                  </h3>
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    disabled={!user}
                    className="w-full bg-orange-500 text-white hover:bg-orange-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Item
                  </Button>
                  {!user && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Sign in to create items
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Filters Card */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Filters
                    </h3>
                    <Filter className="h-4 w-4 text-slate-400" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Category
                      </Label>
                      <Select
                        value={filters.category}
                        onValueChange={(value) =>
                          setFilters({ ...filters, category: value })
                        }
                      >
                        <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Rarity
                      </Label>
                      <Select
                        value={filters.rarity}
                        onValueChange={(value) =>
                          setFilters({ ...filters, rarity: value })
                        }
                      >
                        <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                          {RARITIES.map((rarity) => (
                            <SelectItem key={rarity} value={rarity}>
                              {rarity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Type
                      </Label>
                      <Select
                        value={filters.type}
                        onValueChange={(value) =>
                          setFilters({ ...filters, type: value })
                        }
                      >
                        <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                          {TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-4">
                  <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                    Community Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Total Items
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {allItems.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        API Items
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {apiItems.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        User Items
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {userItems.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
                  <TabsTrigger
                    value="all"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-500 dark:data-[state=active]:bg-slate-900"
                  >
                    <Database className="h-4 w-4" />
                    All Items
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-slate-300 dark:bg-slate-700"
                    >
                      {allItems.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="api"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-500 dark:data-[state=active]:bg-slate-900"
                  >
                    <Database className="h-4 w-4" />
                    API Items
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-slate-300 dark:bg-slate-700"
                    >
                      {apiItems.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="user"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-500 dark:data-[state=active]:bg-slate-900"
                    disabled={!user}
                  >
                    <Users className="h-4 w-4" />
                    My Items
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-slate-300 dark:bg-slate-700"
                    >
                      {userItems.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>

            {/* Items Feed */}
            {loading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className="cursor-pointer border-slate-200 transition-all hover:border-orange-300 hover:shadow-md dark:border-slate-800 dark:hover:border-orange-600"
                        onClick={() => handleItemClick(item)}
                      >
                        <CardContent className="p-0">
                          <div className="flex">
                            {/* Vote Column - Reddit Style */}
                            <div className="flex w-10 flex-col items-center bg-slate-50 py-3 dark:bg-slate-800/50">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:text-orange-500"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <span className="my-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                                0
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:text-blue-500"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4">
                              <div className="mb-2 flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={
                                      item.source === "user"
                                        ? "bg-green-500 text-white"
                                        : "bg-blue-500 text-white"
                                    }
                                  >
                                    {item.source === "user" ? "MY ITEM" : "API"}
                                  </Badge>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Posted by{" "}
                                    {item.source === "user" ? "you" : "API"} •{" "}
                                    {formatDate(item.createdAt)}
                                  </span>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                  >
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(item);
                                      }}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteItem(item);
                                      }}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                                {item.name}
                              </h3>

                              {item.imageUrl && (
                                <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}

                              <p className="mb-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                                {item.description}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  className={getRarityBadgeClass(item.rarity)}
                                >
                                  {item.rarity}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400"
                                >
                                  {item.category}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400"
                                >
                                  {item.type}
                                </Badge>
                              </div>

                              {/* Action Bar */}
                              <div className="mt-3 flex items-center gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 text-slate-600 hover:text-orange-500 dark:text-slate-400"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  <span className="text-xs">Comments</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 text-slate-600 hover:text-green-500 dark:text-slate-400"
                                >
                                  <Share className="h-4 w-4" />
                                  <span className="text-xs">Share</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 text-slate-600 hover:text-blue-500 dark:text-slate-400"
                                >
                                  <Bookmark className="h-4 w-4" />
                                  <span className="text-xs">Save</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {!loading && filteredItems.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-8 dark:border-slate-800 dark:bg-slate-800/50">
                      <Database className="mx-auto h-12 w-12 text-slate-400" />
                      <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                        ⚠️ Rate limit exceeded
                      </h3>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">
                        {filters.search ||
                        filters.category !== "All Categories" ||
                        filters.rarity !== "All Rarities"
                          ? "Try adjusting your filters"
                          : activeTab === "user"
                            ? "Create your first item to get started!"
                            : "No items available"}
                      </p>
                      {activeTab === "user" && !user && (
                        <p className="mt-2 text-sm text-orange-500">
                          You need to be logged in to create items
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* About Card */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-4">
                  <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                    About XDimension
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    A community-driven platform for sharing and discovering
                    amazing game items. Join us to expand your collection and
                    connect with other gamers.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link href="/billing" className="flex-1">
                      <Button className="bg-orange-500 text-white hover:bg-orange-600">
                        Billing
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-slate-300 dark:border-slate-700"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Community Rules */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-4">
                  <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                    Community Rules
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
                      Be respectful and kind to others
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
                      Only share appropriate content
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
                      Credit original creators
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
                      No spam or self-promotion
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* View Item Dialog - Fixed Overlapping */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {selectedItem && (
            <>
              <DialogHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl text-slate-900 dark:text-white">
                    {selectedItem.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        selectedItem.source === "user"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                      }
                    >
                      {selectedItem.source === "user" ? "MY ITEM" : "FROM API"}
                    </Badge>
                    {selectedItem.source === "user" &&
                      user?.id === selectedItem.uploaderId && (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(selectedItem)}
                            className="border-yellow-600 text-yellow-600 hover:bg-yellow-600/20"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(selectedItem)}
                            className="rounded-md border-red-600 text-red-600 transition duration-200 ease-in-out hover:scale-105 hover:bg-red-600/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Item Details */}
                <div className="space-y-6">
                  {selectedItem.imageUrl && (
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={selectedItem.imageUrl}
                        alt={selectedItem.name}
                        className="w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Category
                      </Label>
                      <p className="text-slate-900 dark:text-white">
                        {selectedItem.category}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Type
                      </Label>
                      <p className="text-slate-900 dark:text-white">
                        {selectedItem.type}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Rarity
                      </Label>
                      <Badge
                        className={getRarityBadgeClass(selectedItem.rarity)}
                      >
                        {selectedItem.rarity}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Power
                      </Label>
                      <p className="text-slate-900 dark:text-white">
                        {selectedItem.power || "None"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Effect
                      </Label>
                      <p className="text-slate-900 dark:text-white">
                        {selectedItem.effect || "None"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Description
                    </Label>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedItem.description}
                    </p>
                  </div>
                </div>

                {/* Comments Section - Threaded Style */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Comments
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {comments.length}{" "}
                      {comments.length === 1 ? "comment" : "comments"}
                    </span>
                  </div>

                  {/* Add Comment */}
                  {user && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="What are your thoughts?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="bg-orange-500 text-white hover:bg-orange-600"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Comments List - Threaded Style */}
                  <div className="max-h-96 space-y-4 overflow-y-auto">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
                      >
                        {editingComment?.id === comment.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editingComment.content}
                              onChange={(e) =>
                                setEditingComment({
                                  ...editingComment,
                                  content: e.target.value,
                                })
                              }
                              className="min-h-[80px] border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  handleUpdateComment(editingComment)
                                }
                                className="bg-green-600 text-white hover:bg-green-700"
                                size="sm"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={() => setEditingComment(null)}
                                variant="outline"
                                size="sm"
                                className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={comment.user?.imageUrl} />
                                  <AvatarFallback className="bg-orange-500 text-xs text-white">
                                    {comment.user?.firstName?.[0]}
                                    {comment.user?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {comment.user?.firstName}{" "}
                                  {comment.user?.lastName}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  • {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              {user && user.id === comment.userId && (
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingComment(comment)}
                                    className="h-8 w-8 p-0 text-slate-400 hover:text-blue-500"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <p className="mt-2 text-slate-700 dark:text-slate-300">
                              {comment.content}
                            </p>
                          </>
                        )}
                      </div>
                    ))}

                    {comments.length === 0 && (
                      <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                        <MessageCircle className="mx-auto mb-2 h-8 w-8" />
                        <p>No comments yet. Be the first to comment!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Item Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">
              Create New Item
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Add a new item to your personal collection
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-slate-700 dark:text-slate-300"
              >
                Item Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
                placeholder="Enter item name"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-slate-700 dark:text-slate-300"
              >
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {CATEGORIES.filter((cat) => cat !== "All Categories").map(
                    (category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="type"
                className="text-slate-700 dark:text-slate-300"
              >
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {TYPES.filter((type) => type !== "All Types").map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="rarity"
                className="text-slate-700 dark:text-slate-300"
              >
                Rarity *
              </Label>
              <Select
                value={formData.rarity}
                onValueChange={(value) =>
                  setFormData({ ...formData, rarity: value })
                }
              >
                <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {RARITIES.filter((rarity) => rarity !== "All Rarities").map(
                    (rarity) => (
                      <SelectItem key={rarity} value={rarity}>
                        {rarity}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="power"
                className="text-slate-700 dark:text-slate-300"
              >
                Power Level
              </Label>
              <Select
                value={formData.power}
                onValueChange={(value) =>
                  setFormData({ ...formData, power: value })
                }
              >
                <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select power level" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {POWER_LEVELS.map((power) => (
                    <SelectItem key={power} value={power}>
                      {power}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="effect"
                className="text-slate-700 dark:text-slate-300"
              >
                Effect
              </Label>
              <Select
                value={formData.effect}
                onValueChange={(value) =>
                  setFormData({ ...formData, effect: value })
                }
              >
                <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select effect" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {EFFECTS.map((effect) => (
                    <SelectItem key={effect} value={effect}>
                      {effect}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-slate-700 dark:text-slate-300">
                Item Image
              </Label>

              {formData.imageUrl ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={formData.imageUrl}
                      alt="Item preview"
                      className="h-32 w-32 rounded-lg border border-slate-300 object-cover dark:border-slate-600"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Image uploaded successfully!
                    <Button
                      variant="link"
                      className="h-auto p-0 text-orange-500"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <UploadButton
                    endpoint="imageUploader"
                    input={getUploadInput()}
                    onUploadBegin={() => setUploading(true)}
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    className="ut-button:bg-orange-500 ut-button:text-white ut-button:hover:bg-orange-600 ut-button:ut-readying:bg-orange-400 ut-button:ut-uploading:bg-orange-400 ut-button:ut-uploading:after:bg-orange-600"
                    content={{
                      button: uploading ? "Uploading..." : "Choose Image",
                      allowedContent: "Image (4MB max)",
                    }}
                    appearance={{
                      button:
                        "w-full ut-ready:bg-orange-500 ut-uploading:bg-orange-400 ut-uploading:after:bg-orange-600",
                      allowedContent:
                        "text-slate-500 dark:text-slate-400 text-xs",
                    }}
                  />

                  {/* Fallback URL input */}
                  <div className="pt-2">
                    <Label className="text-sm text-slate-600 dark:text-slate-400">
                      Or enter image URL
                    </Label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label
                htmlFor="description"
                className="text-slate-700 dark:text-slate-300"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-[100px] border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
                placeholder="Describe your amazing item..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
              className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateItem}
              disabled={
                !formData.name ||
                !formData.category ||
                !formData.rarity ||
                uploading
              }
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Create Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">
              Edit Item
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Update your item details
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="edit-name"
                className="text-slate-700 dark:text-slate-300"
              >
                Item Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-category"
                className="text-slate-700 dark:text-slate-300"
              >
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {CATEGORIES.filter((cat) => cat !== "All Categories").map(
                    (category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-type"
                className="text-slate-700 dark:text-slate-300"
              >
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {TYPES.filter((type) => type !== "All Types").map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-rarity"
                className="text-slate-700 dark:text-slate-300"
              >
                Rarity *
              </Label>
              <Select
                value={formData.rarity}
                onValueChange={(value) =>
                  setFormData({ ...formData, rarity: value })
                }
              >
                <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {RARITIES.filter((rarity) => rarity !== "All Rarities").map(
                    (rarity) => (
                      <SelectItem key={rarity} value={rarity}>
                        {rarity}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-power"
                className="text-slate-700 dark:text-slate-300"
              >
                Power Level
              </Label>
              <Select
                value={formData.power}
                onValueChange={(value) =>
                  setFormData({ ...formData, power: value })
                }
              >
                <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select power level" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {POWER_LEVELS.map((power) => (
                    <SelectItem key={power} value={power}>
                      {power}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-effect"
                className="text-slate-700 dark:text-slate-300"
              >
                Effect
              </Label>
              <Select
                value={formData.effect}
                onValueChange={(value) =>
                  setFormData({ ...formData, effect: value })
                }
              >
                <SelectTrigger className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select effect" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {EFFECTS.map((effect) => (
                    <SelectItem key={effect} value={effect}>
                      {effect}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload Section for Edit */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-slate-700 dark:text-slate-300">
                Item Image
              </Label>

              {formData.imageUrl ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={formData.imageUrl}
                        alt="Item preview"
                        className="h-32 w-32 rounded-lg border border-slate-300 object-cover dark:border-slate-600"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                        Current image
                      </p>
                      <UploadButton
                        endpoint="imageUploader"
                        input={getUploadInput()}
                        onUploadBegin={() => setUploading(true)}
                        onClientUploadComplete={handleUploadComplete}
                        onUploadError={handleUploadError}
                        className="ut-button:bg-orange-500 ut-button:text-white ut-button:hover:bg-orange-600"
                        content={{
                          button: uploading ? "Uploading..." : "Change Image",
                          allowedContent: "Image (4MB max)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <UploadButton
                    endpoint="imageUploader"
                    input={getUploadInput()}
                    onUploadBegin={() => setUploading(true)}
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    className="ut-button:bg-orange-500 ut-button:text-white ut-button:hover:bg-orange-600 ut-button:ut-readying:bg-orange-400 ut-button:ut-uploading:bg-orange-400 ut-button:ut-uploading:after:bg-orange-600"
                    content={{
                      button: uploading ? "Uploading..." : "Choose Image",
                      allowedContent: "Image (4MB max)",
                    }}
                    appearance={{
                      button:
                        "w-full ut-ready:bg-orange-500 ut-uploading:bg-orange-400 ut-uploading:after:bg-orange-600",
                      allowedContent:
                        "text-slate-500 dark:text-slate-400 text-xs",
                    }}
                  />

                  {/* Fallback URL input */}
                  <div className="pt-2">
                    <Label className="text-sm text-slate-600 dark:text-slate-400">
                      Or enter image URL
                    </Label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label
                htmlFor="edit-description"
                className="text-slate-700 dark:text-slate-300"
              >
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-[100px] border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                resetForm();
              }}
              className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateItem}
              disabled={
                !formData.name ||
                !formData.category ||
                !formData.rarity ||
                uploading
              }
              className="bg-yellow-600 text-white hover:bg-yellow-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Update Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
