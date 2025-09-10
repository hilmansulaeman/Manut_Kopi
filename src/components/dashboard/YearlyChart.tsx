import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceDot, Area, AreaChart } from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = [
  { month: 'Jan', value: 8000000 },
  { month: 'Feb', value: 9200000 },
  { month: 'Mar', value: 7800000 },
  { month: 'Apr', value: 11000000 },
  { month: 'May', value: 12500000 },
  { month: 'Jun', value: 10800000 },
  { month: 'Jul', value: 13200000 },
  { month: 'Aug', value: 14100000 },
  { month: 'Sep', value: 15450000 },
  { month: 'Oct', value: 12900000 },
  { month: 'Nov', value: 11700000 },
  { month: 'Des', value: 13800000 },
];

export const YearlyChart = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-card-border p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-ink">Yearly Receive Spending</h2>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-ink hover:bg-black/5 rounded-lg transition-colors">
          <span>Yearly</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#313131' }}
            />
            <YAxis hide />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(211, 100%, 50%)"
              strokeWidth={2}
              fill="url(#chartGradient)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(211, 100%, 50%)"
              strokeWidth={2}
              dot={false}
            />
            <ReferenceDot 
              x="Sep" 
              y={15450000} 
              r={4} 
              fill="hsl(211, 100%, 50%)" 
              stroke="white" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Chart annotation */}
        <div className="absolute top-8 right-20 bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium text-ink border border-card-border">
          15.450.000
        </div>
      </div>
    </div>
  );
};