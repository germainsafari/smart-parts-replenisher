import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const RequisitionHistory = ({ refreshKey }) => {
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequisitions = () => {
        setLoading(true);
        axios.get(`${API_URL}/requisitions`)
            .then(response => {
                setRequisitions(response.data);
                setLoading(false);
            })
            .catch(error => {
                toast.error("Failed to fetch requisition history.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRequisitions();
    }, [refreshKey]);

    return (
        <Paper className="p-6 shadow-md">
            <Typography variant="h6" className="font-bold mb-4">Requisition History</Typography>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Part Name</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Requested By</TableCell>
                            <TableCell>Needed By</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : requisitions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No requisitions found.</TableCell>
                            </TableRow>
                        ) : (
                            requisitions.map(req => (
                                <TableRow key={req.req_item_id} hover>
                                    <TableCell>{req.req_id}</TableCell>
                                    <TableCell>{req.part_name}</TableCell>
                                    <TableCell>{req.part_sku}</TableCell>
                                    <TableCell>{req.qty_requested}</TableCell>
                                    <TableCell>{req.username}</TableCell>
                                    <TableCell>{req.needed_by ? new Date(req.needed_by).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>{new Date(req.created_at).toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default RequisitionHistory; 