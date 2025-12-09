import { useState, useEffect } from 'react';
import { 
  FaBalanceScale, FaFileContract, FaBuilding, FaChevronDown, FaChevronRight,
  FaArrowUp, FaArrowDown, FaEquals, FaSearch, FaTimes, FaChartLine
} from 'react-icons/fa';
import { 
  hopdongAPI, duanAPI, tramAPI, tramCotAPI, tramVolumeKhacAPI,
  tramThucTeCotAPI, tramThucTeVolumeKhacAPI
} from '../../service/api';

const Comparison = () => {
  const [contracts, setContracts] = useState([]);
  const [duanList, setDuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [filterHopDong, setFilterHopDong] = useState('');
  const [filterTram, setFilterTram] = useState('');
  const [filterDuan, setFilterDuan] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [tramCots, setTramCots] = useState([]);
  const [tramVolumes, setTramVolumes] = useState([]);
  const [tramThucTeCots, setTramThucTeCots] = useState([]);
  const [tramThucTeVolumes, setTramThucTeVolumes] = useState([]);
  
  // Accordion states
  const [expandedContracts, setExpandedContracts] = useState(new Set());
  const [expandedTrams, setExpandedTrams] = useState(new Set());
  
  // Comparison data
  const [comparisonData, setComparisonData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all data
      const [contractsData, duanData, tramsData, cotsData, volumesData, thucTeCotsData, thucTeVolumesData] = await Promise.all([
        hopdongAPI.getAll(true).catch(() => []),
        duanAPI.getAll().catch(() => []),
        tramAPI.getAll(true).catch(() => []),
        tramCotAPI.getAll(true).catch(() => []),
        tramVolumeKhacAPI.getAll(true).catch(() => []),
        tramThucTeCotAPI.getAll(true).catch(() => []),
        tramThucTeVolumeKhacAPI.getAll(true).catch(() => [])
      ]);

      setContracts(contractsData);
      setDuanList(duanData);
      setTramCots(cotsData);
      setTramVolumes(volumesData);
      setTramThucTeCots(thucTeCotsData);
      setTramThucTeVolumes(thucTeVolumesData);

      // Calculate comparison data
      calculateComparison(contractsData, cotsData, volumesData, thucTeCotsData, thucTeVolumesData);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      alert('Không thể tải dữ liệu so sánh');
    } finally {
      setLoading(false);
    }
  };

  const calculateComparison = (contracts, cots, volumes, thucTeCots, thucTeVolumes) => {
    const comparison = {};

    contracts.forEach(contract => {
      if (!contract.trams || contract.trams.length === 0) return;

      const contractComparison = {
        contractId: contract.id,
        contractName: contract.sohopdong,
        totalTrams: contract.trams.length,
        totalCotDuToan: 0,
        totalCotThucTe: 0,
        totalVolumeDuToan: 0,
        totalVolumeThucTe: 0,
        trams: {}
      };

      contract.trams.forEach(tram => {
        // Tính volume cột hợp đồng
        const cotDuToan = (cots || []).filter(tc => tc.tram_id === tram.id)
          .reduce((sum, tc) => sum + (parseInt(tc.soluong) || 0), 0);
        
        // Tính volume khác hợp đồng
        const volumeDuToan = (volumes || []).filter(tv => tv.tram_id === tram.id)
          .reduce((sum, tv) => sum + (parseInt(tv.soluong) || 0), 0);

        // Tính volume cột thực tế
        const cotThucTe = (thucTeCots || []).filter(ttc => 
          ttc.tram_id === tram.id && ttc.hopdong_id === contract.id
        ).reduce((sum, ttc) => sum + (parseInt(ttc.soluong_thucte) || 0), 0);

        // Tính volume khác thực tế
        const volumeThucTe = (thucTeVolumes || []).filter(ttv => 
          ttv.tram_id === tram.id && ttv.hopdong_id === contract.id
        ).reduce((sum, ttv) => sum + (parseInt(ttv.soluong_thucte) || 0), 0);

        // Chi tiết từng item
        const cotItems = (cots || []).filter(tc => tc.tram_id === tram.id).map(cot => {
          const thucTe = (thucTeCots || []).find(ttc => 
            ttc.tram_id === tram.id && ttc.hopdong_id === contract.id && ttc.cot_id === cot.cot_id
          );
          return {
            ...cot,
            soluong_thucte: thucTe ? thucTe.soluong_thucte : 0,
            chenhLech: (thucTe ? thucTe.soluong_thucte : 0) - (parseInt(cot.soluong) || 0)
          };
        });

        const volumeItems = (volumes || []).filter(tv => tv.tram_id === tram.id).map(vol => {
          const thucTe = (thucTeVolumes || []).find(ttv => 
            ttv.tram_id === tram.id && ttv.hopdong_id === contract.id && ttv.volume_id === vol.volume_id
          );
          return {
            ...vol,
            soluong_thucte: thucTe ? thucTe.soluong_thucte : 0,
            chenhLech: (thucTe ? thucTe.soluong_thucte : 0) - (parseInt(vol.soluong) || 0)
          };
        });

        contractComparison.trams[tram.id] = {
          tramId: tram.id,
          tramName: tram.matram,
          tinhThanh: tram.tinhthanh?.ten || 'N/A',
          cotDuToan,
          cotThucTe,
          volumeDuToan,
          volumeThucTe,
          cotChenhLech: cotThucTe - cotDuToan,
          volumeChenhLech: volumeThucTe - volumeDuToan,
          cotItems,
          volumeItems
        };

        contractComparison.totalCotDuToan += cotDuToan;
        contractComparison.totalCotThucTe += cotThucTe;
        contractComparison.totalVolumeDuToan += volumeDuToan;
        contractComparison.totalVolumeThucTe += volumeThucTe;
      });

      contractComparison.totalCotChenhLech = contractComparison.totalCotThucTe - contractComparison.totalCotDuToan;
      contractComparison.totalVolumeChenhLech = contractComparison.totalVolumeThucTe - contractComparison.totalVolumeDuToan;

      comparison[contract.id] = contractComparison;
    });

    setComparisonData(comparison);
  };

  const toggleContract = (contractId) => {
    const newExpanded = new Set(expandedContracts);
    if (newExpanded.has(contractId)) {
      newExpanded.delete(contractId);
      // Collapse all trams in this contract
      const contract = contracts.find(c => c.id === contractId);
      if (contract && contract.trams) {
        contract.trams.forEach(tram => {
          expandedTrams.delete(tram.id);
        });
        setExpandedTrams(new Set(expandedTrams));
      }
    } else {
      newExpanded.add(contractId);
    }
    setExpandedContracts(newExpanded);
  };

  const toggleTram = (tramId) => {
    const newExpanded = new Set(expandedTrams);
    if (newExpanded.has(tramId)) {
      newExpanded.delete(tramId);
    } else {
      newExpanded.add(tramId);
    }
    setExpandedTrams(newExpanded);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };

  const getChenhLechIcon = (chenhLech) => {
    if (chenhLech > 0) return <FaArrowUp className="w-4 h-4 text-green-600" />;
    if (chenhLech < 0) return <FaArrowDown className="w-4 h-4 text-red-600" />;
    return <FaEquals className="w-4 h-4 text-gray-500" />;
  };

  const getChenhLechColor = (chenhLech) => {
    if (chenhLech > 0) return 'text-green-600 font-semibold';
    if (chenhLech < 0) return 'text-red-600 font-semibold';
    return 'text-gray-600';
  };

  const getChenhLechBg = (chenhLech) => {
    if (chenhLech > 0) return 'bg-green-50';
    if (chenhLech < 0) return 'bg-red-50';
    return 'bg-gray-50';
  };

  // Filter contracts
  const filteredContracts = contracts.filter(contract => {
    if (filterHopDong && contract.id !== parseInt(filterHopDong)) return false;
    if (filterDuan && contract.duan_id !== parseInt(filterDuan)) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        contract.sohopdong?.toLowerCase().includes(term) ||
        contract.tenhopdong?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Get unique trams for filter
  const allTrams = contracts.flatMap(c => c.trams || []).filter(Boolean);
  const uniqueTrams = Array.from(new Map(allTrams.map(t => [t.id, t])).values());

  // Filter trams if filterTram is set
  const contractsToShow = filterTram 
    ? filteredContracts.filter(c => c.trams?.some(t => t.id === parseInt(filterTram)))
    : filteredContracts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">So sánh Thực tế</h1>
        <p className="text-gray-600">So sánh volume hợp đồng và volume thực tế sau khảo sát</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm hợp đồng..."
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
            {contracts.map(hd => (
              <option key={hd.id} value={hd.id}>
                {hd.sohopdong}
              </option>
            ))}
          </select>

          {/* Filter Dự án */}
          <select
            value={filterDuan}
            onChange={(e) => setFilterDuan(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả dự án</option>
            {duanList.map(duan => (
              <option key={duan.id} value={duan.id}>
                {duan.tenduan}
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
            {uniqueTrams.map(tram => (
              <option key={tram.id} value={tram.id}>
                {tram.matram}
              </option>
            ))}
          </select>
        </div>

        {/* Clear filters */}
        {(filterHopDong || filterTram || filterDuan || searchTerm) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setFilterHopDong('');
                setFilterTram('');
                setFilterDuan('');
                setSearchTerm('');
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Comparison List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      ) : contractsToShow.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <FaBalanceScale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có dữ liệu so sánh</h3>
            <p className="text-gray-500">Không tìm thấy hợp đồng nào phù hợp</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {contractsToShow.map(contract => {
            const comp = comparisonData[contract.id];
            if (!comp) return null;

            const isExpanded = expandedContracts.has(contract.id);

            return (
              <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Contract Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleContract(contract.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {isExpanded ? (
                        <FaChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <FaChevronRight className="w-5 h-4 text-gray-400" />
                      )}
                      <FaFileContract className="w-6 h-6 text-red-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{contract.sohopdong}</h3>
                        <p className="text-sm text-gray-600">{contract.tenhopdong || 'N/A'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Dự án: {contract.duan?.tenduan || 'N/A'} | {comp.totalTrams} trạm
                        </p>
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="flex items-center gap-6">
                      {/* Volume Cột */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Volume Cột</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {formatCurrency(comp.totalCotDuToan)} → {formatCurrency(comp.totalCotThucTe)}
                          </span>
                          {getChenhLechIcon(comp.totalCotChenhLech)}
                          <span className={`text-sm ${getChenhLechColor(comp.totalCotChenhLech)}`}>
                            {comp.totalCotChenhLech > 0 ? '+' : ''}{formatCurrency(comp.totalCotChenhLech)}
                          </span>
                        </div>
                      </div>

                      {/* Volume Khác */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Volume Khác</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {formatCurrency(comp.totalVolumeDuToan)} → {formatCurrency(comp.totalVolumeThucTe)}
                          </span>
                          {getChenhLechIcon(comp.totalVolumeChenhLech)}
                          <span className={`text-sm ${getChenhLechColor(comp.totalVolumeChenhLech)}`}>
                            {comp.totalVolumeChenhLech > 0 ? '+' : ''}{formatCurrency(comp.totalVolumeChenhLech)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-6 space-y-4">
                      {contract.trams && contract.trams.length > 0 ? (
                        contract.trams.map(tram => {
                          const tramComp = comp.trams[tram.id];
                          if (!tramComp) return null;

                          const isTramExpanded = expandedTrams.has(tram.id);

                          return (
                            <div key={tram.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              {/* Tram Header */}
                              <div 
                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => toggleTram(tram.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {isTramExpanded ? (
                                      <FaChevronDown className="w-4 h-4 text-gray-400" />
                                    ) : (
                                      <FaChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                    <FaBuilding className="w-5 h-5 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-gray-900">{tramComp.tramName}</p>
                                      <p className="text-xs text-gray-500">{tramComp.tinhThanh}</p>
                                    </div>
                                  </div>

                                  {/* Tram Summary */}
                                  <div className="flex items-center gap-6">
                                    <div className="text-right">
                                      <p className="text-xs text-gray-500 mb-1">Cột</p>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-700">
                                          {formatCurrency(tramComp.cotDuToan)} → {formatCurrency(tramComp.cotThucTe)}
                                        </span>
                                        {getChenhLechIcon(tramComp.cotChenhLech)}
                                        <span className={`text-xs ${getChenhLechColor(tramComp.cotChenhLech)}`}>
                                          {tramComp.cotChenhLech > 0 ? '+' : ''}{formatCurrency(tramComp.cotChenhLech)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-500 mb-1">Khác</p>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-700">
                                          {formatCurrency(tramComp.volumeDuToan)} → {formatCurrency(tramComp.volumeThucTe)}
                                        </span>
                                        {getChenhLechIcon(tramComp.volumeChenhLech)}
                                        <span className={`text-xs ${getChenhLechColor(tramComp.volumeChenhLech)}`}>
                                          {tramComp.volumeChenhLech > 0 ? '+' : ''}{formatCurrency(tramComp.volumeChenhLech)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Tram Details */}
                              {isTramExpanded && (
                                <div className="border-t border-gray-200 p-4 space-y-4">
                                  {/* Volume Cột Table */}
                                  {tramComp.cotItems && tramComp.cotItems.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaChartLine className="w-4 h-4 text-blue-600" />
                                        Volume Cột
                                      </h4>
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                          <thead className="bg-blue-50">
                                            <tr>
                                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Tên cột</th>
                                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">Mã cột</th>
                                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">Hợp đồng</th>
                                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">Thực tế</th>
                                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">Chênh lệch</th>
                                            </tr>
                                          </thead>
                                          <tbody className="bg-white divide-y divide-gray-200">
                                            {tramComp.cotItems.map((item, idx) => (
                                              <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                  <p className="font-medium text-gray-900">{item.cot?.tencot || 'N/A'}</p>
                                                </td>
                                                <td className="px-4 py-2 text-center text-gray-600">
                                                  {item.cot?.macot || 'N/A'}
                                                </td>
                                                <td className="px-4 py-2 text-center font-medium text-gray-900">
                                                  {formatCurrency(item.soluong)}
                                                </td>
                                                <td className="px-4 py-2 text-center font-medium text-gray-900">
                                                  {formatCurrency(item.soluong_thucte)}
                                                </td>
                                                <td className={`px-4 py-2 text-center ${getChenhLechColor(item.chenhLech)}`}>
                                                  <div className="flex items-center justify-center gap-1">
                                                    {getChenhLechIcon(item.chenhLech)}
                                                    <span>
                                                      {item.chenhLech > 0 ? '+' : ''}{formatCurrency(item.chenhLech)}
                                                    </span>
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}

                                  {/* Volume Khác Table */}
                                  {tramComp.volumeItems && tramComp.volumeItems.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaChartLine className="w-4 h-4 text-green-600" />
                                        Volume Khác
                                      </h4>
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                          <thead className="bg-green-50">
                                            <tr>
                                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Tên volume</th>
                                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">Mã volume</th>
                                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">Hợp đồng</th>
                                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">Thực tế</th>
                                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">Chênh lệch</th>
                                            </tr>
                                          </thead>
                                          <tbody className="bg-white divide-y divide-gray-200">
                                            {tramComp.volumeItems.map((item, idx) => (
                                              <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                  <p className="font-medium text-gray-900">{item.volume?.tenvolume || 'N/A'}</p>
                                                </td>
                                                <td className="px-4 py-2 text-center text-gray-600">
                                                  {item.volume?.mavolume || 'N/A'}
                                                </td>
                                                <td className="px-4 py-2 text-center font-medium text-gray-900">
                                                  {formatCurrency(item.soluong)}
                                                </td>
                                                <td className="px-4 py-2 text-center font-medium text-gray-900">
                                                  {formatCurrency(item.soluong_thucte)}
                                                </td>
                                                <td className={`px-4 py-2 text-center ${getChenhLechColor(item.chenhLech)}`}>
                                                  <div className="flex items-center justify-center gap-1">
                                                    {getChenhLechIcon(item.chenhLech)}
                                                    <span>
                                                      {item.chenhLech > 0 ? '+' : ''}{formatCurrency(item.chenhLech)}
                                                    </span>
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}

                                  {(!tramComp.cotItems || tramComp.cotItems.length === 0) && 
                                   (!tramComp.volumeItems || tramComp.volumeItems.length === 0) && (
                                    <div className="text-center py-8 text-gray-500">
                                      Chưa có dữ liệu volume cho trạm này
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Hợp đồng này chưa có trạm nào
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Comparison;
