import React from "react";

interface TableProps<T> {
  headers: string[];
  data: T[];
  onEdit?: (item: T) => void; // Flexible: accepts an entire object
  onDelete?: (id: string) => void; // Specifically for _id
}

const Table = <T extends { _id: string }>({
  headers,
  data,
  onEdit,
  onDelete,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header) => (
              <th
                key={header}
                className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
              >
                {header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border border-gray-300">
              {Object.entries(row).map(([key, value], index) => {
                if (key !== "_id") {
                  return (
                    <td
                      key={index}
                      className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                    >
                      {String(value)}
                    </td>
                  );
                }
                return null;
              })}
              {(onEdit || onDelete) && (
                <td className="border border-gray-300 px-4 py-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)} // Pass the entire row to onEdit
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row._id)} // Pass only _id to onDelete
                      className="text-red-500 hover:underline ml-2"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;