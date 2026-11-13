import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

type LightboxMeta = {
  open: boolean;
  body: ReactNode;
};

type LightboxContextType = {
  lightbox: LightboxMeta;
  openLightbox: (body: ReactNode) => void;
  closeLightbox: () => void;
  clearLightbox: () => void;
};

const defaultValues: LightboxContextType = {
  lightbox: { open: false, body: null },
  openLightbox: () => {},
  closeLightbox: () => {},
  clearLightbox: () => {},
};

export const LightboxContext =
  createContext<LightboxContextType>(defaultValues);

export const LightboxProvider = ({ children }: { children: ReactNode }) => {
  const [lightbox, setLightbox] = useState<LightboxMeta>(
    defaultValues.lightbox,
  );

  const openLightbox = useCallback((body: ReactNode) => {
    setLightbox({ open: true, body });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => (prev.open ? { ...prev, open: false } : prev));
  }, []);

  const clearLightbox = useCallback(() => {
    setLightbox((prev) => (prev.open ? prev : { open: false, body: null }));
  }, []);

  const value = useMemo(
    () => ({ lightbox, openLightbox, closeLightbox, clearLightbox }),
    [lightbox, openLightbox, closeLightbox, clearLightbox],
  );

  return (
    <LightboxContext.Provider value={value}>
      {children}
    </LightboxContext.Provider>
  );
};
