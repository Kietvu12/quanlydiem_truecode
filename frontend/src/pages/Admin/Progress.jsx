import React from 'react';
import { FaTasks } from 'react-icons/fa';

const Progress = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tiến trình</h1>
        <p className="text-gray-600">Theo dõi tiến trình thi công của các trạm</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <FaTasks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có dữ liệu tiến trình</h3>
          <p className="text-gray-500">Dữ liệu tiến trình sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
};

export default Progress;

