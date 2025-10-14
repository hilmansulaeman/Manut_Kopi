import { useState } from 'react';
import { Sidebar } from '../dashboard/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useDevice } from '../../hooks/use-device';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import { useToast } from '../ui/use-toast';
import { useProfile } from '../../context/ProfileContext';
import { useSidebar } from '../../context/SidebarContext';

interface SettingsProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout, onMenuChange }) => {
  const { isMobileOrTablet, isMobile, isTablet } = useDevice();
  const { toast } = useToast();
  const { profileName, setProfileName } = useProfile();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [profileEmail, setProfileEmail] = useState('jibut@example.com');
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleProfileSave = () => {
    toast({
      title: 'Profil Diperbarui',
      description: 'Informasi profil Anda telah berhasil diperbarui.',
    });
  };

  const handleNotificationSave = () => {
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
    toast({
      title: 'Kata Sandi Diperbarui',
      description: 'Kata sandi Anda telah berhasil diperbarui.',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-[#313131]">
      {isMobileOrTablet ? (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[260px]">
            <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
            <SheetDescription className="sr-only">
              Menu navigasi sidebar untuk aplikasi MANUT KOPI
            </SheetDescription>
            <Sidebar onLogout={onLogout} activeMenu="settings" onMenuChange={onMenuChange} />
          </SheetContent>
        </Sheet>
      ) : (
        <div className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>
          <Sidebar 
            onLogout={onLogout} 
            activeMenu="settings" 
            onMenuChange={onMenuChange}
            isCollapsed={isCollapsed}
            onCollapseChange={setIsCollapsed}
          />
        </div>
      )}
      <div className={`flex-1 transition-all duration-300 ${!isMobileOrTablet ? (isCollapsed ? 'ml-[80px]' : 'ml-[260px]') : ''}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

          <h1 className="text-[#313131] mb-8">Pengaturan</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#f9f9f9] border border-[#e8e8e8]">
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:bg-white data-[state=active]:text-[#313131] text-[#717182]"
              >
                Profil
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="data-[state=active]:bg-white data-[state=active]:text-[#313131] text-[#717182]"
              >
                Notifikasi
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-white data-[state=active]:text-[#313131] text-[#717182]"
              >
                Keamanan
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
              <Card className="border border-[#e8e8e8] bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#313131]">Informasi Profil</CardTitle>
                  <CardDescription className="text-[#717182]">
                    Perbarui informasi profil dan alamat email akun Anda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#313131]">Nama</Label>
                    <Input 
                      id="name" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)}
                      className="bg-white border border-[#e8e8e8] text-[#313131] focus:border-[#313131]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#313131]">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileEmail} 
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="bg-white border border-[#e8e8e8] text-[#313131] focus:border-[#313131]"
                    />
                  </div>
                  <Button 
                    onClick={handleProfileSave}
                    className="bg-[#313131] text-white hover:bg-[#313131]/90"
                  >
                    Simpan Perubahan
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="mt-6">
              <Card className="border border-[#e8e8e8] bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#313131]">Notifikasi</CardTitle>
                  <CardDescription className="text-[#717182]">
                    Konfigurasi cara Anda menerima notifikasi.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-1">
                      <Label htmlFor="receive-notifications" className="text-[#313131]">
                        Terima semua notifikasi
                      </Label>
                      <p className="text-sm text-[#717182]">
                        Aktifkan untuk menerima semua notifikasi aplikasi
                      </p>
                    </div>
                    <Switch
                      id="receive-notifications"
                      checked={receiveNotifications}
                      onCheckedChange={setReceiveNotifications}
                      className="data-[state=checked]:bg-[#578e7e]"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-1">
                      <Label htmlFor="email-notifications" className="text-[#313131]">
                        Notifikasi email
                      </Label>
                      <p className="text-sm text-[#717182]">
                        Terima notifikasi melalui email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      className="data-[state=checked]:bg-[#578e7e]"
                    />
                  </div>
                  <Button 
                    onClick={handleNotificationSave}
                    className="bg-[#313131] text-white hover:bg-[#313131]/90"
                  >
                    Simpan Perubahan
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="mt-6">
              <Card className="border border-[#e8e8e8] bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#313131]">Keamanan</CardTitle>
                  <CardDescription className="text-[#717182]">
                    Kelola pengaturan keamanan akun Anda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-[#313131]">
                      Kata Sandi Saat Ini
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Masukkan kata sandi saat ini"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-white border border-[#e8e8e8] text-[#313131] focus:border-[#313131]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-[#313131]">
                      Kata Sandi Baru
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Masukkan kata sandi baru"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white border border-[#e8e8e8] text-[#313131] focus:border-[#313131]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-[#313131]">
                      Konfirmasi Kata Sandi Baru
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Konfirmasi kata sandi baru"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="bg-white border border-[#e8e8e8] text-[#313131] focus:border-[#313131]"
                    />
                  </div>
                  <Button 
                    onClick={handlePasswordChange}
                    className="bg-[#313131] text-white hover:bg-[#313131]/90"
                  >
                    Perbarui Kata Sandi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;