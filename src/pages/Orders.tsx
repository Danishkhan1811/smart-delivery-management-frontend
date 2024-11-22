import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import apiClient from "../utils/apiClient";

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  status: string;
  createdAt: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await apiClient.put(`/orders/${orderId}/status`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: response.data.status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  //Delete an order

  const handleDelete = async (_id: string) => {
    try {
      // Confirm deletion
      const confirmDelete = window.confirm("Are you sure you want to delete this order?");
      if (!confirmDelete) return;

      // Call the API to delete the order
      await apiClient.delete(`/orders/${_id}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== _id)); // Remove from local state
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

      {/* Filter Dropdown */}
      <div className="flex items-center space-x-4">
        <label htmlFor="statusFilter" className="text-gray-700">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded-md"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="picked">Picked</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <Table
        headers={["Order Number", "Customer", "Status", "Actions"]}
        data={filteredOrders.map((order) => ({
          _id: order._id, // Ensure _id is included
          orderNumber: order.orderNumber,
          customer: `${order.customer.name} (${order.customer.phone})`,
          status: order.status,
        }))}
        onEdit={(order) => {
          // Extract _id for usage
          const { _id } = order;
          const newStatus = prompt("Enter new status (pending, assigned, picked, delivered):");
          if (newStatus) updateOrderStatus(_id, newStatus); // Use the _id for updating
        }}
        onDelete={handleDelete} // Receives only _id
      />

    </div>
  );
};

export default Orders;