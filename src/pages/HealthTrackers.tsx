import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrackerInput } from "@/components/TrackerInput";
import { InsightSummary } from "@/components/InsightSummary";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart, Baby, Flower2, Calendar, Activity } from "lucide-react";
import { Navigate } from "react-router-dom";

interface TrackerData {
  id: string;
  user_id: string;
  tracker_type: 'period' | 'pregnancy' | 'menopause' | 'ovulation';
  data: any;
  insights: any[];
  created_at: string;
  updated_at: string;
}

const HealthTrackers = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('period');
  const [trackerData, setTrackerData] = useState<TrackerData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTrackerData();
    }
  }, [user]);

  const fetchTrackerData = async () => {
    try {
      const { data, error } = await supabase
        .from('tracker_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setTrackerData(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load tracker data",
        variant: "destructive",
      });
    }
  };

  const processAIInput = async (input: string, trackerType: string) => {
    setLoading(true);
    try {
      // Call Gemini API to process natural language input
      const response = await fetch('/api/process-health-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, trackerType, userId: user?.id }),
      });

      if (!response.ok) throw new Error('Failed to process input');

      const result = await response.json();
      
      // Save processed data to Supabase
      const { data, error } = await supabase
        .from('tracker_data')
        .upsert({
          user_id: user?.id,
          tracker_type: trackerType,
          data: result.data,
          insights: result.insights,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await fetchTrackerData();
      toast({
        title: "Success",
        description: "Health data processed and insights generated!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process input",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrackerData = (type: string) => {
    return trackerData.find(t => t.tracker_type === type);
  };

  const trackerTabs = [
    {
      id: 'period',
      label: 'Period Tracker',
      icon: Heart,
      color: 'text-red-500',
      placeholder: `Tell me about your recent period cycle in natural language. For example:

"My last period started on January 15th and lasted 5 days. I had moderate cramps on the first two days, some bloating, and felt more tired than usual. My cycle is usually around 28 days."

Include:
- Start and end dates
- Flow intensity (light/moderate/heavy)
- Symptoms (cramps, bloating, mood changes, etc.)
- Any unusual patterns or concerns`,
    },
    {
      id: 'pregnancy',
      label: 'Pregnancy Tracker',
      icon: Baby,
      color: 'text-pink-500',
      placeholder: `Share your pregnancy updates in natural language. For example:

"I'm 12 weeks pregnant. This week I had mild morning sickness in the mornings, some food aversions to coffee, and I've been craving citrus fruits. My energy levels are slowly improving. Last appointment blood pressure was normal."

Include:
- Current week/trimester
- Symptoms and changes
- Cravings or aversions
- Appointment updates
- Any concerns or questions`,
    },
    {
      id: 'menopause',
      label: 'Menopause Support',
      icon: Flower2,
      color: 'text-purple-500',
      placeholder: `Describe your menopause journey and symptoms. For example:

"I haven't had a period for 8 months now. This week I had 3 hot flashes, some night sweats that disrupted my sleep, and I've been feeling more anxious than usual. I'm taking calcium supplements and doing yoga for stress."

Include:
- Menstruation patterns
- Hot flashes and night sweats
- Sleep and mood changes
- Current treatments or supplements
- Lifestyle adjustments`,
    },
    {
      id: 'ovulation',
      label: 'Ovulation Tracker',
      icon: Calendar,
      color: 'text-green-500',
      placeholder: `Track your ovulation and fertility signs. For example:

"I'm on day 14 of my cycle. I noticed clear, stretchy cervical mucus today and had some mild cramping on my left side. My basal temperature spiked this morning. We're trying to conceive and have been timing intercourse."

Include:
- Cycle day and length
- Cervical mucus changes
- Basal body temperature
- Ovulation pain or signs
- Fertility goals or concerns`,
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Health Trackers</h1>
          <p className="text-muted-foreground">
            Track your health journey with AI-powered insights and personalized guidance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-card/50 backdrop-blur-sm">
            {trackerTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className={`h-4 w-4 ${tab.color}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {trackerTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <TrackerInput
                title={`${tab.label} - AI Input`}
                placeholder={tab.placeholder}
                onSubmit={(input) => processAIInput(input, tab.id)}
                loading={loading}
              />

              <InsightSummary
                insights={getTrackerData(tab.id)?.insights || []}
                lastUpdated={getTrackerData(tab.id) ? new Date(getTrackerData(tab.id)!.updated_at) : undefined}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default HealthTrackers;