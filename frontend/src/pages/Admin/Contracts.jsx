import { useState, useEffect } from 'react';
import { FaFileContract, FaPlus, FaEdit, FaTrash, FaSearch, FaBuilding, FaTimes, FaChevronDown, FaChevronRight, FaGripVertical, FaHandPointer } from 'react-icons/fa';
import { hopdongAPI, duanAPI, tramAPI, tramCotAPI, tramVolumeKhacAPI, thuVienCotAPI, thuVienVolumeKhacAPI } from '../../service/api';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [duanList, setDuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [showTramModal, setShowTramModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [allStations, setAllStations] = useState([]);
  const [contractStations, setContractStations] = useState([]);
  const [tramSearchTerm, setTramSearchTerm] = useState('');
  const [loadingTrams, setLoadingTrams] = useState(false);
  
  // Accordion states
  const [expandedContracts, setExpandedContracts] = useState(new Set());
  const [expandedTrams, setExpandedTrams] = useState(new Set());
  const [tramVolumes, setTramVolumes] = useState({}); // { tramId: { cots: [], volumes: [] } }
  const [loadingVolumes, setLoadingVolumes] = useState(new Set());
  const [thuVienCots, setThuVienCots] = useState([]);
  const [thuVienVolumes, setThuVienVolumes] = useState([]);
  
  // Modal states for volume
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [editingVolumeItem, setEditingVolumeItem] = useState(null);
  const [currentTramForVolume, setCurrentTramForVolume] = useState(null);
  const [volumeType, setVolumeType] = useState('cot'); // 'cot' or 'volume'
  const [volumeItems, setVolumeItems] = useState([{ id: Date.now(), type: 'cot', item_id: '', soluong: 0 }]);
  
  // Drag and Drop states for modal
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedVolumeItems, setSelectedVolumeItems] = useState([]); // Items đã kéo vào modal
  const [librarySearchTerm, setLibrarySearchTerm] = useState('');
  const [libraryType, setLibraryType] = useState('cot'); // 'cot' or 'volume'
  const [formData, setFormData] = useState({
    duan_id: '',
    sohopdong: '',
    chudautu: '',
    ngayky: '',
    trangthai: 'dangxuly'
  });

  useEffect(() => {
    loadContracts();
    loadDuanList();
    loadThuVienCots();
    loadThuVienVolumes();
  }, []);

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

  const loadDuanList = async () => {
    try {
      const data = await duanAPI.getAll();
      setDuanList(data);
    } catch (error) {
      console.error('Lỗi tải danh sách dự án:', error);
    }
  };

  const handleCreate = () => {
    setEditingContract(null);
    setFormData({
      duan_id: '',
      sohopdong: '',
      chudautu: '',
      ngayky: '',
      trangthai: 'dangxuly'
    });
    setShowModal(true);
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
    setFormData({
      duan_id: contract.duan_id || '',
      sohopdong: contract.sohopdong || '',
      chudautu: contract.chudautu || '',
      ngayky: contract.ngayky ? contract.ngayky.split('T')[0] : '',
      trangthai: contract.trangthai || 'dangxuly'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) return;
    
    try {
      await hopdongAPI.delete(id);
      alert('Xóa hợp đồng thành công');
      loadContracts();
    } catch (error) {
      console.error('Lỗi xóa hợp đồng:', error);
      alert('Không thể xóa hợp đồng');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContract) {
        await hopdongAPI.update(editingContract.id, formData);
        alert('Cập nhật hợp đồng thành công');
      } else {
        await hopdongAPI.create(formData);
        alert('Tạo hợp đồng thành công');
      }
      setShowModal(false);
      loadContracts();
    } catch (error) {
      console.error('Lỗi lưu hợp đồng:', error);
      alert(error.message || 'Không thể lưu hợp đồng');
    }
  };

  const filteredContracts = contracts.filter(contract =>
    contract.sohopdong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.chudautu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusMap = {
      'dangxuly': { text: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800' },
      'hoanthanh': { text: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
      'tretien_do': { text: 'Trễ tiến độ', color: 'bg-red-100 text-red-800' }
    };
    const statusInfo = statusMap[status] || statusMap['dangxuly'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  const handleManageTrams = async (contract) => {
    setSelectedContract(contract);
    setLoadingTrams(true);
    try {
      // Lấy thông tin hợp đồng với trạm
      const contractData = await hopdongAPI.getById(contract.id, true);
      setContractStations(contractData.trams || []);
      
      // Lấy tất cả trạm
      const allTrams = await tramAPI.getAll(true);
      setAllStations(allTrams);
      
      setShowTramModal(true);
    } catch (error) {
      console.error('Lỗi tải trạm:', error);
      alert('Không thể tải danh sách trạm');
    } finally {
      setLoadingTrams(false);
    }
  };

  const handleAddTram = async (tramId) => {
    if (!selectedContract) return;
    
    try {
      await hopdongAPI.addTram(selectedContract.id, tramId);
      alert('Thêm trạm vào hợp đồng thành công');
      
      // Reload danh sách trạm của hợp đồng
      const contractData = await hopdongAPI.getById(selectedContract.id, true);
      setContractStations(contractData.trams || []);
      
      // Reload danh sách hợp đồng
      loadContracts();
    } catch (error) {
      console.error('Lỗi thêm trạm:', error);
      alert(error.message || 'Không thể thêm trạm vào hợp đồng');
    }
  };

  const handleRemoveTram = async (tramId) => {
    if (!selectedContract) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa trạm này khỏi hợp đồng?')) return;
    
    try {
      await hopdongAPI.removeTram(selectedContract.id, tramId);
      alert('Xóa trạm khỏi hợp đồng thành công');
      
      // Reload danh sách trạm của hợp đồng
      const contractData = await hopdongAPI.getById(selectedContract.id, true);
      setContractStations(contractData.trams || []);
      
      // Reload danh sách hợp đồng
      loadContracts();
    } catch (error) {
      console.error('Lỗi xóa trạm:', error);
      alert(error.message || 'Không thể xóa trạm khỏi hợp đồng');
    }
  };

  // Lọc trạm chưa được gán vào hợp đồng
  const getAvailableStations = () => {
    const assignedTramIds = contractStations.map(t => t.id);
    return allStations.filter(station => 
      !assignedTramIds.includes(station.id) &&
      (station.matram?.toLowerCase().includes(tramSearchTerm.toLowerCase()) ||
       station.tinhthanh?.ten?.toLowerCase().includes(tramSearchTerm.toLowerCase()) ||
       station.diachi?.toLowerCase().includes(tramSearchTerm.toLowerCase()))
    );
  };

  // Helper function để load volume với relations
  const loadTramVolumesWithRelations = async (tramId) => {
    const [cots, volumes] = await Promise.all([
      tramCotAPI.getByTram(tramId).catch(() => []),
      tramVolumeKhacAPI.getByTram(tramId).catch(() => [])
    ]);
    
    // Fetch relation cho từng item
    const cotsWithRelations = await Promise.all(
      (cots || []).map(async (cot) => {
        if (cot.cot_id) {
          try {
            const cotDetail = await tramCotAPI.getById(cot.id, true);
            return cotDetail || cot;
          } catch {
            return cot;
          }
        }
        return cot;
      })
    );
    
    const volumesWithRelations = await Promise.all(
      (volumes || []).map(async (vol) => {
        if (vol.volume_id) {
          try {
            const volDetail = await tramVolumeKhacAPI.getById(vol.id, true);
            return volDetail || vol;
          } catch {
            return vol;
          }
        }
        return vol;
      })
    );
    
    return { cots: cotsWithRelations, volumes: volumesWithRelations };
  };

  // Accordion handlers
  const toggleContract = (contractId) => {
    const newExpanded = new Set(expandedContracts);
    if (newExpanded.has(contractId)) {
      newExpanded.delete(contractId);
      // Đóng tất cả trạm của hợp đồng này
      const contract = contracts.find(c => c.id === contractId);
      if (contract && contract.trams) {
        const newExpandedTrams = new Set(expandedTrams);
        contract.trams.forEach(tram => {
          newExpandedTrams.delete(tram.id);
        });
        setExpandedTrams(newExpandedTrams);
      }
    } else {
      newExpanded.add(contractId);
    }
    setExpandedContracts(newExpanded);
  };

  const toggleTram = async (tramId) => {
    const newExpanded = new Set(expandedTrams);
    if (newExpanded.has(tramId)) {
      newExpanded.delete(tramId);
    } else {
      newExpanded.add(tramId);
      // Load volume nếu chưa có hoặc reload
      if (!tramVolumes[tramId]) {
        setLoadingVolumes(new Set([...loadingVolumes, tramId]));
        try {
          const volumesData = await loadTramVolumesWithRelations(tramId);
          setTramVolumes({
            ...tramVolumes,
            [tramId]: volumesData
          });
        } catch (error) {
          console.error('Lỗi tải volume:', error);
        } finally {
          const newLoading = new Set(loadingVolumes);
          newLoading.delete(tramId);
          setLoadingVolumes(newLoading);
        }
      }
    }
    setExpandedTrams(newExpanded);
  };

  // Volume handlers
  const handleCreateVolume = (tram) => {
    setCurrentTramForVolume(tram);
    setEditingVolumeItem(null);
    setVolumeType('cot');
    setVolumeItems([{ id: Date.now(), type: 'cot', item_id: '', soluong: 0 }]);
    setSelectedVolumeItems([]);
    setLibrarySearchTerm('');
    setLibraryType('cot');
    setShowVolumeModal(true);
  };

  const handleEditVolume = (item, tram) => {
    setCurrentTramForVolume(tram);
    setEditingVolumeItem(item);
    setVolumeType(item.type || 'cot');
    setVolumeItems([{ id: Date.now(), type: item.type || 'cot', item_id: item.item_id || '', soluong: item.soluong || 0 }]);
    setShowVolumeModal(true);
  };

  const handleDeleteVolume = async (item, tramId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa volume này?')) return;
    
    try {
      if (item.type === 'cot') {
        await tramCotAPI.delete(item.id);
      } else {
        await tramVolumeKhacAPI.delete(item.id);
      }
      alert('Xóa volume thành công');
      
      // Reload volume với relations
      const volumesData = await loadTramVolumesWithRelations(tramId);
      const newTramVolumes = {
        ...tramVolumes,
        [tramId]: volumesData
      };
      setTramVolumes(newTramVolumes);
      
      loadContracts();
    } catch (error) {
      console.error('Lỗi xóa volume:', error);
      alert('Không thể xóa volume');
    }
  };

  const handleAddVolumeRow = () => {
    setVolumeItems([...volumeItems, { id: Date.now(), type: volumeType, item_id: '', soluong: 0 }]);
  };

  const handleRemoveVolumeRow = (id) => {
    if (volumeItems.length > 1) {
      setVolumeItems(volumeItems.filter(item => item.id !== id));
    }
  };

  const handleUpdateVolumeItem = (id, field, value) => {
    setVolumeItems(volumeItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmitVolume = async (e) => {
    e.preventDefault();
    if (!currentTramForVolume) return;

    try {
      // Nếu đang edit, dùng logic cũ
      if (editingVolumeItem) {
        const item = volumeItems[0];
        if (item.type === 'cot') {
          await tramCotAPI.update(editingVolumeItem.id, {
            tram_id: currentTramForVolume.id,
            cot_id: parseInt(item.item_id),
            soluong: parseInt(item.soluong)
          });
        } else {
          await tramVolumeKhacAPI.update(editingVolumeItem.id, {
            tram_id: currentTramForVolume.id,
            volume_id: parseInt(item.item_id),
            soluong: parseInt(item.soluong)
          });
        }
        alert('Cập nhật volume thành công');
      } else {
        // Validate selected items
        const validItems = selectedVolumeItems.filter(item => item.soluong > 0);
        if (validItems.length === 0) {
          alert('Vui lòng nhập số lượng cho ít nhất một volume');
          return;
        }

        // Thêm nhiều volume cùng lúc
        const promises = validItems.map(item => {
          if (item.type === 'cot') {
            return tramCotAPI.create({
              tram_id: currentTramForVolume.id,
              cot_id: item.item.id,
              soluong: item.soluong
            });
          } else {
            return tramVolumeKhacAPI.create({
              tram_id: currentTramForVolume.id,
              volume_id: item.item.id,
              soluong: item.soluong
            });
          }
        });
        
        await Promise.all(promises);
        alert(`Thêm ${validItems.length} volume thành công`);
      }
      
      setShowVolumeModal(false);
      setSelectedVolumeItems([]);
      
      // Reload volume với relations
      const volumesData = await loadTramVolumesWithRelations(currentTramForVolume.id);
      const newTramVolumes = {
        ...tramVolumes,
        [currentTramForVolume.id]: volumesData
      };
      setTramVolumes(newTramVolumes);
      
      loadContracts();
    } catch (error) {
      console.error('Lỗi lưu volume:', error);
      alert(error.message || 'Không thể lưu volume');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };

  // Drag and Drop handlers for modal
  const handleDragStart = (e, item, type) => {
    setDraggedItem({ item, type });
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, type }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropInModal = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      // Kiểm tra xem item đã có trong danh sách chưa
      const exists = selectedVolumeItems.some(
        sv => sv.item.id === data.item.id && sv.type === data.type
      );
      
      if (!exists) {
        setSelectedVolumeItems([
          ...selectedVolumeItems,
          {
            id: Date.now(),
            item: data.item,
            type: data.type,
            soluong: 1
          }
        ]);
      }
      setDraggedItem(null);
    } catch (error) {
      console.error('Lỗi xử lý drop:', error);
    }
  };

  const handleUpdateSelectedItemQuantity = (id, soluong) => {
    setSelectedVolumeItems(selectedVolumeItems.map(item =>
      item.id === id ? { ...item, soluong: parseInt(soluong) || 0 } : item
    ));
  };

  const handleRemoveSelectedItem = (id) => {
    setSelectedVolumeItems(selectedVolumeItems.filter(item => item.id !== id));
  };

  const getFilteredLibrary = () => {
    const items = libraryType === 'cot' ? thuVienCots : thuVienVolumes;
    return items.filter(item => {
      const searchLower = librarySearchTerm.toLowerCase();
      if (libraryType === 'cot') {
        return item.tencot?.toLowerCase().includes(searchLower) ||
               item.macot?.toLowerCase().includes(searchLower);
      } else {
        return item.tenvolume?.toLowerCase().includes(searchLower) ||
               item.mavolume?.toLowerCase().includes(searchLower);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Hợp đồng</h1>
          <p className="text-gray-600">Quản lý tất cả các hợp đồng thi công trạm BTS</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tạo hợp đồng mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo số hợp đồng hoặc chủ đầu tư..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
            <FaFileContract className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có hợp đồng nào</h3>
            <p className="text-gray-500">Bắt đầu bằng cách tạo hợp đồng mới</p>
          </div>
        ) : (
          filteredContracts.map((contract) => {
            const isExpanded = expandedContracts.has(contract.id);
            return (
              <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Contract Header */}
                <div 
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleContract(contract.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {isExpanded ? (
                      <FaChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <FaChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <div className="flex-1 grid grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Số hợp đồng</p>
                        <p className="text-sm font-semibold text-gray-900">{contract.sohopdong}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Dự án</p>
                        <p className="text-sm text-gray-700">{contract.duan?.tenduan || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Chủ đầu tư</p>
                        <p className="text-sm text-gray-700">{contract.chudautu}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tổng giá trị</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(contract.tonggiatri)} đ
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Trạng thái</p>
                        <div>{getStatusBadge(contract.trangthai)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleManageTrams(contract)}
                      className="text-green-600 hover:text-green-800 p-2"
                      title="Quản lý trạm"
                    >
                      <FaBuilding className="w-4 h-4" />
                    </button>
                      <button
                        onClick={() => handleEdit(contract)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Sửa"
                      >
                      <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contract.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Xóa"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Trạm List */}
                {isExpanded && contract.trams && contract.trams.length > 0 && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {contract.trams.map((tram) => {
                      const isTramExpanded = expandedTrams.has(tram.id);
                      const volumes = tramVolumes[tram.id] || { cots: [], volumes: [] };
                      const isLoadingVolume = loadingVolumes.has(tram.id);
                      
                      return (
                        <div key={tram.id} className="border-b border-gray-200 last:border-b-0">
                          {/* Tram Header */}
                          <div 
                            className="flex items-center justify-between p-3 pl-8 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => toggleTram(tram.id)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {isTramExpanded ? (
                                <FaChevronDown className="w-3 h-3 text-gray-500" />
                              ) : (
                                <FaChevronRight className="w-3 h-3 text-gray-500" />
                              )}
                              <FaBuilding className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{tram.matram}</p>
                                <p className="text-xs text-gray-500">
                                  {tram.tinhthanh?.ten || 'N/A'} {tram.diachi && `- ${tram.diachi}`}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Volume List */}
                          {isTramExpanded && (
                            <div className="bg-white pl-12 pr-4 py-3">
                              {isLoadingVolume ? (
                                <div className="text-center py-4">
                                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                  <p className="mt-2 text-xs text-gray-500">Đang tải volume...</p>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-700">
                                      Danh sách Volume ({volumes.cots.length + volumes.volumes.length})
                                    </h4>
                                    <button
                                      onClick={() => handleCreateVolume(tram)}
                                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                      <FaPlus className="w-3 h-3" />
                                      Thêm Volume
                                    </button>
                                  </div>
                                  
                                  {/* Volume List */}
                                  <div className="space-y-2">
                                    {volumes.cots.length === 0 && volumes.volumes.length === 0 ? (
                                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <FaBuilding className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500">Chưa có volume nào</p>
                                        <p className="text-xs text-gray-400 mt-1">Click "Thêm" để thêm volume</p>
                                      </div>
                                    ) : (
                                      <>
                                        {/* Volume Cột */}
                                        {volumes.cots.map((cot) => (
                                          <div key={`cot-${cot.id}`} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3 flex-1">
                                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                  <p className="text-sm font-semibold text-gray-900">{cot.cot?.tencot || 'N/A'}</p>
                                                  <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full">Cột</span>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-0.5">
                                                  Số lượng: <span className="font-medium">{cot.soluong}</span> | 
                                                  Tổng tiền: <span className="font-medium text-red-600">{formatCurrency(cot.tongtien)} đ</span>
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex gap-2 ml-3">
                                              <button
                                                onClick={() => handleEditVolume({ ...cot, type: 'cot', item_id: cot.cot_id }, tram)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                                                title="Sửa"
                                              >
                                                <FaEdit className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                onClick={() => handleDeleteVolume({ ...cot, type: 'cot' }, tram.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-200 rounded transition-colors"
                                                title="Xóa"
                                              >
                                                <FaTrash className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                        
                                        {/* Volume Khác */}
                                        {volumes.volumes.map((vol) => (
                                          <div key={`vol-${vol.id}`} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3 flex-1">
                                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                  <p className="text-sm font-semibold text-gray-900">{vol.volume?.tenvolume || 'N/A'}</p>
                                                  <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full">Volume</span>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-0.5">
                                                  Số lượng: <span className="font-medium">{vol.soluong}</span> | 
                                                  Tổng tiền: <span className="font-medium text-red-600">{formatCurrency(vol.tongtien)} đ</span>
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex gap-2 ml-3">
                                              <button
                                                onClick={() => handleEditVolume({ ...vol, type: 'volume', item_id: vol.volume_id }, tram)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                                                title="Sửa"
                                              >
                                                <FaEdit className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                onClick={() => handleDeleteVolume({ ...vol, type: 'volume' }, tram.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-200 rounded transition-colors"
                                                title="Xóa"
                                              >
                                                <FaTrash className="w-3.5 h-3.5" />
                      </button>
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isExpanded && (!contract.trams || contract.trams.length === 0) && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 pl-8 text-sm text-gray-500">
                    Hợp đồng này chưa có trạm nào. Vui lòng gán trạm vào hợp đồng.
                  </div>
                )}
          </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingContract ? 'Sửa hợp đồng' : 'Tạo hợp đồng mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dự án *</label>
                <select
                  value={formData.duan_id}
                  onChange={(e) => setFormData({ ...formData, duan_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Chọn dự án</option>
                  {duanList.map((duan) => (
                    <option key={duan.id} value={duan.id}>
                      {duan.tenduan}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số hợp đồng *</label>
                <input
                  type="text"
                  value={formData.sohopdong}
                  onChange={(e) => setFormData({ ...formData, sohopdong: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đầu tư *</label>
                <input
                  type="text"
                  value={formData.chudautu}
                  onChange={(e) => setFormData({ ...formData, chudautu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày ký *</label>
                <input
                  type="date"
                  value={formData.ngayky}
                  onChange={(e) => setFormData({ ...formData, ngayky: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái *</label>
                <select
                  value={formData.trangthai}
                  onChange={(e) => setFormData({ ...formData, trangthai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="dangxuly">Đang xử lý</option>
                  <option value="hoanthanh">Hoàn thành</option>
                  <option value="tretien_do">Trễ tiến độ</option>
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
                  {editingContract ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Quản lý Trạm */}
      {showTramModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Trạm</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Hợp đồng: <span className="font-semibold">{selectedContract.sohopdong}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTramModal(false);
                  setSelectedContract(null);
                  setContractStations([]);
                  setTramSearchTerm('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingTrams ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Danh sách trạm đã gán */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Trạm đã gán ({contractStations.length})
                    </h3>
                    {contractStations.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <FaBuilding className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Chưa có trạm nào được gán</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {contractStations.map((tram) => (
                          <div
                            key={tram.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{tram.matram}</p>
                              <p className="text-xs text-gray-600">
                                {tram.tinhthanh?.ten || 'N/A'}
                                {tram.diachi && ` - ${tram.diachi}`}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveTram(tram.id)}
                              className="ml-3 text-red-600 hover:text-red-800"
                              title="Xóa khỏi hợp đồng"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Danh sách trạm có thể thêm */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm trạm mới</h3>
                    
                    {/* Search */}
                    <div className="mb-4">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm trạm..."
                          value={tramSearchTerm}
                          onChange={(e) => setTramSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    {/* Danh sách trạm có sẵn */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getAvailableStations().length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">
                            {tramSearchTerm ? 'Không tìm thấy trạm nào' : 'Tất cả trạm đã được gán'}
                          </p>
                        </div>
                      ) : (
                        getAvailableStations().map((station) => (
                          <div
                            key={station.id}
                            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-sm transition-all"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{station.matram}</p>
                              <p className="text-xs text-gray-600">
                                {station.tinhthanh?.ten || 'N/A'}
                                {station.diachi && ` - ${station.diachi}`}
                              </p>
                            </div>
                            <button
                              onClick={() => handleAddTram(station.id)}
                              className="ml-3 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Thêm
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm/Sửa Volume */}
      {showVolumeModal && currentTramForVolume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingVolumeItem ? 'Sửa Volume' : 'Thêm Volume'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Trạm: <span className="font-semibold">{currentTramForVolume.matram}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowVolumeModal(false);
                  setCurrentTramForVolume(null);
                  setEditingVolumeItem(null);
                  setVolumeItems([{ id: Date.now(), type: 'cot', item_id: '', soluong: 0 }]);
                  setSelectedVolumeItems([]);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Content - 2 cột layout */}
            {editingVolumeItem ? (
              // Form sửa (giữ nguyên layout cũ)
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmitVolume} className="space-y-4 max-w-2xl mx-auto">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {volumeItems[0].type === 'cot' ? 'Cột' : 'Volume'} *
                      </label>
                      <select
                        value={volumeItems[0].item_id}
                        onChange={(e) => handleUpdateVolumeItem(volumeItems[0].id, 'item_id', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      >
                        <option value="">Chọn {volumeItems[0].type === 'cot' ? 'cột' : 'volume'}...</option>
                        {volumeItems[0].type === 'cot' ? (
                          thuVienCots.map((cot) => (
                            <option key={cot.id} value={cot.id}>
                              {cot.tencot} ({cot.macot}) - {formatCurrency(cot.giadonvi)} đ/đơn vị
                            </option>
                          ))
                        ) : (
                          thuVienVolumes.map((vol) => (
                            <option key={vol.id} value={vol.id}>
                              {vol.tenvolume} ({vol.mavolume}) - {formatCurrency(vol.giadonvi)} đ/đơn vị
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng *</label>
                      <input
                        type="number"
                        min="0"
                        value={volumeItems[0].soluong}
                        onChange={(e) => handleUpdateVolumeItem(volumeItems[0].id, 'soluong', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowVolumeModal(false);
                        setCurrentTramForVolume(null);
                        setEditingVolumeItem(null);
                        setVolumeItems([{ id: Date.now(), type: 'cot', item_id: '', soluong: 0 }]);
                      }}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                    >
                      Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // Layout kéo thả 2 cột
              <div className="flex-1 flex overflow-hidden">
                {/* Cột trái: Thư viện (Drag Source) */}
                <div className="w-1/2 border-r border-gray-200 flex flex-col bg-gray-50">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        setLibraryType('cot');
                        setLibrarySearchTerm('');
                      }}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        libraryType === 'cot'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Volume Cột
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLibraryType('volume');
                        setLibrarySearchTerm('');
                      }}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        libraryType === 'volume'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Volume Khác
                    </button>
                  </div>

                  {/* Search */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder={`Tìm kiếm ${libraryType === 'cot' ? 'cột' : 'volume'}...`}
                        value={librarySearchTerm}
                        onChange={(e) => setLibrarySearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Library Items - Draggable */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                      {getFilteredLibrary().length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>Không tìm thấy {libraryType === 'cot' ? 'cột' : 'volume'} nào</p>
                        </div>
                      ) : (
                        getFilteredLibrary().map((item) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item, libraryType)}
                            className={`p-3 rounded-lg border-2 cursor-move transition-all ${
                              libraryType === 'cot'
                                ? 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-md'
                                : 'bg-green-50 border-green-200 hover:border-green-400 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${libraryType === 'cot' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {libraryType === 'cot' ? item.tencot : item.tenvolume}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {libraryType === 'cot' ? item.macot : item.mavolume} | 
                                  Giá: {formatCurrency(item.giadonvi)} đ/đơn vị
                                </p>
                              </div>
                              <div className="text-gray-400">
                                <FaGripVertical className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Cột phải: Danh sách đã chọn (Drop Zone) */}
                <div className="w-1/2 flex flex-col bg-white">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Danh sách đã chọn ({selectedVolumeItems.length})
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">Kéo thả từ thư viện hoặc click để thêm</p>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDropInModal}
                    className={`flex-1 overflow-y-auto p-4 ${
                      draggedItem ? 'bg-red-50' : 'bg-white'
                    } transition-colors`}
                  >
                    {selectedVolumeItems.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <FaHandPointer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 mb-1">
                          {draggedItem ? 'Thả vào đây để thêm volume' : 'Kéo thả từ thư viện bên trái'}
                        </p>
                        <p className="text-xs text-gray-400">Sau đó nhập số lượng cho từng item</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedVolumeItems.map((sv) => (
                          <div
                            key={sv.id}
                            className={`p-4 rounded-lg border-2 ${
                              sv.type === 'cot'
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-green-50 border-green-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-3 h-3 rounded-full mt-1.5 ${sv.type === 'cot' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-sm font-semibold text-gray-900">
                                    {sv.type === 'cot' ? sv.item.tencot : sv.item.tenvolume}
                                  </p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    sv.type === 'cot'
                                      ? 'bg-blue-200 text-blue-800'
                                      : 'bg-green-200 text-green-800'
                                  }`}>
                                    {sv.type === 'cot' ? 'Cột' : 'Volume'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">
                                  {sv.type === 'cot' ? sv.item.macot : sv.item.mavolume} | 
                                  Giá: {formatCurrency(sv.item.giadonvi)} đ/đơn vị
                                </p>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Số lượng:</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={sv.soluong}
                                    onChange={(e) => handleUpdateSelectedItemQuantity(sv.id, e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                                    placeholder="Nhập số lượng..."
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveSelectedItem(sv.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                                title="Xóa"
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowVolumeModal(false);
                          setCurrentTramForVolume(null);
                          setEditingVolumeItem(null);
                          setVolumeItems([{ id: Date.now(), type: 'cot', item_id: '', soluong: 0 }]);
                          setSelectedVolumeItems([]);
                        }}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitVolume}
                        disabled={selectedVolumeItems.length === 0}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Thêm {selectedVolumeItems.length} Volume
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Contracts;
