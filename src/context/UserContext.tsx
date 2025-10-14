import React, { createContext, useState, useContext, ReactNode } from 'react';

export type UserRole = "Super Admin" | "Admin" | "Employee" | "Cashier" | "Customer";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // NOTE: In a real application, passwords should be hashed and not stored directly. This is for demonstration purposes.
  role: UserRole;
  status: "active" | "inactive";
  phone?: string;
  address?: string;
  memberCode?: string; // For Customer role
}

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'status'> & { password?: string }) => void; // Allow password for addUser
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Super Admin', email: 'superadmin@example.com', password: 'password123', role: 'Super Admin', status: 'active' },
    { id: '2', name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'Admin', status: 'active' },
    { id: '3', name: 'Employee One', email: 'employee1@example.com', password: 'password123', role: 'Employee', status: 'active' },
    { id: '4', name: 'Cashier Alpha', email: 'cashier1@example.com', password: 'password123', role: 'Cashier', status: 'active' },
    { id: '5', name: 'Customer Beta', email: 'customer1@example.com', password: 'password123', role: 'Customer', status: 'active', memberCode: 'CUST001' },
  ]);

  const addUser = (newUser: Omit<User, 'id' | 'status'> & { password?: string }) => {
    const id = (users.length + 1).toString(); // Simple ID generation
    setUsers((prevUsers) => [...prevUsers, { ...newUser, id, status: 'active' }]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const deleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
