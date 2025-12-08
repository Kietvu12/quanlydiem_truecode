import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ContractManagementSystem = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedContract, setSelectedContract] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample data
  const contracts = [
    { id: 1, code: 'THA2281', contractNo: '1402052-BQLDA/VTNet', province: 'Hà Giang', status: 'Đang thi công', progress: 65, value: 998164663, investor: 'ANTHANHSON', date: '2025-02-14' },
    { id: 2, code: 'NAN1927', contractNo: '1402039-BQLDA/VTNet', province: 'Nghệ An', status: 'ĐHTC', progress: 45, value: 856234500, investor: 'ANTHANHSON', date: '2025-02-14' },
    { id: 3, code: 'QNH0001', contractNo: '1402015-BQLDA/VTNet', province: 'Quảng Ninh', status: 'Hoàn thành', progress: 100, value: 1245678900, investor: 'VTK', date: '2025-02-14' },
    { id: 4, code: 'BGG0125', contractNo: '23620241-BQLDA/VTNet', province: 'Bắc Giang', status: 'Thiết kế', progress: 30, value: 675432100, investor: 'VTK', date: '2024-06-23' },
    { id: 5, code: 'BKN0089', contractNo: '26620242-BQLDA/VTNet', province: 'Bắc Kạn', status: 'Khảo sát', progress: 20, value: 534890000, investor: 'VTK', date: '2024-06-26' },
  ];

  const columnTypes = [
    { id: 1, code: 'COT-001', name: 'Monopole H=30m', height: 30, location: 'Dưới đất', price: 125000000, image: '📡' },
    { id: 2, code: 'COT-002', name: 'Dây co 600x600 H=36m', height: 36, location: 'Dưới đất', price: 156000000, image: '📡' },
    { id: 3, code: 'COT-003', name: 'Tự đứng 3 chân H=42m', height: 42, location: 'Dưới đất', price: 189000000, image: '📡' },
    { id: 4, code: 'COT-004', name: 'Cột cóc H=6m', height: 6, location: 'Trên mái', price: 35000000, image: '📡' },
    { id: 5, code: 'COT-005', name: 'Ngụy trang cây dừa H=25m', height: 25, location: 'Dưới đất', price: 145000000, image: '🌴' },
  ];

  const dashboardData = {
    summary: [
      { title: 'Tổng hợp đồng', value: '1,647', color: 'bg-blue-500', icon: '📋' },
      { title: 'Đã hoàn thành', value: '640', color: 'bg-green-500', icon: '✓' },
      { title: 'Đang thi công', value: '823', color: 'bg-yellow-500', icon: '⚙️' },
      { title: 'Trễ tiến độ', value: '184', color: 'bg-red-500', icon: '⚠️' },
    ],
    revenueData: [
      { month: 'T1', revenue: 45 }, { month: 'T2', revenue: 52 }, { month: 'T3', revenue: 61 },
      { month: 'T4', revenue: 58 }, { month: 'T5', revenue: 68 }, { month: 'T6', revenue: 75 },
    ],
    provinceProgress: [
      { province: 'Hà Nội', progress: 85 }, { province: 'Nghệ An', progress: 72 },
      { province: 'Quảng Ninh', progress: 90 }, { province: 'Hà Giang', progress: 65 },
      { province: 'Bắc Giang', progress: 58 },
    ],
    projectDistribution: [
      { name: 'BTS Mới', value: 474, color: '#3B82F6' },
      { name: 'Kiên Cố', value: 1173, color: '#10B981' },
    ],
    alerts: [
      { id: 1, contract: 'THA2281', issue: 'Chênh lệch khối lượng >10%', priority: 'Cao', color: 'text-red-600' },
      { id: 2, contract: 'NAN1927', issue: 'Trễ tiến độ 2 tuần', priority: 'TB', color: 'text-yellow-600' },
      { id: 3, contract: 'BGG0125', issue: 'Chưa hoàn thành thiết kế', priority: 'Thấp', color: 'text-blue-600' },
    ],
  };

  const comparisonData = {
    contract: 'THA2281',
    items: [
      { name: 'Monopole H=30m', volumeHD: 10, actualKSTK: 8, difference: -2, status: 'warning' },
      { name: 'Dây co 600x600 H=36m', volumeHD: 6, actualKSTK: 6, difference: 0, status: 'ok' },
      { name: 'Tự đứng 3 chân H=42m', volumeHD: 4, actualKSTK: 5, difference: 1, status: 'info' },
      { name: 'PMLG C05 dưới đất', volumeHD: 2, actualKSTK: 2, difference: 0, status: 'ok' },
    ],
  };

  // Navigation
  const navigation = [
    { name: 'Dashboard', icon: '📊', page: 'dashboard' },
    { name: 'Hợp đồng', icon: '📋', page: 'contracts' },
    { name: 'Thư viện cột', icon: '📡', page: 'columns' },
    { name: 'Tiến trình', icon: '⏱️', page: 'progress' },
    { name: 'So sánh thực tế', icon: '⚖️', page: 'comparison' },
    { name: 'Báo cáo', icon: '📈', page: 'reports' },
  ];

  // Components
  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white h-screen fixed left-0 top-0 transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {sidebarOpen && <h1 className="text-xl font-bold">BTS Manager</h1>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:bg-gray-700 p-2 rounded">
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </div>
      <nav className="mt-4">
        {navigation.map(item => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-800 flex items-center gap-3 ${
              currentPage === item.page ? 'bg-blue-600' : ''
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            {sidebarOpen && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">👤</div>
          {sidebarOpen && (
            <div>
              <div className="font-semibold">Admin</div>
              <div className="text-xs text-gray-400">Quản trị viên</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Tổng Quan</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dashboardData.summary.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{borderLeftColor: item.color.replace('bg-', '')}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{item.title}</p>
                <p className="text-3xl font-bold mt-2">{item.value}</p>
              </div>
              <div className="text-5xl opacity-20">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng (Tỷ VNĐ)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboardData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Province Progress */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Tiến độ theo tỉnh (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboardData.provinceProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="province" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Phân bổ dự án</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={dashboardData.projectDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {dashboardData.projectDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {dashboardData.projectDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{backgroundColor: item.color}}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Cảnh báo</h3>
          <div className="space-y-3">
            {dashboardData.alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4" 
                   style={{borderLeftColor: alert.priority === 'Cao' ? '#DC2626' : alert.priority === 'TB' ? '#F59E0B' : '#3B82F6'}}>
                <div>
                  <div className="font-semibold">{alert.contract}</div>
                  <div className="text-sm text-gray-600">{alert.issue}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${alert.color}`}>
                  {alert.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ContractsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Hợp đồng</h1>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <span>➕</span> Thêm hợp đồng
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Tìm mã trạm, số HĐ..." className="border rounded px-4 py-2" />
          <select className="border rounded px-4 py-2">
            <option>Tất cả tỉnh</option>
            <option>Hà Giang</option>
            <option>Nghệ An</option>
            <option>Quảng Ninh</option>
          </select>
          <select className="border rounded px-4 py-2">
            <option>Tất cả trạng thái</option>
            <option>Khảo sát</option>
            <option>Thiết kế</option>
            <option>Đang thi công</option>
            <option>Hoàn thành</option>
          </select>
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded">🔍 Tìm kiếm</button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Mã trạm</th>
              <th className="text-left p-4">Số hợp đồng</th>
              <th className="text-left p-4">Tỉnh</th>
              <th className="text-left p-4">Chủ đầu tư</th>
              <th className="text-left p-4">Trạng thái</th>
              <th className="text-left p-4">Tiến độ</th>
              <th className="text-left p-4">Giá trị (VNĐ)</th>
              <th className="text-left p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(contract => (
              <tr key={contract.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-semibold">{contract.code}</td>
                <td className="p-4 text-sm">{contract.contractNo}</td>
                <td className="p-4">{contract.province}</td>
                <td className="p-4 text-sm">{contract.investor}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    contract.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                    contract.status === 'Đang thi công' ? 'bg-blue-100 text-blue-800' :
                    contract.status === 'ĐHTC' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contract.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${contract.progress}%`}}></div>
                    </div>
                    <span className="text-sm font-semibold">{contract.progress}%</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">{contract.value.toLocaleString()}</td>
                <td className="p-4">
                  <button 
                    onClick={() => { setSelectedContract(contract); setCurrentPage('contractDetail'); }}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Chi tiết →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Hiển thị 1-5 trong 1,647 hợp đồng</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-100">←</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">→</button>
        </div>
      </div>
    </div>
  );

  const ContractDetailPage = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentPage('contracts')} className="text-blue-600 hover:text-blue-800">
          ← Quay lại
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Chi tiết hợp đồng: {selectedContract?.code}</h1>
      </div>

      {/* Contract Info */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-600">Mã trạm</label>
            <div className="font-semibold">{selectedContract?.code}</div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Số hợp đồng</label>
            <div className="font-semibold text-sm">{selectedContract?.contractNo}</div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Tỉnh</label>
            <div className="font-semibold">{selectedContract?.province}</div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Ngày ký</label>
            <div className="font-semibold">{selectedContract?.date}</div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Chủ đầu tư</label>
            <div className="font-semibold">{selectedContract?.investor}</div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Giá trị HĐ</label>
            <div className="font-semibold text-blue-600">{selectedContract?.value.toLocaleString()} VNĐ</div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Trạng thái</label>
            <div><span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{selectedContract?.status}</span></div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Tiến độ</label>
            <div className="font-semibold">{selectedContract?.progress}%</div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Tiến trình thi công</h3>
        <div className="space-y-4">
          {['Khảo sát', 'Thiết kế', 'Dự toán', 'Phê duyệt', 'ĐHTC', 'Thi công'].map((stage, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                idx < 3 ? 'bg-green-500 text-white' : idx === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {idx < 3 ? '✓' : idx + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{stage}</div>
                {idx < 3 && <div className="text-sm text-gray-600">Hoàn thành: 15/03/2025</div>}
                {idx === 3 && <div className="text-sm text-blue-600">Đang thực hiện</div>}
              </div>
              {idx < 3 && <span className="text-green-500 text-xl">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Volume Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Khối lượng thi công</h3>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Loại cột</th>
              <th className="text-center p-3">Volume HĐ</th>
              <th className="text-center p-3">Thực tế KSTK</th>
              <th className="text-center p-3">Chênh lệch</th>
              <th className="text-right p-3">Đơn giá</th>
              <th className="text-right p-3">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">Monopole H=30m</td>
              <td className="text-center p-3">10</td>
              <td className="text-center p-3">8</td>
              <td className="text-center p-3"><span className="text-red-600 font-semibold">-2</span></td>
              <td className="text-right p-3">125,000,000</td>
              <td className="text-right p-3 font-semibold">1,000,000,000</td>
            </tr>
            <tr className="border-t">
              <td className="p-3">Dây co 600x600 H=36m</td>
              <td className="text-center p-3">6</td>
              <td className="text-center p-3">6</td>
              <td className="text-center p-3"><span className="text-green-600 font-semibold">0</span></td>
              <td className="text-right p-3">156,000,000</td>
              <td className="text-right p-3 font-semibold">936,000,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const ColumnsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Thư viện Dữ liệu Cột</h1>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <span>➕</span> Thêm loại cột
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Tìm tên/mã cột..." className="border rounded px-4 py-2" />
          <select className="border rounded px-4 py-2">
            <option>Tất cả vị trí</option>
            <option>Trên mái</option>
            <option>Dưới đất</option>
          </select>
          <select className="border rounded px-4 py-2">
            <option>Tất cả chiều cao</option>
            <option>6m - 12m</option>
            <option>12m - 30m</option>
            <option>30m - 60m</option>
          </select>
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded">🔍 Tìm kiếm</button>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columnTypes.map(col => (
          <div key={col.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="text-6xl text-center mb-4">{col.image}</div>
              <h3 className="text-lg font-semibold text-center mb-2">{col.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã cột:</span>
                  <span className="font-semibold">{col.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chiều cao:</span>
                  <span className="font-semibold">{col.height}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vị trí:</span>
                  <span className="font-semibold">{col.location}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600">Đơn giá:</span>
                  <span className="font-bold text-blue-600">{(col.price / 1000000).toFixed(0)}M VNĐ</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100">Sửa</button>
                <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded hover:bg-gray-100">Xem chi tiết</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ComparisonPage = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">So sánh Thực tế vs Hợp đồng</h1>

      {/* Contract Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="border rounded px-4 py-2">
            <option>THA2281 - Hà Giang</option>
            <option>NAN1927 - Nghệ An</option>
            <option>QNH0001 - Quảng Ninh</option>
          </select>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Nhập khối lượng KSTK
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            📥 Import từ Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">Tổng Volume HĐ</div>
          <div className="text-3xl font-bold mt-2">22 cột</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Thực tế KSTK</div>
          <div className="text-3xl font-bold mt-2">21 cột</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Chênh lệch</div>
          <div className="text-3xl font-bold text-red-600 mt-2">-1 cột (-4.5%)</div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Loại cột</th>
              <th className="text-center p-4">Volume HĐ</th>
              <th className="text-center p-4">Thực tế KSTK</th>
              <th className="text-center p-4">Chênh lệch</th>
              <th className="text-center p-4">% Sai lệch</th>
              <th className="text-center p-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.items.map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-4 font-semibold">{item.name}</td>
                <td className="text-center p-4">{item.volumeHD}</td>
                <td className="text-center p-4">{item.actualKSTK}</td>
                <td className="text-center p-4">
                  <span className={`font-bold ${
                    item.difference < 0 ? 'text-red-600' : 
                    item.difference > 0 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {item.difference > 0 ? '+' : ''}{item.difference}
                  </span>
                </td>
                <td className="text-center p-4">
                  <span className={`font-semibold ${
                    Math.abs(item.difference / item.volumeHD * 100) > 10 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {((item.difference / item.volumeHD) * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="text-center p-4">
                  {item.status === 'warning' && <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">⚠️ Cảnh báo</span>}
                  {item.status === 'ok' && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">✓ Khớp</span>}
                  {item.status === 'info' && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">ℹ️ Vượt</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded">
          Hủy
        </button>
        <button className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700">
          Gửi phê duyệt
        </button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Cập nhật HĐ
        </button>
      </div>
    </div>
  );

  const ReportsPage = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Báo cáo & Xuất dữ liệu</h1>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Báo cáo danh sách HĐ', desc: 'Xuất danh sách hợp đồng theo bộ lọc', icon: '📋' },
          { title: 'Báo cáo tiến độ', desc: 'Tiến trình chi tiết từng hợp đồng', icon: '⏱️' },
          { title: 'Báo cáo doanh thu', desc: 'Thống kê doanh thu theo thời gian', icon: '💰' },
          { title: 'Báo cáo so sánh', desc: 'Volume HĐ vs Thực tế KSTK', icon: '⚖️' },
          { title: 'Báo cáo tổng hợp', desc: 'Gộp dữ liệu từ nhiều module', icon: '📊' },
          { title: 'Báo cáo theo tỉnh', desc: 'Thống kê chi tiết từng tỉnh', icon: '🗺️' },
        ].map((report, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-5xl mb-4">{report.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{report.desc}</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
              <span>📥</span> Xuất Excel
            </button>
          </div>
        ))}
      </div>

      {/* Export History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Lịch sử xuất báo cáo</h3>
        </div>
        <div className="divide-y">
          {[
            { file: 'Bao_cao_danh_sach_HD_2025.xlsx', date: '2025-11-12 14:30', user: 'Admin', size: '2.4 MB' },
            { file: 'Bao_cao_tien_do_Q4_2024.xlsx', date: '2025-11-10 10:15', user: 'Manager', size: '1.8 MB' },
            { file: 'Bao_cao_doanh_thu_thang_10.xlsx', date: '2025-11-01 09:00', user: 'Admin', size: '3.2 MB' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="text-3xl">📄</div>
                <div>
                  <div className="font-semibold">{item.file}</div>
                  <div className="text-sm text-gray-600">{item.date} • {item.user} • {item.size}</div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-semibold">
                Tải xuống ↓
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} p-8 transition-all duration-300`}>
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'contracts' && <ContractsPage />}
        {currentPage === 'contractDetail' && <ContractDetailPage />}
        {currentPage === 'columns' && <ColumnsPage />}
        {currentPage === 'comparison' && <ComparisonPage />}
        {currentPage === 'reports' && <ReportsPage />}
        {currentPage === 'progress' && (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">⏱️</div>
            <h2 className="text-2xl font-bold mb-2">Module Quản lý Tiến trình</h2>
            <p className="text-gray-600">Màn hình này sẽ hiển thị workflow 6 giai đoạn với timeline và Gantt chart</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractManagementSystem;
