import { useState, useEffect } from 'react';
import { HiCalendar } from 'react-icons/hi';
import { FaFileContract, FaTasks, FaChartBar, FaBuilding } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { hopdongAPI, tramAPI, tramTienDoAPI, tramCotAPI, tramVolumeKhacAPI, tramThucTeCotAPI, tramThucTeVolumeKhacAPI, tinhThanhAPI, khuVucAPI } from '../../service/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [filterType, setFilterType] = useState('thang'); // thang, quy, nam, tuy_chon
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Set default dates
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  const isAdmin = user && user.la_admin === 1;
  const [stats, setStats] = useState({
    totalContracts: 0,
    totalStations: 0,
    totalProgress: 0,
    totalReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [volumeData, setVolumeData] = useState([]);
  const [contractStatusData, setContractStatusData] = useState([]);
  const [monthlyContractData, setMonthlyContractData] = useState([]);
  const [recentContracts, setRecentContracts] = useState([]);

  useEffect(() => {
    loadStats();
  }, [filterType, startDate, endDate]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Lấy dữ liệu với quan hệ đầy đủ
      const [contracts, stations, progress, tinhThanhList, khuVucList] = await Promise.all([
        hopdongAPI.getAll(true).catch(() => []),
        tramAPI.getAll(true).catch(() => []),
        tramTienDoAPI.getAll().catch(() => []),
        tinhThanhAPI.getAll(true).catch(() => []),
        khuVucAPI.getAll().catch(() => [])
      ]);

      // Lọc hợp đồng theo khoảng thời gian
      const filteredContracts = filterContractsByDate(contracts);
      
      // Tính toán thống kê
      const totalContracts = filteredContracts.length || 0;
      const totalStations = stations.length || 0;
      const totalProgress = progress.length || 0;
      const completedContracts = filteredContracts.filter(c => c.trangthai === 'hoanthanh').length;
      
      setStats({
        totalContracts,
        totalStations,
        totalProgress,
        totalReports: completedContracts
      });

      // 1. Tính toán dữ liệu chênh lệch volume theo khu vực/tỉnh
      await calculateVolumeDifferenceData(filteredContracts, stations, tinhThanhList, khuVucList);
      
      // 2. Tính toán dữ liệu trạng thái hợp đồng
      calculateContractStatusData(filteredContracts);
      
      // 3. Tính toán dữ liệu hợp đồng theo tháng
      calculateMonthlyContractData(filteredContracts);
      
      // 4. Lấy danh sách hợp đồng gần đây
      setRecentContracts(filteredContracts.slice(0, 10));
      
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContractsByDate = (contracts) => {
    if (!startDate || !endDate) return contracts;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return contracts.filter(contract => {
      const contractDate = new Date(contract.ngayky);
      return contractDate >= start && contractDate <= end;
    });
  };

  const calculateVolumeDifferenceData = async (contracts, stations, tinhThanhList, khuVucList) => {
    try {
      // Lấy tất cả volume dự toán và thực tế
      const [tramCots, tramVolumes, tramThucTeCots, tramThucTeVolumes] = await Promise.all([
        tramCotAPI.getAll(true).catch(() => []),
        tramVolumeKhacAPI.getAll(true).catch(() => []),
        tramThucTeCotAPI.getAll(true).catch(() => []),
        tramThucTeVolumeKhacAPI.getAll(true).catch(() => [])
      ]);

      // Tạo map để tra cứu nhanh
      const tinhThanhMap = new Map();
      tinhThanhList.forEach(tinh => {
        tinhThanhMap.set(tinh.id, tinh);
      });

      const khuVucMap = new Map();
      khuVucList.forEach(kv => {
        khuVucMap.set(kv.id, kv);
      });

      // Tính volume theo khu vực
      const volumeByKhuVuc = new Map();
      
      contracts.forEach(contract => {
        if (!contract.trams || contract.trams.length === 0) return;
        
        contract.trams.forEach(tram => {
          // Lấy thông tin tỉnh từ tram
          let tinh = null;
          if (tram.tinhthanh) {
            tinh = tram.tinhthanh;
          } else if (tram.tinhthanh_id) {
            tinh = tinhThanhMap.get(tram.tinhthanh_id);
          }
          
          if (!tinh) return;
          
          // Lấy khu vực từ tỉnh
          let khuVucId = null;
          if (tinh.khuvuc) {
            khuVucId = tinh.khuvuc.id || tinh.khuvuc;
          } else if (tinh.khuvuc_id) {
            khuVucId = tinh.khuvuc_id;
          }
          
          if (!khuVucId) return;
          
          const khuVuc = khuVucMap.get(khuVucId);
          if (!khuVuc) return;
          
          const khuVucName = khuVuc.ten || khuVuc.ma || `Khu vực ${khuVucId}`;
          
          if (!volumeByKhuVuc.has(khuVucName)) {
            volumeByKhuVuc.set(khuVucName, {
              khuVuc: khuVucName,
              duToan: 0,
              thucTe: 0
            });
          }
          
          // Tính volume dự toán
          const cotDuToan = (tramCots || []).filter(tc => tc.tram_id === tram.id)
            .reduce((sum, tc) => sum + (parseInt(tc.soluong) || 0), 0);
          const volDuToan = (tramVolumes || []).filter(tv => tv.tram_id === tram.id)
            .reduce((sum, tv) => sum + (parseInt(tv.soluong) || 0), 0);
          
          // Tính volume thực tế
          const cotThucTe = (tramThucTeCots || []).filter(ttc => 
            ttc.tram_id === tram.id && ttc.hopdong_id === contract.id
          ).reduce((sum, ttc) => sum + (parseInt(ttc.soluong_thucte) || 0), 0);
          const volThucTe = (tramThucTeVolumes || []).filter(ttv => 
            ttv.tram_id === tram.id && ttv.hopdong_id === contract.id
          ).reduce((sum, ttv) => sum + (parseInt(ttv.soluong_thucte) || 0), 0);
          
          const data = volumeByKhuVuc.get(khuVucName);
          data.duToan += (cotDuToan + volDuToan);
          data.thucTe += (cotThucTe + volThucTe);
        });
      });

      // Chuyển đổi sang mảng và tính chênh lệch
      const volumeDataArray = Array.from(volumeByKhuVuc.values()).map(item => ({
        khuVuc: item.khuVuc,
        duToan: item.duToan,
        thucTe: item.thucTe,
        chenhLech: item.thucTe - item.duToan,
        tiLe: item.duToan > 0 ? ((item.thucTe - item.duToan) / item.duToan * 100).toFixed(2) : 0
      }));

      setVolumeData(volumeDataArray);
    } catch (error) {
      console.error('Lỗi tính toán volume:', error);
      setVolumeData([]);
    }
  };

  const calculateContractStatusData = (contracts) => {
    const statusCount = {
      'dangxuly': 0,
      'hoanthanh': 0,
      'tretien_do': 0
    };

    contracts.forEach(contract => {
      const status = contract.trangthai || 'dangxuly';
      if (statusCount.hasOwnProperty(status)) {
        statusCount[status]++;
      }
    });

    const statusLabels = {
      'dangxuly': 'Đang xử lý',
      'hoanthanh': 'Hoàn thành',
      'tretien_do': 'Trễ tiến độ'
    };

    const statusColors = {
      'dangxuly': '#f59e0b',
      'hoanthanh': '#10b981',
      'tretien_do': '#ef4444'
    };

    const data = Object.keys(statusCount).map(status => ({
      name: statusLabels[status],
      value: statusCount[status],
      color: statusColors[status]
    }));

    setContractStatusData(data);
  };

  const calculateMonthlyContractData = (contracts) => {
    const monthlyCount = {};
    
    contracts.forEach(contract => {
      if (!contract.ngayky) return;
      const date = new Date(contract.ngayky);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `T${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthlyCount[monthKey]) {
        monthlyCount[monthKey] = { name: monthLabel, value: 0 };
      }
      monthlyCount[monthKey].value++;
    });

    const data = Object.values(monthlyCount).sort((a, b) => {
      const aDate = a.name.split('/');
      const bDate = b.name.split('/');
      if (aDate[1] !== bDate[1]) return aDate[1] - bDate[1];
      return parseInt(aDate[0].substring(1)) - parseInt(bDate[0].substring(1));
    });

    setMonthlyContractData(data);
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Tổng hợp đồng',
      value: stats.totalContracts.toString(),
      icon: FaFileContract,
      bgGradient: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      iconBg: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Tổng trạm',
      value: stats.totalStations.toString(),
      icon: FaBuilding,
      bgGradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-100',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Tiến trình',
      value: stats.totalProgress.toString(),
      icon: FaTasks,
      bgGradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
      iconBg: 'bg-amber-100',
      textColor: 'text-amber-600'
    },
    {
      title: 'Hợp đồng hoàn thành',
      value: stats.totalReports.toString(),
      icon: FaChartBar,
      bgGradient: 'from-rose-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-rose-500 to-pink-600',
      iconBg: 'bg-rose-100',
      textColor: 'text-rose-600'
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      'dangxuly': 'bg-yellow-100 text-yellow-800',
      'hoanthanh': 'bg-green-100 text-green-800',
      'tretien_do': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'dangxuly': 'Đang xử lý',
      'hoanthanh': 'Hoàn thành',
      'tretien_do': 'Trễ tiến độ'
    };
    return labels[status] || status;
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    const today = new Date();
    
    if (type === 'thang') {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (type === 'quy') {
      const quarter = Math.floor(today.getMonth() / 3);
      const firstDayOfQuarter = new Date(today.getFullYear(), quarter * 3, 1);
      setStartDate(firstDayOfQuarter.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (type === 'nam') {
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      setStartDate(firstDayOfYear.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Chào mừng trở lại{user?.ten ? `, ${user.ten}` : ''}!
        </h1>
        <p className="text-sm text-gray-600">
          {isAdmin ? 'Quản trị viên' : 'Kỹ thuật viên'} - Dashboard quản lý hợp đồng thi công trạm BTS
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <HiCalendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
          </div>
          
          <button
            onClick={() => handleFilterChange('thang')}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              filterType === 'thang'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tháng
          </button>
          
          <button
            onClick={() => handleFilterChange('quy')}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              filterType === 'quy'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quý
          </button>
          
          <button
            onClick={() => handleFilterChange('nam')}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              filterType === 'nam'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Năm
          </button>
          
          <button
            onClick={() => setFilterType('tuy_chon')}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              filterType === 'tuy_chon'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tùy chọn
          </button>

          {filterType === 'tuy_chon' && (
            <div className="flex items-center gap-2 ml-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="text-sm text-gray-600">đến</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all overflow-hidden relative"
            >
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.iconBg} p-2.5 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} opacity-10 rounded-full -mr-10 -mt-10`}></div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Biểu đồ chênh lệch volume theo khu vực */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Chênh lệch Volume theo Khu vực</h2>
          {loading ? (
            <div className="flex items-center justify-center h-[250px]">
              <div className="text-gray-500">Đang tải...</div>
            </div>
          ) : volumeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="khuVuc" 
                  stroke="#6b7280" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => {
                    if (name === 'tiLe') {
                      return `${value}%`;
                    }
                    return formatCurrency(value);
                  }}
                />
                <Legend />
                <Bar dataKey="duToan" fill="#6366f1" name="Dự toán" radius={[8, 8, 0, 0]} />
                <Bar dataKey="thucTe" fill="#10b981" name="Thực tế" radius={[8, 8, 0, 0]} />
                <Bar dataKey="chenhLech" fill="#ef4444" name="Chênh lệch" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </div>

        {/* 2. Biểu đồ tròn - Tình trạng hợp đồng */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Tình trạng Hợp đồng</h2>
          {loading ? (
            <div className="flex items-center justify-center h-[250px]">
              <div className="text-gray-500">Đang tải...</div>
            </div>
          ) : contractStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contractStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={3}
                >
                  {contractStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>

      {/* 3. Biểu đồ hợp đồng theo tháng */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Số lượng Hợp đồng theo Tháng</h2>
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        ) : monthlyContractData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyContractData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3} 
                name="Số hợp đồng" 
                dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            Không có dữ liệu
          </div>
        )}
      </div>

      {/* 4. Danh sách hợp đồng gần đây */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Hợp đồng Gần đây</h2>
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        ) : recentContracts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Số hợp đồng</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chủ đầu tư</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ngày ký</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tổng giá trị</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Số trạm</th>
                </tr>
              </thead>
              <tbody>
                {recentContracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{contract.sohopdong}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{contract.chudautu}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {contract.ngayky ? new Date(contract.ngayky).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {formatCurrency(contract.tonggiatri || 0)} VNĐ
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(contract.trangthai)}`}>
                        {getStatusLabel(contract.trangthai)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {contract.trams ? contract.trams.length : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            Không có hợp đồng nào
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
