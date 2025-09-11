import { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Menu } from 'lucide-react';
import { exportToXLSX } from '@/lib/exportUtils';
import { useIsMobile } from '../hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface ReportItem {
  id: number;
  reportName: string;
  dateGenerated: string;
  status: string;
  actions: string;
}

const mockReports: ReportItem[] = [
  { id: 1, reportName: 'Laporan Penjualan Bulanan', dateGenerated: '2024-09-01', status: 'Selesai', actions: 'Unduh' },
  { id: 2, reportName: 'Laporan Penggunaan Bahan Baku', dateGenerated: '2024-08-25', status: 'Selesai', actions: 'Unduh' },
  { id: 3, reportName: 'Laporan Pergerakan Stok', dateGenerated: '2024-08-20', status: 'Tertunda', actions: 'Hasilkan' },
  { id: 4, reportName: 'Ringkasan Transaksi Harian', dateGenerated: '2024-08-19', status: 'Selesai', actions: 'Unduh' },
];

const AllReports = () => {
  const isMobile = useIsMobile();
  const [reports, setReports] = useState<ReportItem[]>(mockReports);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false); // State for sidebar drawer

  return (
    <div className="min-h-screen bg-white flex">
      {isMobile ? (
        <Drawer open={isSidebarDrawerOpen} onOpenChange={setIsSidebarDrawerOpen} direction="left">
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-[260px] h-full mt-0 rounded-none">
            <Sidebar />
          </DrawerContent>
        </Drawer>
      ) : (
        <Sidebar />
      )}
      <div className={`flex-1 ${!isMobile ? 'ml-[260px]' : ''}`}>
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-ink">Semua Laporan</h1>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => exportToXLSX(reports, 'all_reports.xlsx')}>
                <Download className="w-4 h-4 mr-2" />
                Ekspor Semua
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Laporan Tersedia</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Laporan</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.reportName}</TableCell>
                      <TableCell>{report.dateGenerated}</TableCell>
                      <TableCell>{report.status}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          {report.actions}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AllReports;
