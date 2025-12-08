import React from 'react';
import { FaChartBar } from 'react-icons/fa';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo</h1>
        <p className="text-gray-600">Xem và xuất các báo cáo thống kê</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <FaChartBar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có báo cáo nào</h3>
          <p className="text-gray-500">Các báo cáo sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;

