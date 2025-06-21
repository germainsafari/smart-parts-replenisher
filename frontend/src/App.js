import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PendingOrders from './components/PendingOrders';
import PartRequisition from './components/PartRequisition';
import RequisitionsPage from './components/RequisitionsPage';
import PurchaseOrdersPage from './components/PurchaseOrdersPage';
import ReportsPage from './components/ReportsPage';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const MainLayout = ({ children }) => (
    <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Smart Parts Replenisher</h1>
            <div className="flex items-center space-x-4">
                <NotificationsIcon className="text-gray-500" />
                <AccountCircleIcon className="text-gray-500" fontSize="large" />
            </div>
        </header>
        <main>{children}</main>
    </div>
);

const DashboardPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    return(
        <>
            <div className="mb-8">
                <Dashboard />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <PendingOrders refreshKey={refreshKey} />
                </div>
                <div>
                    <PartRequisition onRequisitionSubmit={() => setRefreshKey(k => k + 1)} />
                </div>
            </div>
        </>
    )
}


function App() {
  return (
    <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <Routes>
            <Route path="/" element={<MainLayout><DashboardPage /></MainLayout>} />
            {/* Define other pages below */}
            <Route path="/requisitions" element={<MainLayout><RequisitionsPage /></MainLayout>} />
            <Route path="/purchase-orders" element={<MainLayout><PurchaseOrdersPage /></MainLayout>} />
            <Route path="/reports" element={<MainLayout><ReportsPage /></MainLayout>} />
        </Routes>
        </div>
    </Router>
  );
}

export default App; 