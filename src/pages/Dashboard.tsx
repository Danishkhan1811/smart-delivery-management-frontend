// import React, { useEffect, useState } from "react";
// import apiClient from "../utils/apiClient";
// import { Bar } from "react-chartjs-2";

// interface AssignmentMetrics {
//   totalAssigned: number;
//   successRate: number;
//   failureRate: number;
//   failureReasons: { reason: string; count: number }[];
// }

// interface PartnerMetrics {
//   totalPartners: number;
//   activePartners: number;
//   averageRating: number;
//   totalCompletedOrders: number;
//   totalCancelledOrders: number;
// }

// interface OrderMetrics {
//   totalOrders: number;
//   pendingOrders: number;
//   completedOrders: number;
//   pickedOrders: number;
//   totalSales: number; // New field for total sales
// }

// const Dashboard: React.FC = () => {
//   const [assignmentMetrics, setAssignmentMetrics] = useState<AssignmentMetrics | null>(null);
//   const [partnerMetrics, setPartnerMetrics] = useState<PartnerMetrics | null>(null);
//   const [orderMetrics, setOrderMetrics] = useState<OrderMetrics | null>(null);

//   useEffect(() => {
//     // Fetch Assignment Metrics
//     const fetchAssignmentMetrics = async () => {
//       try {
//         const response = await apiClient.get("/assignments/metrics");
//         setAssignmentMetrics(response.data);
//       } catch (error) {
//         console.error("Error fetching assignment metrics:", error);
//       }
//     };

//     // Fetch Partner Metrics
//     const fetchPartnerMetrics = async () => {
//       try {
//         const response = await apiClient.get("/partners"); // Adjust this if needed to fetch metrics
//         const partners = response.data;

//         const totalPartners = partners.length;
//         const activePartners = partners.filter((partner: any) => partner.status === "active").length;
//         const averageRating = partners.reduce((sum: number, partner: any) => sum + partner.metrics.rating, 0) / totalPartners;

//         const totalCompletedOrders = partners.reduce((sum: number, partner: any) => sum + partner.metrics.completedOrders, 0);
//         const totalCancelledOrders = partners.reduce((sum: number, partner: any) => sum + partner.metrics.cancelledOrders, 0);

//         setPartnerMetrics({
//           totalPartners,
//           activePartners,
//           averageRating,
//           totalCompletedOrders,
//           totalCancelledOrders,
//         });
//       } catch (error) {
//         console.error("Error fetching partner metrics:", error);
//       }
//     };

//     // Fetch Order Metrics
//     const fetchOrderMetrics = async () => {
//       try {
//         const response = await apiClient.get("/orders");
//         const orders = response.data;

//         const totalOrders = orders.length;
//         const pendingOrders = orders.filter((order: any) => order.status === "pending").length;
//         const completedOrders = orders.filter((order: any) => order.status === "delivered").length; // Assuming delivered means completed
//         const pickedOrders = orders.filter((order: any) => order.status === "picked").length;
//         const totalSales = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);

//         setOrderMetrics({
//           totalOrders,
//           pendingOrders,
//           completedOrders,
//           pickedOrders,
//           totalSales,
//         });
//       } catch (error) {
//         console.error("Error fetching order metrics:", error);
//       }
//     };

//     fetchAssignmentMetrics();
//     fetchPartnerMetrics();
//     fetchOrderMetrics();
//   }, []);

//   return (
//     <div className="space-y-6 p-6">
//       <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

//       {/* Assignment Metrics */}
//       {assignmentMetrics && (
//         <div className="bg-white p-4 shadow-md rounded-lg space-y-4">
//           <h2 className="text-xl font-bold text-gray-700">Assignment Metrics</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div>Total Assignments: {assignmentMetrics.totalAssigned}</div>
//             <div>Success Rate: {assignmentMetrics.successRate.toFixed(2)}%</div>
//             <div>Failure Rate: {assignmentMetrics.failureRate.toFixed(2)}%</div>
//           </div>
//         </div>
//       )}

