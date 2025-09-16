import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface StockItem {
  id: number;
  kodeBahanBaku: string;
  kodeBahanBaku2: string;
  supplier: string;
  stokMasuk: string;
  stokKeluar: string;
  status: string;
  statusColor: 'green' | 'orange';
}

interface StockContextType {
  stockItems: StockItem[];
  addStockItem: (item: Omit<StockItem, 'id'>) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

const initialStockData: StockItem[] = [
  {
    id: 1,
    kodeBahanBaku: 'Biji Kopi Arabika',
    kodeBahanBaku2: 'BKA001',
    supplier: 'Petani Kopi Jaya',
    stokMasuk: '100 Kg',
    stokKeluar: '75 Kg',
    status: '25 Kg',
    statusColor: 'green',
  },
  {
    id: 2,
    kodeBahanBaku: 'Susu Full Cream',
    kodeBahanBaku2: 'SFC002',
    supplier: 'Dairy Farm',
    stokMasuk: '50 Liter',
    stokKeluar: '40 Liter',
    status: '10 Liter',
    statusColor: 'orange',
  },
  {
    id: 3,
    kodeBahanBaku: 'Gula Pasir',
    kodeBahanBaku2: 'GUL003',
    supplier: 'Sumber Manis',
    stokMasuk: '30 Kg',
    stokKeluar: '20 Kg',
    status: '10 Kg',
    statusColor: 'green',
  },
  {
    id: 4,
    kodeBahanBaku: 'Cokelat Bubuk',
    kodeBahanBaku2: 'COK004',
    supplier: 'Cokelat Nikmat',
    stokMasuk: '20 Kg',
    stokKeluar: '15 Kg',
    status: '5 Kg',
    statusColor: 'green',
  },
  {
    id: 5,
    kodeBahanBaku: 'Roti Tawar',
    kodeBahanBaku2: 'ROT005',
    supplier: 'Pabrik Roti Enak',
    stokMasuk: '60 Pcs',
    stokKeluar: '55 Pcs',
    status: '5 Pcs',
    statusColor: 'orange',
  },
];

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockData);

  const addStockItem = (newItem: Omit<StockItem, 'id'>) => {
    const newId = stockItems.length > 0 ? Math.max(...stockItems.map(item => item.id)) + 1 : 1;
    setStockItems((prevItems) => [...prevItems, { ...newItem, id: newId }]);
  };

  return (
    <StockContext.Provider value={{ stockItems, addStockItem }}>
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
