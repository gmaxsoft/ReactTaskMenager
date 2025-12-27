import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/layout/Layout';
import { useAuthStore } from './store/authStore';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Layout />;
  }

  return (
    <>
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </>
  );
}

export default App;
