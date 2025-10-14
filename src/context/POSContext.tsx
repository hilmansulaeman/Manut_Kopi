import React, { createContext, useState, useContext, ReactNode } from 'react';
import { StockItem } from './StockContext'; // Assuming products can be linked to stock items

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number; // Current stock, could be linked to IngredientLibrary
  isPromo: boolean;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  discount?: { type: 'percentage' | 'fixed'; value: number };
  taxInclusive?: boolean;
}

export type PaymentMethod = "Cash" | "Card" | "Digital Payment";

export interface Payment {
  method: PaymentMethod;
  amount: number;
  reference?: string; // For non-cash payments
}

export type TransactionStatus = "draft" | "held" | "completed" | "void";

export interface Transaction {
  id: string;
  invoiceNo: string;
  outlet: string;
  register: string;
  shiftId: string;
  cashierId: string;
  customerId?: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  payments: Payment[];
  status: TransactionStatus;
  createdAt: Date;
  completedAt?: Date;
  voidedAt?: Date;
}

export interface Shift {
  id: string;
  outlet: string;
  register: string;
  openingCash: number;
  closingCash?: number;
  cashierId: string;
  startTime: Date;
  endTime?: Date;
  status: "open" | "closed";
}

interface POSContextType {
  products: Product[];
  currentCart: CartItem[];
  transactions: Transaction[];
  shifts: Shift[];
  activeShift: Shift | null;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: string) => void;
  addToCart: (item: Omit<CartItem, 'name' | 'price'> & { product: Product }) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeCartItem: (productId: string) => void;
  clearCart: () => void;
  openShift: (outlet: string, register: string, openingCash: number, cashierId: string) => void;
  closeShift: (shiftId: string, closingCash: number) => void;
  createTransaction: (transactionData: Omit<Transaction, 'id' | 'invoiceNo' | 'shiftId' | 'cashierId' | 'createdAt' | 'status'>) => void;
  holdTransaction: (transactionId: string) => void;
  resumeTransaction: (transactionId: string) => void;
  voidTransaction: (transactionId: string) => void;
  // Add more functions for discounts, taxes, returns, etc. as needed
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([
    { id: 'prod1', name: 'Espresso', category: 'Coffee', price: 25000, stock: 100, isPromo: false },
    { id: 'prod2', name: 'Latte', category: 'Coffee', price: 30000, stock: 150, isPromo: true },
    { id: 'prod3', name: 'Croissant', category: 'Food', price: 18000, stock: 50, isPromo: false },
    { id: 'prod4', name: 'T-Shirt Kopi Haus', category: 'Merchandise', price: 120000, stock: 20, isPromo: false },
  ]);
  const [currentCart, setCurrentCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = `prod${products.length + 1}`;
    setProducts((prev) => [...prev, { ...newProduct, id }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const addToCart = (item: Omit<CartItem, 'name' | 'price'> & { product: Product }) => {
    setCurrentCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.productId === item.productId);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prev, { ...item, name: item.product.name, price: item.product.price }];
    });
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCurrentCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeCartItem = (productId: string) => {
    setCurrentCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCurrentCart([]);
  };

  const openShift = (outlet: string, register: string, openingCash: number, cashierId: string) => {
    if (activeShift) {
      console.warn('Another shift is already open.');
      return;
    }
    const newShift: Shift = {
      id: `shift${shifts.length + 1}`,
      outlet,
      register,
      openingCash,
      cashierId,
      startTime: new Date(),
      status: 'open',
    };
    setShifts((prev) => [...prev, newShift]);
    setActiveShift(newShift);
  };

  const closeShift = (shiftId: string, closingCash: number) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId ? { ...s, closingCash, endTime: new Date(), status: 'closed' } : s
      )
    );
    if (activeShift?.id === shiftId) {
      setActiveShift(null);
    }
  };

  const createTransaction = (transactionData: Omit<Transaction, 'id' | 'invoiceNo' | 'shiftId' | 'cashierId' | 'createdAt' | 'status'>) => {
    if (!activeShift) {
      console.error('No active shift to create a transaction.');
      return;
    }
    const newTransaction: Transaction = {
      ...transactionData,
      id: `trans${transactions.length + 1}`,
      invoiceNo: `INV-${Date.now()}`,
      shiftId: activeShift.id,
      cashierId: activeShift.cashierId, // Assuming cashier is linked to active shift
      createdAt: new Date(),
      status: 'completed',
    };
    setTransactions((prev) => [...prev, newTransaction]);
    clearCart(); // Clear cart after successful transaction
  };

  const holdTransaction = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'held' } : t))
    );
  };

  const resumeTransaction = (transactionId: string) => {
    const heldTransaction = transactions.find(t => t.id === transactionId && t.status === 'held');
    if (heldTransaction) {
      setCurrentCart(heldTransaction.items);
      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionId ? { ...t, status: 'draft' } : t))
      );
    }
  };

  const voidTransaction = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'void', voidedAt: new Date() } : t))
    );
  };

  return (
    <POSContext.Provider
      value={{
        products,
        currentCart,
        transactions,
        shifts,
        activeShift,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        openShift,
        closeShift,
        createTransaction,
        holdTransaction,
        resumeTransaction,
        voidTransaction,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
