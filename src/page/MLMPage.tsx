import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CustomLayout from '../components/layout/CustomLayout';
import BreadcrumbSection from '../components/breadcrumb/BreadcrumbSection';
import MLMLogin from '../components/mlm/MLMLogin';
import MLMDashboard from '../components/mlm/MLMDashboard';

const MLMPage = () => {
  const [searchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      try {
        const tokens = JSON.parse(stored);
        setIsAuthenticated(!!tokens.access);
      } catch {
        setIsAuthenticated(false);
      }
    }

    // Store referral code from URL query ?ref=CODE
    const refCode = searchParams.get('ref');
    if (refCode) {
      sessionStorage.setItem('mlm_referrer_code', refCode);
    }
  }, [searchParams]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_tokens');
    setIsAuthenticated(false);
  };

  return (
    <CustomLayout>
      <BreadcrumbSection title="Partner Network" />
      <section className="mlm-page-section section-padding fix">
        <div className="container">
          {!isAuthenticated ? (
            <MLMLogin onSuccess={handleLoginSuccess} />
          ) : (
            <MLMDashboard onLogout={handleLogout} />
          )}
        </div>
      </section>
    </CustomLayout>
  );
};

export default MLMPage;
