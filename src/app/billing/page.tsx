"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Check,
  Crown,
  Zap,
  Building2,
  CreditCard,
  Download,
  Calendar,
  Receipt,
  Shield,
  BarChart3,
  Webhook,
  Users,
  Settings,
  Star,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  features: string[];
  limitations: string[];
  popular?: boolean;
  icon: React.ReactNode;
  buttonVariant: "default" | "outline" | "secondary";
  requestLimit: string;
  color: string;
};

type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  plan: string;
  downloadUrl: string;
};

export default function BillingPage() {
  const { user, isLoaded } = useUser();
  const [currentPlan, setCurrentPlan] = useState("starter");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for learning and personal projects",
      price: 0,
      billingPeriod: "forever",
      features: [
        "Basic API Access",
        "Community Support",
        "Standard Rate Limits",
        "Public Data Only",
      ],
      limitations: [
        "No priority support",
        "No webhook access",
        "Basic analytics only",
        "Rate limited",
      ],
      icon: <Zap className="h-6 w-6" />,
      buttonVariant: "outline",
      requestLimit: "5 requests / 10s",
      color: "bg-gray-500",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Ideal for serious projects and applications",
      price: 199,
      billingPeriod: "month",
      features: [
        "All Starter Features",
        "Priority Support",
        "Webhook Support",
        "Advanced Analytics",
        "Early Access Features",
      ],
      limitations: [],
      popular: true,
      icon: <Crown className="h-6 w-6" />,
      buttonVariant: "default",
      requestLimit: "300 requests / minute",
      color: "bg-orange-500",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For mission-critical applications",
      price: 999,
      billingPeriod: "month",
      features: [
        "All Pro Features",
        "Dedicated Support",
        "Custom Integrations",
        "SLA Guarantee",
        "Custom Data Models",
      ],
      limitations: [],
      icon: <Building2 className="h-6 w-6" />,
      buttonVariant: "outline",
      requestLimit: "Unlimited requests",
      color: "bg-purple-600",
    },
  ];

  const invoices: Invoice[] = [
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      amount: 0,
      status: "paid",
      plan: "Starter Plan",
      downloadUrl: "#",
    },
    {
      id: "INV-2023-012",
      date: "2023-12-15",
      amount: 0,
      status: "paid",
      plan: "Starter Plan",
      downloadUrl: "#",
    },
    {
      id: "INV-2023-011",
      date: "2023-11-15",
      amount: 0,
      status: "paid",
      plan: "Starter Plan",
      downloadUrl: "#",
    },
  ];

  const currentPlanData = plans.find((plan) => plan.id === currentPlan);

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <div className="h-3 w-3 rounded-full bg-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800";
    }
  };

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
                <Button
                  variant="ghost"
                  className="text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Link href="/billing">Billing</Link>
                </Button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-700"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Subscription Plans
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Choose the perfect plan for your needs. Scale as you grow.
          </p>
        </motion.div>

        {/* Current Plan Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 dark:border-orange-900 dark:from-orange-950/50 dark:to-amber-950/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                    <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Current Plan:{" "}
                      <span className="text-orange-600 dark:text-orange-400">
                        Starter
                      </span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      You're on our free forever plan. Upgrade anytime to unlock
                      more features.
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                >
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing Period Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
            <Button
              variant={billingPeriod === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingPeriod("monthly")}
              className={billingPeriod === "monthly" ? "dark:bg-slate-800" : ""}
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === "yearly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingPeriod("yearly")}
              className={billingPeriod === "yearly" ? "dark:bg-slate-800" : ""}
            >
              Yearly <Badge className="ml-2 bg-green-500">Save 20%</Badge>
            </Button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 grid gap-8 lg:grid-cols-3"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full border-2 transition-all hover:shadow-lg ${
                  plan.popular
                    ? "border-orange-300 dark:border-orange-700"
                    : plan.id === currentPlan
                      ? "border-green-300 dark:border-green-700"
                      : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${plan.color} text-white`}
                      >
                        {plan.icon}
                      </div>
                      <div>
                        <CardTitle className="text-slate-900 dark:text-white">
                          {plan.name}
                        </CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                    </div>
                    {plan.id === currentPlan && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        Current
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        ₱
                        {billingPeriod === "yearly" && plan.price > 0
                          ? Math.round(plan.price * 12 * 0.8)
                          : plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-slate-500 dark:text-slate-400">
                          /
                          {billingPeriod === "yearly"
                            ? "year"
                            : plan.billingPeriod}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div
                        className={`rounded px-2 py-1 text-xs font-medium ${plan.color} text-white`}
                      >
                        {plan.requestLimit}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div
                        key={limitationIndex}
                        className="flex items-center gap-3 opacity-50"
                      >
                        <XCircle className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.buttonVariant}
                    disabled={plan.id === currentPlan}
                    onClick={() => setCurrentPlan(plan.id)}
                  >
                    {plan.id === currentPlan ? (
                      "Current Plan"
                    ) : (
                      <>
                        Upgrade Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Billing History & Receipt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid gap-8 lg:grid-cols-2"
        >
          {/* Billing History */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Receipt className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                Your recent invoices and payment history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {invoice.plan}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(invoice.date).toLocaleDateString()}•{" "}
                        {invoice.id}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        ₱{invoice.amount.toFixed(2)}
                      </div>
                      <Badge
                        variant="outline"
                        className={`border ${getStatusColor(invoice.status)}`}
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(invoice.status)}
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Current Invoice Receipt */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <CreditCard className="h-5 w-5" />
                Latest Receipt
              </CardTitle>
              <CardDescription>
                Your most recent payment confirmation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                {/* Receipt Header */}
                <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                          <span className="text-sm font-bold text-white">
                            XD
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            XDimension
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            API Services
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        PAID
                      </Badge>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Receipt Body */}
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Invoice #INV-2024-001
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Issued to: {user?.fullName || "User"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Starter Plan
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        ₱0.00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        API Requests (5/10s)
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        Included
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Community Support
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        Included
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Total
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ₱0.00
                    </span>
                  </div>

                  <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Payment completed on {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receipt Footer */}
                <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Thank you for using XDimension!</span>
                    <span>Questions? Contact support@xdimension.com</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button className="flex-1" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button className="flex-1">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="text-center">
              <CardTitle className="text-slate-900 dark:text-white">
                Plan Comparison
              </CardTitle>
              <CardDescription>
                Detailed feature breakdown across all plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                      <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-white">
                        Feature
                      </th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {plan.name}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {plan.requestLimit}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "API Requests",
                        starter: "5/10s",
                        pro: "300/min",
                        enterprise: "Unlimited",
                      },
                      {
                        feature: "Support",
                        starter: "Community",
                        pro: "Priority",
                        enterprise: "Dedicated",
                      },
                      {
                        feature: "Webhooks",
                        starter: "❌",
                        pro: "✅",
                        enterprise: "✅",
                      },
                      {
                        feature: "Analytics",
                        starter: "Basic",
                        pro: "Advanced",
                        enterprise: "Advanced",
                      },
                      {
                        feature: "SLA Guarantee",
                        starter: "❌",
                        pro: "❌",
                        enterprise: "✅",
                      },
                      {
                        feature: "Custom Models",
                        starter: "❌",
                        pro: "❌",
                        enterprise: "✅",
                      },
                    ].map((row, index) => (
                      <tr
                        key={row.feature}
                        className={
                          index % 2 === 0
                            ? "bg-slate-50/50 dark:bg-slate-900/50"
                            : ""
                        }
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {row.feature}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                          {row.starter}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                          {row.pro}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                          {row.enterprise}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
