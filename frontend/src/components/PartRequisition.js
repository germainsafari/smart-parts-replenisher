import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, FormHelperText } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const PartRequisition = ({ onRequisitionSubmit }) => {
  const [parts, setParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [neededBy, setNeededBy] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/parts`)
      .then(response => setParts(response.data))
      .catch(error => toast.error("Failed to fetch parts."));
  }, []);

  const selectedPart = parts.find(p => p.part_id === selectedPartId);
  const availableStock = selectedPart ? selectedPart.current_qty : 0;
  const isStockError = selectedPart && quantity > availableStock;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPartId || quantity <= 0) {
      toast.error("Please select a part and enter a valid quantity.");
      return;
    }
    if (isStockError) {
      toast.error("Cannot requisition more than the available stock.");
      return;
    }

    setLoading(true);

    const payload = {
        part_id: selectedPartId,
        quantity: quantity,
        needed_by: neededBy || null
    };

    axios.post(`${API_URL}/requisitions`, payload)
      .then(response => {
        toast.success("Requisition submitted successfully!");
        // Refresh parts list to get updated quantities
        axios.get(`${API_URL}/parts`).then(res => setParts(res.data));
        setSelectedPartId('');
        setQuantity(1);
        setNeededBy('');
        if (onRequisitionSubmit) onRequisitionSubmit();
      })
      .catch(error => {
        const errorMsg = error.response?.data?.error || "Failed to submit requisition.";
        toast.error(errorMsg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Part Requisition</h2>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth className="mb-4">
          <InputLabel>Part</InputLabel>
          <Select label="Part" value={selectedPartId} onChange={e => setSelectedPartId(e.target.value)}>
            {parts.map(part => (
              <MenuItem key={part.part_id} value={part.part_id}>{part.sku} - {part.name}</MenuItem>
            ))}
          </Select>
          {selectedPart && <FormHelperText>Available Stock: {availableStock}</FormHelperText>}
        </FormControl>
        <FormControl fullWidth className="mb-4" error={isStockError}>
            <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
            />
            {isStockError && <FormHelperText>Quantity exceeds available stock.</FormHelperText>}
        </FormControl>
        <TextField
            fullWidth
            type="date"
            label="Needed By (Optional)"
            value={neededBy}
            onChange={e => setNeededBy(e.target.value)}
            className="mb-4"
            InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading || isStockError}>
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default PartRequisition; 