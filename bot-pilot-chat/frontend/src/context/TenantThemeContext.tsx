import React, { createContext, useContext, useState } from 'react';
import type { TenantTheme } from '../theme/tenantTheme.ts';
import { DEFAULT_TENANT_THEME } from '../theme/tenantTheme.ts';

const TenantThemeContext = createContext<TenantTheme>(DEFAULT_TENANT_THEME);

export const TenantThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<TenantTheme>(DEFAULT_TENANT_THEME);
  // TODO: accept a tenantId prop, fetch theme from backend, call setTheme
  return <TenantThemeContext.Provider value={theme}>{children}</TenantThemeContext.Provider>;
};

export const useTenantTheme = (): TenantTheme => useContext(TenantThemeContext);
