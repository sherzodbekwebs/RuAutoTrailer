import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ContactsPage from './pages/ContactsPage.jsx';
import { INITIAL_PRODUCTS } from './constants.js';
import { db, auth, productsCollection, handleFirestoreError, OperationType } from './lib/firebase';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

const ProtectedRoute = ({ children, user, loading }) => {
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      {/* Spinner mobil qurilmalarda ham markazda va mos o'lchamda bo'lishi uchun */}
      <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppContent({ products, user, loading, onLogin, onLogout, updateProducts }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');
  const hideHeaderFooter = isLoginPage || isAdminPage;

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {!hideHeaderFooter && <Header />}
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/product/:id" element={<ProductPage products={products} />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user} loading={loading}>
                <AdminPage products={products} onUpdate={updateProducts} onLogout={onLogout} />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session check for auth
    const sessionUser = sessionStorage.getItem('admin_session');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
    setLoading(false);

    // Fetch products
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    const unsubscribeDocs = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (data.length === 0) {
        setProducts(INITIAL_PRODUCTS);
      } else {
        setProducts(data);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => {
      unsubscribeDocs();
    };
  }, []);

  const login = () => {
    const adminUser = { id: 'admin', role: 'administrator' };
    setUser(adminUser);
    sessionStorage.setItem('admin_session', JSON.stringify(adminUser));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('admin_session');
  };

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent 
          products={products} 
          user={user} 
          loading={loading} 
          onLogin={login}
          onLogout={logout}
          updateProducts={updateProducts} 
        />
      </BrowserRouter>
    </HelmetProvider>
  );
}