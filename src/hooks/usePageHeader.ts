import { useEffect, useState } from 'react';

interface PageHeaderConfig {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

// Global state for page header
let currentPageHeader: PageHeaderConfig | null = null;
let headerUpdateCallback: ((config: PageHeaderConfig | null) => void) | null = null;

export const usePageHeader = (config?: PageHeaderConfig) => {
  useEffect(() => {
    if (config) {
      currentPageHeader = config;
      if (headerUpdateCallback) {
        headerUpdateCallback(config);
      }
    }

    return () => {
      currentPageHeader = null;
      if (headerUpdateCallback) {
        headerUpdateCallback(null);
      }
    };
  }, [config?.title, config?.subtitle, config?.actions]);

  const setPageHeader = (newConfig: PageHeaderConfig) => {
    currentPageHeader = newConfig;
    if (headerUpdateCallback) {
      headerUpdateCallback(newConfig);
    }
  };

  const clearPageHeader = () => {
    currentPageHeader = null;
    if (headerUpdateCallback) {
      headerUpdateCallback(null);
    }
  };

  return { setPageHeader, clearPageHeader };
};

export const useHeaderState = () => {
  const [headerConfig, setHeaderConfig] = useState<PageHeaderConfig | null>(currentPageHeader);

  useEffect(() => {
    headerUpdateCallback = setHeaderConfig;
    return () => {
      headerUpdateCallback = null;
    };
  }, []);

  return headerConfig;
};