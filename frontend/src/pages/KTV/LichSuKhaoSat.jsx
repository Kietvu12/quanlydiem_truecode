import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHistory, FaSearch, FaBuilding, FaFileContract, 
  FaUser, FaCalendarAlt, FaEye, FaCheckCircle, FaFilter,
  FaTimes, FaArrowRight
} from 'react-icons/fa';
import { tramTienDoAPI, hopdongAPI, tramThucTeCotAPI, tramThucTeVolumeKhacAPI } from '../../service/api';

const LichSuKhaoSat = () => {
  const navigate = useNavigate();
  const [tiendoList, setTiendoList] = useState([]);
  const [hopdongList, setHopdongList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHopDong, setFilterHopDong] = useState('');
  const [filterTram, setFilterTram] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTiendo, setSelectedTiendo] = useState(null);
  const [thucTeVolumes, setThucTeVolumes] = useState({ cots: [], volumes: [] });
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
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
      
      // Lọc chỉ lấy các tiến độ khảo sát đã hoàn thành của KTV hiện tại
      let filteredTiendos = (tiendos || []).filter(td => {
        const trangThaiKS = td.trangthai_ks || 'chua_bat_dau';
        return trangThaiKS === 'hoan_thanh';
      });

      // Lọc theo người khảo sát
      if (currentUser) {
        filteredTiendos = filteredTiendos.filter(td => 
          td.nguoi_ks_id === currentUser.id
        );
      }

      // Sắp xếp theo ngày khảo sát mới nhất
      filteredTiendos.sort((a, b) => {
        const dateA = a.ngay_khao_sat ? new Date(a.ngay_khao_sat) : new Date(0);
        const dateB = b.ngay_khao_sat ? new Date(b.ngay_khao_sat) : new Date(0);
        return dateB - dateA;
      });

      setTiendoList(filteredTiendos);
      setHopdongList(hopdongs || []);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      alert('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (tiendo) => {
    setSelectedTiendo(tiendo);
    setLoadingDetail(true);
    try {
      const [thucTeCots, thucTeVolumes] = await Promise.all([
        tramThucTeCotAPI.getByTramAndHopDong(tiendo.tram_id, tiendo.hopdong_id).catch(() => []),
        tramThucTeVolumeKhacAPI.getByTramAndHopDong(tiendo.tram_id, tiendo.hopdong_id).catch(() => [])
      ]);

      // Load relations
      const cotsWithRelations = await Promise.all(
        (thucTeCots || []).map(async (cot) => {
          try {
            const cotDetail = await tramThucTeCotAPI.getById(cot.id, true);
            return cotDetail || cot;
          } catch {
            return cot;
          }
        })
      );
      
      const volumesWithRelations = await Promise.all(
        (thucTeVolumes || []).map(async (vol) => {
          try {
            const volDetail = await tramThucTeVolumeKhacAPI.getById(vol.id, true);
            return volDetail || vol;
          } catch {
            return vol;
          }
        })
      );

      setThucTeVolumes({ cots: cotsWithRelations, volumes: volumesWithRelations });
    } catch (error) {
      console.error('Lỗi tải chi tiết:', error);
      alert('Không thể tải chi tiết khảo sát');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleViewFullDetail = (tiendo) => {
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
      const matchTram = !filterTram || td.tram_id === parseInt(filterTram);
      
      // Filter theo ngày
      if (startDate || endDate) {
        const ngayKS = td.ngay_khao_sat ? new Date(td.ngay_khao_sat) : null;
        if (!ngayKS) return false;
        
        if (startDate && ngayKS < new Date(startDate)) return false;
        if (endDate && ngayKS > new Date(endDate)) return false;
      }
      
      return matchSearch && matchHopDong && matchTram;
    });
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('vi-VN');
  };

  const filteredTiendo = getFilteredTiendo();
  const uniqueTrams = [...new Set(tiendoList.map(td => ({ id: td.tram_id, matram: td.tram?.matram })))].filter(t => t.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử Khảo sát</h1>
        <p className="text-gray-600">Xem lại lịch sử các lần khảo sát đã thực hiện</p>
        {currentUser && (
          <p className="text-sm text-gray-500 mt-1">
            KTV: <span className="font-semibold">{currentUser.hoten || currentUser.email}</span>
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filter Hợp đồng */}
          <select
            value={filterHopDong}
            onChange={(e) => setFilterHopDong(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Tất cả trạm</option>
            {uniqueTrams.map(tram => (
              <option key={tram.id} value={tram.id}>
                {tram.matram}
              </option>
            ))}
          </select>

          {/* Filter Ngày bắt đầu */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Từ ngày"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Filter Ngày kết thúc */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Đến ngày"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Clear filters */}
        {(filterHopDong || filterTram || startDate || endDate) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setFilterHopDong('');
                setFilterTram('');
                setStartDate('');
                setEndDate('');
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Danh sách */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredTiendo.length === 0 ? (
          <div className="text-center py-12">
            <FaHistory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có lịch sử khảo sát</h3>
            <p className="text-gray-500">Bạn chưa hoàn thành khảo sát nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạm / Hợp đồng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày khảo sát</th>
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
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          <FaCalendarAlt className="w-3 h-3 inline mr-1" />
                          {formatDate(td.ngay_khao_sat)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Hoàn thành: {formatDateTime(td.ngaysua || td.ngaytao)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaCheckCircle className="w-3 h-3 text-green-600" />
                          <span className="font-medium text-green-600">Đã hoàn thành</span>
                        </div>
                        {td.vuong_mac && (
                          <p className="text-red-600 truncate max-w-xs" title={td.vuong_mac}>
                            ⚠️ Có vướng mắc
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetail(td)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Xem chi tiết"
                        >
                          <FaEye className="w-4 h-4" />
                          Xem
                        </button>
                        <button
                          onClick={() => handleViewFullDetail(td)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          title="Xem đầy đủ"
                        >
                          <FaArrowRight className="w-4 h-4" />
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

      {/* Modal Chi tiết */}
      {selectedTiendo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] shadow-xl flex flex-col">
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết khảo sát</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Trạm: <span className="font-semibold">{selectedTiendo.tram?.matram || 'N/A'}</span> | 
                  Hợp đồng: <span className="font-semibold">{selectedTiendo.hopdong?.sohopdong || 'N/A'}</span> | 
                  Ngày: <span className="font-semibold">{formatDate(selectedTiendo.ngay_khao_sat)}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedTiendo(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Volume Cột thực tế */}
                  {thucTeVolumes.cots.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Cột thực tế</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-blue-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên cột</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Số lượng thực tế</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Người nhập</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Ngày nhập</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {thucTeVolumes.cots.map((cot) => (
                              <tr key={cot.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <p className="text-sm font-medium text-gray-900">{cot.cot?.tencot || 'N/A'}</p>
                                  <p className="text-xs text-gray-500">{cot.cot?.macot || 'N/A'}</p>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="text-sm font-semibold text-gray-900">{cot.soluong_thucte || 0}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="text-xs text-gray-600">{cot.nguoinhap?.hoten || cot.nguoinhap?.email || 'N/A'}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="text-xs text-gray-600">{formatDateTime(cot.ngaytao)}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Volume Khác thực tế */}
                  {thucTeVolumes.volumes.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Khác thực tế</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-green-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên volume</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Số lượng thực tế</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Người nhập</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Ngày nhập</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {thucTeVolumes.volumes.map((vol) => (
                              <tr key={vol.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <p className="text-sm font-medium text-gray-900">{vol.volume?.tenvolume || 'N/A'}</p>
                                  <p className="text-xs text-gray-500">{vol.volume?.mavolume || 'N/A'}</p>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="text-sm font-semibold text-gray-900">{vol.soluong_thucte || 0}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="text-xs text-gray-600">{vol.nguoinhap?.hoten || vol.nguoinhap?.email || 'N/A'}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="text-xs text-gray-600">{formatDateTime(vol.ngaytao)}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {thucTeVolumes.cots.length === 0 && thucTeVolumes.volumes.length === 0 && (
                    <div className="text-center py-12 border border-gray-200 rounded-lg">
                      <p className="text-gray-500">Chưa có dữ liệu volume thực tế</p>
                    </div>
                  )}

                  {/* Thông tin vướng mắc */}
                  {selectedTiendo.vuong_mac && (
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h3 className="text-lg font-semibold text-red-900 mb-2">Vướng mắc</h3>
                      <p className="text-sm text-red-800">{selectedTiendo.vuong_mac}</p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex gap-3 p-6 border-t border-gray-200 bg-white">
              <button
                onClick={() => setSelectedTiendo(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => handleViewFullDetail(selectedTiendo)}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                Xem đầy đủ
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LichSuKhaoSat;
