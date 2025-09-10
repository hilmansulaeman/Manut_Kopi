import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Zod schema for form validation
const formSchema = z.object({
  kodeBahanBaku: z.string().min(1, { message: 'Kode Bahan Baku wajib diisi' }),
  namaBarang: z.string().min(1, { message: 'Nama Barang wajib diisi' }),
  supplier: z.string().min(1, { message: 'Pemasok wajib diisi' }),
  tanggal: z.string().min(1, { message: 'Tanggal wajib diisi' }),
  kodeBahanBakuKedua: z.string().min(1, { message: 'Kode Bahan Baku wajib diisi' }),
});

type IngredientFormValues = z.infer<typeof formSchema>;

interface CreateIngredientDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newRow: any) => void; // Will be updated with a proper type later
}

export const CreateIngredientDrawer: React.FC<CreateIngredientDrawerProps> = ({ open, onClose, onCreate }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kodeBahanBaku: '',
      namaBarang: '',
      supplier: '',
      tanggal: '',
      kodeBahanBakuKedua: '',
    },
  });

  const onSubmit = async (values: IngredientFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newIngredient = {
        id: Math.floor(Math.random() * 100000), // Temporary ID
        name: values.namaBarang,
        kodeBahanBaku: values.kodeBahanBaku,
        namaBahanBaku: values.namaBarang, // Assuming namaBarang is also namaBahanBaku
        supplier: values.supplier,
        stockMasuk: 0, // Default value
        stockKeluar: 0, // Default value
        status: 'In', // Default status
        createdAt: new Date().toISOString(),
      };

      onCreate(newIngredient);
      toast({
        title: 'Berhasil!',
        description: 'Bahan baku berhasil ditambahkan.',
      });
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menambahkan bahan baku.',
        variant: 'destructive',
      });
      console.error('Failed to add ingredient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Bahan Baku</DialogTitle>
          <DialogDescription>
            Isi detail bahan baku baru di sini. Klik simpan saat Anda selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="kodeBahanBaku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Bahan Baku</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan kode bahan baku"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="namaBarang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Barang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama barang"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pemasok</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan pemasok"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Masukkan tanggal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kodeBahanBakuKedua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Bahan Baku</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan kode bahan baku"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
