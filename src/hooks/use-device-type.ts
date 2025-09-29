'use client';

import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  screenWidth: number;
  screenHeight: number;
}

export function useDeviceType(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Detectar si es dispositivo táctil
      const isTouchDevice = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );

      // Detectar user agent para dispositivos móviles conocidos
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod',
        'blackberry', 'windows phone', 'mobile', 'opera mini'
      ];

      const isMobileUserAgent = mobileKeywords.some(keyword =>
        userAgent.includes(keyword)
      );

      // Lógica de detección basada en ancho de pantalla y características
      let type: DeviceType;
      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;

      if (width < 768) {
        type = 'mobile';
        isMobile = true;
      } else if (width < 1024 && (isTouchDevice || isMobileUserAgent)) {
        type = 'tablet';
        isTablet = true;
      } else {
        type = 'desktop';
        isDesktop = true;
      }

      // Override para dispositivos móviles detectados por user agent
      if (isMobileUserAgent && width < 1024) {
        if (width < 768) {
          type = 'mobile';
          isMobile = true;
          isTablet = false;
          isDesktop = false;
        } else {
          type = 'tablet';
          isMobile = false;
          isTablet = true;
          isDesktop = false;
        }
      }

      setDeviceInfo({
        type,
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        screenWidth: width,
        screenHeight: height,
      });
    };

    // Detectar al montar
    detectDevice();

    // Detectar al cambiar el tamaño de ventana
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);

    // También detectar cambios de orientación en móviles
    window.addEventListener('orientationchange', () => {
      // Pequeño delay para que se actualicen las dimensiones
      setTimeout(detectDevice, 100);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return deviceInfo;
}

// Hook auxiliar para casos simples
export function useIsMobile(): boolean {
  const { isMobile } = useDeviceType();
  return isMobile;
}

export function useIsDesktop(): boolean {
  const { isDesktop } = useDeviceType();
  return isDesktop;
}