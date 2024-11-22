import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import apiClient from "../utils/apiClient";

interface Partner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  currentLoad: number;
}

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
  });

  const fetchPartners = async () => {
    try {
      const response = await apiClient.get("/partners");
      setPartners(response.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const handleDelete = async (_id: string) => {
    console.log("Deleting partner with _id:", _id);
    if (!_id) {
      console.error("Partner _id is undefined");
      return;
    }

    try {
      await apiClient.delete(`/partners/${_id}`);
      setPartners((prev) => prev.filter((partner) => partner._id !== _id));
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  const handleEdit = (partner: Partner) => {
    setFormData({
      name: partner.name,
      email: partner.email,
      phone: partner.phone,
      status: partner.status,
    });
    setEditPartner(partner);
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const { name, value, checked, type } = target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (target instanceof HTMLSelectElement) {
      const { name, value } = target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPartner) return;

    try {
      const updatedPartner = await apiClient.put(`/partners/${editPartner._id}`, formData);
      setPartners((prev) =>
        prev.map((partner) =>
          partner._id === updatedPartner.data._id ? updatedPartner.data : partner
        )
      );
      setModalOpen(false);
      setEditPartner(null);
    } catch (error) {
      console.error("Error updating partner:", error);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Partners</h1>
      <Table
        headers={["Name", "Email", "Phone", "Status", "Current Load"]}
        data={partners.map((partner) => ({
          _id: partner._id,
          name: partner.name,
          email: partner.email,
          phone: partner.phone,
          status: partner.status,
          currentLoad: partner.currentLoad,
        }))}
        onDelete={handleDelete}
        onEdit={handleEdit} // Pass the edit handler
      />

      {/* Modal for Editing Partner */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Partner</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Partners;