//       {/* Partner Metrics */}
//       {partnerMetrics && (
//         <div className="bg-white p-4 shadow-md rounded-lg space-y-4">
//           <h2 className="text-xl font-bold text-gray-700">Delivery Partner Metrics</h2>
//           <div className="grid grid-cols-3 gap-4">
//           <div>Total Partners: {partnerMetrics.totalPartners}</div>
//             <div>Active Partners: {partnerMetrics.activePartners}</div>
//             <div>Average Rating: {partnerMetrics.averageRating.toFixed(2)}</div>
//             <div>Total Completed Orders: {partnerMetrics.totalCompletedOrders}</div>
//             <div>Total Cancelled Orders: {partnerMetrics.totalCancelledOrders}</div>
//           </div>
//         </div>
//       )}

//       {/* Order Metrics */}
//       {orderMetrics && (
//         <div className="bg-white p-4 shadow-md rounded-lg space-y-4">
//           <h2 className="text-xl font-bold text-gray-700">Order Metrics</h2>
//           <div className="grid grid-cols-4 gap-4">
//             <div>Total Orders: {orderMetrics.totalOrders}</div>
//             <div>Pending Orders: {orderMetrics.pendingOrders}</div>
//             <div>Completed Orders: {orderMetrics.completedOrders}</div>
//             <div>Picked Orders: {orderMetrics.pickedOrders}</div>
//             <div>Total Sales: ${orderMetrics.totalSales.toFixed(2)}</div>
//           </div>
//         </div>
//       )}

//       {/* Failure Reasons Chart for Assignments */}
//       {assignmentMetrics && (
//         <div className="bg-white p-4 shadow-md rounded-lg space-y-4">
//           <h3 className="text-lg font-semibold">Failure Reasons</h3>
//           <Bar
//             data={{
//               labels: assignmentMetrics.failureReasons.map((r) => r.reason),
//               datasets: [
//                 {
//                   label: "Failure Reasons",
//                   data: assignmentMetrics.failureReasons.map((r) => r.count),
//                   backgroundColor: "rgba(255, 99, 132, 0.6)",
//                 },
//               ],
//             }}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { display: false },
//               },
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;




import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface AssignmentMetrics {
  totalAssigned: number;
  successRate: number;
  failureRate: number;
  failureReasons: { reason: string; count: number }[];
}

interface PartnerMetrics {
  totalPartners: number;
  activePartners: number;
  averageRating: number;
  totalCompletedOrders: number;
  totalCancelledOrders: number;
}

interface OrderMetrics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  pickedOrders: number;
  totalSales: number;
}

