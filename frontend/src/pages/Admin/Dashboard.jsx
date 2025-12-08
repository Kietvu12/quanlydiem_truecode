import { useState, useEffect } from 'react';
import { HiHome, HiUser, HiDocumentText, HiCalendar } from 'react-icons/hi';
import { FaFileContract, FaTasks, FaChartBar, FaBuilding } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { hopdongAPI, tramAPI, tramTienDoAPI } from '../../service/api';

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

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [contracts, stations, progress] = await Promise.all([
        hopdongAPI.getAll().catch(() => []),
        tramAPI.getAll().catch(() => []),
        tramTienDoAPI.getAll().catch(() => [])
      ]);

      // Tính toán thống kê
      const totalContracts = contracts.length || 0;
      const totalStations = stations.length || 0;
      const totalProgress = progress.length || 0;
      
      // Tính số hợp đồng hoàn thành
      const completedContracts = contracts.filter(c => c.trangthai === 'hoanthanh').length;
      
      setStats({
        totalContracts,
        totalStations,
        totalProgress,
        totalReports: completedContracts
      });
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
    } finally {
      setLoading(false);
    }
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

  // Sample data for charts (sẽ được thay thế bằng dữ liệu thực từ API)
  const hopDongData = [
    { name: 'T1', value: 5 },
    { name: 'T2', value: 8 },
    { name: 'T3', value: 12 },
    { name: 'T4', value: 15 },
    { name: 'T5', value: 18 },
    { name: 'T6', value: 20 },
  ];

  const tramData = [
    { name: 'T1', value: 10 },
    { name: 'T2', value: 15 },
    { name: 'T3', value: 20 },
    { name: 'T4', value: 25 },
    { name: 'T5', value: 30 },
    { name: 'T6', value: 35 },
  ];

  const tienDoData = [
    { name: 'Hoàn thành', value: 45, color: '#10b981' },
    { name: 'Đang thực hiện', value: 30, color: '#f59e0b' },
    { name: 'Chưa bắt đầu', value: 25, color: '#ef4444' },
  ];

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

      {/* Charts Section - 3 columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Biểu đồ Hợp đồng theo thời gian */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Hợp đồng theo thời gian</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hopDongData}>
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
        </div>

        {/* Pie Chart - Tiến trình */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Phân bổ Tiến trình</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={tienDoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={75}
                innerRadius={35}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {tienDoData.map((entry, index) => (
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
        </div>
      </div>

      {/* Biểu đồ Trạm theo thời gian - Full width */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Trạm theo thời gian</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={tramData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={1}/>
              </linearGradient>
            </defs>
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
            <Bar dataKey="value" fill="url(#barGradient)" name="Số trạm" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <HiDocumentText className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Tạo hợp đồng mới</span>
          </button>
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FaBuilding className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Thêm trạm mới</span>
          </button>
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FaTasks className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Cập nhật tiến trình</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Hoạt động gần đây</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <HiUser className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Chào mừng đến với hệ thống</p>
              <p className="text-xs text-gray-500">Bắt đầu quản lý hợp đồng và trạm BTS của bạn</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">Vừa xong</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
