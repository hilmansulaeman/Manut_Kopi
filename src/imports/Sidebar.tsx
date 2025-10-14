import React from 'react';
import svgPaths from "./svg-5awasofbwm";
import imgLogoManutRemovebgPreview1 from "figma:asset/bd90131d35a2fe406ed9c0ac7fb4724cb52f7427.png";
import imgRectangle1 from "figma:asset/d5b6bba6867cce143eb53d820b1f4e21c3ad2afe.png";

function Logo({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[6.4px] h-[40px] items-center relative shrink-0 ${isCollapsed ? 'justify-center' : 'justify-center'}`} data-name="Logo">
      <div className="h-[20px] relative shrink-0 w-[32px]" data-name="logo_manut-removebg-preview 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogoManutRemovebgPreview1} />
      </div>
      {!isCollapsed && (
        <p className="font-['Inter:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">MANUT KOPI</p>
      )}
    </div>
  );
}

function CollapseIcon() {
  return (
    <div className="relative size-[12px]" data-name="Collapse icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Collapse icon">
          <rect fill="var(--fill-0, #F7F6F3)" height="12" rx="4" width="12" />
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #454545)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Collapse({ onClick, isCollapsed }: { onClick?: () => void; isCollapsed?: boolean }) {
  return (
    <div 
      className="absolute bg-[#d5d5d5] box-border content-stretch flex items-center justify-center p-[4px] right-[-12px] rounded-[8px] size-[24px] translate-y-[-50%] cursor-pointer hover:bg-[#c5c5c5] transition-colors" 
      data-name="Collapse" 
      style={{ top: "calc(50% + 661px)" }}
      onClick={onClick}
    >
      <div className="flex h-[12px] items-center justify-center relative shrink-0 w-[12px]">
        <div className={`flex-none transition-transform ${isCollapsed ? 'rotate-[-90deg]' : 'rotate-[90deg]'}`}>
          <CollapseIcon />
        </div>
      </div>
    </div>
  );
}

function Brand({ onCollapseClick, isCollapsed }: { onCollapseClick?: () => void; isCollapsed?: boolean }) {
  return (
    <div className="relative shrink-0 w-full" data-name="Brand">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center pb-[12px] pt-[16px] px-[24px] relative w-full">
          <Logo isCollapsed={isCollapsed} />
          <Collapse onClick={onCollapseClick} isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
}

function IconFromTablerIo() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (from Tabler.io)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (from Tabler.io)">
          <path d={svgPaths.p26e8b180} id="Vector" stroke="var(--stroke-0, #7D7D7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Bar() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full" data-name="Bar">
      <div aria-hidden="true" className="absolute border border-[#f1f1f1] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[16px] py-[12px] relative w-full">
          <IconFromTablerIo />
          <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[14px] not-italic relative shrink-0 text-[#7d7d7d] text-[14px] text-nowrap tracking-[-0.25px] whitespace-pre">Search</p>
        </div>
      </div>
    </div>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 w-full" data-name="Search">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-[12px] pt-0 px-[12px] relative w-full">
          <Bar />
        </div>
      </div>
    </div>
  );
}

function IconFromTablerIo1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (from Tabler.io)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (from Tabler.io)">
          <path d={svgPaths.p2f0e5a00} id="Vector" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function SidebarItem01({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Dashboard item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item 01"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconFromTablerIo1 />
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#979797]'}`}>Dashboard</p>
          )}
        </div>
      </div>
    </div>
  );
}

