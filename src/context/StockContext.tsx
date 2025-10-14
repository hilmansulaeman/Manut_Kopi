import { createContext, useContext, useState, ReactNode } from 'react';

export interface StockItem {
  id: string;
  nama?: string;
  kategori?: string;
  harga?: string;
  kodeBahanBaku: string;
  kodeBahanBaku2: string;
  supplier: string;
  stokMasuk: number;
  stockLimit: number;
  unit: string;
  status: string;
  statusColor: 'green' | 'orange' | 'red';
  currentStock: number; // Add currentStock to the interface
}

export interface StockOutTransaction {
  id: string;
  stockItemId: string;
  kodeBahanBaku: string;
  kodeBahanBaku2: string;
  jumlah: number;
  unit: string;
  tanggal: string;
  waktu: string;
  keterangan: string;
  dibuatOleh: string;
}

interface StockContextType {
  stockItems: StockItem[];
  stockOutTransactions: StockOutTransaction[];
  addStock: (item: StockItem) => void;
  updateStock: (id: string, item: Partial<StockItem>) => void;
  deleteStock: (id: string) => void;
  getLowStockItems: () => StockItem[];
  addStockItem: (item: Omit<StockItem, 'id' | 'status' | 'statusColor' | 'currentStock'>) => void;
  updateStockItem: (id: string, updates: Partial<StockItem>) => void;
  addStockOutTransaction: (transaction: Omit<StockOutTransaction, 'id' | 'tanggal' | 'waktu'>) => void;
  getStockItemById: (id: string) => StockItem | undefined;
  updateStockItemCurrentStock: (id: string, newCurrentStock: number) => void; // New function
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: ReactNode }) {
  const [stockOutTransactions, setStockOutTransactions] = useState<StockOutTransaction[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([
    { 
      id: "001", 
      kodeBahanBaku: "Biji Kopi Arabica", 
      kodeBahanBaku2: "BK-ARB-001",
      supplier: "PT Kopi Nusantara",
      stokMasuk: 150, 
      stockLimit: 50,
      unit: "kg",
      status: "Tersedia",
      statusColor: "green",
      currentStock: 150 // Initial current stock
    },
    { 
      id: "002", 
      kodeBahanBaku: "Susu Full Cream", 
      kodeBahanBaku2: "SU-FC-002",
      supplier: "PT Susu Segar",
      stokMasuk: 120, 
      stockLimit: 40,
      unit: "liter",
      status: "Tersedia",
      statusColor: "green",
      currentStock: 120
    },
    { 
      id: "003", 
      kodeBahanBaku: "Gula Pasir", 
      kodeBahanBaku2: "GU-PS-003",
      supplier: "CV Gula Manis",
      stokMasuk: 98, 
      stockLimit: 50,
      unit: "kg",
      status: "Stok Menipis",
      statusColor: "orange",
      currentStock: 98
    },
    { 
      id: "004", 
      kodeBahanBaku: "Cokelat Bubuk", 
      kodeBahanBaku2: "CK-BB-004",
      supplier: "PT Cokelat Indonesia",
      stokMasuk: 85, 
      stockLimit: 30,
      unit: "kg",
      status: "Tersedia",
      statusColor: "green",
      currentStock: 85
    },
    { 
      id: "005", 
      kodeBahanBaku: "Sirup Vanila", 
      kodeBahanBaku2: "SR-VN-005",
      supplier: "CV Rasa Manis",
      stokMasuk: 76, 
      stockLimit: 25,
      unit: "botol",
      status: "Stok Menipis",
      statusColor: "orange",
      currentStock: 76
    },
    { 
      id: "006", 
      kodeBahanBaku: "Bubuk Matcha", 
      kodeBahanBaku2: "BB-MT-006",
      supplier: "PT Green Tea",
      stokMasuk: 25, 
      stockLimit: 20,
      unit: "kg",
      status: "Tersedia",
      statusColor: "green",
      currentStock: 25
    },
    { 
      id: "007", 
      kodeBahanBaku: "Whipped Cream", 
      kodeBahanBaku2: "WC-CR-007",
      supplier: "PT Dairy Products",
      stokMasuk: 50, 
      stockLimit: 30,
      unit: "kaleng",
      status: "Tersedia",
      statusColor: "green",
      currentStock: 50
    },
    { 
      id: "008", 
      kodeBahanBaku: "Es Batu", 
      kodeBahanBaku2: "ES-BT-008",
      supplier: "CV Es Sejuk",
      stokMasuk: 30, 
      stockLimit: 20,
      unit: "kg",
      status: "Stok Menipis",
      statusColor: "orange",
      currentStock: 30
    },
    { 
      id: "009", 
      kodeBahanBaku: "Paper Cup", 
      kodeBahanBaku2: "PC-CU-009",
      supplier: "PT Kemasan Ramah",
      stokMasuk: 12, 
      stockLimit: 100,
      unit: "pack",
      status: "Tersedia",
      statusColor: "green",
      currentStock: 12
    },
    { 
      id: "010", 
      kodeBahanBaku: "Cinnamon Powder", 
      kodeBahanBaku2: "CP-PW-010",
      supplier: "CV Rempah Nusantara",
      stokMasuk: 65, 
      stockLimit: 20,
      unit: "kg",
      status: "Tersedia",
      statusColor: "green",
      currentStock: 65
    },
  ]);

  const calculateStatus = (currentStock: number, stockLimit: number): { status: string; statusColor: 'green' | 'orange' | 'red' } => {
    if (currentStock <= 0) {
      return { status: 'Habis Stok', statusColor: 'red' };
    } else if (currentStock <= stockLimit) {
      return { status: 'Stok Menipis', statusColor: 'orange' };
    } else {
      return { status: 'Tersedia', statusColor: 'green' };
    }
  };

  const addStock = (item: StockItem) => {
    setStockItems([...stockItems, item]);
  };

  const updateStock = (id: string, updates: Partial<StockItem>) => {
    setStockItems(stockItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteStock = (id: string) => {
    setStockItems(stockItems.filter(item => item.id !== id));
  };

  const getLowStockItems = () => {
    return stockItems.filter(item => item.currentStock <= item.stockLimit);
  };

  const addStockItem = (item: Omit<StockItem, 'id' | 'status' | 'statusColor' | 'currentStock'>) => {
    const newId = (stockItems.length + 1).toString().padStart(3, '0');
    const currentStock = item.stokMasuk; // Initial current stock is stokMasuk
    const { status, statusColor } = calculateStatus(currentStock, item.stockLimit);
    const newItem: StockItem = {
      ...item,
      id: newId,
      status,
      statusColor,
      currentStock,
    };
    setStockItems([...stockItems, newItem]);
  };

  const updateStockItem = (id: string, updates: Partial<StockItem>) => {
    setStockItems(stockItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        const currentStock = updatedItem.stokMasuk; // Assuming stokMasuk is the base for currentStock
        const { status, statusColor } = calculateStatus(
          currentStock,
          updatedItem.stockLimit
        );
        return { ...updatedItem, status, statusColor, currentStock };
      }
      return item;
    }));
  };

  const addStockOutTransaction = (transaction: Omit<StockOutTransaction, 'id' | 'tanggal' | 'waktu'>) => {
    const now = new Date();
    const newId = `OUT-${Date.now()}`;
    const tanggal = now.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const waktu = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newTransaction: StockOutTransaction = {
      ...transaction,
      id: newId,
      tanggal,
      waktu,
    };

    setStockOutTransactions([newTransaction, ...stockOutTransactions]);

    // Update currentStock pada item yang bersangkutan
    setStockItems(stockItems.map(item => {
      if (item.id === transaction.stockItemId) {
        const newCurrentStock = item.currentStock - transaction.jumlah;
        const { status, statusColor } = calculateStatus(
          newCurrentStock,
          item.stockLimit
        );
        return { 
          ...item, 
          currentStock: newCurrentStock,
          status,
          statusColor
        };
      }
      return item;
    }));
  };

  const getStockItemById = (id: string) => {
    return stockItems.find(item => item.id === id);
  };

  const updateStockItemCurrentStock = (id: string, newCurrentStock: number) => {
    setStockItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const { status, statusColor } = calculateStatus(newCurrentStock, item.stockLimit);
          return { ...item, currentStock: newCurrentStock, status, statusColor };
        }
        return item;
      })
    );
  };

  return (
    <StockContext.Provider value={{ 
      stockItems,
      stockOutTransactions,
      addStock, 
      updateStock, 
      deleteStock, 
      getLowStockItems,
      addStockItem,
      updateStockItem,
      addStockOutTransaction,
      getStockItemById,
      updateStockItemCurrentStock // Add new function to context value
    }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
}
