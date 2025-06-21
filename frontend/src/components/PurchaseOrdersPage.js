import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Select, MenuItem, FormControl } from '@mui/material';
import CreatePOForm from './CreatePOForm';

const API_URL = 'http://localhost:5000/api';

const PO_STATUSES = ['pending', 'sent', 'acknowledged', 'shipped', 'delivered', 'cancelled'];

const PurchaseOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchOrders = () => {
        setLoading(true);
        axios.get(`${API_URL}/purchase-orders`)
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(error => {
                toast.error("Failed to fetch purchase orders.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, [refreshKey]);

    const handleStatusChange = (po_id, newStatus) => {
        axios.put(`${API_URL}/purchase-orders/${po_id}`, { status: newStatus })
            .then(() => {
                toast.success(`Order ${po_id} updated to ${newStatus}.`);
                fetchOrders(); // Re-fetch to show updated data
            })
            .catch(() => toast.error("Failed to update status."));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <CreatePOForm onPOSubmit={() => setRefreshKey(k => k + 1)} />
            </div>
            <div className="lg:col-span-2">
                <Paper className="p-6 shadow-md">
                    <Typography variant="h6" className="font-bold mb-4">Manage Purchase Orders</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>PO ID</TableCell>
                                    <TableCell>Part SKU</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>ETA</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
                                ) : orders.map((order) => (
                                    <TableRow key={order.po_id}>
                                        <TableCell>{order.po_id}</TableCell>
                                        <TableCell>{order.part_sku}</TableCell>
                                        <TableCell>{order.qty_ordered}</TableCell>
                                        <TableCell>{order.eta ? new Date(order.eta).toLocaleDateString() : 'N/A'}</TableCell>
                                        <TableCell>
                                            <FormControl size="small">
                                                <Select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.po_id, e.target.value)}
                                                >
                                                    {PO_STATUSES.map(status => (
                                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </div>
    );
};

export default PurchaseOrdersPage; 