import React from 'react';
import { FaBalanceScale } from 'react-icons/fa';

const ChenhLech = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chênh lệch Hợp đồng</h1>
        <p className="text-gray-600">Theo dõi chênh lệch volume và giá trị của các hợp đồng</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <FaBalanceScale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có dữ liệu chênh lệch</h3>
          <p className="text-gray-500">Dữ liệu chênh lệch sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
};

export default ChenhLech;

