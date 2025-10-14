import React, { useState, useMemo } from 'react';
import Dashboard from '../Dashboard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { useToast } from '../ui/use-toast';
import { Badge } from '../ui/badge';
interface MasterDataProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

const MasterData: React.FC<MasterDataProps> = ({ onLogout, onMenuChange }) => {
  // Since POS feature is disabled, MasterData will not manage products.
  // This component will now display a message indicating the feature is disabled.

  return (
    <Dashboard onLogout={onLogout} onMenuChange={onMenuChange}>
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#313131] mb-4">Master Data Produk</h1>
          <p className="text-gray-600">
            Fitur Master Data Produk telah dinonaktifkan.
          </p>
        </div>
      </div>
    </Dashboard>
  );
};

export default MasterData;
