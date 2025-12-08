import React from 'react';
import { FaHistory } from 'react-icons/fa';

const LichSuKhaoSat = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử Khảo sát</h1>
        <p className="text-gray-600">Xem lại lịch sử các lần khảo sát đã thực hiện</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <FaHistory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có lịch sử khảo sát</h3>
          <p className="text-gray-500">Lịch sử khảo sát sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
};

export default LichSuKhaoSat;

