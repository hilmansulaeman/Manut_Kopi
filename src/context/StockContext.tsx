import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface StockItem {
  id: number;
  kodeBahanBaku: string;
  kodeBahanBaku2: string;
  supplier: string;
  stokMasuk: number;
  stokKeluar: number;
  stockLimit: number; // Add stockLimit to StockItem
  status: string;
  statusColor: 'green' | 'orange';
  unit: string;
}

interface StockContextType {
  stockItems: StockItem[];
  addStockItem: (item: Omit<StockItem, 'id' | 'status' | 'statusColor'>) => void;
  updateStockItem: (item: StockItem) => void;
  getLowStockItems: () => StockItem[]; // No longer needs a threshold parameter
}

const StockContext = createContext<StockContextType | undefined>(undefined);

const initialStockData: StockItem[] = [
  {
    id: 1,
    kodeBahanBaku: 'Biji Kopi Arabika',
    kodeBahanBaku2: 'BKA001',
    supplier: 'Petani Kopi Jaya',
    stokMasuk: 100,
    stokKeluar: 75,
    stockLimit: 30, // Added stockLimit
    status: '25 Kg',
    statusColor: 'green',
    unit: 'Kg',
  },
  {
    id: 2,
    kodeBahanBaku: 'Susu Full Cream',
    kodeBahanBaku2: 'SFC002',
    supplier: 'Dairy Farm',
    stokMasuk: 50,
    stokKeluar: 40,
    stockLimit: 15, // Added stockLimit
    status: '10 Liter',
    statusColor: 'orange',
    unit: 'Liter',
  },
  {
    id: 3,
    kodeBahanBaku: 'Gula Pasir',
    kodeBahanBaku2: 'GUL003',
    supplier: 'Sumber Manis',
    stokMasuk: 30,
    stokKeluar: 20,
    stockLimit: 10, // Added stockLimit
    status: '10 Kg',
    statusColor: 'green',
    unit: 'Kg',
  },
  {
    id: 4,
    kodeBahanBaku: 'Cokelat Bubuk',
    kodeBahanBaku2: 'COK004',
    supplier: 'Cokelat Nikmat',
    stokMasuk: 20,
    stokKeluar: 15,
    stockLimit: 8, // Added stockLimit
    status: '5 Kg',
    statusColor: 'green',
    unit: 'Kg',
  },
  {
    id: 5,
    kodeBahanBaku: 'Roti Tawar',
    kodeBahanBaku2: 'ROT005',
    supplier: 'Pabrik Roti Enak',
    stokMasuk: 60,
    stokKeluar: 55,
    stockLimit: 10, // Added stockLimit
    status: '5 Pcs',
    statusColor: 'orange',
    unit: 'Pcs',
  },
  {
    id: 6,
    kodeBahanBaku: 'Tepung Terigu',
    kodeBahanBaku2: 'TPT006',
    supplier: 'Gandum Jaya',
    stokMasuk: 80,
    stokKeluar: 30,
    stockLimit: 20,
    status: '50 Kg',
    statusColor: 'green',
    unit: 'Kg',
  },
];

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockData);

  const calculateStatus = (masuk: number, keluar: number, unit: string, stockLimit: number) => {
    const currentStock = masuk - keluar;
    let statusText = `${currentStock} ${unit}`;
    let statusColor: 'green' | 'orange' = 'green';

    if (currentStock <= stockLimit) { // Use stockLimit for low stock
      statusText = `${currentStock} ${unit} (Menipis)`;
      statusColor = 'orange';
    }
    if (currentStock <= 0) {
      statusText = `Habis Stok`;
      statusColor = 'orange';
    }
    return { statusText, statusColor };
  };

  const addStockItem = (newItem: Omit<StockItem, 'id' | 'status' | 'statusColor'>) => {
    const newId = stockItems.length > 0 ? Math.max(...stockItems.map(item => item.id)) + 1 : 1;
    const { statusText, statusColor } = calculateStatus(newItem.stokMasuk, newItem.stokKeluar, newItem.unit, newItem.stockLimit);
    setStockItems((prevItems) => [...prevItems, { ...newItem, id: newId, status: statusText, statusColor: statusColor }]);
  };

  const updateStockItem = (updatedItem: StockItem) => {
    const { statusText, statusColor } = calculateStatus(updatedItem.stokMasuk, updatedItem.stokKeluar, updatedItem.unit, updatedItem.stockLimit);
    setStockItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id ? { ...updatedItem, status: statusText, statusColor: statusColor } : item
      )
    );
  };

  const getLowStockItems = () => {
    return stockItems.filter(item => (item.stokMasuk - item.stokKeluar) <= item.stockLimit);
  };

  return (
    <StockContext.Provider value={{ stockItems, addStockItem, updateStockItem, getLowStockItems }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
