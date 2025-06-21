import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const CreatePOForm = ({ onPOSubmit }) => {
    const [parts, setParts] = useState([]);
    const [selectedPartId, setSelectedPartId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${API_URL}/parts`)
            .then(response => setParts(response.data))
            .catch(error => toast.error("Failed to fetch parts."));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedPartId || quantity <= 0) {
            toast.error("Please select a part and enter a valid quantity.");
            return;
        }

        setLoading(true);
        axios.post(`${API_URL}/purchase-orders`, { part_id: selectedPartId, quantity: quantity })
            .then(() => {
                toast.success("Purchase Order created successfully!");
                setSelectedPartId('');
                setQuantity(1);
                if (onPOSubmit) onPOSubmit();
            })
            .catch(() => toast.error("Failed to create Purchase Order."))
            .finally(() => setLoading(false));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Create Purchase Order</h2>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth className="mb-4">
                    <InputLabel>Part</InputLabel>
                    <Select label="Part" value={selectedPartId} onChange={e => setSelectedPartId(e.target.value)}>
                        {parts.map(part => (
                            <MenuItem key={part.part_id} value={part.part_id}>{part.sku} - {part.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    InputProps={{ inputProps: { min: 1 } }}
                    className="mb-4"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Create PO'}
                </Button>
            </form>
        </div>
    );
};

export default CreatePOForm; 