import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const ReportSection = ({ title, loading, children }) => (
    <Paper className="p-6 shadow-md mb-8">
        <Typography variant="h6" className="font-bold mb-4">{title}</Typography>
        {loading ? <CircularProgress /> : children}
    </Paper>
);

const ReportsPage = () => {
    const [inventory, setInventory] = useState([]);
    const [spend, setSpend] = useState([]);
    const [velocity, setVelocity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [invRes, spendRes, velRes] = await Promise.all([
                    axios.get(`${API_URL}/reports/inventory`),
                    axios.get(`${API_URL}/reports/spend`),
                    axios.get(`${API_URL}/reports/velocity`)
                ]);
                setInventory(invRes.data);
                setSpend(spendRes.data);
                setVelocity(velRes.data);
            } catch (error) {
                toast.error("Failed to fetch reports.");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    return (
        <div>
            <ReportSection title="Inventory Health" loading={loading}>
                <TableContainer>
                    <Table>
                        <TableHead><TableRow><TableCell>SKU</TableCell><TableCell>Name</TableCell><TableCell>Current Qty</TableCell><TableCell>Min Level</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                        <TableBody>
                            {inventory.map(p => <TableRow key={p.sku}><TableCell>{p.sku}</TableCell><TableCell>{p.name}</TableCell><TableCell>{p.current_qty}</TableCell><TableCell>{p.min_level}</TableCell><TableCell>{p.status}</TableCell></TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ReportSection>

            <ReportSection title="Spend Analytics" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={spend}><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="total_spend" stroke="#8884d8" /></LineChart>
                </ResponsiveContainer>
            </ReportSection>

            <ReportSection title="Part Velocity (Top 10)" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={velocity.slice(0, 10)} layout="vertical"><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={150} /><Tooltip /><Legend /><Bar dataKey="total_requested" fill="#82ca9d" /></BarChart>
                </ResponsiveContainer>
            </ReportSection>
        </div>
    );
};

export default ReportsPage; 