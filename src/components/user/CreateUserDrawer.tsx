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

import { useUsers, UserRole } from '../../context/UserContext';

interface CreateUserDrawerProps {
  open: boolean;
  onClose: () => void;
}

const roleOptions = ['Super Admin', 'Admin', 'Employee', 'Cashier', 'Customer'] as const;

// Schema: memberCode wajib saat role = Customer
const userSchema = z
  .object({
    name: z.string().min(1, { message: 'Nama wajib diisi.' }),
    email: z.string().email({ message: 'Email tidak valid.' }),
    password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter.' }),
    role: z.enum(roleOptions, { required_error: 'Peran wajib dipilih.' }),
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

type UserFormValues = z.infer<typeof userSchema>;

export const CreateUserDrawer: React.FC<CreateUserDrawerProps> = ({ open, onClose }) => {
  const { addUser } = useUsers();
  const { toast } = useToast();

  const defaultValues: UserFormValues = useMemo(
    () => ({
      name: '',
      email: '',
      password: '',
      role: 'Employee',
      phone: '',
      address: '',
      memberCode: '',
    }),
    [],
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  // Reset form ketika dialog ditutup
  useEffect(() => {
    if (!open) form.reset(defaultValues);
  }, [open, form, defaultValues]);

  const onSubmit = (values: UserFormValues) => {
    addUser({
      name: values.name.trim(),
      email: values.email.trim(),
      // NOTE: untuk production, password harus di-hash di backend
      password: values.password,
      role: values.role as UserRole,
      phone: values.phone?.trim() || undefined,
      address: values.address?.trim() || undefined,
      memberCode: values.role === 'Customer' ? values.memberCode?.trim() || undefined : undefined,
    });

    toast({
      title: 'Pengguna Berhasil Dibuat',
      description: `Pengguna ${values.name} (${values.role}) telah ditambahkan.`,
    });

    form.reset(defaultValues);
    onClose();
  };

  const roleWatch = form.watch('role');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
          <DialogTitle>Buat Pengguna Baru</DialogTitle>
          <DialogDescription>
            Tambahkan detail pengguna baru di sini. Klik simpan saat selesai.
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
