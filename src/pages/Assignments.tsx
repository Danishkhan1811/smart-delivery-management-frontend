import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import apiClient from "../utils/apiClient";

interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface OrderId {
  customer: Customer;
  _id: string;
  orderNumber: string;
  area: string;
  status: string;
}

interface PartnerId {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Assignment {
  _id: string;
  orderId: OrderId;
  partnerId: PartnerId;
  timestamp: string;
  status: string;
  reason: string | null;
}

interface PartnerMetrics {
  partnerName: string;
  successRate: number;
  failureRate: number;
  failureReasons: Record<string, number>;
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [globalSuccessRate, setGlobalSuccessRate] = useState<number>(0);
  const [globalFailureRate, setGlobalFailureRate] = useState<number>(0);
  const [globalFailureReasons, setGlobalFailureReasons] = useState<Record<string, number>>({});
  const [partnerMetrics, setPartnerMetrics] = useState<PartnerMetrics[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Fetch all assignments
  const fetchAssignments = async () => {
    try {
      const response = await apiClient.get("/assignments");
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  // Fetch global metrics (success rate, failure rate, and failure reasons)
  const fetchGlobalMetrics = async () => {
    try {
      const response = await apiClient.get("/assignments/metrics");
      setGlobalSuccessRate(response.data.successRate);
      setGlobalFailureRate(response.data.failureRate);
      setGlobalFailureReasons(response.data.failureReasons);
    } catch (error) {
      console.error("Error fetching global metrics:", error);
    }
  };

  // Fetch individual partner metrics
  const fetchPartnerMetrics = async () => {
    try {
      const partners = [...new Set(assignments.map((assignment) => assignment.partnerId?.name).filter(Boolean))];
      const metricsPromises = partners.map((partnerName) =>
        apiClient.get(`/assignments/partner/${partnerName}/metrics`)
      );
      const metricsResponses = await Promise.all(metricsPromises);
      setPartnerMetrics(metricsResponses.map((res) => res.data));
    } catch (error) {
      console.error("Error fetching partner metrics:", error);
    }
  };
  

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  useEffect(() => {
    fetchAssignments();
    fetchGlobalMetrics();
  }, []);

  useEffect(() => {
    if (assignments.length > 0) {
      fetchPartnerMetrics();
    }
  }, [assignments]);

  const filteredAssignments = filterStatus
    ? assignments.filter((assignment) => assignment.status === filterStatus)
    : assignments;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>

      {/* Global Metrics */}
      <div className="space-y-2">
        <div>
          <strong>Global Success Rate:</strong> {globalSuccessRate}%
        </div>
        <div>
          <strong>Global Failure Rate:</strong> {globalFailureRate}%
        </div>
        <div>
          <strong>Global Failure Reasons:</strong>
          <ul>
            {Object.entries(globalFailureReasons).map(([reason, count]) => (
              <li key={reason}>
                {reason}: {count} assignments
              </li>
            ))}
          </ul>
        </div>
      </div>

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
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Partner Metrics */}
      <div className="space-y-4">
        {partnerMetrics.map((partnerMetric) => (
          <div key={partnerMetric.partnerName}>
            <h3 className="font-semibold">{partnerMetric.partnerName} Metrics</h3>
            <div>
              <strong>Success Rate:</strong> {partnerMetric.successRate}%
            </div>
            <div>
              <strong>Failure Rate:</strong> {partnerMetric.failureRate}%
            </div>
            <div>
              <strong>Failure Reasons:</strong>
              <ul>
                {Object.entries(partnerMetric.failureReasons).map(([reason, count]) => (
                  <li key={reason}>
                    {reason}: {count} assignments
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Assignments Table */}
      <Table
        headers={["Order Number", "Partner", "Status", "Failure Reason", "Actions"]}
        data={filteredAssignments.map((assignment) => ({
          _id: assignment._id,
          orderNumber: assignment.orderId.orderNumber,
          // partnerName: assignment.partnerId.name,
          partnerName: assignment.partnerId?.name || "Unknown Partner",
          status: assignment.status,
          failureReason: assignment.reason || "N/A",
        }))}
        onDelete={(id) => {
          console.log("Delete assignment with _id:", id);
          // Implement deletion logic here
        }}
      />
    </div>
  );
};

export default Assignments;