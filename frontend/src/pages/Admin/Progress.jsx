import { useState, useEffect } from 'react';
import { 
  FaTasks, FaPlus, FaEdit, FaTrash, FaSearch, FaBuilding, FaFileContract, 
  FaUser, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaClock,
  FaFilter, FaTimes
} from 'react-icons/fa';
import { tramTienDoAPI, hopdongAPI, tramAPI, userAPI } from '../../service/api';

const Progress = () => {
  const [tiendoList, setTiendoList] = useState([]);
  const [hopdongList, setHopdongList] = useState([]);
  const [tramList, setTramList] = useState([]);
  const [nguoiKSList, setNguoiKSList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHopDong, setFilterHopDong] = useState('');
  const [filterTram, setFilterTram] = useState('');
  const [filterTinhTrang, setFilterTinhTrang] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTiendo, setEditingTiendo] = useState(null);
  const [availableTrams, setAvailableTrams] = useState([]); // Trạm theo hợp đồng đã chọn
  const [formData, setFormData] = useState({
    tram_id: '',
    hopdong_id: '',
    // Thiết kế
    ngay_thiet_ke: '',
    trangthai_thietke: 'chua_bat_dau',
    phantram_thietke: 0,
    // KCS
    ngay_kcs: '',
    trangthai_kcs: 'chua_bat_dau',
    phantram_kcs: 0,
    // Dự toán
    ngay_du_toan: '',
    trangthai_dutoan: 'chua_bat_dau',
    phantram_dutoan: 0,
    // Khảo sát
    ngay_khao_sat: '',
    nguoi_ks_id: '',
    trangthai_ks: 'chua_bat_dau',
    phantram_ks: 0,
    // Tình trạng
    tinh_trang: 'binh_thuong',
    vuong_mac: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tiendos, hopdongs, trams, users] = await Promise.all([
        tramTienDoAPI.getAll(true).catch(() => []),
        hopdongAPI.getAll(true).catch(() => []),
        tramAPI.getAll(true).catch(() => []),
        userAPI.getAll().catch(() => [])
      ]);
      setTiendoList(tiendos || []);
      setHopdongList(hopdongs || []);
      setTramList(trams || []);
      setNguoiKSList(users || []);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      alert('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTiendo(null);
    setAvailableTrams([]);
    setFormData({
      tram_id: '',
      hopdong_id: '',
      ngay_thiet_ke: '',
      trangthai_thietke: 'chua_bat_dau',
      phantram_thietke: 0,
      ngay_kcs: '',
      trangthai_kcs: 'chua_bat_dau',
      phantram_kcs: 0,
      ngay_du_toan: '',
      trangthai_dutoan: 'chua_bat_dau',
      phantram_dutoan: 0,
      ngay_khao_sat: '',
      nguoi_ks_id: '',
      trangthai_ks: 'chua_bat_dau',
      phantram_ks: 0,
      tinh_trang: 'binh_thuong',
      vuong_mac: ''
    });
    setShowModal(true);
  };

  // Load trạm theo hợp đồng
  const handleHopDongChange = async (hopdongId) => {
    setFormData({ ...formData, hopdong_id: hopdongId, tram_id: '' });
    setAvailableTrams([]);
    
    if (hopdongId) {
      try {
        const contractData = await hopdongAPI.getById(hopdongId, true);
        setAvailableTrams(contractData.trams || []);
      } catch (error) {
        console.error('Lỗi tải trạm theo hợp đồng:', error);
        setAvailableTrams([]);
      }
    }
  };

  // Tự động cập nhật phần trăm dựa trên trạng thái
  const getPercentageByStatus = (status) => {
    switch (status) {
      case 'chua_bat_dau':
        return 0;
      case 'dang_thuc_hien':
        return 50;
      case 'hoan_thanh':
        return 100;
      default:
        return 0;
    }
  };

  // Handler cập nhật trạng thái và tự động set phần trăm
  const handleStatusChange = (field, status, stepType) => {
    const percentageField = `phantram_${stepType}`;
    const autoPercentage = getPercentageByStatus(status);
    
    setFormData({
      ...formData,
      [field]: status,
      [percentageField]: autoPercentage
    });
  };

  const handleEdit = async (tiendo) => {
    setEditingTiendo(tiendo);
    
    // Load trạm theo hợp đồng khi edit
    if (tiendo.hopdong_id) {
      try {
        const contractData = await hopdongAPI.getById(tiendo.hopdong_id, true);
        setAvailableTrams(contractData.trams || []);
      } catch (error) {
        console.error('Lỗi tải trạm theo hợp đồng:', error);
        setAvailableTrams([]);
      }
    }
    
    setFormData({
      tram_id: tiendo.tram_id || '',
      hopdong_id: tiendo.hopdong_id || '',
      ngay_thiet_ke: tiendo.ngay_thiet_ke || '',
      trangthai_thietke: tiendo.trangthai_thietke || 'chua_bat_dau',
      phantram_thietke: tiendo.phantram_thietke || 0,
      ngay_kcs: tiendo.ngay_kcs || '',
      trangthai_kcs: tiendo.trangthai_kcs || 'chua_bat_dau',
      phantram_kcs: tiendo.phantram_kcs || 0,
      ngay_du_toan: tiendo.ngay_du_toan || '',
      trangthai_dutoan: tiendo.trangthai_dutoan || 'chua_bat_dau',
      phantram_dutoan: tiendo.phantram_dutoan || 0,
      ngay_khao_sat: tiendo.ngay_khao_sat || '',
      nguoi_ks_id: tiendo.nguoi_ks_id || '',
      trangthai_ks: tiendo.trangthai_ks || 'chua_bat_dau',
      phantram_ks: tiendo.phantram_ks || 0,
      tinh_trang: tiendo.tinh_trang || 'binh_thuong',
      vuong_mac: tiendo.vuong_mac || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tiến trình này?')) return;
    
    try {
      await tramTienDoAPI.delete(id);
      alert('Xóa tiến trình thành công');
      loadData();
    } catch (error) {
      console.error('Lỗi xóa tiến trình:', error);
      alert(error.message || 'Không thể xóa tiến trình');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        tram_id: parseInt(formData.tram_id),
        hopdong_id: parseInt(formData.hopdong_id),
        phantram_thietke: parseFloat(formData.phantram_thietke) || 0,
        phantram_kcs: parseFloat(formData.phantram_kcs) || 0,
        phantram_dutoan: parseFloat(formData.phantram_dutoan) || 0,
        phantram_ks: parseFloat(formData.phantram_ks) || 0,
        nguoi_ks_id: formData.nguoi_ks_id ? parseInt(formData.nguoi_ks_id) : null
      };

      if (editingTiendo) {
        await tramTienDoAPI.update(editingTiendo.id, data);
        alert('Cập nhật tiến trình thành công');
      } else {
        await tramTienDoAPI.create(data);
        alert('Tạo tiến trình thành công');
      }
      
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Lỗi lưu tiến trình:', error);
      alert(error.message || 'Không thể lưu tiến trình');
    }
  };

  // Filter danh sách
  const getFilteredTiendo = () => {
    return tiendoList.filter(td => {
      const matchSearch = !searchTerm || 
        td.tram?.matram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        td.hopdong?.sohopdong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        td.tram?.tinhthanh?.ten?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchHopDong = !filterHopDong || td.hopdong_id === parseInt(filterHopDong);
      const matchTram = !filterTram || td.tram_id === parseInt(filterTram);
      const matchTinhTrang = !filterTinhTrang || td.tinh_trang === filterTinhTrang;
      
      return matchSearch && matchHopDong && matchTram && matchTinhTrang;
    });
  };

  // Helper functions
  const getStatusBadge = (status) => {
    const statusMap = {
      'chua_bat_dau': { label: 'Chưa bắt đầu', color: 'bg-gray-100 text-gray-800' },
      'dang_thuc_hien': { label: 'Đang thực hiện', color: 'bg-yellow-100 text-yellow-800' },
      'hoan_thanh': { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' }
    };
    const statusInfo = statusMap[status] || statusMap['chua_bat_dau'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getTinhTrangBadge = (tinhTrang) => {
    const tinhTrangMap = {
      'binh_thuong': { label: 'Bình thường', color: 'bg-blue-100 text-blue-800', icon: FaCheckCircle },
      'vuong_mac': { label: 'Vướng mắc', color: 'bg-red-100 text-red-800', icon: FaExclamationTriangle },
      'tam_dung': { label: 'Tạm dừng', color: 'bg-orange-100 text-orange-800', icon: FaClock }
    };
    const tinhTrangInfo = tinhTrangMap[tinhTrang] || tinhTrangMap['binh_thuong'];
    const Icon = tinhTrangInfo.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tinhTrangInfo.color}`}>
        <Icon className="w-3 h-3" />
        {tinhTrangInfo.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount || 0);
  };

  const filteredTiendo = getFilteredTiendo();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tiến trình</h1>
        <p className="text-gray-600">Theo dõi tiến trình thi công của các trạm</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Thêm tiến trình
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Filter Hợp đồng */}
          <select
            value={filterHopDong}
            onChange={(e) => setFilterHopDong(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả hợp đồng</option>
            {hopdongList.map(hd => (
              <option key={hd.id} value={hd.id}>
                {hd.sohopdong}
              </option>
            ))}
          </select>

          {/* Filter Trạm */}
          <select
            value={filterTram}
            onChange={(e) => setFilterTram(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả trạm</option>
            {tramList.map(tram => (
              <option key={tram.id} value={tram.id}>
                {tram.matram}
              </option>
            ))}
          </select>

          {/* Filter Tình trạng */}
          <select
            value={filterTinhTrang}
            onChange={(e) => setFilterTinhTrang(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả tình trạng</option>
            <option value="binh_thuong">Bình thường</option>
            <option value="vuong_mac">Vướng mắc</option>
            <option value="tam_dung">Tạm dừng</option>
          </select>

          {/* Clear filters */}
          {(filterHopDong || filterTram || filterTinhTrang) && (
            <button
              onClick={() => {
                setFilterHopDong('');
                setFilterTram('');
                setFilterTinhTrang('');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Danh sách tiến trình */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredTiendo.length === 0 ? (
        <div className="text-center py-12">
          <FaTasks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có dữ liệu tiến trình</h3>
            <p className="text-gray-500">Hãy thêm tiến trình mới để bắt đầu theo dõi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạm / Hợp đồng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thiết kế</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KCS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dự toán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khảo sát</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tình trạng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTiendo.map((td) => (
                  <tr key={td.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{td.tram?.matram || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{td.tram?.tinhthanh?.ten || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <FaFileContract className="w-4 h-4 text-gray-400" />
                        <p className="text-xs text-gray-600">{td.hopdong?.sohopdong || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(td.trangthai_thietke || 'chua_bat_dau')}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(td.phantram_thietke || 0, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">{td.phantram_thietke || 0}%</p>
                        {td.ngay_thiet_ke && (
                          <p className="text-xs text-gray-500">
                            <FaCalendarAlt className="w-3 h-3 inline mr-1" />
                            {formatDate(td.ngay_thiet_ke)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(td.trangthai_kcs)}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(td.phantram_kcs || 0, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">{td.phantram_kcs || 0}%</p>
                        {td.ngay_kcs && (
                          <p className="text-xs text-gray-500">
                            <FaCalendarAlt className="w-3 h-3 inline mr-1" />
                            {formatDate(td.ngay_kcs)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(td.trangthai_dutoan)}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(td.phantram_dutoan || 0, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">{td.phantram_dutoan || 0}%</p>
                        {td.ngay_du_toan && (
                          <p className="text-xs text-gray-500">
                            <FaCalendarAlt className="w-3 h-3 inline mr-1" />
                            {formatDate(td.ngay_du_toan)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(td.trangthai_ks)}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(td.phantram_ks || 0, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">{td.phantram_ks || 0}%</p>
                        {td.ngay_khao_sat && (
                          <p className="text-xs text-gray-500">
                            <FaCalendarAlt className="w-3 h-3 inline mr-1" />
                            {formatDate(td.ngay_khao_sat)}
                          </p>
                        )}
                        {td.nguoi_ks && (
                          <p className="text-xs text-gray-500">
                            <FaUser className="w-3 h-3 inline mr-1" />
                            {td.nguoi_ks.hoten || 'N/A'}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {getTinhTrangBadge(td.tinh_trang)}
                        {td.vuong_mac && (
                          <p className="text-xs text-gray-600 max-w-xs truncate" title={td.vuong_mac}>
                            {td.vuong_mac}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(td)}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Sửa"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(td.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingTiendo ? 'Sửa tiến trình' : 'Thêm tiến trình'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Hợp đồng và Trạm - Chọn hợp đồng trước */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hợp đồng *</label>
                  <select
                    value={formData.hopdong_id}
                    onChange={(e) => handleHopDongChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Chọn hợp đồng...</option>
                    {hopdongList.map(hd => (
                      <option key={hd.id} value={hd.id}>
                        {hd.sohopdong}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạm *</label>
                  <select
                    value={formData.tram_id}
                    onChange={(e) => setFormData({ ...formData, tram_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    disabled={!formData.hopdong_id || availableTrams.length === 0}
                  >
                    <option value="">
                      {!formData.hopdong_id 
                        ? 'Chọn hợp đồng trước...' 
                        : availableTrams.length === 0 
                        ? 'Hợp đồng này chưa có trạm' 
                        : 'Chọn trạm...'}
                    </option>
                    {availableTrams.map(tram => (
                      <option key={tram.id} value={tram.id}>
                        {tram.matram} - {tram.tinhthanh?.ten || 'N/A'}
                      </option>
                    ))}
                  </select>
                  {formData.hopdong_id && availableTrams.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">Vui lòng gán trạm vào hợp đồng trước</p>
                  )}
                </div>
              </div>

              {/* Thiết kế */}
              <div className="border border-gray-200 rounded-lg p-4 bg-indigo-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thiết kế</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày thiết kế</label>
                    <input
                      type="date"
                      value={formData.ngay_thiet_ke}
                      onChange={(e) => setFormData({ ...formData, ngay_thiet_ke: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                      value={formData.trangthai_thietke}
                      onChange={(e) => handleStatusChange('trangthai_thietke', e.target.value, 'thietke')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="chua_bat_dau">Chưa bắt đầu (0%)</option>
                      <option value="dang_thuc_hien">Đang thực hiện (50%)</option>
                      <option value="hoan_thanh">Hoàn thành (100%)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Phần trăm: <span className="font-semibold text-indigo-600">{formData.phantram_thietke}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* KCS */}
              <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">KCS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày KCS</label>
                    <input
                      type="date"
                      value={formData.ngay_kcs}
                      onChange={(e) => setFormData({ ...formData, ngay_kcs: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                      value={formData.trangthai_kcs}
                      onChange={(e) => handleStatusChange('trangthai_kcs', e.target.value, 'kcs')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="chua_bat_dau">Chưa bắt đầu (0%)</option>
                      <option value="dang_thuc_hien">Đang thực hiện (50%)</option>
                      <option value="hoan_thanh">Hoàn thành (100%)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Phần trăm: <span className="font-semibold text-blue-600">{formData.phantram_kcs}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Dự toán */}
              <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dự toán</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày dự toán</label>
                    <input
                      type="date"
                      value={formData.ngay_du_toan}
                      onChange={(e) => setFormData({ ...formData, ngay_du_toan: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                      value={formData.trangthai_dutoan}
                      onChange={(e) => handleStatusChange('trangthai_dutoan', e.target.value, 'dutoan')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="chua_bat_dau">Chưa bắt đầu (0%)</option>
                      <option value="dang_thuc_hien">Đang thực hiện (50%)</option>
                      <option value="hoan_thanh">Hoàn thành (100%)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Phần trăm: <span className="font-semibold text-green-600">{formData.phantram_dutoan}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Khảo sát */}
              <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Khảo sát</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khảo sát</label>
                    <input
                      type="date"
                      value={formData.ngay_khao_sat}
                      onChange={(e) => setFormData({ ...formData, ngay_khao_sat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Người khảo sát</label>
                    <select
                      value={formData.nguoi_ks_id}
                      onChange={(e) => setFormData({ ...formData, nguoi_ks_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Chọn người khảo sát...</option>
                      {nguoiKSList.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.hoten || user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                      value={formData.trangthai_ks}
                      onChange={(e) => handleStatusChange('trangthai_ks', e.target.value, 'ks')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="chua_bat_dau">Chưa bắt đầu (0%)</option>
                      <option value="dang_thuc_hien">Đang thực hiện (50%)</option>
                      <option value="hoan_thanh">Hoàn thành (100%)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Phần trăm: <span className="font-semibold text-purple-600">{formData.phantram_ks}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Tình trạng và vướng mắc */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tình trạng và vướng mắc</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng</label>
                    <select
                      value={formData.tinh_trang}
                      onChange={(e) => setFormData({ ...formData, tinh_trang: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="binh_thuong">Bình thường</option>
                      <option value="vuong_mac">Vướng mắc</option>
                      <option value="tam_dung">Tạm dừng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả vướng mắc</label>
                    <textarea
                      value={formData.vuong_mac}
                      onChange={(e) => setFormData({ ...formData, vuong_mac: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Nhập mô tả vướng mắc nếu có..."
                    />
        </div>
      </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  {editingTiendo ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
