import React, { useState, useMemo } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Dashboard from '../Dashboard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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
import { useUsers, User, UserRole } from '../../context/UserContext';
import { CreateUserDrawer } from '../user/CreateUserDrawer';
import { EditUserDrawer } from '../user/EditUserDrawer';
import { useToast } from '../ui/use-toast';
import { Badge } from '../ui/badge';

interface UserManagementProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onLogout, onMenuChange }) => {
  const { users, deleteUser } = useUsers();
  const { toast } = useToast();

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleDelete = (userId: string) => {
    deleteUser(userId);
    toast({
      title: "Pengguna Dihapus",
      description: "Pengguna telah berhasil dihapus.",
    });
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-600';
      case 'Admin': return 'bg-blue-600';
      case 'Employee': return 'bg-green-600';
      case 'Cashier': return 'bg-yellow-600';
      case 'Customer': return 'bg-gray-600';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Dashboard onLogout={onLogout} onMenuChange={onMenuChange}>
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[#313131]">Manajemen Pengguna</h1>
            <p className="text-[14px] text-[#7d7d7d] mt-1">Kelola data pengguna dan peran</p>
          </div>
          <Button onClick={() => setIsCreateDrawerOpen(true)} className="bg-[rgba(49,49,49,1)] hover:bg-[#4a7a6d] text-white rounded-[12px] flex items-center gap-2 shadow-sm">
            <Plus size={18} />
            <span>Tambah Pengguna</span>
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari pengguna (nama, email, peran)"
              className="w-full bg-white border border-black/5 rounded-lg pl-10 pr-4 py-2 text-sm text-[#313131] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-3 sm:p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Nama</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Peran</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Telepon</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[#313131]/70">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-black/50 transition-colors duration-200 
                                ${index % 2 === 1 ? 'bg-black/5' : ''} 
                                hover:bg-black/10`}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-[#313131]">{user.name}</td>
                    <td className="py-3 px-4 text-sm text-[#313131]/70">{user.email}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge
                        variant="secondary"
                        className={`px-2.5 py-1 rounded-full text-xs font-medium min-w-[80px] text-center text-white ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge
                        variant="secondary"
                        className={`px-2.5 py-1 rounded-full text-xs font-medium min-w-[80px] text-center ${
                          user.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#313131]/70">{user.phone || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingUser(user);
                              setIsEditDrawerOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pengguna {user.name} secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700 text-white">
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateUserDrawer
        open={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
      <EditUserDrawer
        open={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
      />
    </Dashboard>
  );
};

export default UserManagement;
