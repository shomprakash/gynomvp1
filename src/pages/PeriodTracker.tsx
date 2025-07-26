import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Heart, Calendar as CalendarIcon, TrendingUp, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

interface PeriodCycle {
  id: string;
  cycle_start_date: string;
  period_start_date: string;
  period_end_date?: string;
  ovulation_date?: string;
}

interface Symptom {
  id: string;
  date: string;
  symptom_type: string;
  severity: number;
  notes?: string;
}

export default function PeriodTracker() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [cycles, setCycles] = useState<PeriodCycle[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [activeTab, setActiveTab] = useState("calendar");

  // Form states
  const [periodStartDate, setPeriodStartDate] = useState<Date>(new Date());
  const [periodEndDate, setPeriodEndDate] = useState<Date | undefined>();
  const [ovulationDate, setOvulationDate] = useState<Date | undefined>();
  const [symptomSeverities, setSymptomSeverities] = useState({
    pms: 1,
    pmdd: 1,
    cramps: 1,
    mood: 1,
    energy: 1,
    bloating: 1,
    headache: 1,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      fetchData();
    }
  }, [user, loading]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const { data: cyclesData } = await supabase
        .from("period_cycles")
        .select("*")
        .eq("user_id", user.id)
        .order("cycle_start_date", { ascending: false });

      const { data: symptomsData } = await supabase
        .from("symptoms")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      setCycles(cyclesData || []);
      setSymptoms(symptomsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addPeriodCycle = async () => {
    if (!user) return;

    const cycleData = {
      user_id: user.id,
      cycle_start_date: format(periodStartDate, "yyyy-MM-dd"),
      period_start_date: format(periodStartDate, "yyyy-MM-dd"),
      period_end_date: periodEndDate ? format(periodEndDate, "yyyy-MM-dd") : null,
      ovulation_date: ovulationDate ? format(ovulationDate, "yyyy-MM-dd") : null,
    };

    const { error } = await supabase.from("period_cycles").insert(cycleData);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add period cycle",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Period cycle added successfully",
      });
      fetchData();
    }
  };

  const addSymptoms = async () => {
    if (!user) return;

    const symptomsToAdd = Object.entries(symptomSeverities).map(([type, severity]) => ({
      user_id: user.id,
      date: format(selectedDate, "yyyy-MM-dd"),
      symptom_type: type,
      severity,
    }));

    const { error } = await supabase.from("symptoms").upsert(symptomsToAdd);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add symptoms",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Symptoms recorded successfully",
      });
      fetchData();
    }
  };

  const getDateEvents = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const events = [];

    // Check for period days
    const periodDay = cycles.find(cycle => {
      const start = cycle.period_start_date;
      const end = cycle.period_end_date;
      return dateStr >= start && (!end || dateStr <= end);
    });
    if (periodDay) events.push("period");

    // Check for ovulation
    const ovulation = cycles.find(cycle => cycle.ovulation_date === dateStr);
    if (ovulation) events.push("ovulation");

    // Check for symptoms
    const daySymptoms = symptoms.filter(s => s.date === dateStr);
    if (daySymptoms.length > 0) events.push("symptoms");

    return events;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-primary hover:opacity-80 transition-opacity">
              <Heart className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold">Period Tracker</h1>
            <Badge variant="secondary">NEW!</Badge>
          </div>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="period">Log Period</TabsTrigger>
            <TabsTrigger value="symptoms">Track Symptoms</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Cycle Calendar
                </CardTitle>
                <CardDescription>
                  Track your periods, ovulation, and symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    period: (date) => getDateEvents(date).includes("period"),
                    ovulation: (date) => getDateEvents(date).includes("ovulation"),
                    symptoms: (date) => getDateEvents(date).includes("symptoms"),
                  }}
                  modifiersStyles={{
                    period: { backgroundColor: "#ef4444", color: "white" },
                    ovulation: { backgroundColor: "#22c55e", color: "white" },
                    symptoms: { backgroundColor: "#3b82f6", color: "white" },
                  }}
                />
                <div className="mt-4 flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Ovulation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span>Symptoms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="period" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Log Period Cycle</CardTitle>
                <CardDescription>
                  Record your menstrual cycle dates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Period Start Date</Label>
                    <Calendar
                      mode="single"
                      selected={periodStartDate}
                      onSelect={(date) => date && setPeriodStartDate(date)}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Period End Date (optional)</Label>
                    <Calendar
                      mode="single"
                      selected={periodEndDate}
                      onSelect={setPeriodEndDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ovulation Date (optional)</Label>
                    <Calendar
                      mode="single"
                      selected={ovulationDate}
                      onSelect={setOvulationDate}
                      className="rounded-md border"
                    />
                  </div>
                </div>
                <Button onClick={addPeriodCycle} className="w-full">
                  Add Period Cycle
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Track Symptoms</CardTitle>
                <CardDescription>
                  Rate your symptoms from 1-5 for {format(selectedDate, "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(symptomSeverities).map(([symptom, severity]) => (
                  <div key={symptom} className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="capitalize">{symptom.replace("_", " ")}</Label>
                      <Badge variant="outline">{severity}/5</Badge>
                    </div>
                    <Slider
                      value={[severity]}
                      onValueChange={(value) =>
                        setSymptomSeverities(prev => ({ ...prev, [symptom]: value[0] }))
                      }
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
                <Button onClick={addSymptoms} className="w-full">
                  Save Symptoms
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Cycle Insights
                </CardTitle>
                <CardDescription>
                  Your health summary and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Recent Cycles</h3>
                    {cycles.slice(0, 3).map((cycle) => (
                      <div key={cycle.id} className="p-3 border rounded-lg">
                        <p className="font-medium">
                          {format(new Date(cycle.period_start_date), "MMM d, yyyy")}
                        </p>
                        {cycle.period_end_date && (
                          <p className="text-sm text-muted-foreground">
                            Duration: {Math.ceil(
                              (new Date(cycle.period_end_date).getTime() - 
                               new Date(cycle.period_start_date).getTime()) / (1000 * 60 * 60 * 24)
                            )} days
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Symptom Patterns</h3>
                    <p className="text-sm text-muted-foreground">
                      Track symptoms over time to identify patterns and discuss with your healthcare provider.
                    </p>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        💡 <strong>Tip:</strong> Regular tracking helps identify your unique cycle patterns
                        and can be valuable information for medical consultations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}