import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Search, Filter, X } from "lucide-react";
import { useStock, StockOutTransaction } from "../../context/StockContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

export function StockTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const { stockItems, stockOutTransactions } = useStock();

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => 
    Array.from(new Set(stockItems.map(item => item.status))).sort(),
    [stockItems]
  );

  const uniqueSuppliers = useMemo(() => 
    Array.from(new Set(stockItems.map(item => item.supplier))).sort(),
    [stockItems]
  );

  const uniqueUnits = useMemo(() => 
    Array.from(new Set(stockItems.map(item => item.unit))).sort(),
    [stockItems]
  );

  // Apply filters
  const filteredData = useMemo(() => {
    return stockItems.filter(item => {
      // Search filter
      const matchesSearch = 
        item.kodeBahanBaku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kodeBahanBaku2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(item.status);

      // Supplier filter
      const matchesSupplier = selectedSuppliers.length === 0 || selectedSuppliers.includes(item.supplier);

      // Unit filter
      const matchesUnit = selectedUnits.length === 0 || selectedUnits.includes(item.unit);

      return matchesSearch && matchesStatus && matchesSupplier && matchesUnit;
    });
  }, [stockItems, searchQuery, selectedStatuses, selectedSuppliers, selectedUnits]);

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleSupplierToggle = (supplier: string) => {
    setSelectedSuppliers(prev =>
      prev.includes(supplier) ? prev.filter(s => s !== supplier) : [...prev, supplier]
    );
  };

  const handleUnitToggle = (unit: string) => {
    setSelectedUnits(prev =>
      prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedSuppliers([]);
    setSelectedUnits([]);
  };

  const activeFilterCount = selectedStatuses.length + selectedSuppliers.length + selectedUnits.length;

  return (
    <Card className="border border-[#e8e8e8] shadow-sm rounded-[16px] bg-white">
      <CardHeader className="px-3 sm:px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="font-['Inter:Bold',_sans-serif] text-lg sm:text-[22px] text-[#313131]">
            Data Inventori
          </CardTitle>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7d7d7d]" size={16} />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-['Inter:Regular',_sans-serif] text-[14px] pl-10 pr-4 py-2 border border-[#e8e8e8] rounded-[12px] bg-[#fafafa] text-[#313131] placeholder:text-[#7d7d7d] focus:outline-none focus:ring-2 focus:ring-[#578e7e]/20 focus:border-[#578e7e] w-full sm:w-[200px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#578e7e] text-white rounded-[12px] font-['Inter:Medium',_sans-serif] text-[14px] hover:bg-[#4a7a6d] transition-colors whitespace-nowrap relative">
                  <Filter size={16} />
                  <span className="hidden sm:inline">Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#f5a623] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px] max-h-[400px] overflow-y-auto">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel className="p-0">Filter Data</DropdownMenuLabel>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-[12px] text-[#578e7e] hover:text-[#4a7a6d] font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <DropdownMenuSeparator />

                {/* Status Filter */}
                <div className="px-2 py-2">
                  <p className="text-[12px] font-medium text-[#7d7d7d] mb-2">Status</p>
                  {uniqueStatuses.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => handleStatusToggle(status)}
                      className="text-[13px]"
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
                <DropdownMenuSeparator />

                {/* Supplier Filter */}
                <div className="px-2 py-2">
                  <p className="text-[12px] font-medium text-[#7d7d7d] mb-2">Pemasok</p>
                  {uniqueSuppliers.map((supplier) => (
                    <DropdownMenuCheckboxItem
                      key={supplier}
                      checked={selectedSuppliers.includes(supplier)}
                      onCheckedChange={() => handleSupplierToggle(supplier)}
                      className="text-[13px]"
                    >
                      {supplier}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
                <DropdownMenuSeparator />

                {/* Unit Filter */}
                <div className="px-2 py-2">
                  <p className="text-[12px] font-medium text-[#7d7d7d] mb-2">Unit</p>
                  {uniqueUnits.map((unit) => (
                    <DropdownMenuCheckboxItem
                      key={unit}
                      checked={selectedUnits.includes(unit)}
                      onCheckedChange={() => handleUnitToggle(unit)}
                      className="text-[13px]"
                    >
                      {unit}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedStatuses.map((status) => (
              <Badge
                key={`status-${status}`}
                variant="secondary"
                className="bg-[#578e7e]/10 text-[#578e7e] hover:bg-[#578e7e]/20 flex items-center gap-1"
              >
                {status}
                <button
                  onClick={() => handleStatusToggle(status)}
                  className="ml-1 hover:bg-[#578e7e]/30 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
            {selectedSuppliers.map((supplier) => (
              <Badge
                key={`supplier-${supplier}`}
                variant="secondary"
                className="bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6]/20 flex items-center gap-1"
              >
                {supplier}
                <button
                  onClick={() => handleSupplierToggle(supplier)}
                  className="ml-1 hover:bg-[#3b82f6]/30 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
            {selectedUnits.map((unit) => (
              <Badge
                key={`unit-${unit}`}
                variant="secondary"
                className="bg-[#ec4899]/10 text-[#ec4899] hover:bg-[#ec4899]/20 flex items-center gap-1"
              >
                {unit}
                <button
                  onClick={() => handleUnitToggle(unit)}
                  className="ml-1 hover:bg-[#ec4899]/30 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-6">
        {/* Results Count */}
        <div className="mb-4 text-[13px] text-[#7d7d7d]">
          Menampilkan <span className="font-medium text-[#313131]">{filteredData.length}</span> dari <span className="font-medium text-[#313131]">{stockItems.length}</span> data
        </div>

        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="border-b border-[#e8e8e8] hover:bg-transparent">
                <TableHead className="font-['Inter:Medium',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">ID</TableHead>
                <TableHead className="font-['Inter:Medium',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">Nama Bahan</TableHead>
                <TableHead className="font-['Inter:Medium',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">Kode</TableHead>
                <TableHead className="font-['Inter:Medium',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">Pemasok</TableHead>
                <TableHead className="font-['Inter:Medium',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">Stok Awal</TableHead>
                <TableHead className="font-['Inter:Medium',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">Jumlah Keluar</TableHead>
                <TableHead className="font-['Inter:Medium',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">Stok Saat Ini</TableHead>
                <TableHead className="font-['Inter:Medium',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">Unit</TableHead>
                <TableHead className="font-['Inter:Medium',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => {
                const totalKeluar = stockOutTransactions
                  .filter(transaction => transaction.stockItemId === item.id)
                  .reduce((sum, transaction) => sum + transaction.jumlah, 0);
                
                return (
                  <TableRow key={item.id} className="border-b border-[#e8e8e8] hover:bg-[#fafafa] transition-colors">
                    <TableCell className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#313131] px-4 py-4">{item.id}</TableCell>
                    <TableCell className="font-['Inter:Medium',_sans-serif] text-[14px] text-[#313131] px-4 py-4">{item.kodeBahanBaku}</TableCell>
                    <TableCell className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">{item.kodeBahanBaku2}</TableCell>
                    <TableCell className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">{item.supplier}</TableCell>
                    <TableCell className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#313131] px-4 py-4">{item.stokMasuk}</TableCell>
                    <TableCell className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#313131] px-4 py-4">{totalKeluar}</TableCell>
                    <TableCell className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#313131] px-4 py-4">{item.currentStock}</TableCell>
                    <TableCell className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#7d7d7d] px-4 py-4">{item.unit}</TableCell>
                    <TableCell className="px-4 py-4">
                      <span className={`inline-flex px-3 py-1.5 rounded-[20px] font-['Inter:Medium',_sans-serif] text-[12px] ${
                        item.statusColor === 'green'
                          ? "bg-[#578e7e]/10 text-[#578e7e]" 
                          : item.statusColor === 'orange'
                          ? "bg-[#f5a623]/10 text-[#f5a623]"
                          : "bg-[#e93232]/10 text-[#e93232]"
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
