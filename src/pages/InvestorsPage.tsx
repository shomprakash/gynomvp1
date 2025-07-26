import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Users, DollarSign, Target, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function InvestorsPage() {
  const marketData = [
    { label: "Global Femtech Market by 2030", value: "$54B+", source: "Allied Market Research" },
    { label: "India Women's Digital Health", value: "$6.7B", source: "Current TAM" },
    { label: "Target Users Year 1", value: "2M+", source: "Urban Millennial Women" },
    { label: "YoY Growth Rate", value: "40%", source: "Women Seeking Health Content Online" },
  ];

  const problemStats = [
    "3 in 4 women in India face health issues they don't consult doctors about due to shame, fear, or lack of access",
    "60% of health-related search traffic is driven by women, but answers are often unreliable",
    "No single trusted, unbiased, private resource for accurate, hyper-contextual medical information",
    "Existing health platforms are generic, ad-driven, or biased"
  ];

  const solutionPoints = [
    "24/7 access to private, medically-validated women's health information",
    "GPT-based conversational AI trained on OB-GYN data",
    "Pre-screening, pre-diagnostic aid (guidance before/after medical consults)",
    "Pathways to connect with real-world gynecologists, clinics & hospitals"
  ];

  const revenueStreams = [
    { stream: "B2B Lead Generation + API Partnerships", description: "Connect users to healthcare providers" },
    { stream: "Sponsored Credible Content", description: "Non-invasive, medically validated partnerships" },
    { stream: "Community-based Subscriptions", description: "Premium features and exclusive content" },
  ];

  const fundingBreakdown = [
    { item: "Brand Acquisition (Gyno.com)", amount: "INR 87L", timeline: "Q1" },
    { item: "Founder Salaries (CEO + CMO)", amount: "INR 66.42L", timeline: "18 months" },
    { item: "CTO Salary", amount: "INR 43.2L", timeline: "18 months" },
    { item: "Full Stack Developer", amount: "INR 27L", timeline: "18 months" },
    { item: "MedOps + BD Lead", amount: "INR 21.6L", timeline: "18 months" },
    { item: "Community & Social Media Lead", amount: "INR 21.6L", timeline: "18 months" },
    { item: "AI API Costs (Gemini Tier 2)", amount: "INR 15L", timeline: "18 months" },
    { item: "Brand, Product Marketing & PR", amount: "INR 72L", timeline: "18 months" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity">
              <Heart className="h-6 w-6" />
              <span className="text-xl font-bold">GYNO.APP</span>
            </Link>
            <Badge variant="outline" className="hidden sm:block">For Investors</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Gyno.app
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            AI-Powered Women's Health Companion
          </p>
          <p className="text-lg font-medium">
            Unbiased. Credible. Confidential.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-muted-foreground">
            <span>Presented by Shomprakash Sinha Roy</span>
            <span className="hidden sm:block">•</span>
            <span>www.gyno.app</span>
            <span className="hidden sm:block">•</span>
            <span>shomprakash@gmail.com</span>
          </div>
        </div>

        {/* The Problem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="h-6 w-6" />
              The Problem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {problemStats.map((stat, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                  <p className="text-sm md:text-base">{stat}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* The Solution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Heart className="h-6 w-6" />
              The Solution
            </CardTitle>
            <CardDescription>
              Gyno.app — An AI-native platform offering:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 mb-6">
              {solutionPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                  <p className="text-sm md:text-base">{point}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Live, tested MVP:</p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://gyno.app" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Platform
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Market Opportunity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6" />
              Market Opportunity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.map((data, index) => (
                <div key={index} className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-2">{data.value}</div>
                  <div className="text-sm font-medium mb-1">{data.label}</div>
                  <div className="text-xs text-muted-foreground">{data.source}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm font-medium">
                Path to own top-of-funnel health queries for women
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DollarSign className="h-6 w-6" />
              Revenue & Growth Model
            </CardTitle>
            <CardDescription>
              AI pre-screen layer → referral & consult pipeline to hyperlocal gynecologists, 
              maternity hospitals, IVF/OB-GYN/Endocrine/PCOS clinics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold">Monetization Streams:</h3>
              {revenueStreams.map((revenue, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{revenue.stream}</h4>
                  <p className="text-sm text-muted-foreground">{revenue.description}</p>
                </div>
              ))}
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="font-medium">Long-term Vision:</p>
                <p className="text-sm">AI as first touchpoint for every female health query in India</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funding Ask */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="h-6 w-6" />
              Funding Ask & Utilization
            </CardTitle>
            <CardDescription>
              ASK: INR 3.6 Cr (~$430K) against 9% SAFE
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 mb-6">
              {fundingBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{item.item}</div>
                    <div className="text-xs text-muted-foreground">{item.timeline}</div>
                  </div>
                  <div className="font-semibold">{item.amount}</div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="font-medium">Total Utilization: Supports 6 core team members + infra + branding + GTM</p>
              <p className="text-sm">Runway: 18 months to PMF, monetization & revenue loops</p>
            </div>
          </CardContent>
        </Card>

        {/* Founder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-6 w-6" />
              Why Us
            </CardTitle>
            <CardDescription>Shomprakash Sinha Roy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="font-medium">Storyteller-turned-tech founder</p>
                  <p className="text-sm">Ex-CMO at Onco.com, Colive, Graviton, AppLayer, ex-Dell, Amagi Legacy Global</p>
                  <p className="text-sm">Built India's top oncology platform from ground up (Onco)</p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm">PR Magnet: International Young Achiever's Award (Media & Comms)</p>
                  <p className="text-sm">Ex Dell | Published Author | India's most recognised face in crypto</p>
                  <p className="text-sm">AI-native thinker who "vibe-coded" the fully functional Gyno MVP solo</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://bit.ly/web3guy" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn More
                  </a>
                </Button>
                <p className="text-sm text-muted-foreground self-center">
                  Born to build for women, with women, in the age of AI
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Women's Healthcare?</h2>
            <p className="mb-6 opacity-90">
              Join us in building the future of AI-powered women's health
            </p>
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:shomprakash@gmail.com">
                <Mail className="h-4 w-4 mr-2" />
                Contact: shomprakash@gmail.com
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}