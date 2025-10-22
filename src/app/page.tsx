"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";
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
  Lock
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/5 blur-3xl"></div>
        
        {/* Grid Pattern */}
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
                <p className="text-xs font-medium text-gray-400">by MarioX</p>
              </div>
            </motion.div>

            {/* Sign In Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="group relative bg-gradient-to-r from-red-500 to-yellow-500 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Zap className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    Launch Adventure
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 font-bold text-white"
                >
                  Enter Dashboard
                </Button>
              </SignedIn>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
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
                className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-400">
                  Next-Gen Gaming API Platform
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-4xl font-black leading-tight sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight"
              >
                Enter the{" "}
                <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                  xDimension
                </span>{" "}
                of Gaming
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-xl leading-relaxed text-gray-300"
              >
                Unleash the power of MarioX with our revolutionary API platform. 
                Build, deploy, and scale your gaming experiences across multiple dimensions.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <SignInButton mode="modal">
                  <Button 
                    size="lg"
                    className="group bg-gradient-to-r from-red-500 to-yellow-500 px-8 py-3 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </SignInButton>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 bg-gray-800/50 px-8 py-3 text-lg font-medium text-gray-300 backdrop-blur-sm hover:bg-gray-700/50 hover:text-white"
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
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
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-gray-400">Developers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1M+</div>
                  <div className="text-sm text-gray-400">API Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              {/* Main Visual Container */}
              <div className="relative rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/60 p-8 shadow-2xl backdrop-blur-xl">
                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -left-4 rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-4 shadow-2xl"
                >
                  <Crown className="h-6 w-6 text-white" />
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, -3, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-4 -right-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4 shadow-2xl"
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>

                {/* Main Image/Visual */}
                <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/30 bg-gradient-to-br from-gray-800 to-gray-900 p-1">
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 to-yellow-500/10">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="mb-4 inline-block rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-6 shadow-2xl"
                        >
                          <Gamepad2 className="h-16 w-16 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white">MarioX</h3>
                        <p className="text-gray-400">Powered by xDimension</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/10 to-yellow-500/10 blur-3xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 backdrop-blur-sm"
            >
              <Star className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-bold text-blue-400">
                About xDimension
              </span>
            </motion.div>

            <h2 className="mt-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
              Revolutionizing Gaming APIs
            </h2>
            
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-400">
              xDimension provides the infrastructure and tools to build the next generation 
              of gaming experiences with MarioX at its core.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Feature 1 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="group rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/60 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300"
            >
              <div className="mb-6 inline-block rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-4 shadow-lg">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">Developer First</h3>
              <p className="text-gray-400 leading-relaxed">
                Built with developers in mind. Comprehensive documentation, SDKs, and 
                tools to accelerate your development process.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="group rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/60 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300"
            >
              <div className="mb-6 inline-block rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4 shadow-lg">
                <Server className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">Enterprise Scale</h3>
              <p className="text-gray-400 leading-relaxed">
                Handle millions of requests with our globally distributed infrastructure. 
                Scale seamlessly as your user base grows.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="group rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/60 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300"
            >
              <div className="mb-6 inline-block rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-4 shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">Secure & Reliable</h3>
              <p className="text-gray-400 leading-relaxed">
                Enterprise-grade security with end-to-end encryption. Your data and 
                your users' data are always protected.
              </p>
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-20 rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/60 p-12 text-center shadow-2xl backdrop-blur-xl"
          >
            <h3 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Explore xDimension?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-400">
              Join thousands of developers building the future of gaming with MarioX.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mt-8 inline-block"
            >
              <SignInButton mode="modal">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-yellow-500 px-12 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300"
                >
                  <Rocket className="mr-3 h-5 w-5" />
                  Launch Your Adventure
                </Button>
              </SignInButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-r from-red-500 to-yellow-500 p-2">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">xDimension</h4>
                <p className="text-sm text-gray-400">Powered by MarioX</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-gray-400 transition-colors hover:text-white">
                Documentation
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-white">
                API Reference
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-white">
                Support
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © 2024 xDimension. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}