import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { useUsers, User, UserRole } from '../../context/UserContext';

interface EditUserDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const roleOptions = ['Super Admin', 'Admin', 'Employee', 'Cashier', 'Customer'] as const;
const statusOptions = ['active', 'inactive'] as const;

// Schema: memberCode wajib jika role = Customer
const editUserSchema = z
  .object({
    name: z.string().min(1, { message: 'Nama wajib diisi.' }),
    email: z.string().email({ message: 'Email tidak valid.' }),
    role: z.enum(roleOptions, { required_error: 'Peran wajib dipilih.' }),
    status: z.enum(statusOptions, { required_error: 'Status wajib dipilih.' }),
    phone: z.string().optional(),
    address: z.string().optional(),
    memberCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'Customer' && !data.memberCode?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['memberCode'],
        message: 'Kode Member wajib diisi untuk role Customer.',
      });
    }
  });

type EditUserFormValues = z.infer<typeof editUserSchema>;

export const EditUserDrawer: React.FC<EditUserDrawerProps> = ({ open, onClose, user }) => {
  const { updateUser } = useUsers();
  const { toast } = useToast();

  // Nilai default ketika belum ada user (agar form tidak undefined)
  const defaults = useMemo<EditUserFormValues>(() => ({
    name: '',
    email: '',
    role: 'Employee',
    status: 'active',
    phone: '',
    address: '',
    memberCode: '',
  }), []);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: defaults,
    mode: 'onSubmit',
  });

  // Prefill saat dialog dibuka + user tersedia; reset ketika ditutup
  useEffect(() => {
    if (open && user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        role: (user.role as EditUserFormValues['role']) ?? 'Employee',
        status: (user.status as EditUserFormValues['status']) ?? 'active',
        phone: user.phone ?? '',
        address: user.address ?? '',
        memberCode: user.memberCode ?? '',
      });
    } else if (!open) {
      form.reset(defaults);
    }
  }, [open, user, form, defaults]);

  const onSubmit = (values: EditUserFormValues) => {
    if (!user) {
      toast({
        title: 'Tidak ada data pengguna',
        description: 'Pengguna tidak ditemukan saat menyimpan.',
        variant: 'destructive',
      });
      return;
    }

    updateUser({
      ...user, // pertahankan field yang tidak diubah (termasuk password)
      id: user.id, // pastikan id tetap
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role as UserRole,
      status: values.status,
      phone: values.phone?.trim() || undefined,
      address: values.address?.trim() || undefined,
      memberCode: values.role === 'Customer'
        ? values.memberCode?.trim() || undefined
        : undefined,
    });

    toast({
      title: 'Pengguna Berhasil Diperbarui',
      description: `Pengguna ${values.name} (${values.role}) telah diperbarui.`,
    });

    onClose();
  };

  const roleWatch = form.watch('role');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            Edit detail pengguna di sini. Klik simpan saat selesai.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="Nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" placeholder="nama@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peran</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Pilih Peran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Peran Pengguna</SelectLabel>
                          {roleOptions.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status Pengguna</SelectLabel>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Tidak Aktif</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telepon</FormLabel>
                    <FormControl>
                      <Input id="phone" placeholder="08xxxxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input id="address" placeholder="Alamat lengkap (opsional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {roleWatch === 'Customer' && (
              <FormField
                control={form.control}
                name="memberCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Member</FormLabel>
                    <FormControl>
                      <Input id="memberCode" placeholder="Contoh: CUST-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
