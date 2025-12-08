import React from 'react';
import { FaBalanceScale } from 'react-icons/fa';

const Comparison = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">So sánh Thực tế</h1>
        <p className="text-gray-600">So sánh volume dự toán và volume thực tế sau khảo sát</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <FaBalanceScale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có dữ liệu so sánh</h3>
          <p className="text-gray-500">Dữ liệu so sánh sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
};

export default Comparison;

