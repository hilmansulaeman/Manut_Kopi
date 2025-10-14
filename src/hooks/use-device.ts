import * as React from "react";

const MOBILE_BREAKPOINT = 640; // sm breakpoint
const TABLET_BREAKPOINT = 1024; // lg breakpoint

export type DeviceType = "mobile" | "tablet" | "desktop";

export function useDevice() {
  const [device, setDevice] = React.useState<DeviceType>("desktop");

  React.useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setDevice("mobile");
      } else if (width < TABLET_BREAKPOINT) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return {
    device,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
    isMobileOrTablet: device === "mobile" || device === "tablet",
  };
}
