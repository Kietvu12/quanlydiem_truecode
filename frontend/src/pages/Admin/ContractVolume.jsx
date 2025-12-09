import { useState, useEffect } from 'react';
import { FaFileContract, FaBuilding, FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';
import { hopdongAPI, tramCotAPI, tramVolumeKhacAPI, thuVienCotAPI, thuVienVolumeKhacAPI } from '../../service/api';

const ContractVolume = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedTram, setSelectedTram] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Volume Cột
  const [tramCots, setTramCots] = useState([]);
  const [thuVienCots, setThuVienCots] = useState([]);
  const [showCotModal, setShowCotModal] = useState(false);
  const [editingCot, setEditingCot] = useState(null);
  const [cotFormData, setCotFormData] = useState({
    cot_id: '',
    soluong: 0
  });

  // Volume Khác
  const [tramVolumes, setTramVolumes] = useState([]);
  const [thuVienVolumes, setThuVienVolumes] = useState([]);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [editingVolume, setEditingVolume] = useState(null);
  const [volumeFormData, setVolumeFormData] = useState({
    volume_id: '',
    soluong: 0
  });

  useEffect(() => {
    loadContracts();
    loadThuVienCots();
    loadThuVienVolumes();
  }, []);

  useEffect(() => {
    if (selectedTram) {
      loadTramVolumes();
    }
  }, [selectedTram]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const data = await hopdongAPI.getAll(true);
      setContracts(data);
    } catch (error) {
      console.error('Lỗi tải hợp đồng:', error);
      alert('Không thể tải danh sách hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const loadThuVienCots = async () => {
    try {
      const data = await thuVienCotAPI.getAll();
      setThuVienCots(data);
    } catch (error) {
      console.error('Lỗi tải thư viện cột:', error);
    }
  };

  const loadThuVienVolumes = async () => {
    try {
      const data = await thuVienVolumeKhacAPI.getAll();
      setThuVienVolumes(data);
    } catch (error) {
      console.error('Lỗi tải thư viện volume:', error);
    }
  };

  const loadTramVolumes = async () => {
    if (!selectedTram) return;
    
    try {
      // Load volume cột
      const cots = await tramCotAPI.getByTram(selectedTram.id);
      setTramCots(cots || []);
      
      // Load volume khác
      const volumes = await tramVolumeKhacAPI.getByTram(selectedTram.id);
      setTramVolumes(volumes || []);
    } catch (error) {
      console.error('Lỗi tải volume trạm:', error);
      alert('Không thể tải volume của trạm');
    }
  };

  const handleSelectContract = (contract) => {
    setSelectedContract(contract);
    setSelectedTram(null);
    setTramCots([]);
    setTramVolumes([]);
  };

  const handleSelectTram = (tram) => {
    setSelectedTram(tram);
  };

  // ========== Volume Cột ==========
  const handleCreateCot = () => {
    setEditingCot(null);
    setCotFormData({
      cot_id: '',
      soluong: 0
    });
    setShowCotModal(true);
  };

  const handleEditCot = (tramCot) => {
    setEditingCot(tramCot);
    setCotFormData({
      cot_id: tramCot.cot_id || '',
      soluong: tramCot.soluong || 0
    });
    setShowCotModal(true);
  };

  const handleDeleteCot = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa volume cột này?')) return;
    
    try {
      await tramCotAPI.delete(id);
      alert('Xóa volume cột thành công');
      loadTramVolumes();
    } catch (error) {
      console.error('Lỗi xóa volume cột:', error);
      alert('Không thể xóa volume cột');
    }
  };

  const handleSubmitCot = async (e) => {
    e.preventDefault();
    if (!selectedTram) return;

    try {
      const data = {
        tram_id: selectedTram.id,
        cot_id: parseInt(cotFormData.cot_id),
        soluong: parseInt(cotFormData.soluong)
      };

      if (editingCot) {
        await tramCotAPI.update(editingCot.id, data);
        alert('Cập nhật volume cột thành công');
      } else {
        await tramCotAPI.create(data);
        alert('Thêm volume cột thành công');
      }
      
      setShowCotModal(false);
      loadTramVolumes();
      
      // Reload hợp đồng để cập nhật tổng giá trị
      loadContracts();
    } catch (error) {
      console.error('Lỗi lưu volume cột:', error);
      alert(error.message || 'Không thể lưu volume cột');
    }
  };

  // ========== Volume Khác ==========
  const handleCreateVolume = () => {
    setEditingVolume(null);
    setVolumeFormData({
      volume_id: '',
      soluong: 0
    });
    setShowVolumeModal(true);
  };

  const handleEditVolume = (tramVolume) => {
    setEditingVolume(tramVolume);
    setVolumeFormData({
      volume_id: tramVolume.volume_id || '',
      soluong: tramVolume.soluong || 0
    });
    setShowVolumeModal(true);
  };

  const handleDeleteVolume = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa volume này?')) return;
    
    try {
      await tramVolumeKhacAPI.delete(id);
      alert('Xóa volume thành công');
      loadTramVolumes();
    } catch (error) {
      console.error('Lỗi xóa volume:', error);
      alert('Không thể xóa volume');
    }
  };

  const handleSubmitVolume = async (e) => {
    e.preventDefault();
    if (!selectedTram) return;

    try {
      const data = {
        tram_id: selectedTram.id,
        volume_id: parseInt(volumeFormData.volume_id),
        soluong: parseInt(volumeFormData.soluong)
      };

      if (editingVolume) {
        await tramVolumeKhacAPI.update(editingVolume.id, data);
        alert('Cập nhật volume thành công');
      } else {
        await tramVolumeKhacAPI.create(data);
        alert('Thêm volume thành công');
      }
      
      setShowVolumeModal(false);
      loadTramVolumes();
      
      // Reload hợp đồng để cập nhật tổng giá trị
      loadContracts();
    } catch (error) {
      console.error('Lỗi lưu volume:', error);
      alert(error.message || 'Không thể lưu volume');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Volume Hợp đồng</h1>
        <p className="text-gray-600">Quản lý volume dự toán của các trạm trong hợp đồng</p>
      </div>

      {/* Chọn hợp đồng */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn hợp đồng</label>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <select
            value={selectedContract?.id || ''}
            onChange={(e) => {
              const contract = contracts.find(c => c.id === parseInt(e.target.value));
              handleSelectContract(contract);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">-- Chọn hợp đồng --</option>
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.sohopdong} - {contract.duan?.tenduan || 'N/A'}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedContract && (
        <>
          {/* Chọn trạm */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn trạm</label>
            {selectedContract.trams && selectedContract.trams.length > 0 ? (
              <select
                value={selectedTram?.id || ''}
                onChange={(e) => {
                  const tram = selectedContract.trams.find(t => t.id === parseInt(e.target.value));
                  handleSelectTram(tram);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">-- Chọn trạm --</option>
                {selectedContract.trams.map((tram) => (
                  <option key={tram.id} value={tram.id}>
                    {tram.matram} - {tram.tinhthanh?.ten || 'N/A'}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500 py-2">Hợp đồng này chưa có trạm nào. Vui lòng gán trạm vào hợp đồng trước.</p>
            )}
          </div>

          {selectedTram && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Volume Cột */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Volume Cột</h2>
                  <button
                    onClick={handleCreateCot}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaPlus className="w-3 h-3" />
                    Thêm
                  </button>
                </div>

                {tramCots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaBuilding className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>Chưa có volume cột nào</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tramCots.map((tramCot) => (
                      <div
                        key={tramCot.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {tramCot.cot?.tencot || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-600">
                            Số lượng: {tramCot.soluong} | 
                            Tổng tiền: {formatCurrency(tramCot.tongtien)} đ
                          </p>
                        </div>
                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => handleEditCot(tramCot)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Sửa"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCot(tramCot.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Volume Khác */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Volume Khác</h2>
                  <button
                    onClick={handleCreateVolume}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaPlus className="w-3 h-3" />
                    Thêm
                  </button>
                </div>

                {tramVolumes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaBuilding className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>Chưa có volume khác nào</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tramVolumes.map((tramVolume) => (
                      <div
                        key={tramVolume.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {tramVolume.volume?.tenvolume || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-600">
                            Số lượng: {tramVolume.soluong} | 
                            Tổng tiền: {formatCurrency(tramVolume.tongtien)} đ
                          </p>
                        </div>
                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => handleEditVolume(tramVolume)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Sửa"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVolume(tramVolume.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Volume Cột */}
      {showCotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingCot ? 'Sửa Volume Cột' : 'Thêm Volume Cột'}
            </h2>
            <form onSubmit={handleSubmitCot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cột *</label>
                <select
                  value={cotFormData.cot_id}
                  onChange={(e) => setCotFormData({ ...cotFormData, cot_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Chọn cột</option>
                  {thuVienCots.map((cot) => (
                    <option key={cot.id} value={cot.id}>
                      {cot.tencot} ({cot.macot}) - {formatCurrency(cot.giadonvi)} đ/đơn vị
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                <input
                  type="number"
                  min="0"
                  value={cotFormData.soluong}
                  onChange={(e) => setCotFormData({ ...cotFormData, soluong: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCotModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editingCot ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Volume Khác */}
      {showVolumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingVolume ? 'Sửa Volume Khác' : 'Thêm Volume Khác'}
            </h2>
            <form onSubmit={handleSubmitVolume} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Volume *</label>
                <select
                  value={volumeFormData.volume_id}
                  onChange={(e) => setVolumeFormData({ ...volumeFormData, volume_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Chọn volume</option>
                  {thuVienVolumes.map((volume) => (
                    <option key={volume.id} value={volume.id}>
                      {volume.tenvolume} ({volume.mavolume}) - {formatCurrency(volume.giadonvi)} đ/đơn vị
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                <input
                  type="number"
                  min="0"
                  value={volumeFormData.soluong}
                  onChange={(e) => setVolumeFormData({ ...volumeFormData, soluong: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowVolumeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editingVolume ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractVolume;