const Dashboard: React.FC = () => {
  const [assignmentMetrics, setAssignmentMetrics] = useState<AssignmentMetrics | null>(null);
  const [partnerMetrics, setPartnerMetrics] = useState<PartnerMetrics | null>(null);
  const [orderMetrics, setOrderMetrics] = useState<OrderMetrics | null>(null);

  useEffect(() => {
    const fetchAssignmentMetrics = async () => {
      try {
        const response = await apiClient.get("/assignments/metrics");
        setAssignmentMetrics(response.data);
      } catch (error) {
        console.error("Error fetching assignment metrics:", error);
      }
    };

    const fetchPartnerMetrics = async () => {
      try {
        const response = await apiClient.get("/partners");
        const partners = response.data;

        const totalPartners = partners.length;
        const activePartners = partners.filter((partner: any) => partner.status === "active").length;
        const averageRating = partners.reduce((sum: number, partner: any) => sum + partner.metrics.rating, 0) / totalPartners;

        const totalCompletedOrders = partners.reduce((sum: number, partner: any) => sum + partner.metrics.completedOrders, 0);
        const totalCancelledOrders = partners.reduce((sum: number, partner: any) => sum + partner.metrics.cancelledOrders, 0);

        setPartnerMetrics({
          totalPartners,
          activePartners,
          averageRating,
          totalCompletedOrders,
          totalCancelledOrders,
        });
      } catch (error) {
        console.error("Error fetching partner metrics:", error);
      }
    };

    const fetchOrderMetrics = async () => {
      try {
        const response = await apiClient.get("/orders");
        const orders = response.data;

        const totalOrders = orders.length;
        const pendingOrders = orders.filter((order: any) => order.status === "pending").length;
        const completedOrders = orders.filter((order: any) => order.status === "delivered").length;
        const pickedOrders = orders.filter((order: any) => order.status === "picked").length;
        const totalSales = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);

        setOrderMetrics({
          totalOrders,
          pendingOrders,
          completedOrders,
          pickedOrders,
          totalSales,
        });
      } catch (error) {
        console.error("Error fetching order metrics:", error);
      }
    };

    fetchAssignmentMetrics();
    fetchPartnerMetrics();
    fetchOrderMetrics();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Assignment Metrics */}
      {assignmentMetrics && (
        <div className="bg-white p-4 shadow-md rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-gray-700">Assignment Metrics</h2>
          <Line
            data={{
              labels: ["Success", "Failure"],
              datasets: [
                {
                  label: "Assignment Rates",
                  data: [assignmentMetrics.successRate, assignmentMetrics.failureRate],
                  backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                  ],
                  borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132,                     1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )}

      {/* Partner Metrics */}
      {partnerMetrics && (
        <div className="bg-white p-4 shadow-md rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-gray-700">Delivery Partner Metrics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>Total Partners: {partnerMetrics.totalPartners}</div>
            <div>Active Partners: {partnerMetrics.activePartners}</div>
            <div>Average Rating: {partnerMetrics.averageRating.toFixed(2)}</div>
            <div>Total Completed Orders: {partnerMetrics.totalCompletedOrders}</div>
            <div>Total Cancelled Orders: {partnerMetrics.totalCancelledOrders}</div>
          </div>
        </div>
      )}

      {/* This is the div where i want you to make changes */}
      <div className="flex justify-between">    
      {/* Order Metrics */}
      {orderMetrics && (
        <div className="bg-white p-4 shadow-md rounded-lg space-y-4 w-[64%]">
          <h2 className="text-xl font-bold text-gray-700">Order Metrics</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>Total Orders: {orderMetrics.totalOrders}</div>
            <div>Pending Orders: {orderMetrics.pendingOrders}</div>
            <div>Completed Orders: {orderMetrics.completedOrders}</div>
            <div>Picked Orders: {orderMetrics.pickedOrders}</div>
            <div>Total Sales: ${orderMetrics.totalSales.toFixed(2)}</div>
          </div>
          {/* Bar Chart for Order Status */}
          <Bar
            data={{
              labels: ['Pending', 'Completed', 'Picked'],
              datasets: [
                {
                  label: 'Order Status',
                  data: [orderMetrics.pendingOrders, orderMetrics.completedOrders, orderMetrics.pickedOrders],
                  backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                  borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )}

      {/* Pie Chart for Completed vs Cancelled Orders */}
      {partnerMetrics && (
        <div className="bg-white p-4 shadow-md rounded-lg space-y-4 w-[34%]">
          <h2 className="text-xl font-bold text-gray-700">Completed vs Cancelled Orders</h2>
          <Pie
            data={{
              labels: ['Completed Orders', 'Cancelled Orders'],
              datasets: [
                {
                  label: 'Order Distribution',
                  data: [partnerMetrics.totalCompletedOrders, partnerMetrics.totalCancelledOrders],
                  backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                  borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
              },
            }}
          />
        </div>
      )}
      </div>


      {/* Failure Reasons Chart for Assignments */}
      {
      assignmentMetrics && (
        <div className="bg-white p-4 shadow-md rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Failure Reasons</h3>
          <Bar
            data={{
              labels: assignmentMetrics.failureReasons.map((r) => r.reason),
              datasets: [
                {
                  label: "Failure Reasons",
                  data: assignmentMetrics.failureReasons.map((r) => r.count),
                  backgroundColor: "rgba(255, 99, 132, 0.6)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )
      }
    </div>
  );
};

export default Dashboard;