import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Order } from '@/types';

const USER_KEY = 'shopnest_user';
const ORDERS_KEY = 'shopnest_orders';
const RECENTLY_VIEWED_KEY = 'shopnest_recently_viewed';

interface AuthContextValue {
  user: User | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  updateUser: (name: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Order) => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

interface RecentlyViewedValue {
  ids: string[];
  addRecentlyViewed: (id: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedValue | undefined>(
  undefined
);

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function loadRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(
    loadRecentlyViewed
  );

  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const login = useCallback((email: string) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ');
    setUser({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
    });
  }, []);

  const signup = useCallback((name: string, email: string) => {
    setUser({ name, email });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateUser = useCallback(
    (name: string) => {
      setUser((prev) => (prev ? { ...prev, name } : prev));
    },
    []
  );

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const addRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p !== id);
      return [id, ...filtered].slice(0, 8);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateUser }}
    >
      <OrdersContext.Provider value={{ orders, addOrder }}>
        <RecentlyViewedContext.Provider
          value={{ ids: recentlyViewed, addRecentlyViewed }}
        >
          {children}
        </RecentlyViewedContext.Provider>
      </OrdersContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AppProvider');
  return ctx;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within AppProvider');
  return ctx;
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx)
    throw new Error('useRecentlyViewed must be used within AppProvider');
  return ctx;
}
