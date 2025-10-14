import { useState } from 'react';
import { Sidebar } from '../dashboard/Sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Download, Menu, Eye } from 'lucide-react';
import { exportToXLSX } from '../../lib/exportUtils';
import { useDevice } from '../../hooks/use-device';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStock } from '../../context/StockContext';
import { useSidebar } from '../../context/SidebarContext';

interface ReportItem {
  id: number;
  reportName: string;
  dateGenerated: string;
  status: string;
  actions: string;
}

interface AllReportsProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

const mockReports: ReportItem[] = [
  { id: 1, reportName: 'Laporan Penjualan Bulanan', dateGenerated: '2024-09-01', status: 'Selesai', actions: 'Unduh' },
  { id: 2, reportName: 'Laporan Penggunaan Bahan Baku', dateGenerated: '2024-08-25', status: 'Selesai', actions: 'Unduh' },
  { id: 3, reportName: 'Laporan Pergerakan Stok', dateGenerated: '2024-08-20', status: 'Tertunda', actions: 'Hasilkan' },
  { id: 4, reportName: 'Ringkasan Transaksi Harian', dateGenerated: '2024-08-19', status: 'Selesai', actions: 'Unduh' },
];

const AllReports: React.FC<AllReportsProps> = ({ onLogout, onMenuChange }) => {
  const { isMobileOrTablet, isMobile, isTablet } = useDevice();
  const { stockItems } = useStock();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [reports] = useState<ReportItem[]>(mockReports);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Generate monthly stock data for the current year
  const generateMonthlyStockData = () => {
    const currentYear = new Date().getFullYear();
    const monthlyData: { name: string; totalStock: number }[] = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(currentYear, i).toLocaleString('id-ID', { month: 'short' }),
      totalStock: 0,
    }));

    stockItems.forEach(item => {
      // For simplicity, let's assume stock changes are not tracked by date in StockItem
      // We'll just distribute the current stock across months for visualization
      // In a real application, you would have dated stock transactions
      const currentStock = item.stokMasuk - item.stokKeluar;
      // Distribute current stock evenly across all months for a basic visualization
      // This is a placeholder and should be replaced with actual historical data if available
      monthlyData.forEach(month => {
        month.totalStock += currentStock / 12; // Even distribution
      });
    });

    return monthlyData;
  };

  const monthlyStockData = generateMonthlyStockData();

  return (
    <div className="min-h-screen bg-white flex font-sans text-[#313131]">
      {isMobileOrTablet ? (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[260px]">
            <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
            <SheetDescription className="sr-only">
              Menu navigasi sidebar untuk aplikasi MANUT KOPI
            </SheetDescription>
            <Sidebar onLogout={onLogout} activeMenu="all-reports" onMenuChange={onMenuChange} />
          </SheetContent>
        </Sheet>
      ) : (
        <div className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>
          <Sidebar 
            onLogout={onLogout} 
            activeMenu="all-reports" 
            onMenuChange={onMenuChange}
            isCollapsed={isCollapsed}
            onCollapseChange={setIsCollapsed}
          />
        </div>
      )}
      <div className={`flex-1 transition-all duration-300 ${!isMobileOrTablet ? (isCollapsed ? 'ml-[80px]' : 'ml-[260px]') : ''}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-[#313131]">Semua Laporan</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full md:w-[180px] bg-white border border-black/5">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => exportToXLSX(reports, 'all_reports.xlsx')}
                className="bg-[#313131] text-white hover:bg-[#313131]/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Ekspor Semua
              </Button>
            </div>
          </div>

          <Card className="mb-6 border border-[#e8e8e8] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#313131]">Grafik Stok Bulanan ({new Date().getFullYear()})</CardTitle>
              <CardDescription className="text-[#717182]">Menampilkan total stok bahan baku per bulan.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={monthlyStockData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#717182"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#717182"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalStock" 
                      stroke="#313131" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                      name="Total Stok" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#e8e8e8] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#313131]">Laporan Tersedia</CardTitle>
              <CardDescription className="text-[#717182]">
                Daftar laporan yang dapat diunduh atau dihasilkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#e8e8e8]">
                      <TableHead className="text-[#313131]">Nama Laporan</TableHead>
                      <TableHead className="text-[#313131]">Tanggal Dibuat</TableHead>
                      <TableHead className="text-[#313131]">Status</TableHead>
                      <TableHead className="text-[#313131]">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id} className="border-b border-[#e8e8e8] hover:bg-[#f9f9f9]">
                        <TableCell className="text-[#313131]">{report.reportName}</TableCell>
                        <TableCell className="text-[#717182]">{report.dateGenerated}</TableCell>
                        <TableCell>
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                              report.status === 'Selesai' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {report.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border border-black/5 text-[#313131] hover:bg-black/5"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {report.actions}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AllReports;
