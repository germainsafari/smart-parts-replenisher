import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-bold rounded-full text-white capitalize";
    const statusClasses = {
      open: "bg-blue-500",
      completed: "bg-green-500",
      pending: "bg-yellow-500 text-black",
      shipped: "bg-purple-500",
      delivered: "bg-green-700",
    };
    const finalStatus = status ? status.toLowerCase() : 'pending';
    return <span className={`${baseClasses} ${statusClasses[finalStatus]}`}>{status}</span>;
  };

const PendingOrders = ({ refreshKey }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios.get(`${API_URL}/purchase-orders`)
      .then(response => setOrders(response.data))
      .catch(error => toast.error("Failed to fetch pending orders."));
  };

  useEffect(() => {
    fetchOrders(); // Fetch initially
  }, [refreshKey]);

  useEffect(() => {
    const intervalId = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);


  return (
    <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
      <h2 className="text-xl font-bold mb-4">Pending Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
            <tr className="border-b">
                <th className="p-2">PO ID</th>
                <th className="p-2">Part SKU</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">ETA</th>
                <th className="p-2">Status</th>
            </tr>
            </thead>
            <tbody>
            {orders.length > 0 ? orders.map((order) => (
                <tr key={order.po_id} className="border-b hover:bg-gray-50">
                <td className="p-2">{order.po_id}</td>
                <td className="p-2">{order.part_sku}</td>
                <td className="p-2">{order.qty_ordered}</td>
                <td className="p-2">{new Date(order.eta).toLocaleDateString()}</td>
                <td className="p-2"><StatusBadge status={order.status} /></td>
                </tr>
            )) : (
                <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">No pending orders found.</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingOrders; 