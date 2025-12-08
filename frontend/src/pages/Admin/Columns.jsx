import { useState, useEffect } from 'react';
import { FaDatabase, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { thuVienCotAPI } from '../../service/api';

const Columns = () => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [formData, setFormData] = useState({
    macot: '',
    tencot: '',
    vitri: '',
    cao: '',
    giadonvi: '',
    mota: ''
  });

  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async () => {
    try {
      setLoading(true);
      const data = await thuVienCotAPI.getAll();
      setColumns(data);
    } catch (error) {
      console.error('Lỗi tải cột:', error);
      alert('Không thể tải danh sách cột');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingColumn(null);
    setFormData({
      macot: '',
      tencot: '',
      vitri: '',
      cao: '',
      giadonvi: '10',
      mota: ''
    });
    setShowModal(true);
  };

  const handleEdit = (column) => {
    setEditingColumn(column);
    setFormData({
      macot: column.macot || '',
      tencot: column.tencot || '',
      vitri: column.vitri || '',
      cao: column.cao || '',
      giadonvi: column.giadonvi || '10',
      mota: column.mota || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cột này?')) return;
    
    try {
      await thuVienCotAPI.delete(id);
      alert('Xóa cột thành công');
      loadColumns();
    } catch (error) {
      console.error('Lỗi xóa cột:', error);
      alert('Không thể xóa cột');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        cao: formData.cao ? parseInt(formData.cao) : null,
        giadonvi: parseFloat(formData.giadonvi) || 0
      };
      
      if (editingColumn) {
        await thuVienCotAPI.update(editingColumn.id, submitData);
        alert('Cập nhật cột thành công');
      } else {
        await thuVienCotAPI.create(submitData);
        alert('Tạo cột thành công');
      }
      setShowModal(false);
      loadColumns();
    } catch (error) {
      console.error('Lỗi lưu cột:', error);
      alert(error.message || 'Không thể lưu cột');
    }
  };

  const filteredColumns = columns.filter(column =>
    column.macot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    column.tencot?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thư viện Cột</h1>
          <p className="text-gray-600">Quản lý danh sách các loại cột trong hệ thống</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          <span>Thêm cột mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc tên cột..."
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
        ) : filteredColumns.length === 0 ? (
          <div className="text-center py-12">
            <FaDatabase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có cột nào</h3>
            <p className="text-gray-500">Bắt đầu bằng cách thêm cột mới vào thư viện</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã cột</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên cột</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cao (m)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá đơn vị</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredColumns.map((column) => (
                  <tr key={column.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {column.macot}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {column.tencot}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {column.vitri || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {column.cao || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Intl.NumberFormat('vi-VN').format(column.giadonvi || 0)} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(column)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(column.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingColumn ? 'Sửa cột' : 'Tạo cột mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã cột *</label>
                <input
                  type="text"
                  value={formData.macot}
                  onChange={(e) => setFormData({ ...formData, macot: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên cột *</label>
                <input
                  type="text"
                  value={formData.tencot}
                  onChange={(e) => setFormData({ ...formData, tencot: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
                <input
                  type="text"
                  value={formData.vitri}
                  onChange={(e) => setFormData({ ...formData, vitri: e.target.value })}
                  placeholder="VD: Dưới đất, Trên mái"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cao (m)</label>
                  <input
                    type="number"
                    value={formData.cao}
                    onChange={(e) => setFormData({ ...formData, cao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  {editingColumn ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Columns;
