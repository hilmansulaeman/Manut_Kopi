import SidebarImport from '../../imports/Sidebar';
import { useProfile } from '../../context/ProfileContext';

export function Sidebar({ 
  onLogout, 
  activeMenu,
  onMenuChange,
  isCollapsed,
  onCollapseChange 
}: { 
  onLogout?: () => void;
  activeMenu?: string;
  onMenuChange?: (menu: string) => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}) {
  const { profileName } = useProfile();
  
  return (
    <SidebarImport 
      onLogout={onLogout}
      activeMenu={activeMenu}
      onMenuChange={onMenuChange}
      profileName={profileName}
      isCollapsed={isCollapsed}
      onCollapseChange={onCollapseChange}
    />
  );
}
