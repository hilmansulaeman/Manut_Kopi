import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStock, StockItem } from '../context/StockContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const IngredientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stockItems } = useStock();
  const [ingredient, setIngredient] = useState<StockItem | null>(null);

  useEffect(() => {
    if (id) {
      const foundIngredient = stockItems.find(item => item.id === parseInt(id));
      setIngredient(foundIngredient || null);
    }
  }, [id, stockItems]);

  if (!ingredient) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans text-[#313131]">
        <h1 className="text-2xl font-semibold mb-4">Bahan Baku tidak ditemukan</h1>
        <Button onClick={() => navigate('/ingredient-library')}>Kembali ke Perpustakaan Bahan Baku</Button>
      </div>
    );
  }

  // Simulate stock history for demonstration purposes
  const simulatedHistory = [
    { date: '2025-09-28', type: 'Masuk', quantity: 50, unit: ingredient.unit, notes: 'Pembelian dari supplier' },
    { date: '2025-09-29', type: 'Keluar', quantity: 20, unit: ingredient.unit, notes: 'Digunakan untuk produksi' },
    { date: '2025-09-29', type: 'Masuk', quantity: 10, unit: ingredient.unit, notes: 'Pengembalian stok' },
    { date: '2025-09-30', type: 'Keluar', quantity: 15, unit: ingredient.unit, notes: 'Digunakan untuk produksi' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#313131]">
      <div className="max-w-[1200px] mx-auto px-6 py-8 w-full">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-[#313131] hover:bg-black/5">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <h1 className="text-3xl font-bold mb-6 text-[#313131]">Detail Bahan Baku: {ingredient.kodeBahanBaku}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-black/5 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]">
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
              <CardDescription>Detail dasar bahan baku.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Kode Bahan Baku:</strong> {ingredient.kodeBahanBaku}</p>
              <p><strong>Kode Bahan Baku 2:</strong> {ingredient.kodeBahanBaku2}</p>
              <p><strong>Pemasok:</strong> {ingredient.supplier}</p>
              <p><strong>Unit:</strong> {ingredient.unit}</p>
              <p><strong>Status:</strong> {ingredient.status}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-black/5 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]">
            <CardHeader>
              <CardTitle>Ringkasan Stok</CardTitle>
              <CardDescription>Jumlah stok masuk dan keluar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Stok Masuk:</strong> {ingredient.stokMasuk} {ingredient.unit}</p>
              <p><strong>Stok Keluar:</strong> {ingredient.stokKeluar} {ingredient.unit}</p>
              <p><strong>Stok Saat Ini:</strong> {ingredient.stokMasuk - ingredient.stokKeluar} {ingredient.unit}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-black/5 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]">
          <CardHeader>
            <CardTitle>Riwayat Stok</CardTitle>
            <CardDescription>Catatan transaksi stok.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Kuantitas</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {simulatedHistory.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell>{entry.quantity} {entry.unit}</TableCell>
                    <TableCell>{entry.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IngredientDetail;
