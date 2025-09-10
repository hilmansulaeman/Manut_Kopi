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
    kodeBahanBaku: 'Photocopy machine x230',
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-card-border p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <h2 className="text-lg font-semibold text-ink mb-6">Stock Receipt / Issued</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-card-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">No</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Kode bahan baku</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Kode bahan baku</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Supplier</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Stok Masuk</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Stok Keluar</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Status</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((item) => (
              <tr key={item.id} className="border-b border-card-border/50 hover:bg-black/2 transition-colors">
                <td className="py-3 px-4 text-sm text-ink">{item.id}</td>
                <td className="py-3 px-4 text-sm font-medium text-ink">{item.kodeBahanBaku}</td>
                <td className="py-3 px-4 text-sm text-ink/70">{item.kodeBahanBaku2}</td>
                <td className="py-3 px-4 text-sm text-ink/70">{item.supplier}</td>
                <td className="py-3 px-4 text-sm text-ink/70">{item.stokMasuk}</td>
                <td className="py-3 px-4 text-sm text-ink/70">{item.stokKeluar}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[item.statusColor]}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};