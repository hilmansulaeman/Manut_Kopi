import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface StockItem {
  id: number;
  kodeBahanBaku: string;
  kodeBahanBaku2: string;
  supplier: string;
  stokMasuk: string;
  stokKeluar: string;
  status: string;
  statusColor: 'green' | 'orange';
}

const stockData: StockItem[] = [
  {
    id: 1,
    kodeBahanBaku: 'Mesin Fotokopi x230',
    kodeBahanBaku2: 'PMX230',
    supplier: 'Canon Indonesia',
    stokMasuk: '50 Unit',
    stokKeluar: '47 Unit',
    status: '3 Pcs',
    statusColor: 'green',
  },
  {
    id: 2,
    kodeBahanBaku: 'Asus X541U',
    kodeBahanBaku2: 'ASX541U',
    supplier: 'Asus Indonesia',
    stokMasuk: '25 Unit',
    stokKeluar: '22 Unit',
    status: '3 Pcs',
    statusColor: 'orange',
  },
  {
    id: 3,
    kodeBahanBaku: 'Iphone 17 Projo',
    kodeBahanBaku2: 'IP17PRO',
    supplier: 'Apple Store',
    stokMasuk: '15 Unit',
    stokKeluar: '12 Unit',
    status: '3 Pcs',
    statusColor: 'green',
  },
  {
    id: 4,
    kodeBahanBaku: 'Samsung Belsayur',
    kodeBahanBaku2: 'SMBEL',
    supplier: 'Samsung Indonesia',
    stokMasuk: '30 Unit',
    stokKeluar: '27 Unit',
    status: '3 Pcs',
    statusColor: 'green',
  },
];

const statusColors = {
  green: 'bg-status-green/10 text-status-green border-status-green/20',
  orange: 'bg-status-orange/10 text-status-orange border-status-orange/20',
};

export const StockTable = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-card-border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-ink">Penerimaan / Pengeluaran Stok</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-ink/70">No</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-ink/70">Kode bahan baku</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-ink/70">Kode bahan baku</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-ink/70">Pemasok</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-ink/70">Stok Masuk</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-ink/70">Stok Keluar</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-ink/70">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.map((item) => (
                <TableRow key={item.id} className="border-b border-card-border/50 hover:bg-black/2 transition-colors">
                  <TableCell className="py-3 px-4 text-sm text-ink">{item.id}</TableCell>
                  <TableCell className="py-3 px-4 text-sm font-medium text-ink">{item.kodeBahanBaku}</TableCell>
                  <TableCell className="py-3 px-4 text-sm text-ink/70">{item.kodeBahanBaku2}</TableCell>
                  <TableCell className="py-3 px-4 text-sm text-ink/70">{item.supplier}</TableCell>
                  <TableCell className="py-3 px-4 text-sm text-ink/70">{item.stokMasuk}</TableCell>
                  <TableCell className="py-3 px-4 text-sm text-ink/70">{item.stokKeluar}</TableCell>
                  <TableCell className="py-3 px-4">
                    <Badge className={`${statusColors[item.statusColor]}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
