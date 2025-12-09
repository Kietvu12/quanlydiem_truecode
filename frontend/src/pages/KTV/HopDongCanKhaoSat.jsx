import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaClipboardList, FaSearch, FaBuilding, FaFileContract, 
  FaUser, FaCalendarAlt, FaEdit, FaCheckCircle, FaClock,
  FaExclamationTriangle, FaFilter, FaTimes
} from 'react-icons/fa';
import { tramTienDoAPI, hopdongAPI } from '../../service/api';

const HopDongCanKhaoSat = () => {
  const navigate = useNavigate();
  const [tiendoList, setTiendoList] = useState([]);
  const [hopdongList, setHopdongList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHopDong, setFilterHopDong] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('');

  useEffect(() => {
    // Lấy thông tin user hiện tại
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tiendos, hopdongs] = await Promise.all([
        tramTienDoAPI.getAll(true).catch(() => []),
        hopdongAPI.getAll(true).catch(() => [])
      ]);
      
      // Lọc chỉ lấy các tiến độ cần khảo sát (chưa hoàn thành hoặc đang thực hiện)
      // và có thể lọc theo người khảo sát nếu có
      let filteredTiendos = (tiendos || []).filter(td => {
        const trangThaiKS = td.trangthai_ks || 'chua_bat_dau';
        return trangThaiKS !== 'hoan_thanh';
      });

      // Nếu có user, lọc theo người khảo sát (nếu được gán)
      if (currentUser) {
        filteredTiendos = filteredTiendos.filter(td => 
          !td.nguoi_ks_id || td.nguoi_ks_id === currentUser.id
        );
      }

      setTiendoList(filteredTiendos);
      setHopdongList(hopdongs || []);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      alert('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tiendo) => {
    navigate(`/khaosat-chitiet/${tiendo.id}`);
  };

  // Filter danh sách
  const getFilteredTiendo = () => {
    return tiendoList.filter(td => {
      const matchSearch = !searchTerm || 
        td.tram?.matram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        td.hopdong?.sohopdong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        td.tram?.tinhthanh?.ten?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchHopDong = !filterHopDong || td.hopdong_id === parseInt(filterHopDong);
      const matchTrangThai = !filterTrangThai || td.trangthai_ks === filterTrangThai;
      
      return matchSearch && matchHopDong && matchTrangThai;
    });
  };

  // Helper functions
  const getStatusBadge = (status) => {
    const statusMap = {
      'chua_bat_dau': { label: 'Chưa bắt đầu', color: 'bg-gray-100 text-gray-800', icon: FaClock },
      'dang_thuc_hien': { label: 'Đang thực hiện', color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
      'hoan_thanh': { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: FaCheckCircle }
    };
    const statusInfo = statusMap[status] || statusMap['chua_bat_dau'];
    const Icon = statusInfo.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        <Icon className="w-3 h-3" />
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN');
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hợp đồng cần khảo sát</h1>
        <p className="text-gray-600">Danh sách các hợp đồng cần được khảo sát</p>
        {currentUser && (
          <p className="text-sm text-gray-500 mt-1">
            Người khảo sát: <span className="font-semibold">{currentUser.hoten || currentUser.email}</span>
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Filter Trạng thái */}
          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="chua_bat_dau">Chưa bắt đầu</option>
            <option value="dang_thuc_hien">Đang thực hiện</option>
          </select>

          {/* Clear filters */}
          {(filterHopDong || filterTrangThai) && (
            <button
              onClick={() => {
                setFilterHopDong('');
                setFilterTrangThai('');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Danh sách */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredTiendo.length === 0 ? (
          <div className="text-center py-12">
            <FaClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có hợp đồng cần khảo sát</h3>
            <p className="text-gray-500">Tất cả các hợp đồng đã được khảo sát hoặc chưa được phân công</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạm / Hợp đồng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái khảo sát</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiến độ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin</th>
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
                      {getStatusBadge(td.trangthai_ks || 'chua_bat_dau')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(td.phantram_ks || 0, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">{td.phantram_ks || 0}%</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs text-gray-600">
                        {td.ngay_khao_sat && (
                          <p>
                            <FaCalendarAlt className="w-3 h-3 inline mr-1" />
                            Ngày KS: {formatDate(td.ngay_khao_sat)}
                          </p>
                        )}
                        {td.nguoi_ks && (
                          <p>
                            <FaUser className="w-3 h-3 inline mr-1" />
                            {td.nguoi_ks.hoten || 'N/A'}
                          </p>
                        )}
                        {td.vuong_mac && (
                          <p className="text-red-600">
                            <FaExclamationTriangle className="w-3 h-3 inline mr-1" />
                            {td.vuong_mac}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(td)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        title="Cập nhật tiến độ khảo sát"
                      >
                        <FaEdit className="w-4 h-4" />
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default HopDongCanKhaoSat;
