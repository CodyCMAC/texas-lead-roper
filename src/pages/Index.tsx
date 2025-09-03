import { Button } from "@/components/ui/button";
import { Star, Target, TrendingUp, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-dashboard.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <img 
                    src="/lovable-uploads/c0b242e2-5443-4955-a498-c225fb78a2d9.png" 
                    alt="Lead Wrangler" 
                    className="h-24 w-24 mr-4 shadow-copper hover:scale-105 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Star className="h-12 w-12 text-primary mr-3 hidden" />
                  <h1 className="text-4xl font-bold bg-gradient-copper bg-clip-text text-transparent sm:text-5xl md:text-6xl">
                    Lead Wrangler
                  </h1>
                </div>
                
                <h2 className="text-3xl tracking-tight font-extrabold text-foreground sm:text-4xl md:text-5xl">
                  <span className="block">Wrangle Your Leads,</span>
                  <span className="block text-primary">Rope Your Success</span>
                </h2>
                
                <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  The address-first, AI-native CRM built for door-knockers and sales teams. 
                  Track every lead from knock to cash with Texas-sized efficiency.
                </p>
                
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow-copper">
                    <Link to="/auth">
                      <Button size="lg" className="btn-copper px-8 py-3 text-lg">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="px-8 py-3 text-lg"
                      onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                    >
                      Watch Demo
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img 
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full rounded-l-3xl shadow-copper" 
            src={heroImage} 
            alt="Lead Wrangler Dashboard showing CRM interface with property tracking and analytics"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
              Everything you need to wrangle leads
            </p>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
              Built for the modern sales professional who needs speed, accuracy, and results.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-copper text-white">
                  <Target className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">Address-First CRM</p>
                <p className="mt-2 ml-16 text-base text-muted-foreground">
                  Every property is the anchor. No more duplicate leads, no more confusion. 
                  One address, one record, complete history.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-copper text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">AI-Powered Insights</p>
                <p className="mt-2 ml-16 text-base text-muted-foreground">
                  Smart lead scoring, automated follow-ups, and AI summaries help you focus on what matters most.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-sage text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">Team Collaboration</p>
                <p className="mt-2 ml-16 text-base text-muted-foreground">
                  Monday.com-style boards and workflows that keep your entire team in sync across multiple markets.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-sage text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">Enterprise Security</p>
                <p className="mt-2 ml-16 text-base text-muted-foreground">
                  Role-based permissions, audit trails, and workspace isolation keep your data secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-copper">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to wrangle your leads?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-foreground/80">
            Join sales teams across Texas who trust Lead Wrangler to manage their pipeline.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="mt-8 px-8 py-3 text-lg">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
