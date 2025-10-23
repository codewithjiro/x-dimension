"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Rocket,
  Gamepad2,
  Zap,
  Shield,
  Users,
  Sparkles,
  ArrowRight,
  Star,
  Crown,
  Gem,
  Code2,
  Server,
  Lock,
  Search,
  Filter,
  HelpCircle,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ThumbsUp,
  ChevronRight,
  Database,
  Cpu,
  Globe,
  BarChart3,
  Smartphone,
  Cloud,
} from "lucide-react";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) return null;

  // Mock featured items for preview
  const featuredItems = [
    {
      id: 1,
      name: "Super Mushroom",
      category: "Power-Up",
      rarity: "Common",
      description:
        "A classic red-and-white mushroom that makes Mario grow bigger and stronger instantly.",
      votes: 512,
      comments: 87,
      user: "mariofan_64",
      timestamp: "1 hour ago",
    },
    {
      id: 2,
      name: "Fire Flower",
      category: "Power-Up",
      rarity: "Rare",
      description:
        "Grants the power to throw fireballs — perfect for taking down Goombas and Koopas alike.",
      votes: 468,
      comments: 73,
      user: "luigi_time",
      timestamp: "3 hours ago",
    },
    {
      id: 3,
      name: "Star Power",
      category: "Item",
      rarity: "Legendary",
      description:
        "Turns the user invincible for a short period, glowing with unstoppable energy and speed.",
      votes: 620,
      comments: 104,
      user: "princess_peach",
      timestamp: "6 hours ago",
    },
  ];

  const features = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Vast Item Library",
      description:
        "Access thousands of game items from multiple genres and platforms",
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Smart Search",
      description:
        "Find exactly what you need with advanced filtering and search capabilities",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Community Driven",
      description: "Share, discuss, and rate items with gamers worldwide",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Real-time Analytics",
      description: "Track item popularity, usage stats, and community trends",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "API Access",
      description:
        "Integrate our item database directly into your applications",
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Cloud Sync",
      description: "Your collections and favorites synced across all devices",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Reddit-Style Navigation */}
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
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="bg-orange-500 text-white hover:bg-orange-600">
                    Sign Up
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  Go to Dashboard
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 dark:border-orange-800 dark:bg-orange-900/20"
              >
                <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  Largest Game Item Database
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-4xl leading-tight font-black text-slate-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight dark:text-white"
              >
                Discover & Visualize{" "}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Game Data
                </span>{" "}
                from the{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  MarioX API
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-xl leading-relaxed text-slate-600 dark:text-slate-400"
              >
                Join the world's largest community for game item discovery,
                sharing, and discussion. Find rare items, build your collection,
                and connect with fellow gamers.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      size="lg"
                      className="group bg-orange-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-orange-600 hover:shadow-xl"
                    >
                      <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                      Join Community
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button
                    size="lg"
                    onClick={() => router.push("/dashboard")}
                    className="group bg-orange-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-orange-600 hover:shadow-xl"
                  >
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Explore Items
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </SignedIn>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-300 bg-white px-8 py-3 text-lg font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Gem className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="grid grid-cols-3 gap-8 pt-8"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    50K+
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Community Members
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    100K+
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Game Items
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    1M+
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Monthly Discussions
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Featured Items Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Trending Items
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {featuredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-orange-300 dark:border-slate-700 dark:hover:border-orange-600"
                      >
                        <div className="flex gap-4">
                          {/* Vote Column */}
                          <div className="flex flex-col items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:text-orange-500"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              {item.votes}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-start justify-between">
                              <div>
                                <h4 className="truncate font-semibold text-slate-900 dark:text-white">
                                  {item.name}
                                </h4>
                                <div className="mt-1 flex items-center gap-2">
                                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                    {item.category}
                                  </Badge>
                                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                    {item.rarity}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                              {item.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-4">
                                <span>Posted by u/{item.user}</span>
                                <span>{item.timestamp}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                                <span>{item.comments}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 dark:border-slate-600"
                    >
                      View All Trending Items
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-slate-900/50"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-800 dark:bg-blue-900/20"
            >
              <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                Why Choose XDimension?
              </span>
            </motion.div>

            <h2 className="mt-8 text-4xl font-black text-slate-900 sm:text-5xl dark:text-white">
              Built for Gamers,{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                By Gamers
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600 dark:text-slate-400">
              Everything you need to discover, share, and discuss game items in
              one place.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="mb-4 inline-block rounded-xl bg-orange-100 p-3 group-hover:bg-orange-200 dark:bg-orange-900/20 dark:group-hover:bg-orange-900/30">
                  <div className="text-orange-600 dark:text-orange-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-black text-slate-900 sm:text-5xl dark:text-white">
              How It{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                1
              </div>
              <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                Join Community
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Sign up for free and become part of our growing gaming community
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                2
              </div>
              <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                Explore Items
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Browse thousands of game items, filter by category, rarity, and
                more
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                3
              </div>
              <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                Share & Discuss
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Upload your own items, join discussions, and build your
                reputation
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 px-4 py-16 sm:px-6 lg:px-8 dark:from-orange-900/20 dark:to-red-900/20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-black text-slate-900 sm:text-5xl dark:text-white">
              Ready to Join the Community?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600 dark:text-slate-400">
              Join thousands of gamers discovering and sharing amazing game
              items every day.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mt-8 inline-block"
            >
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-orange-500 px-12 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-orange-600"
                  >
                    <Rocket className="mr-3 h-5 w-5" />
                    Get Started Free
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                  className="bg-orange-500 px-12 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-orange-600"
                >
                  <Gamepad2 className="mr-3 h-5 w-5" />
                  Explore Items Now
                </Button>
              </SignedIn>
            </motion.div>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              No credit card required • Free forever plan available
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <span className="text-sm font-bold text-white">XD</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  XDimension
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                The ultimate platform for game item discovery and community
                sharing.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                Explore
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="/dashboard"
                    className="transition-colors hover:text-orange-500"
                  >
                    All Items
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-500"
                  >
                    Popular Items
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-500"
                  >
                    New Items
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-500"
                  >
                    Top Contributors
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                Resources
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="/about"
                    className="transition-colors hover:text-orange-500"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/help"
                    className="transition-colors hover:text-orange-500"
                  >
                    Help & FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-500"
                  >
                    API Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-500"
                  >
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                Support
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-500"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-500"
                  >
                    Report Issue
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-500"
                  >
                    Feature Request
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-500"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                © 2025 XDimension. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-400">
                <a href="#" className="transition-colors hover:text-orange-500">
                  Privacy
                </a>
                <a href="#" className="transition-colors hover:text-orange-500">
                  Terms
                </a>
                <a href="#" className="transition-colors hover:text-orange-500">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
