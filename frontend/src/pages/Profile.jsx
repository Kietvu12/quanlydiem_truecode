import { useState, useEffect } from 'react';
import { HiUser } from 'react-icons/hi';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const isAdmin = user && user.la_admin === 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isAdmin ? 'Hồ sơ cá nhân' : 'Thông tin tài khoản'}
        </h1>
        <p className="text-gray-600">Xem và quản lý thông tin tài khoản của bạn</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {user ? (
          <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <HiUser className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.ten || 'Người dùng'}</h2>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {isAdmin ? 'Quản trị viên' : user.vaitro || 'Kỹ thuật viên'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {user.ten || 'Chưa có'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {user.email || 'Chưa có'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {isAdmin ? 'Quản trị viên' : user.vaitro || 'Kỹ thuật viên'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày tạo</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {user.ngaytao ? new Date(user.ngaytao).toLocaleDateString('vi-VN') : 'Chưa có'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <HiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy thông tin</h3>
            <p className="text-gray-500">Vui lòng đăng nhập lại</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

