import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, AlertCircle, Lightbulb } from "lucide-react";

interface Insight {
  id: string;
  type: 'pattern' | 'concern' | 'recommendation';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
}

interface InsightSummaryProps {
  insights: Insight[];
  lastUpdated?: Date;
}

export const InsightSummary = ({ insights, lastUpdated }: InsightSummaryProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pattern': return Activity;
      case 'concern': return AlertCircle;
      case 'recommendation': return Lightbulb;
      default: return Activity;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (insights.length === 0) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No insights available yet. Add some data to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-glow bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Lightbulb className="h-5 w-5" />
            Health Insights
          </CardTitle>
          {lastUpdated && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Updated {lastUpdated.toLocaleDateString()}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => {
          const Icon = getIcon(insight.type);
          return (
            <div key={insight.id} className="p-4 rounded-lg border border-border/50 bg-background/30">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary mt-0.5" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{insight.title}</h4>
                    {insight.severity && (
                      <Badge className={`text-xs ${getSeverityColor(insight.severity)}`}>
                        {insight.severity}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};