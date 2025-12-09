import { useState, useEffect } from 'react';
import { FaBuilding, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { tramAPI, tinhThanhAPI } from '../../service/api';

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [tinhThanhList, setTinhThanhList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({
    matram: '',
    tinhthanh_id: '',
    diachi: '',
    lat: '',
    lng: '',
    loaiproject: 'btsmoi'
  });

  useEffect(() => {
    loadStations();
    loadTinhThanhList();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      const data = await tramAPI.getAll(true);
      setStations(data);
    } catch (error) {
      console.error('Lỗi tải trạm:', error);
      alert('Không thể tải danh sách trạm');
    } finally {
      setLoading(false);
    }
  };

  const loadTinhThanhList = async () => {
    try {
      const data = await tinhThanhAPI.getAll(true);
      setTinhThanhList(data);
    } catch (error) {
      console.error('Lỗi tải danh sách tỉnh thành:', error);
    }
  };

  const handleCreate = () => {
    setEditingStation(null);
    setFormData({
      matram: '',
      tinhthanh_id: '',
      diachi: '',
      lat: '',
      lng: '',
      loaiproject: 'btsmoi'
    });
    setShowModal(true);
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData({
      matram: station.matram || '',
      tinhthanh_id: station.tinhthanh_id || '',
      diachi: station.diachi || '',
      lat: station.lat || '',
      lng: station.lng || '',
      loaiproject: station.loaiproject || 'btsmoi'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa trạm này?')) return;
    
    try {
      await tramAPI.delete(id);
      alert('Xóa trạm thành công');
      loadStations();
    } catch (error) {
      console.error('Lỗi xóa trạm:', error);
      alert('Không thể xóa trạm');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null
      };
      
      if (editingStation) {
        await tramAPI.update(editingStation.id, submitData);
        alert('Cập nhật trạm thành công');
      } else {
        await tramAPI.create(submitData);
        alert('Tạo trạm thành công');
      }
      setShowModal(false);
      loadStations();
    } catch (error) {
      console.error('Lỗi lưu trạm:', error);
      alert(error.message || 'Không thể lưu trạm');
    }
  };

  const filteredStations = stations.filter(station =>
    station.matram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.diachi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.tinhthanh?.ten?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Trạm</h1>
          <p className="text-gray-600">Quản lý tất cả các trạm BTS</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          <span>Thêm trạm mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã trạm, địa chỉ hoặc tỉnh thành..."
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
        ) : filteredStations.length === 0 ? (
          <div className="text-center py-12">
            <FaBuilding className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có trạm nào</h3>
            <p className="text-gray-500">Bắt đầu bằng cách thêm trạm mới</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã trạm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỉnh thành</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại project</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {station.matram}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {station.tinhthanh?.ten || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {station.diachi || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        station.loaiproject === 'btsmoi' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {station.loaiproject === 'btsmoi' ? 'BTS mới' : 'Kiên cố'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(station)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(station.id)}
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
              {editingStation ? 'Sửa trạm' : 'Tạo trạm mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã trạm *</label>
                <input
                  type="text"
                  value={formData.matram}
                  onChange={(e) => setFormData({ ...formData, matram: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh thành *</label>
                <select
                  value={formData.tinhthanh_id}
                  onChange={(e) => setFormData({ ...formData, tinhthanh_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Chọn tỉnh thành</option>
                  {tinhThanhList.map((tt) => (
                    <option key={tt.id} value={tt.id}>
                      {tt.ten} ({tt.khuvuc?.ten})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <textarea
                  value={formData.diachi}
                  onChange={(e) => setFormData({ ...formData, diachi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại project *</label>
                <select
                  value={formData.loaiproject}
                  onChange={(e) => setFormData({ ...formData, loaiproject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="btsmoi">BTS mới</option>
                  <option value="kienco">Kiên cố</option>
                </select>
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
                  {editingStation ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stations;
