import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ContextData {
  isMenuOpen: boolean;
  toggleMobileMenu: () => void;
  isVideoModalOpen: boolean;
  toggleVideoModal: () => void;
}

const Context = createContext<ContextData | undefined>(undefined);

interface ContextProviderProps {
  children: ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  // Mobile Menu modal
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // Mobile Menu modal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  const toggleVideoModal = () => {
    setIsVideoModalOpen(!isVideoModalOpen);
  };

  // Return
  const contextValue: ContextData = {
    isMenuOpen,
    toggleMobileMenu,
    isVideoModalOpen,
    toggleVideoModal,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useCustomContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useCustomContext must be used within an ContextProvider");
  }
  return context;
};
