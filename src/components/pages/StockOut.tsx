import { useState } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { TopBar } from "../dashboard/TopBar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Plus,
  Package,
  TrendingDown,
  User,
} from "lucide-react";
import { useStock } from "../../context/StockContext";
import { useSidebar } from "../../context/SidebarContext";
import { useDevice } from "../../hooks/use-device";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { toast } from "sonner@2.0.3";
import { Badge } from "../ui/badge";

interface StockOutProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

export default function StockOut({
  onLogout,
  onMenuChange,
}: StockOutProps) {
  const { isCollapsed } = useSidebar();
  const { isMobileOrTablet } = useDevice();
  const {
    stockItems,
    stockOutTransactions,
    addStockOutTransaction,
    getStockItemById,
  } = useStock();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStockItemId, setSelectedStockItemId] =
    useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [dibuatOleh, setDibuatOleh] = useState("");

  const totalTransaksi = stockOutTransactions.length;

  const handleSubmitTransaction = () => {
    if (!selectedStockItemId || !jumlah || !dibuatOleh) {
      toast.error(
        "Mohon lengkapi semua field yang wajib diisi",
      );
      return;
    }

    const selectedItem = getStockItemById(selectedStockItemId);
    if (!selectedItem) {
      toast.error("Bahan baku tidak ditemukan");
      return;
    }

    const jumlahNum = parseFloat(jumlah);
    if (isNaN(jumlahNum) || jumlahNum <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }

    const sisaStok = selectedItem.currentStock;
    if (jumlahNum > sisaStok) {
      toast.error(
        `Stok tidak mencukupi. Sisa stok: ${sisaStok} ${selectedItem.unit}`,
      );
      return;
    }

    addStockOutTransaction({
      stockItemId: selectedStockItemId,
      kodeBahanBaku: selectedItem.kodeBahanBaku,
      kodeBahanBaku2: selectedItem.kodeBahanBaku2,
      jumlah: jumlahNum,
      unit: selectedItem.unit,
      keterangan: keterangan || "-",
      dibuatOleh,
    });

    toast.success("Transaksi stok keluar berhasil dicatat");

    // Reset form
    setSelectedStockItemId("");
    setJumlah("");
    setKeterangan("");
    setDibuatOleh("");
    setIsDialogOpen(false);
  };

  const selectedItem = selectedStockItemId
    ? getStockItemById(selectedStockItemId)
    : null;
  const sisaStok = selectedItem
    ? selectedItem.currentStock
    : 0;

  const getMarginClass = () => {
    if (!isMobileOrTablet && isCollapsed) return "ml-[80px]";
    if (!isMobileOrTablet) return "ml-[280px]";
    return "ml-0";
  };

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      {/* Sidebar fixed (desktop) / inline (mobile) */}
      {!isMobileOrTablet ? (
        <div
          className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${
            isCollapsed ? "w-[80px]" : "w-[260px]"
          }`}
        >
          <Sidebar onMenuChange={onMenuChange} />
        </div>
      ) : (
        <Sidebar onMenuChange={onMenuChange} />
      )}

      {/* Content pushed by sidebar width */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isMobileOrTablet
            ? isCollapsed
              ? "ml-[80px]"
              : "ml-[260px]"
            : "ml-0"
        }`}
      >
        <TopBar />

        <main className="flex-1 overflow-y-auto">
          {/* Full width container (no mx-auto) just padding */}
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Page header */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[#313131]">
                  Transaksi Stok Keluar
                </h1>
                <p className="text-[14px] text-[#7d7d7d] mt-1">
                  Kelola dan catat penggunaan bahan baku
                </p>
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-[rgba(49,49,49,1)] hover:bg-[#4a7a6d] text-white rounded-[12px] flex items-center gap-2 shadow-sm"
              >
                <Plus size={18} />
                <span>Tambah Transaksi</span>
              </Button>
            </div>

            {/* Transactions card */}
            <Card className="border border-[#e8e8e8] shadow-sm rounded-[16px] bg-white">
              <CardHeader className="px-6 py-4 border-b border-[#e8e8e8]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[18px] text-[#313131]">
                    Riwayat Transaksi
                  </CardTitle>
                  <span className="text-[12px] text-[#7d7d7d]">
                    Total {totalTransaksi} transaksi
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {totalTransaksi === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full bg-[#fafafa] flex items-center justify-center mb-4">
                      <Package
                        size={32}
                        className="text-[#7d7d7d]"
                      />
                    </div>
                    <p className="text-[#313131] mb-1">
                      Belum ada transaksi
                    </p>
                    <p className="text-[14px] text-[#7d7d7d] mb-6 text-center max-w-sm">
                      Mulai catat penggunaan bahan baku dengan
                      menambahkan transaksi baru
                    </p>
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-[rgba(49,49,49,1)] hover:bg-[#4a7a6d] text-white rounded-[12px]"
                    >
                      <Plus size={18} className="mr-2" />
                      Tambah Transaksi Pertama
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <Table className="w-full min-w-[800px]">
                      <TableHeader>
                        <TableRow className="border-b border-black/5">
                          <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">
                            ID Transaksi
                          </TableHead>
                          <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">
                            Tanggal & Waktu
                          </TableHead>
                          <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">
                            Nama Bahan
                          </TableHead>
                          <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">
                            Kode
                          </TableHead>
                          <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">
                            Jumlah Keluar
                          </TableHead>
                          <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">
                            Keterangan
                          </TableHead>
                          <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">
                            Dibuat Oleh
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockOutTransactions.map(
                          (transaction) => (
                            <TableRow
                              key={transaction.id}
                              className="border-b border-black/50 transition-colors duration-200 hover:bg-black/10"
                            >
                              <TableCell className="py-3 px-4 text-sm text-[#313131]/70 whitespace-nowrap">
                                <span className="font-mono bg-black/5 px-2 py-1 rounded text-[12px]">
                                  #{transaction.id}
                                </span>
                              </TableCell>
                              <TableCell className="py-3 px-4 text-sm text-[#313131] whitespace-nowrap">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-medium">
                                    {transaction.tanggal}
                                  </span>
                                  <span className="text-[12px] text-[#7d7d7d]">
                                    {transaction.waktu}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-[14px] text-[#313131] py-3 px-4 whitespace-nowrap">
                                {transaction.kodeBahanBaku}
                              </TableCell>
                              <TableCell className="text-[13px] text-[#7d7d7d] py-3 px-4 whitespace-nowrap">
                                {transaction.kodeBahanBaku2}
                              </TableCell>
                              <TableCell className="py-3 px-4 whitespace-nowrap">
                                <Badge
                                  variant="secondary"
                                  className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 rounded-md"
                                >
                                  <TrendingDown
                                    size={14}
                                    className="mr-1.5"
                                  />
                                  {transaction.jumlah}{" "}
                                  {transaction.unit}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-[13px] text-[#7d7d7d] py-3 px-4 min-w-[200px] max-w-[350px]">
                                <span className="line-clamp-2">
                                  {transaction.keterangan}
                                </span>
                              </TableCell>
                              <TableCell className="text-[13px] text-[#313131] py-3 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                    <User
                                      size={14}
                                      className="text-green-500"
                                    />
                                  </div>
                                  <span>
                                    {transaction.dibuatOleh}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-[#313131]">
              Tambah Transaksi Stok Keluar
            </DialogTitle>
            <DialogDescription className="text-[14px] text-[#7d7d7d]">
              Catat penggunaan bahan baku dari inventori
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="stockItem"
                className="text-[14px] text-[#313131]"
              >
                Bahan Baku{" "}
                <span className="text-[#e93232]">*</span>
              </Label>
              <Select
                value={selectedStockItemId}
                onValueChange={setSelectedStockItemId}
              >
                <SelectTrigger className="w-full h-11 rounded-[12px] border-[#e8e8e8] focus:ring-[#578e7e]/20">
                  <SelectValue placeholder="Pilih bahan baku" />
                </SelectTrigger>
                <SelectContent>
                  {stockItems.map((item) => {
                    const sisa = item.currentStock;
                    return (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        disabled={item.currentStock <= 0}
                      >
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span>{item.kodeBahanBaku}</span>
                          <span className="text-[#7d7d7d] text-[12px]">
                            ({item.kodeBahanBaku2}) - Sisa:{" "}
                            {item.currentStock} {item.unit}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedItem && (
              <div className="bg-[#578e7e]/5 p-4 rounded-[12px] border border-[#578e7e]/20">
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <p className="text-[#7d7d7d] mb-1">
                      Stok Tersedia
                    </p>
                    <p className="font-semibold text-[#313131] text-[16px]">
                      {sisaStok} {selectedItem.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7d7d7d] mb-1">
                      Status
                    </p>
                    <Badge
                      variant="secondary"
                      className={
                        selectedItem.statusColor === "green"
                          ? "bg-[#578e7e]/10 text-[#578e7e] border-[#578e7e]/20"
                          : selectedItem.statusColor ===
                              "orange"
                            ? "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20"
                            : "bg-[#e93232]/10 text-[#e93232] border-[#e93232]/20"
                      }
                    >
                      {selectedItem.status}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[#7d7d7d] mb-1">
                      Pemasok
                    </p>
                    <p className="font-medium text-[#313131]">
                      {selectedItem.supplier}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="jumlah"
                className="text-[14px] text-[#313131]"
              >
                Jumlah Keluar{" "}
                <span className="text-[#e93232]">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="jumlah"
                  type="number"
                  placeholder="0"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  className="flex-1 h-11 rounded-[12px] border-[#e8e8e8] focus:ring-[#578e7e]/20"
                  min="0"
                  step="0.01"
                />
                {selectedItem && (
                  <div className="flex items-center px-4 bg-[#fafafa] border border-[#e8e8e8] rounded-[12px] text-[14px] text-[#7d7d7d] font-medium min-w-[70px] justify-center">
                    {selectedItem.unit}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="dibuatOleh"
                className="text-[14px] text-[#313131]"
              >
                Dibuat Oleh{" "}
                <span className="text-[#e93232]">*</span>
              </Label>
              <Input
                id="dibuatOleh"
                placeholder="Nama staff/operator"
                value={dibuatOleh}
                onChange={(e) => setDibuatOleh(e.target.value)}
                className="h-11 rounded-[12px] border-[#e8e8e8] focus:ring-[#578e7e]/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="keterangan"
                className="text-[14px] text-[#313131]"
              >
                Keterangan{" "}
                <span className="text-[#7d7d7d]">
                  (Opsional)
                </span>
              </Label>
              <Textarea
                id="keterangan"
                placeholder="Catatan tambahan tentang penggunaan bahan..."
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={3}
                className="rounded-[12px] border-[#e8e8e8] focus:ring-[#578e7e]/20 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedStockItemId("");
                setJumlah("");
                setKeterangan("");
                setDibuatOleh("");
              }}
              className="rounded-[12px] border-[#e8e8e8]"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitTransaction}
              className="bg-[#578e7e] hover:bg-[#4a7a6d] text-white rounded-[12px]"
            >
              Simpan Transaksi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
