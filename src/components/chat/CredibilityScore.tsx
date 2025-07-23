import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";

interface CredibilityScoreProps {
  score: number;
}

export const CredibilityScore = ({ score }: CredibilityScoreProps) => {
  const getScoreConfig = (score: number) => {
    if (score >= 90) {
      return {
        variant: 'default' as const,
        icon: ShieldCheck,
        label: 'High',
        color: 'text-credibility-high',
        bgColor: 'bg-credibility-high/10'
      };
    } else if (score >= 70) {
      return {
        variant: 'secondary' as const,
        icon: Shield,
        label: 'Medium',
        color: 'text-credibility-medium',
        bgColor: 'bg-credibility-medium/10'
      };
    } else {
      return {
        variant: 'destructive' as const,
        icon: ShieldAlert,
        label: 'Low',
        color: 'text-credibility-low',
        bgColor: 'bg-credibility-low/10'
      };
    }
  };

  const config = getScoreConfig(score);
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-1">
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded border backdrop-blur-sm text-xs font-mono ${config.bgColor} border-${config.color.replace('text-', '')}/30`}>
        <Icon className={`h-3 w-3 ${config.color} animate-pulse`} />
        <span className={`${config.color} font-bold`}>
          [{score}%]
        </span>
      </div>
    </div>
  );
};