function IconFromTablerIo2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (from Tabler.io)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (from Tabler.io)">
          <path d={svgPaths.pb766f80} id="Vector" stroke="var(--stroke-0, #7D7D7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Closed() {
  return (
    <div className="absolute left-[228px] size-[16px] top-[12.5px]" data-name="Closed">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Closed">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #7D7D7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function SidebarItem({ onClick, isOpen, isCollapsed }: { onClick?: () => void; isOpen?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('SidebarItem (Bahan Baku) clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`basis-0 grow h-[41px] relative rounded-[24px] shrink-0 cursor-pointer hover:bg-white/10 transition-colors ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] h-[41px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconFromTablerIo2 />
          {!isCollapsed && (
            <>
              <p className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[#7d7d7d] text-[14px] tracking-[-0.25px]">Bahan Baku</p>
              <div className={`absolute left-[228px] size-[16px] top-[12.5px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g id="Closed">
                    <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #7D7D7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                  </g>
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SubMenuItem({ label, onClick, isActive, isCollapsed }: { label: string; onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('SubMenuItem clicked:', label);
    if (onClick) {
      onClick();
    }
  };

  if (isCollapsed) return null;

  return (
    <div 
      className={`max-w-[320px] min-w-[264px] relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''}`}
      onClick={handleClick}
    >
      <div className="flex flex-row items-center max-w-inherit min-w-inherit size-full pointer-events-none">
        <div className="box-border content-stretch flex gap-[12px] items-center max-w-inherit min-w-inherit px-[20px] py-[8px] pl-[48px] relative w-full">
          <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function SidebarNest({ 
  isOpen, 
  onToggle, 
  onSubMenuClick, 
  activeSubMenu,
  isCollapsed 
}: { 
  isOpen: boolean; 
  onToggle: () => void; 
  onSubMenuClick: (menu: string) => void;
  activeSubMenu: string;
  isCollapsed?: boolean;
}) {
  const handleToggle = () => {
    console.log('SidebarNest onToggle called, current isOpen:', isOpen);
    onToggle();
  };

  const handleSubMenuClick = (menu: string) => {
    console.log('SidebarNest handleSubMenuClick called with:', menu);
    onSubMenuClick(menu);
  };

  return (
    <div className={`content-stretch flex flex-col items-start relative shrink-0 ${isCollapsed ? 'w-auto' : 'min-w-[264px] w-[264px]'}`} data-name="Sidebar nest">
      <SidebarItem onClick={handleToggle} isOpen={isOpen} isCollapsed={isCollapsed} />
      {isOpen && !isCollapsed && (
        <div className="w-full flex flex-col gap-[4px] mt-[4px]">
          <SubMenuItem 
            label="Halaman Bahan Baku" 
            onClick={() => handleSubMenuClick('ingredient-library')}
            isActive={activeSubMenu === 'ingredient-library'}
            isCollapsed={isCollapsed}
          />
        </div>
      )}
    </div>
  );
}

function IconFromTablerIo3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (from Tabler.io)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (from Tabler.io)">
          <path d={svgPaths.pf0b4c0} id="Vector" stroke="var(--stroke-0, #7D7D7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function SidebarItem02({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Stok Keluar item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item 02"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <div className="relative shrink-0 size-[16px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <g>
                <path d="M2 4.5L8 4.5M8 4.5L14 4.5M8 4.5V14M8 14L5.5 11.5M8 14L10.5 11.5" stroke="var(--stroke-0, #7D7D7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
              </g>
            </svg>
          </div>
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>Stok Keluar</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItem03({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Semua Laporan item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item 03"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconFromTablerIo3 />
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>Semua Laporan</p>
          )}
        </div>
      </div>
    </div>
  );
}

// New Icon for User Management (using a generic user icon for now)
function IconUserManagement() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (User Management)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (User Management)">
          <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8ZM8 8C4.46373 8 2 10.6863 2 14V16H14V14C14 10.6863 11.5363 8 8 8Z" fill="var(--fill-0, #979797)" />
        </g>
      </svg>
    </div>
  );
}

// New Sidebar Item for User Management
function SidebarItemUserManagement({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Manajemen Pengguna item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item User Management"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconUserManagement />
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>Manajemen Pengguna</p>
          )}
        </div>
      </div>
    </div>
  );
}

// New Icon for Master Data (using a generic database icon for now)
function IconMasterData() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (Master Data)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (Master Data)">
          <path d="M1 5C1 3.34315 4.13401 2 8 2C11.866 2 15 3.34315 15 5M1 5V11C1 12.6569 4.13401 14 8 14C11.866 14 15 12.6569 15 11V5M1 11C1 12.6569 4.13401 14 8 14C11.866 14 15 12.6569 15 11" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

// New Sidebar Item for Master Data
function SidebarItemMasterData({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Master Data item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item Master Data"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconMasterData />
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>Master Data</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Items({ 
  activeMenu, 
  onMenuClick, 
  isMenuOpen, 
  onMenuToggle,
  activeSubMenu,
  onSubMenuClick,
  isCollapsed 
}: { 
  activeMenu: string;
  onMenuClick: (menu: string) => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  activeSubMenu: string;
  onSubMenuClick: (menu: string) => void;
  isCollapsed?: boolean;
}) {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Items">
      <div className="overflow-y-auto size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start p-[8px] relative w-full">
          {!isCollapsed && <Search />}
          <SidebarItem01 
            onClick={() => onMenuClick('dashboard')} 
            isActive={activeMenu === 'dashboard'}
            isCollapsed={isCollapsed}
          />
          <SidebarNest 
            isOpen={isMenuOpen} 
            onToggle={onMenuToggle}
            onSubMenuClick={onSubMenuClick}
            activeSubMenu={activeSubMenu}
            isCollapsed={isCollapsed}
          />
          <SidebarItem02 
            onClick={() => onMenuClick('stock-out')} 
            isActive={activeMenu === 'stock-out'}
            isCollapsed={isCollapsed}
          />
          <SidebarItem03 
            onClick={() => onMenuClick('all-reports')} 
            isActive={activeMenu === 'all-reports'}
            isCollapsed={isCollapsed}
          />
          <SidebarItemMasterData
            onClick={() => onMenuClick('master-data')}
            isActive={activeMenu === 'master-data'}
            isCollapsed={isCollapsed}
          />
          <SidebarItemUserManagement
            onClick={() => onMenuClick('user-management')}
            isActive={activeMenu === 'user-management'}
            isCollapsed={isCollapsed}
          />
          <SidebarItemSalesHistory
            onClick={() => onMenuClick('sales-history')}
            isActive={activeMenu === 'sales-history'}
            isCollapsed={isCollapsed}
          />
          <SidebarItemPurchaseReceipts
            onClick={() => onMenuClick('purchase-receipts')}
            isActive={activeMenu === 'purchase-receipts'}
            isCollapsed={isCollapsed}
          />
          <SidebarItemStockAdjustments
            onClick={() => onMenuClick('stock-adjustments')}
            isActive={activeMenu === 'stock-adjustments'}
            isCollapsed={isCollapsed}
          />
          <SidebarItemStockMovementHistory
            onClick={() => onMenuClick('stock-movement-history')}
            isActive={activeMenu === 'stock-movement-history'}
            isCollapsed={isCollapsed}
          />
          <SidebarItemMinimumStock
            onClick={() => onMenuClick('minimum-stock')}
            isActive={activeMenu === 'minimum-stock'}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Avatar">
      <div className="absolute inset-0 rounded-[24px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[24px]">
          <img alt="" className="absolute h-[218.75%] left-[-28.92%] max-w-none top-[-47.37%] w-[145.83%]" src={imgRectangle1} />
        </div>
      </div>
    </div>
  );
}

function Tag() {
  return (
    <div className="bg-[#578e7e] box-border content-stretch flex gap-[8px] items-center justify-center px-[6px] py-0 relative rounded-[24px] shrink-0" data-name="Tag">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[10px] text-nowrap text-white tracking-[-0.5px] whitespace-pre">Admin</p>
    </div>
  );
}

function Frame1({ profileName, isCollapsed }: { profileName?: string; isCollapsed?: boolean }) {
  if (isCollapsed) return null;
  
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0">
      <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white tracking-[-0.25px] whitespace-pre">{profileName || 'Jibut'}</p>
      <Tag />
    </div>
  );
}

function Info({ profileName, isCollapsed }: { profileName?: string; isCollapsed?: boolean }) {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Info">
      <div className="flex flex-row items-center size-full">
        <div className={`box-border content-stretch flex gap-[12px] h-[40px] items-center px-[20px] py-0 relative w-full ${isCollapsed ? 'justify-center' : ''}`}>
          <Avatar />
          <Frame1 profileName={profileName} isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
}

function IconFromTablerIo4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (from Tabler.io)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (from Tabler.io)">
          <g id="Vector">
            <path d={svgPaths.p7a4cef0} stroke="var(--stroke-0, #7D7D7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            <path d={svgPaths.p19088900} stroke="var(--stroke-0, #7D7D7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function SidebarItem1({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Settings item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconFromTablerIo4 />
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>Pengaturan</p>
          )}
        </div>
      </div>
    </div>
  );
}

function IconFromTablerIo5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (from Tabler.io)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (from Tabler.io)">
          <g id="Vector">
            <path d={svgPaths.p1affee80} fill="var(--fill-0, #E93232)" />
            <path d="M6 8H14L12 6" fill="var(--fill-0, #E93232)" />
            <path d="M12 10L14 8Z" fill="var(--fill-0, #E93232)" />
          </g>
        </g>
      </svg>
    </div>
  );
}


// New Icon for Sales History (using a generic receipt icon for now)
function IconSalesHistory() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (Sales History)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (Sales History)">
          <path d="M13 3H3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44772 13 3 13H13C13.5523 13 14 12.5523 14 12V4C14 3.44772 13.5523 3 13 3Z" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M5 6H11M5 9H11M5 12H8" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

// New Sidebar Item for Sales History
function SidebarItemSalesHistory({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Riwayat Penjualan item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item Sales History"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconSalesHistory />
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>Riwayat Penjualan</p>
          )}
        </div>
      </div>
    </div>
  );
}

// New Icon for Purchase Receipts
function IconPurchaseReceipts() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (Purchase Receipts)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (Purchase Receipts)">
          <path d="M13 3H3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44772 13 3 13H13C13.5523 13 14 12.5523 14 12V4C14 3.44772 13.5523 3 13 3Z" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M5 6H11M5 9H11M5 12H8" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M8 1V3M8 13V15" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

// New Sidebar Item for Purchase Receipts
function SidebarItemPurchaseReceipts({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Penerimaan Pembelian item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item Purchase Receipts"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconPurchaseReceipts />
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>Penerimaan Pembelian</p>
          )}
        </div>
      </div>
    </div>
  );
}

// New Icon for Stock Adjustments
function IconStockAdjustments() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (Stock Adjustments)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (Stock Adjustments)">
          <path d="M8 1V15M1 8H15" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M11 5L8 2L5 5M5 11L8 14L11 11" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

// New Sidebar Item for Stock Adjustments
function SidebarItemStockAdjustments({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Penyesuaian Stok item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item Stock Adjustments"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconStockAdjustments />
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>Penyesuaian Stok</p>
          )}
        </div>
      </div>
    </div>
  );
}

// New Icon for Stock Movement History
function IconStockMovementHistory() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (Stock Movement History)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (Stock Movement History)">
          <path d="M1 1V15H15V1H1ZM1 5H15M1 11H15M5 1V15M11 1V15" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

// New Sidebar Item for Stock Movement History
function SidebarItemStockMovementHistory({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Riwayat Pergerakan Stok item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item Stock Movement History"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconStockMovementHistory />
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>Riwayat Pergerakan Stok</p>
          )}
        </div>
      </div>
    </div>
  );
}

// New Icon for Minimum Stock Indicator
function IconMinimumStock() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon (Minimum Stock)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon (Minimum Stock)">
          <path d="M1 15H15M1 11L5 7L8 10L15 3" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M11 3H15V7" stroke="var(--stroke-0, #979797)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

// New Sidebar Item for Minimum Stock Indicator
function SidebarItemMinimumStock({ onClick, isActive, isCollapsed }: { onClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Indikator Stok Minimum item clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item Minimum Stock"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center size-full pointer-events-none">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconMinimumStock />
          {!isCollapsed && (
            <p className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px] ${isActive ? 'text-white' : 'text-[#7d7d7d]'}`}>Indikator Stok Minimum</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItem2({ onClick, isCollapsed }: { onClick?: () => void; isCollapsed?: boolean }) {
  return (
    <div 
      className={`relative rounded-[24px] shrink-0 w-full cursor-pointer hover:bg-white/10 transition-colors ${isCollapsed ? 'max-w-[60px]' : 'max-w-[320px] min-w-[264px]'}`} 
      data-name="Sidebar item"
      onClick={onClick}
    >
      <div className="flex flex-row items-center size-full">
        <div className={`box-border content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative w-full ${isCollapsed ? 'justify-center px-[8px]' : ''}`}>
          <IconFromTablerIo5 />
          {!isCollapsed && (
            <p className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[14px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] tracking-[-0.25px]">Keluar</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Frame2({ onLogout, onSettingsClick, isActive, isCollapsed }: { onLogout?: () => void; onSettingsClick?: () => void; isActive?: boolean; isCollapsed?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start justify-center relative shrink-0 w-full">
      <SidebarItem1 onClick={onSettingsClick} isActive={isActive} isCollapsed={isCollapsed} />
      <SidebarItem2 onClick={onLogout} isCollapsed={isCollapsed} />
    </div>
  );
}

function User({ onLogout, onSettingsClick, isSettingsActive, profileName, isCollapsed }: { onLogout?: () => void; onSettingsClick?: () => void; isSettingsActive?: boolean; profileName?: string; isCollapsed?: boolean }) {
  return (
    <div className="h-[180px] relative shrink-0 w-full" data-name="User">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] h-[180px] items-center justify-end pb-[24px] pt-[16px] px-[8px] relative w-full">
          <Info profileName={profileName} isCollapsed={isCollapsed} />
          <Frame2 onLogout={onLogout} onSettingsClick={onSettingsClick} isActive={isSettingsActive} isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ 
  onLogout, 
  activeMenu = 'dashboard',
  onMenuChange,
  profileName,
  isCollapsed: externalIsCollapsed,
  onCollapseChange 
}: { 
  onLogout?: () => void;
  activeMenu?: string;
  onMenuChange?: (menu: string) => void;
  profileName?: string;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(activeMenu === 'ingredient-library');
  const [activeSubMenu, setActiveSubMenu] = React.useState(activeMenu === 'ingredient-library' ? 'ingredient-library' : '');
  const [internalIsCollapsed, setInternalIsCollapsed] = React.useState(false);

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;

  React.useEffect(() => {
    console.log('Sidebar mounted/updated. activeMenu:', activeMenu, 'isMenuOpen:', isMenuOpen, 'activeSubMenu:', activeSubMenu);
    if (activeMenu === 'ingredient-library') {
      setIsMenuOpen(true);
      setActiveSubMenu('ingredient-library');
    }
  }, [activeMenu]);

  const handleMenuClick = (menu: string) => {
    console.log('Sidebar handleMenuClick:', menu);
    if (onMenuChange) {
      onMenuChange(menu);
    }
  };

  const handleSubMenuClick = (subMenu: string) => {
    console.log('Sidebar handleSubMenuClick:', subMenu);
    setActiveSubMenu(subMenu);
    if (onMenuChange) {
      console.log('Sidebar calling onMenuChange with:', subMenu);
      onMenuChange(subMenu);
    }
  };

  const handleMenuToggle = () => {
    console.log('Sidebar handleMenuToggle. Current isMenuOpen:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    if (onMenuChange) {
      onMenuChange('settings');
    }
  };

  const handleCollapseClick = () => {
    const newCollapsed = !isCollapsed;
    console.log('Collapse clicked. New state:', newCollapsed);
    setInternalIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  return (
    <div 
      className={`bg-[#313131] content-stretch flex flex-col items-start relative h-full transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`} 
      data-name="Sidebar"
    >
      <Brand onCollapseClick={handleCollapseClick} isCollapsed={isCollapsed} />
      <Items 
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        isMenuOpen={isMenuOpen}
        onMenuToggle={handleMenuToggle}
        activeSubMenu={activeSubMenu}
        onSubMenuClick={handleSubMenuClick}
        isCollapsed={isCollapsed}
      />
      <User onLogout={onLogout} onSettingsClick={handleSettingsClick} isSettingsActive={activeMenu === 'settings'} profileName={profileName} isCollapsed={isCollapsed} />
    </div>
  );
}
