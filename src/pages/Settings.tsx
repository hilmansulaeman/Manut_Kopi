import { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '../hooks/use-mobile';
import { Menu } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast'; // Assuming this is the correct path for useToast
import { Toaster } from '@/components/ui/toaster'; // Assuming this is the correct path for Toaster
import { useProfile } from '../context/ProfileContext'; // Import useProfile

const Settings = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { profileName, setProfileName } = useProfile(); // Use profileName and setProfileName from context
  const [profileEmail, setProfileEmail] = useState('jibut@example.com');
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false); // State for sidebar drawer

  const handleProfileSave = () => {
    // Implement actual save logic here
    toast({
      title: 'Profil Diperbarui',
      description: 'Informasi profil Anda telah berhasil diperbarui.',
    });
  };

  const handleNotificationSave = () => {
    // Implement actual save logic here
    toast({
      title: 'Notifikasi Diperbarui',
      description: 'Pengaturan notifikasi Anda telah berhasil diperbarui.',
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Gagal Memperbarui Kata Sandi',
        description: 'Kata sandi baru dan konfirmasi kata sandi tidak cocok.',
        variant: 'destructive',
      });
      return;
    }
    // Implement actual password change logic here
    toast({
      title: 'Kata Sandi Diperbarui',
      description: 'Kata sandi Anda telah berhasil diperbarui.',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {isMobile ? (
        <Drawer open={isSidebarDrawerOpen} onOpenChange={setIsSidebarDrawerOpen} direction="left">
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-[260px] h-full mt-0 rounded-none">
            <Sidebar />
          </DrawerContent>
        </Drawer>
      ) : (
        <Sidebar />
      )}
      <div className={`flex-1 ${!isMobile ? 'ml-[260px]' : ''}`}>
        <div className="max-w-[1200px] mx-auto px-6 py-8">

          <h1 className="text-2xl font-semibold text-ink mb-6">Pengaturan</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
              <TabsTrigger value="security">Keamanan</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    Perbarui informasi profil dan alamat email akun Anda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input id="name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                  </div>
                  <Button onClick={handleProfileSave}>Simpan perubahan</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifikasi</CardTitle>
                  <CardDescription>
                    Konfigurasi cara Anda menerima notifikasi.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="receive-notifications">Terima semua notifikasi</Label>
                    <Switch
                      id="receive-notifications"
                      checked={receiveNotifications}
                      onCheckedChange={setReceiveNotifications}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Notifikasi email</Label>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                  <Button onClick={handleNotificationSave}>Simpan perubahan</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Keamanan</CardTitle>
                  <CardDescription>
                    Kelola pengaturan keamanan akun Anda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Masukkan kata sandi saat ini"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Kata Sandi Baru</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Masukkan kata sandi baru"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Konfirmasi kata sandi baru"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                  <Button onClick={handlePasswordChange}>Perbarui Kata Sandi</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Settings;
