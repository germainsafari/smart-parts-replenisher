import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CircularProgress, Paper, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const API_URL = 'http://localhost:5000/api';

const StatCard = ({ title, value, children }) => (
    <Paper className="p-4 shadow-md flex flex-col justify-between">
        <Typography variant="subtitle1" className="text-gray-500">{title}</Typography>
        <Typography variant="h4" className="font-bold">{value}</Typography>
        {children && <div className="mt-2">{children}</div>}
    </Paper>
);

const LowStockAlerts = ({ parts }) => (
    <Paper className="p-4 shadow-md col-span-1 md:col-span-3">
        <Typography variant="h6" className="font-bold mb-2 flex items-center">
            <WarningIcon className="text-orange-500 mr-2" /> Low Stock Alerts
        </Typography>
        <div className="flex flex-wrap gap-2">
            {parts.map(part => (
                <Link to="/requisitions" key={part.part_id} className="bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full hover:bg-orange-200">
                    {part.name} ({part.sku})
                </Link>
            ))}
        </div>
    </Paper>
);

const Dashboard = () => {
    const [kpis, setKpis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/reports/kpis`)
            .then(response => {
                setKpis(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch dashboard KPIs", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><CircularProgress /></div>;
    }

    if (!kpis) {
        return <Typography>Failed to load dashboard data.</Typography>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Stock Value" value={`$${kpis.total_stock_value.toLocaleString()}`} />
            <StatCard title="Low-Stock Items" value={kpis.low_stock_count} />
            <StatCard title="Out-of-Stock Items" value={kpis.out_of_stock_count} />
            <StatCard title="Pending POs" value={kpis.pending_orders_count} />

            <Paper className="p-4 shadow-md col-span-1 md:col-span-2 lg:col-span-4">
                <Typography variant="h6" className="font-bold mb-2">Current Inventory Levels</Typography>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={kpis.inventory_data}>
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} units`} />
                        <Bar dataKey="value">
                            {kpis.inventory_data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value > 25 ? '#3b82f6' : '#f97316'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

            {kpis.low_stock_parts.length > 0 && <LowStockAlerts parts={kpis.low_stock_parts} />}
        </div>
    );
};

export default Dashboard; 