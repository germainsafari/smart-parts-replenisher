import React, { useState } from 'react';
import PartRequisition from './PartRequisition';
import RequisitionHistory from './RequisitionHistory';

const RequisitionsPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRequisitionSubmit = () => {
        setRefreshKey(k => k + 1);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <PartRequisition onRequisitionSubmit={handleRequisitionSubmit} />
            </div>
            <div className="lg:col-span-2">
                <RequisitionHistory refreshKey={refreshKey} />
            </div>
        </div>
    );
};

export default RequisitionsPage; 