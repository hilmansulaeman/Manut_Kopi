import { useState, useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useStock, StockItem } from '../../context/StockContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// Zod schema for form validation
const formSchema = z.object({
  kodeBahanBaku: z.string().min(1, { message: 'Kode Bahan Baku wajib diisi' }),
  namaBarang: z.string().min(1, { message: 'Nama Barang wajib diisi' }),
  supplier: z.string().min(1, { message: 'Pemasok wajib diisi' }),
  stokMasuk: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: 'Stok Masuk harus angka positif.' })
  ),
  stockLimit: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: 'Batas Stok harus angka positif.' })
  ),
  unit: z.string().min(1, { message: 'Unit wajib diisi' }),
});

type IngredientFormValues = z.infer<typeof formSchema>;

interface EditIngredientDrawerProps {
  open: boolean;
  onClose: () => void;
  ingredient: StockItem | null;
}

export const EditIngredientDrawer: React.FC<EditIngredientDrawerProps> = ({ open, onClose, ingredient }) => {
  const { toast } = useToast();
  const { updateStockItem } = useStock();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kodeBahanBaku: '',
      namaBarang: '',
      supplier: '',
      stokMasuk: 0,
      stockLimit: 0,
      unit: '',
    },
  });

  // Update form values when ingredient changes
  useEffect(() => {
    if (ingredient) {
      form.reset({
        kodeBahanBaku: ingredient.kodeBahanBaku2,
        namaBarang: ingredient.kodeBahanBaku,
        supplier: ingredient.supplier,
        stokMasuk: ingredient.stokMasuk,
        stockLimit: ingredient.stockLimit,
        unit: ingredient.unit,
      });
    }
  }, [ingredient, form]);

  const onSubmit = async (values: IngredientFormValues) => {
    if (!ingredient) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedStockItem: Omit<StockItem, 'id' | 'status' | 'statusColor' | 'currentStock'> = {
        kodeBahanBaku: values.namaBarang,
        kodeBahanBaku2: values.kodeBahanBaku,
        supplier: values.supplier,
        stokMasuk: values.stokMasuk,
        stockLimit: values.stockLimit,
        unit: values.unit,
      };

      updateStockItem(ingredient.id, updatedStockItem);
      toast({
        title: 'Berhasil!',
        description: 'Bahan baku berhasil diperbarui.',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memperbarui bahan baku.',
        variant: 'destructive',
      });
      console.error('Failed to update ingredient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bahan Baku</DialogTitle>
          <DialogDescription>
            Perbarui detail bahan baku di sini. Klik simpan saat Anda selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="kodeBahanBaku"
              render={({ field }: { field: FieldValues }) => (
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
              render={({ field }: { field: FieldValues }) => (
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
              render={({ field }: { field: FieldValues }) => (
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
              name="stokMasuk"
              render={({ field }: { field: FieldValues }) => (
                <FormItem>
                  <FormLabel>Stok Masuk</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stockLimit"
              render={({ field }: { field: FieldValues }) => (
                <FormItem>
                  <FormLabel>Batas Stok</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }: { field: FieldValues }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="Liter">Liter</SelectItem>
                      <SelectItem value="Pcs">Pcs</SelectItem>
                    </SelectContent>
                  </Select>
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

export default EditIngredientDrawer;
