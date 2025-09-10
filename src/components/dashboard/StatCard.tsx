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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-card-border p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-ink/70 text-sm font-medium mb-2">{title}</h3>
          <div className="text-3xl font-semibold text-ink mb-2">{value}</div>
          <a href="#" className="text-xs text-ink/60 hover:text-ink transition-colors">
            {subtitle}
          </a>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColorClasses[iconColor]}`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
};