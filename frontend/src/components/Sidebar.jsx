import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HiHome, 
  HiUser,
  HiLogout,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
  HiChevronUp,
  HiX
} from 'react-icons/hi';
import { 
  FaFileContract,
  FaDatabase,
  FaTasks,
  FaBalanceScale,
  FaChartBar,
  FaClipboardList,
  FaHistory,
  FaBuilding,
  FaMapMarkerAlt,
  FaCity,
  FaProjectDiagram,
  FaUsers,
  FaCog
} from 'react-icons/fa';
import logo from '../assets/logo.png';

const Sidebar = ({ sidebarOpen, setSidebarOpen, isMobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isVolumeMenuOpen, setIsVolumeMenuOpen] = useState(false);
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    setSidebarOpen(!isCollapsed);
  }, [isCollapsed, setSidebarOpen]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Lấy thông tin user từ localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user && user.la_admin === 1;

  // Menu cho Admin
  const adminNavigation = [
    { 
      name: 'Dashboard', 
      icon: HiHome, 
      path: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    { 
      name: 'Hợp đồng', 
      icon: FaFileContract, 
      path: '/contracts',
      active: location.pathname === '/contracts'
    },
    { 
      name: 'Quản lý trạm', 
      icon: FaBuilding, 
      path: '/stations',
      active: location.pathname === '/stations'
    },
    { 
      name: 'Tiến trình', 
      icon: FaTasks, 
      path: '/progress',
      active: location.pathname === '/progress'
    },
    { 
      name: 'So sánh thực tế', 
      icon: FaBalanceScale, 
      path: '/comparison',
      active: location.pathname === '/comparison'
    },
    { 
      name: 'Chênh lệch hợp đồng', 
      icon: FaBalanceScale, 
      path: '/chenhlech',
      active: location.pathname === '/chenhlech'
    },
    { 
      name: 'Báo cáo', 
      icon: FaChartBar, 
      path: '/reports',
      active: location.pathname === '/reports'
    },
  ];

  // Menu cho KTV
  const ktvNavigation = [
    { 
      name: 'Dashboard', 
      icon: HiHome, 
      path: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    { 
      name: 'Hợp đồng cần khảo sát', 
      icon: FaClipboardList, 
      path: '/hopdong-can-khaosat',
      active: location.pathname === '/hopdong-can-khaosat'
    },
    { 
      name: 'Lịch sử khảo sát', 
      icon: FaHistory, 
      path: '/lichsu-khaosat',
      active: location.pathname === '/lichsu-khaosat'
    },
  ];

  const navigation = isAdmin ? adminNavigation : ktvNavigation;

  // Kiểm tra xem có đang ở trang volume không
  const isVolumePage = location.pathname === '/columns' || location.pathname === '/volume-other' || location.pathname === '/contract-volume';
  
  // Kiểm tra xem có đang ở trang quản lý hệ thống không
  const isSystemPage = [
    '/khuvuc',
    '/tinhthanh',
    '/duan',
    '/users'
  ].includes(location.pathname);
  
  // Tự động mở dropdown nếu đang ở trang volume
  useEffect(() => {
    if (isVolumePage) {
      setIsVolumeMenuOpen(true);
    }
  }, [isVolumePage]);

  // Tự động mở dropdown nếu đang ở trang quản lý hệ thống
  useEffect(() => {
    if (isSystemPage) {
      setIsSystemMenuOpen(true);
    }
  }, [isSystemPage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        bg-white flex flex-col
        h-screen
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-70' : 'w-20'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-lg
        flex-shrink-0
      `}>
        {/* Header với Logo */}
        <div className={`
          flex items-center justify-center
          ${sidebarOpen ? 'p-6' : 'p-4'}
          border-b border-gray-200
        `}>
          {sidebarOpen && (
            <img 
              src={logo} 
              alt="Logo" 
              className="w-48 h-auto object-contain"
            />
          )}
          {!sidebarOpen && (
            <img 
              src={logo} 
              alt="Logo" 
              className="w-24 h-24 object-contain"
            />
          )}
          {/* Mobile close button */}
          {isMobileOpen && (
        <button 
              onClick={onMobileClose}
              className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
              <HiX className="w-5 h-5" />
        </button>
          )}
      </div>

        {/* Toggle Button - Desktop only */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-20 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
          aria-label={sidebarOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
        >
          {sidebarOpen ? (
            <HiChevronLeft className="w-4 h-4 text-gray-600" />
          ) : (
            <HiChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Main Navigation Items */}
        <div className="flex-1 px-4 py-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
          <Link
            key={item.path}
            to={item.path}
                onClick={onMobileClose}
                className={`
                  flex items-center gap-3 mb-2 rounded-lg transition-colors
                  ${!sidebarOpen ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                  ${item.active
                    ? 'bg-gray-100 text-black font-bold'
                    : 'text-gray-500 hover:bg-gray-200'
                  }
                `}
                title={!sidebarOpen ? item.name : ''}
              >
                <div
                  className={`
                    flex items-center justify-center rounded-lg
                    ${!sidebarOpen ? 'w-10 h-10' : 'w-10 h-10'}
                    ${item.active
                      ? 'bg-transparent'
                      : 'bg-gray-100'
                    }
                  `}
          >
                  <Icon
                    className={`
                      ${!sidebarOpen ? 'w-6 h-6' : 'w-5 h-5'}
                      ${item.active
                        ? 'text-gray-800'
                        : 'text-gray-500'
                      }
                    `}
                  />
                </div>
                {sidebarOpen && (
                  <span className="text-sm">{item.name}</span>
                )}
          </Link>
            );
          })}

          {/* Thư viện volume với dropdown - chỉ hiển thị cho Admin */}
          {isAdmin && (
            <div className="mb-2">
              <button
                onClick={() => {
                  if (sidebarOpen) {
                    setIsVolumeMenuOpen(!isVolumeMenuOpen);
                  }
                }}
                className={`
                  w-full flex items-center gap-3 rounded-lg transition-colors
                  ${!sidebarOpen ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                  ${isVolumePage
                    ? 'bg-gray-100 text-black font-bold'
                    : 'text-gray-500 hover:bg-gray-200'
                  }
                `}
                title={!sidebarOpen ? 'Thư viện volume' : ''}
              >
                <div
                  className={`
                    flex items-center justify-center rounded-lg
                    ${!sidebarOpen ? 'w-10 h-10' : 'w-10 h-10'}
                    ${isVolumePage
                      ? 'bg-transparent'
                      : 'bg-gray-100'
                    }
                  `}
                >
                  <FaDatabase
                    className={`
                      ${!sidebarOpen ? 'w-6 h-6' : 'w-5 h-5'}
                      ${isVolumePage
                        ? 'text-gray-800'
                        : 'text-gray-500'
                      }
                    `}
                  />
                </div>
                {sidebarOpen && (
                  <>
                    <span className="text-sm flex-1 text-left">Thư viện volume</span>
                    {isVolumeMenuOpen ? (
                      <HiChevronUp className="w-4 h-4" />
                    ) : (
                      <HiChevronDown className="w-4 h-4" />
                    )}
                  </>
                )}
              </button>

              {/* Dropdown menu */}
              {sidebarOpen && isVolumeMenuOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    to="/columns"
                    onClick={onMobileClose}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${location.pathname === '/columns'
                        ? 'bg-gray-100 text-black font-semibold'
                        : 'text-gray-500 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Thư viện cột</span>
                  </Link>
                  <Link
                    to="/volume-other"
                    onClick={onMobileClose}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${location.pathname === '/volume-other'
                        ? 'bg-gray-100 text-black font-semibold'
                        : 'text-gray-500 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Thư viện volume khác</span>
                  </Link>
                  <Link
                    to="/contract-volume"
                    onClick={onMobileClose}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${location.pathname === '/contract-volume'
                        ? 'bg-gray-100 text-black font-semibold'
                        : 'text-gray-500 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Volume hợp đồng</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Quản lý hệ thống với dropdown - chỉ hiển thị cho Admin */}
          {isAdmin && (
            <div className="mb-2">
              <button
                onClick={() => {
                  if (sidebarOpen) {
                    setIsSystemMenuOpen(!isSystemMenuOpen);
                  }
                }}
                className={`
                  w-full flex items-center gap-3 rounded-lg transition-colors
                  ${!sidebarOpen ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                  ${isSystemPage
                    ? 'bg-gray-100 text-black font-bold'
                    : 'text-gray-500 hover:bg-gray-200'
                  }
                `}
                title={!sidebarOpen ? 'Quản lý hệ thống' : ''}
              >
                <div
                  className={`
                    flex items-center justify-center rounded-lg
                    ${!sidebarOpen ? 'w-10 h-10' : 'w-10 h-10'}
                    ${isSystemPage
                      ? 'bg-transparent'
                      : 'bg-gray-100'
                    }
                  `}
                >
                  <FaCog
                    className={`
                      ${!sidebarOpen ? 'w-6 h-6' : 'w-5 h-5'}
                      ${isSystemPage
                        ? 'text-gray-800'
                        : 'text-gray-500'
                      }
                    `}
                  />
                </div>
                {sidebarOpen && (
                  <>
                    <span className="text-sm flex-1 text-left">Quản lý hệ thống</span>
                    {isSystemMenuOpen ? (
                      <HiChevronUp className="w-4 h-4" />
                    ) : (
                      <HiChevronDown className="w-4 h-4" />
                    )}
                  </>
                )}
              </button>

              {/* Dropdown menu */}
              {sidebarOpen && isSystemMenuOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    to="/khuvuc"
                    onClick={onMobileClose}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${location.pathname === '/khuvuc'
                        ? 'bg-gray-100 text-black font-semibold'
                        : 'text-gray-500 hover:bg-gray-200'
                      }
                    `}
                  >
                    <FaMapMarkerAlt className="w-3 h-3" />
                    <span className="text-sm">Khu vực</span>
                  </Link>
                  <Link
                    to="/tinhthanh"
                    onClick={onMobileClose}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${location.pathname === '/tinhthanh'
                        ? 'bg-gray-100 text-black font-semibold'
                        : 'text-gray-500 hover:bg-gray-200'
                      }
                    `}
                  >
                    <FaCity className="w-3 h-3" />
                    <span className="text-sm">Tỉnh thành</span>
                  </Link>
                  <Link
                    to="/duan"
                    onClick={onMobileClose}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${location.pathname === '/duan'
                        ? 'bg-gray-100 text-black font-semibold'
                        : 'text-gray-500 hover:bg-gray-200'
                      }
                    `}
                  >
                    <FaProjectDiagram className="w-3 h-3" />
                    <span className="text-sm">Dự án</span>
                  </Link>
                  <Link
                    to="/users"
                    onClick={onMobileClose}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${location.pathname === '/users'
                        ? 'bg-gray-100 text-black font-semibold'
                        : 'text-gray-500 hover:bg-gray-200'
                      }
                    `}
                  >
                    <FaUsers className="w-3 h-3" />
                    <span className="text-sm">Người dùng</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Pages Section */}
        <div className="px-4 py-2 border-t border-gray-300 flex-shrink-0">
          {sidebarOpen && (
            <h2 className="text-sm font-bold text-black mb-2 px-4">ACCOUNT PAGES</h2>
          )}
          
          {/* Profile / Thông tin tài khoản */}
          <Link
            to="/profile"
            onClick={onMobileClose}
            className={`
              flex items-center gap-3 mb-2 rounded-lg transition-colors
              ${!sidebarOpen ? 'justify-center px-2 py-3' : 'px-4 py-3'}
              ${location.pathname === '/profile'
                ? 'bg-gray-100 text-black font-bold'
                : 'text-gray-500 hover:bg-gray-200'
              }
            `}
            title={!sidebarOpen ? (isAdmin ? 'Hồ sơ cá nhân' : 'Thông tin tài khoản') : ''}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
              <HiUser
                className={`
                  ${!sidebarOpen ? 'w-6 h-6' : 'w-5 h-5'}
                  ${location.pathname === '/profile'
                    ? 'text-gray-800'
                    : 'text-gray-500'
                  }
                `}
              />
            </div>
          {sidebarOpen && (
              <span className="text-sm">{isAdmin ? 'Hồ sơ cá nhân' : 'Thông tin tài khoản'}</span>
            )}
          </Link>

          {/* User Info */}
          {sidebarOpen && user && (
            <div className="px-4 py-3 mb-2 rounded-lg bg-gray-50">
              <div className="font-semibold text-sm text-black">{user.ten || 'User'}</div>
              <div className="text-xs text-gray-500">
                {isAdmin ? 'Quản trị viên' : 'Kỹ thuật viên'}
              </div>
            </div>
          )}
          
          {/* Logout button */}
          <button
            onClick={() => {
              handleLogout();
              onMobileClose?.();
            }}
            className={`
              w-full flex items-center gap-3 mb-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors
              ${!sidebarOpen ? 'justify-center px-2 py-3' : 'px-4 py-3'}
            `}
            title={!sidebarOpen ? 'Đăng xuất' : ''}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
              <HiLogout className={`${!sidebarOpen ? 'w-6 h-6' : 'w-5 h-5'} text-red-400`} />
        </div>
            {sidebarOpen && (
              <span className="text-sm">Đăng xuất</span>
            )}
          </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;

