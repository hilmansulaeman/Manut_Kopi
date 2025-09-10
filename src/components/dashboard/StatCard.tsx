import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  iconColor: 'green' | 'blue' | 'pink';
  icon: string;
}

const iconColorClasses = {
  green: 'bg-status-green/10 text-status-green',
  blue: 'bg-status-blue/10 text-status-blue',
  pink: 'bg-status-pink/10 text-status-pink',
};

export const StatCard = ({ title, value, subtitle, iconColor, icon }: StatCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-card-border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex-1">
          <CardTitle className="text-ink/70 text-sm font-medium">{title}</CardTitle>
          <div className="text-3xl font-semibold text-ink mt-1">{value}</div>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColorClasses[iconColor]}`}>
          <span className="text-lg">{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Link to="#" className="text-xs text-ink/60 hover:text-ink transition-colors">
          {subtitle}
        </Link>
      </CardContent>
    </Card>
  );
};
