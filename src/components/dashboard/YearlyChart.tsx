import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceDot, Area, AreaChart, Tooltip, Legend, CartesianGrid } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStock } from '../../context/StockContext';
import { useMemo } from 'react';

export const YearlyChart = () => {
  const { stockItems } = useStock();

  const generateMonthlyStockData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const monthlyData: { month: string; totalStock: number }[] = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(currentYear, i).toLocaleString('id-ID', { month: 'short' }),
      totalStock: 0,
    }));

    stockItems.forEach(item => {
      const currentStock = item.stokMasuk - item.stokKeluar;
      // Distribute current stock evenly across all months for a basic visualization
      monthlyData.forEach(month => {
        month.totalStock += currentStock / 12;
      });
    });

    return monthlyData;
  }, [stockItems]);

  const latestMonthData = generateMonthlyStockData[new Date().getMonth()];
  const latestStockValue = latestMonthData ? latestMonthData.totalStock : 0;
  const latestMonthName = latestMonthData ? latestMonthData.month : '';

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-card-border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-ink">Ringkasan Stok Tahunan</CardTitle>
        <Select defaultValue="yearly">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">Tahunan</SelectItem>
            {/* <SelectItem value="monthly">Bulanan</SelectItem> */}
            {/* <SelectItem value="weekly">Mingguan</SelectItem> */}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={generateMonthlyStockData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="totalStock"
                stroke="hsl(211, 100%, 50%)"
                strokeWidth={2}
                fill="url(#chartGradient)"
                name="Total Stok"
              />
              <Line
                type="monotone"
                dataKey="totalStock"
                stroke="hsl(211, 100%, 50%)"
                strokeWidth={2}
                dot={false}
              />
              {latestMonthData && (
                <ReferenceDot 
                  x={latestMonthName} 
                  y={latestStockValue} 
                  r={4} 
                  fill="hsl(211, 100%, 50%)" 
                  stroke="white" 
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Chart annotation */}
          {latestMonthData && (
            <div className="absolute top-8 right-20 bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium text-ink border border-card-border">
              {latestStockValue.toLocaleString('id-ID')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
