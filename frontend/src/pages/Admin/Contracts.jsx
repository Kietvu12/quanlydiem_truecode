import { useState, useEffect } from 'react';
import { FaFileContract, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { hopdongAPI, duanAPI } from '../../service/api';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [duanList, setDuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
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
  }, []);

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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="text-center py-12">
            <FaFileContract className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có hợp đồng nào</h3>
            <p className="text-gray-500">Bắt đầu bằng cách tạo hợp đồng mới</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số hợp đồng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dự án</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chủ đầu tư</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày ký</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng giá trị</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contract.sohopdong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contract.duan?.ten_du_an || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contract.chudautu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contract.ngayky ? new Date(contract.ngayky).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contract.tonggiatri ? new Intl.NumberFormat('vi-VN').format(contract.tonggiatri) : '0'} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contract.trangthai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(contract)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(contract.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                      {duan.ten_du_an}
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
    </div>
  );
};

export default Contracts;
