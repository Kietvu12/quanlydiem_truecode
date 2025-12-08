import { useState, useEffect } from 'react';
import { FaCity, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { tinhThanhAPI, khuVucAPI } from '../../service/api';

const TinhThanh = () => {
  const [tinhThanhList, setTinhThanhList] = useState([]);
  const [khuVucList, setKhuVucList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTinhThanh, setEditingTinhThanh] = useState(null);
  const [formData, setFormData] = useState({
    khuvuc_id: '',
    ma: '',
    ten: ''
  });

  useEffect(() => {
    loadTinhThanhList();
    loadKhuVucList();
  }, []);

  const loadTinhThanhList = async () => {
    try {
      setLoading(true);
      const data = await tinhThanhAPI.getAll(true);
      setTinhThanhList(data);
    } catch (error) {
      console.error('Lỗi tải tỉnh thành:', error);
      alert('Không thể tải danh sách tỉnh thành');
    } finally {
      setLoading(false);
    }
  };

  const loadKhuVucList = async () => {
    try {
      const data = await khuVucAPI.getAll();
      setKhuVucList(data);
    } catch (error) {
      console.error('Lỗi tải danh sách khu vực:', error);
    }
  };

  const handleCreate = () => {
    setEditingTinhThanh(null);
    setFormData({
      khuvuc_id: '',
      ma: '',
      ten: ''
    });
    setShowModal(true);
  };

  const handleEdit = (tinhThanh) => {
    setEditingTinhThanh(tinhThanh);
    setFormData({
      khuvuc_id: tinhThanh.khuvuc_id || '',
      ma: tinhThanh.ma || '',
      ten: tinhThanh.ten || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tỉnh thành này?')) return;
    
    try {
      await tinhThanhAPI.delete(id);
      alert('Xóa tỉnh thành thành công');
      loadTinhThanhList();
    } catch (error) {
      console.error('Lỗi xóa tỉnh thành:', error);
      alert('Không thể xóa tỉnh thành');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTinhThanh) {
        await tinhThanhAPI.update(editingTinhThanh.id, formData);
        alert('Cập nhật tỉnh thành thành công');
      } else {
        await tinhThanhAPI.create(formData);
        alert('Tạo tỉnh thành thành công');
      }
      setShowModal(false);
      loadTinhThanhList();
    } catch (error) {
      console.error('Lỗi lưu tỉnh thành:', error);
      alert(error.message || 'Không thể lưu tỉnh thành');
    }
  };

  const filteredTinhThanh = tinhThanhList.filter(tt =>
    tt.ma?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tt.ten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tt.khuvuc?.ten_khu_vuc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Tỉnh thành</h1>
          <p className="text-gray-600">Quản lý danh sách các tỉnh thành trong hệ thống</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          <span>Thêm tỉnh thành mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên tỉnh thành hoặc khu vực..."
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
        ) : filteredTinhThanh.length === 0 ? (
          <div className="text-center py-12">
            <FaCity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có tỉnh thành nào</h3>
            <p className="text-gray-500">Bắt đầu bằng cách thêm tỉnh thành mới</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên tỉnh thành</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khu vực</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTinhThanh.map((tt) => (
                  <tr key={tt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tt.ma}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tt.ten}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tt.khuvuc?.ten_khu_vuc || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(tt)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(tt.id)}
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
              {editingTinhThanh ? 'Sửa tỉnh thành' : 'Tạo tỉnh thành mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực *</label>
                <select
                  value={formData.khuvuc_id}
                  onChange={(e) => setFormData({ ...formData, khuvuc_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Chọn khu vực</option>
                  {khuVucList.map((kv) => (
                    <option key={kv.id} value={kv.id}>
                      {kv.ten_khu_vuc}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã tỉnh thành *</label>
                <input
                  type="text"
                  value={formData.ma}
                  onChange={(e) => setFormData({ ...formData, ma: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tỉnh thành *</label>
                <input
                  type="text"
                  value={formData.ten}
                  onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
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
                  {editingTinhThanh ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TinhThanh;
