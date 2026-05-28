import React, { createContext, useContext, ReactNode } from 'react';

type AdminContextType = {
  editMode: boolean;
};

const AdminContext = createContext<AdminContextType>({ editMode: false });

export function AdminProvider({ editMode, children }: { editMode: boolean; children: ReactNode }) {
  return <AdminContext.Provider value={{ editMode }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  return useContext(AdminContext);
}
