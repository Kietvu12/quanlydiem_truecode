import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaBuilding, FaFileContract, FaClipboardList,
  FaCalendarAlt, FaTimes, FaSave
} from 'react-icons/fa';
import { 
  tramTienDoAPI, hopdongAPI, tramCotAPI, tramVolumeKhacAPI,
  tramThucTeCotAPI, tramThucTeVolumeKhacAPI
} from '../../service/api';

const KhaoSatChiTiet = () => {
  const { tiendoId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [tiendo, setTiendo] = useState(null);
  const [hopdongVolumes, setHopdongVolumes] = useState({ cots: [], volumes: [] });
  const [thucTeVolumes, setThucTeVolumes] = useState({ cots: [], volumes: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    ngay_khao_sat: '',
    trangthai_ks: 'chua_bat_dau',
    phantram_ks: 0,
    vuong_mac: ''
  });
  const [thucTeData, setThucTeData] = useState({});

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    loadData();
  }, [tiendoId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load tiến độ
      const tiendoData = await tramTienDoAPI.getById(tiendoId, true);
      setTiendo(tiendoData);
      
      if (tiendoData) {
        setFormData({
          ngay_khao_sat: tiendoData.ngay_khao_sat || '',
          trangthai_ks: tiendoData.trangthai_ks || 'chua_bat_dau',
          phantram_ks: tiendoData.phantram_ks || 0,
          vuong_mac: tiendoData.vuong_mac || ''
        });

        // Load volume hợp đồng và volume thực tế
        const [cots, volumes, thucTeCots, thucTeVolumes] = await Promise.all([
          tramCotAPI.getByTram(tiendoData.tram_id).catch(() => []),
          tramVolumeKhacAPI.getByTram(tiendoData.tram_id).catch(() => []),
          tramThucTeCotAPI.getByTramAndHopDong(tiendoData.tram_id, tiendoData.hopdong_id).catch(() => []),
          tramThucTeVolumeKhacAPI.getByTramAndHopDong(tiendoData.tram_id, tiendoData.hopdong_id).catch(() => [])
        ]);

        // Load relations cho volume hợp đồng
        const cotsWithRelations = await Promise.all(
          (cots || []).map(async (cot) => {
            try {
              const cotDetail = await tramCotAPI.getById(cot.id, true);
              return cotDetail || cot;
            } catch {
              return cot;
            }
          })
        );
        
        const volumesWithRelations = await Promise.all(
          (volumes || []).map(async (vol) => {
            try {
              const volDetail = await tramVolumeKhacAPI.getById(vol.id, true);
              return volDetail || vol;
            } catch {
              return vol;
            }
          })
        );

        setHopdongVolumes({ cots: cotsWithRelations, volumes: volumesWithRelations });
        setThucTeVolumes({ cots: thucTeCots || [], volumes: thucTeVolumes || [] });

        // Khởi tạo dữ liệu thực tế
        const initialThucTeData = {};
        cotsWithRelations.forEach(cot => {
          const thucTe = (thucTeCots || []).find(tc => tc.cot_id === cot.cot_id);
          initialThucTeData[`cot-${cot.cot_id}`] = thucTe ? thucTe.soluong_thucte : cot.soluong;
        });
        volumesWithRelations.forEach(vol => {
          const thucTe = (thucTeVolumes || []).find(tv => tv.volume_id === vol.volume_id);
          initialThucTeData[`vol-${vol.volume_id}`] = thucTe ? thucTe.soluong_thucte : vol.soluong;
        });
        setThucTeData(initialThucTeData);
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      alert('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

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

  const handleStatusChange = (status) => {
    const autoPercentage = getPercentageByStatus(status);
    setFormData({
      ...formData,
      trangthai_ks: status,
      phantram_ks: autoPercentage
    });
  };

  const handleThucTeChange = (key, value) => {
    setThucTeData({
      ...thucTeData,
      [key]: parseInt(value) || 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tiendo) return;

    setSaving(true);
    try {
      // 1. Cập nhật tiến độ khảo sát
      const tiendoData = {
        ngay_khao_sat: formData.ngay_khao_sat || null,
        trangthai_ks: formData.trangthai_ks,
        phantram_ks: parseFloat(formData.phantram_ks) || 0,
        nguoi_ks_id: currentUser?.id || null,
        ...(formData.vuong_mac && { vuong_mac: formData.vuong_mac })
      };

      await tramTienDoAPI.update(tiendo.id, tiendoData);

      // 2. Cập nhật volume thực tế cột
      const cotPromises = hopdongVolumes.cots.map(async (cot) => {
        const soluongThucTe = thucTeData[`cot-${cot.cot_id}`] || 0;
        const existingThucTe = thucTeVolumes.cots.find(tc => tc.cot_id === cot.cot_id);
        
        const data = {
          tram_id: tiendo.tram_id,
          hopdong_id: tiendo.hopdong_id,
          cot_id: cot.cot_id,
          soluong_thucte: soluongThucTe,
          nguoinhap_id: currentUser?.id
        };

        if (existingThucTe) {
          return tramThucTeCotAPI.update(existingThucTe.id, data);
        } else {
          return tramThucTeCotAPI.create(data);
        }
      });

      // 3. Cập nhật volume thực tế khác
      const volumePromises = hopdongVolumes.volumes.map(async (vol) => {
        const soluongThucTe = thucTeData[`vol-${vol.volume_id}`] || 0;
        const existingThucTe = thucTeVolumes.volumes.find(tv => tv.volume_id === vol.volume_id);
        
        const data = {
          tram_id: tiendo.tram_id,
          hopdong_id: tiendo.hopdong_id,
          volume_id: vol.volume_id,
          soluong_thucte: soluongThucTe,
          nguoinhap_id: currentUser?.id
        };

        if (existingThucTe) {
          return tramThucTeVolumeKhacAPI.update(existingThucTe.id, data);
        } else {
          return tramThucTeVolumeKhacAPI.create(data);
        }
      });

      await Promise.all([...cotPromises, ...volumePromises]);
      
      alert('Lưu khảo sát thành công');
      navigate('/hopdong-can-khaosat');
    } catch (error) {
      console.error('Lỗi lưu:', error);
      alert(error.message || 'Không thể lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!tiendo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy thông tin tiến độ</p>
        <button
          onClick={() => navigate('/hopdong-can-khaosat')}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/hopdong-can-khaosat')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Khảo sát volume thực tế</h1>
            <p className="text-sm text-gray-600 mt-1">
              Trạm: <span className="font-semibold">{tiendo.tram?.matram || 'N/A'}</span> | 
              Hợp đồng: <span className="font-semibold">{tiendo.hopdong?.sohopdong || 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bảng so sánh Volume Cột */}
        {hopdongVolumes.cots.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Cột</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên cột</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Số lượng HĐ</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Số lượng thực tế</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Chênh lệch</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hopdongVolumes.cots.map((cot) => {
                    const soluongHD = cot.soluong || 0;
                    const soluongThucTe = thucTeData[`cot-${cot.cot_id}`] || 0;
                    const chenhlech = soluongThucTe - soluongHD;
                    return (
                      <tr key={cot.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{cot.cot?.tencot || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{cot.cot?.macot || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-gray-900">{soluongHD}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={soluongThucTe}
                            onChange={(e) => handleThucTeChange(`cot-${cot.cot_id}`, e.target.value)}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-sm font-semibold ${
                            chenhlech > 0 ? 'text-green-600' : 
                            chenhlech < 0 ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {chenhlech > 0 ? '+' : ''}{chenhlech}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bảng so sánh Volume Khác */}
        {hopdongVolumes.volumes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Khác</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên volume</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Số lượng HĐ</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Số lượng thực tế</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Chênh lệch</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hopdongVolumes.volumes.map((vol) => {
                    const soluongHD = vol.soluong || 0;
                    const soluongThucTe = thucTeData[`vol-${vol.volume_id}`] || 0;
                    const chenhlech = soluongThucTe - soluongHD;
                    return (
                      <tr key={vol.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{vol.volume?.tenvolume || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{vol.volume?.mavolume || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-gray-900">{soluongHD}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={soluongThucTe}
                            onChange={(e) => handleThucTeChange(`vol-${vol.volume_id}`, e.target.value)}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-sm font-semibold ${
                            chenhlech > 0 ? 'text-green-600' : 
                            chenhlech < 0 ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {chenhlech > 0 ? '+' : ''}{chenhlech}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {hopdongVolumes.cots.length === 0 && hopdongVolumes.volumes.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Hợp đồng này chưa có volume nào</p>
          </div>
        )}

        {/* Thông tin khảo sát */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khảo sát</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khảo sát *</label>
              <input
                type="date"
                value={formData.ngay_khao_sat}
                onChange={(e) => setFormData({ ...formData, ngay_khao_sat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái *</label>
              <select
                value={formData.trangthai_ks}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
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

        {/* Vướng mắc */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vướng mắc (nếu có)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả vướng mắc</label>
            <textarea
              value={formData.vuong_mac}
              onChange={(e) => setFormData({ ...formData, vuong_mac: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nhập mô tả vướng mắc nếu có..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/hopdong-can-khaosat')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                Lưu khảo sát
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KhaoSatChiTiet;

