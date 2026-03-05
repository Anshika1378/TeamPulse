import React, { useState, useEffect } from 'react';
import { FilterProvider } from './context/FilterContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast/ToastContainer';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ActivityPage } from './pages/ActivityPage';
import { SearchOverlay } from './components/Search/SearchOverlay';
import './App.css';

type Page = 'dashboard' | 'activity';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <ThemeProvider>
      <FilterProvider>
        <ToastProvider>
          <div className="app-layout">
            <Header onNavigate={(page) => setCurrentPage(page as Page)} />

            <div className="app-body">
              <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
                <Sidebar
                  currentPage={currentPage}
                  onNavigate={(page) => {
                    setCurrentPage(page);
                    setSidebarOpen(false);
                  }}
                  onOpenSearch={() => setSearchOpen(true)}
                />
              </div>

              <main className="main-content">
                <button
                  className="mobile-menu-btn"
                  onClick={() => setSidebarOpen(true)}
                >
                  ☰
                </button>

                <div className="dashboard-content">
                  {currentPage === 'dashboard' && <Dashboard />}
                  {currentPage === 'activity' && <ActivityPage />}
                </div>
              </main>
            </div>

            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            {sidebarOpen && (
              <div
                className="sidebar-overlay"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </div>
        </ToastProvider>
      </FilterProvider>
    </ThemeProvider>
  );
};

export default App;