// FILE: src/components/dashboard/RiskScoreCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

// Update component to accept score as a prop
export function RiskScoreCard({ score }: { score: number }) {
  // Use the passed-in score
  const riskScore = score;
  
  // Determine risk level based on score
  let riskLevel = "low risk";
  let colorClass = "text-success";
  let strokeColor = "var(--success)";
  if (riskScore < 70) {
    riskLevel = "medium risk";
    colorClass = "text-warning";
    strokeColor = "var(--warning)";
  }
  if (riskScore < 40) {
    riskLevel = "high risk";
    colorClass = "text-danger";
    strokeColor = "var(--danger)";
  }

  return (
    <Card className="shadow-card bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className={`h-5 w-5 ${colorClass}`} />
          Portfolio Risk Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                // Use the dynamically calculated stroke color
                stroke={`hsl(${strokeColor})`}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(riskScore / 100) * 352} 352`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold ${colorClass}`}>{riskScore}</span>
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            Your portfolio is currently at <span className={`${colorClass} font-semibold`}>{riskLevel}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
