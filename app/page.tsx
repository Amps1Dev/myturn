"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Clock, 
  MapPin, 
  Smartphone, 
  Users, 
  CheckCircle, 
  Bell,
  ArrowRight,
  Building2,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">MyTurn</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="myturn-button-primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10" />
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary-dark to-primary bg-clip-text text-transparent">
              Skip the Wait, Own Your Time
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Join virtual queues at banks, government offices, hospitals, and more. 
              Get real-time updates and arrive exactly when it's your turn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="myturn-button-primary text-lg px-8 py-6">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Join a Queue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup?type=company">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <Building2 className="mr-2 h-5 w-5" />
                  For Businesses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How MyTurn Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, smart, and efficient queue management for everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="myturn-card hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Find & Join</CardTitle>
                <CardDescription>
                  Browse nearby institutions and join virtual queues instantly from your phone
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="myturn-card hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-secondary-dark" />
                </div>
                <CardTitle>Get Notified</CardTitle>
                <CardDescription>
                  Receive real-time updates about your position and estimated wait time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="myturn-card hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Arrive on Time</CardTitle>
                <CardDescription>
                  Show up exactly when it's your turn - no more wasted waiting time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="myturn-card hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-secondary-dark" />
                </div>
                <CardTitle>Smart Location</CardTitle>
                <CardDescription>
                  Priority queuing based on your distance and travel time to the location
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="myturn-card hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Priority Access</CardTitle>
                <CardDescription>
                  Special priority for elderly, pregnant women, and premium subscribers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="myturn-card hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary-dark" />
                </div>
                <CardTitle>Book Ahead</CardTitle>
                <CardDescription>
                  Schedule appointments in advance or gift queue positions to others
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Institutions Preview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Available Institutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join queues at banks, government offices, healthcare facilities, and more
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              'Zanaco Bank', 'Stanbic Bank', 'RTSA', 'ZRA', 'UTH',
              'ZESCO', 'Airtel', 'MTN', 'Shoprite', 'UNZA'
            ].map((institution, index) => (
              <Card key={index} className="myturn-card text-center p-4 hover:scale-105 transition-transform duration-200">
                <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-sm">{institution}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="myturn-card max-w-4xl mx-auto p-12">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Ready to Save Your Time?
              </CardTitle>
              <CardDescription className="text-lg mb-8">
                Join thousands of Zambians who have already discovered the smarter way to wait
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="myturn-button-primary text-lg px-8 py-6">
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">MyTurn</span>
              </div>
              <p className="text-muted-foreground">
                Smart queue management for modern Zambia
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-primary transition-colors">Join Queue</Link></li>
                <li><Link href="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Premium</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Business</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/signup?type=company" className="hover:text-primary transition-colors">Get Started</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 MyTurn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}