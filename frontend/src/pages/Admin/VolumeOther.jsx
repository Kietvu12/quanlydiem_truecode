import { useState, useEffect } from 'react';
import { FaDatabase, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { thuVienVolumeKhacAPI } from '../../service/api';

const VolumeOther = () => {
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVolume, setEditingVolume] = useState(null);
  const [formData, setFormData] = useState({
    mavolume: '',
    tenvolume: '',
    giadonvi: '10',
    mota: ''
  });

  useEffect(() => {
    loadVolumes();
  }, []);

  const loadVolumes = async () => {
    try {
      setLoading(true);
      const data = await thuVienVolumeKhacAPI.getAll();
      setVolumes(data);
    } catch (error) {
      console.error('Lỗi tải volume:', error);
      alert('Không thể tải danh sách volume');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVolume(null);
    setFormData({
      mavolume: '',
      tenvolume: '',
      giadonvi: '10',
      mota: ''
    });
    setShowModal(true);
  };

  const handleEdit = (volume) => {
    setEditingVolume(volume);
    setFormData({
      mavolume: volume.mavolume || '',
      tenvolume: volume.tenvolume || '',
      giadonvi: volume.giadonvi || '10',
      mota: volume.mota || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa volume này?')) return;
    
    try {
      await thuVienVolumeKhacAPI.delete(id);
      alert('Xóa volume thành công');
      loadVolumes();
    } catch (error) {
      console.error('Lỗi xóa volume:', error);
      alert('Không thể xóa volume');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        giadonvi: parseFloat(formData.giadonvi) || 0
      };
      
      if (editingVolume) {
        await thuVienVolumeKhacAPI.update(editingVolume.id, submitData);
        alert('Cập nhật volume thành công');
      } else {
        await thuVienVolumeKhacAPI.create(submitData);
        alert('Tạo volume thành công');
      }
      setShowModal(false);
      loadVolumes();
    } catch (error) {
      console.error('Lỗi lưu volume:', error);
      alert(error.message || 'Không thể lưu volume');
    }
  };

  const filteredVolumes = volumes.filter(volume =>
    volume.mavolume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volume.tenvolume?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thư viện Volume Khác</h1>
          <p className="text-gray-600">Quản lý danh sách các loại volume khác trong hệ thống</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          <span>Thêm volume mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc tên volume..."
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
        ) : filteredVolumes.length === 0 ? (
          <div className="text-center py-12">
            <FaDatabase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có volume nào</h3>
            <p className="text-gray-500">Bắt đầu bằng cách thêm volume mới vào thư viện</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá đơn vị</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVolumes.map((volume) => (
                  <tr key={volume.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {volume.mavolume}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {volume.tenvolume}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Intl.NumberFormat('vi-VN').format(volume.giadonvi || 0)} đ
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {volume.mota || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(volume)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(volume.id)}
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
              {editingVolume ? 'Sửa volume' : 'Tạo volume mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã volume *</label>
                <input
                  type="text"
                  value={formData.mavolume}
                  onChange={(e) => setFormData({ ...formData, mavolume: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên volume *</label>
                <input
                  type="text"
                  value={formData.tenvolume}
                  onChange={(e) => setFormData({ ...formData, tenvolume: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá đơn vị *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.giadonvi}
                  onChange={(e) => setFormData({ ...formData, giadonvi: e.target.value })}
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
                  {editingVolume ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolumeOther;
