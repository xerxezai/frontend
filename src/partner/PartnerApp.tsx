import { Suspense, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PartnerLogin from './pages/PartnerLogin';
import PartnerLayout from './components/PartnerLayout';
import PartnerDashboard from './pages/PartnerDashboard';
import SubmitDeal from './pages/SubmitDeal';
import MyDeals from './pages/MyDeals';
import CommissionTracker from './pages/CommissionTracker';
import TrainingMaterials from './pages/TrainingMaterials';
import MarketingMaterials from './pages/MarketingMaterials';
import PartnerProfile from './pages/PartnerProfile';
import { isPartnerLoggedIn } from './api/partnerApi';
import { CREAM, FF } from './constants';

const Loader = () => (
  <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FF, color: '#9b9690' }}>
    Loading…
  </div>
);

const PartnerApp = () => {
  const [authed, setAuthed] = useState(isPartnerLoggedIn());

  if (!authed) {
    return <PartnerLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <PartnerLayout onLogout={() => setAuthed(false)}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PartnerDashboard />} />
          <Route path="submit-deal" element={<SubmitDeal />} />
          <Route path="deals" element={<MyDeals />} />
          <Route path="commission" element={<CommissionTracker />} />
          <Route path="training" element={<TrainingMaterials />} />
          <Route path="marketing" element={<MarketingMaterials />} />
          <Route path="profile" element={<PartnerProfile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </PartnerLayout>
  );
};

export default PartnerApp;
