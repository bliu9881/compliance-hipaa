
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './services/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { Report } from './components/Report';
import { History } from './components/History';
import { BAAGenerator } from './components/BAAGenerator';
import { Loader2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [showBAAGenerator, setShowBAAGenerator] = useState(false);

  const navigateTo = (page: string, id?: string) => {
    setCurrentPage(page);
    if (id) setSelectedScanId(id);
    else setSelectedScanId(null);
    
    // Handle BAA generator navigation
    if (page === 'baa-generator') {
      setShowBAAGenerator(true);
    } else {
      setShowBAAGenerator(false);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onStartScan={() => navigateTo('scanner')} onViewReport={(id) => navigateTo('report', id)} />;
      case 'scanner':
        return <Scanner onScanComplete={(id) => navigateTo('report', id)} />;
      case 'report':
        return <Report scanId={selectedScanId} onBack={() => navigateTo('history')} />;
      case 'history':
        return <History onViewReport={(id) => navigateTo('report', id)} />;
      case 'baa-generator':
        return <Dashboard onStartScan={() => navigateTo('scanner')} onViewReport={(id) => navigateTo('report', id)} />;
      default:
        return <Dashboard onStartScan={() => navigateTo('scanner')} onViewReport={(id) => navigateTo('report', id)} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activePage={currentPage} onNavigate={navigateTo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {renderContent()}
          </div>
          <Footer />
        </main>
      </div>
      
      {/* BAA Generator Modal */}
      <BAAGenerator 
        isOpen={showBAAGenerator} 
        onClose={() => {
          setShowBAAGenerator(false);
          setCurrentPage('dashboard');
        }} 
      />
    </div>
  );
};

const AuthSwitch: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <MainLayout /> : <Login />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthSwitch />
    </AuthProvider>
  );
};

export default App;
