import { useState, useEffect } from 'react';
import { FaProjectDiagram, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { duanAPI } from '../../service/api';

const Duan = () => {
  const [duanList, setDuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDuan, setEditingDuan] = useState(null);
  const [formData, setFormData] = useState({
    maduan: '',
    tenduan: '',
    mota: ''
  });

  useEffect(() => {
    loadDuanList();
  }, []);

  const loadDuanList = async () => {
    try {
      setLoading(true);
      const data = await duanAPI.getAll();
      setDuanList(data);
    } catch (error) {
      console.error('Lỗi tải dự án:', error);
      alert('Không thể tải danh sách dự án');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDuan(null);
    setFormData({
      maduan: '',
      tenduan: '',
      mota: ''
    });
    setShowModal(true);
  };

  const handleEdit = (duan) => {
    setEditingDuan(duan);
    setFormData({
      maduan: duan.maduan || '',
      tenduan: duan.tenduan || '',
      mota: duan.mota || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;
    
    try {
      await duanAPI.delete(id);
      alert('Xóa dự án thành công');
      loadDuanList();
    } catch (error) {
      console.error('Lỗi xóa dự án:', error);
      alert('Không thể xóa dự án');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDuan) {
        await duanAPI.update(editingDuan.id, formData);
        alert('Cập nhật dự án thành công');
      } else {
        await duanAPI.create(formData);
        alert('Tạo dự án thành công');
      }
      setShowModal(false);
      loadDuanList();
    } catch (error) {
      console.error('Lỗi lưu dự án:', error);
      alert(error.message || 'Không thể lưu dự án');
    }
  };

  const filteredDuan = duanList.filter(duan =>
    duan.maduan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duan.tenduan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Dự án</h1>
          <p className="text-gray-600">Quản lý các dự án trong hệ thống</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          <span>Thêm dự án mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc tên dự án..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : filteredDuan.length === 0 ? (
          <div className="text-center py-12">
            <FaProjectDiagram className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có dự án nào</h3>
            <p className="text-gray-500">Bắt đầu bằng cách thêm dự án mới</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã dự án</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dự án</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDuan.map((duan) => (
                  <tr key={duan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {duan.maduan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {duan.tenduan}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {duan.mota || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(duan)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(duan.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingDuan ? 'Sửa dự án' : 'Tạo dự án mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã dự án *</label>
                <input
                  type="text"
                  value={formData.maduan}
                  onChange={(e) => setFormData({ ...formData, maduan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên dự án *</label>
                <input
                  type="text"
                  value={formData.tenduan}
                  onChange={(e) => setFormData({ ...formData, tenduan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.mota}
                  onChange={(e) => setFormData({ ...formData, mota: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editingDuan ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Duan;
