import React from 'react';
import { FaClipboardList } from 'react-icons/fa';

const HopDongCanKhaoSat = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hợp đồng cần khảo sát</h1>
        <p className="text-gray-600">Danh sách các hợp đồng cần được khảo sát</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <FaClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có hợp đồng cần khảo sát</h3>
          <p className="text-gray-500">Các hợp đồng cần khảo sát sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
};

export default HopDongCanKhaoSat;

