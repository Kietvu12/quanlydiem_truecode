// Base URL của API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper function để lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function để gọi API
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const defaultHeaders = {};
  
  // Chỉ set Content-Type nếu không phải FormData
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Xử lý response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Lỗi server' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // Nếu response là file (Excel, PDF, etc.)
    const contentType = response.headers.get('content-type');
    if (contentType && (
      contentType.includes('application/vnd.openxmlformats-officedocument') ||
      contentType.includes('application/vnd.ms-excel') ||
      contentType.includes('application/pdf')
    )) {
      return response.blob();
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== AUTHENTICATION ====================
export const authAPI = {
  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, matkhau: password }),
    });
  },
};

// ==================== USERS ====================
export const userAPI = {
  getAll: async () => {
    return apiCall('/users');
  },
  getById: async (id) => {
    return apiCall(`/users/${id}`);
  },
  create: async (userData) => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  update: async (id, userData) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  delete: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== KHU VỰC ====================
export const khuVucAPI = {
  getAll: async () => {
    return apiCall('/khuvuc');
  },
  getById: async (id) => {
    return apiCall(`/khuvuc/${id}`);
  },
  create: async (khuVucData) => {
    return apiCall('/khuvuc', {
      method: 'POST',
      body: JSON.stringify(khuVucData),
    });
  },
  update: async (id, khuVucData) => {
    return apiCall(`/khuvuc/${id}`, {
      method: 'PUT',
      body: JSON.stringify(khuVucData),
    });
  },
  delete: async (id) => {
    return apiCall(`/khuvuc/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TỈNH THÀNH ====================
export const tinhThanhAPI = {
  getAll: async (includeKhuVuc = false) => {
    const query = includeKhuVuc ? '?include_khuvuc=true' : '';
    return apiCall(`/tinhthanh${query}`);
  },
  getById: async (id, includeKhuVuc = false) => {
    const query = includeKhuVuc ? '?include_khuvuc=true' : '';
    return apiCall(`/tinhthanh/${id}${query}`);
  },
  getByKhuVuc: async (khuvuc_id) => {
    return apiCall(`/tinhthanh/khuvuc/${khuvuc_id}`);
  },
  create: async (tinhThanhData) => {
    return apiCall('/tinhthanh', {
      method: 'POST',
      body: JSON.stringify(tinhThanhData),
    });
  },
  update: async (id, tinhThanhData) => {
    return apiCall(`/tinhthanh/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tinhThanhData),
    });
  },
  delete: async (id) => {
    return apiCall(`/tinhthanh/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TRẠM ====================
export const tramAPI = {
  getAll: async (includeTinhThanh = false) => {
    const query = includeTinhThanh ? '?include_tinhthanh=true' : '';
    return apiCall(`/tram${query}`);
  },
  getById: async (id, includeTinhThanh = false) => {
    const query = includeTinhThanh ? '?include_tinhthanh=true' : '';
    return apiCall(`/tram/${id}${query}`);
  },
  getByTinhThanh: async (tinhthanh_id) => {
    return apiCall(`/tram/tinhthanh/${tinhthanh_id}`);
  },
  create: async (tramData) => {
    return apiCall('/tram', {
      method: 'POST',
      body: JSON.stringify(tramData),
    });
  },
  update: async (id, tramData) => {
    return apiCall(`/tram/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tramData),
    });
  },
  delete: async (id) => {
    return apiCall(`/tram/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== DỰ ÁN ====================
export const duanAPI = {
  getAll: async () => {
    return apiCall('/duan');
  },
  getById: async (id) => {
    return apiCall(`/duan/${id}`);
  },
  create: async (duanData) => {
    return apiCall('/duan', {
      method: 'POST',
      body: JSON.stringify(duanData),
    });
  },
  update: async (id, duanData) => {
    return apiCall(`/duan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(duanData),
    });
  },
  delete: async (id) => {
    return apiCall(`/duan/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== HỢP ĐỒNG ====================
export const hopdongAPI = {
  getAll: async (includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/hopdong${query}`);
  },
  getById: async (id, includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/hopdong/${id}${query}`);
  },
  create: async (hopdongData) => {
    return apiCall('/hopdong', {
      method: 'POST',
      body: JSON.stringify(hopdongData),
    });
  },
  update: async (id, hopdongData) => {
    return apiCall(`/hopdong/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hopdongData),
    });
  },
  delete: async (id) => {
    return apiCall(`/hopdong/${id}`, {
      method: 'DELETE',
    });
  },
  addTram: async (hopdongId, tramId) => {
    return apiCall(`/hopdong/${hopdongId}/tram`, {
      method: 'POST',
      body: JSON.stringify({ tram_id: tramId }),
    });
  },
  removeTram: async (hopdongId, tramId) => {
    return apiCall(`/hopdong/${hopdongId}/tram/${tramId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== THƯ VIỆN CỘT ====================
export const thuVienCotAPI = {
  getAll: async () => {
    return apiCall('/thuviencot');
  },
  getById: async (id) => {
    return apiCall(`/thuviencot/${id}`);
  },
  create: async (cotData) => {
    return apiCall('/thuviencot', {
      method: 'POST',
      body: JSON.stringify(cotData),
    });
  },
  update: async (id, cotData) => {
    return apiCall(`/thuviencot/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cotData),
    });
  },
  delete: async (id) => {
    return apiCall(`/thuviencot/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== THƯ VIỆN VOLUME KHÁC ====================
export const thuVienVolumeKhacAPI = {
  getAll: async () => {
    return apiCall('/thuvienvolume');
  },
  getById: async (id) => {
    return apiCall(`/thuvienvolume/${id}`);
  },
  create: async (volumeData) => {
    return apiCall('/thuvienvolume', {
      method: 'POST',
      body: JSON.stringify(volumeData),
    });
  },
  update: async (id, volumeData) => {
    return apiCall(`/thuvienvolume/${id}`, {
      method: 'PUT',
      body: JSON.stringify(volumeData),
    });
  },
  delete: async (id) => {
    return apiCall(`/thuvienvolume/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TRẠM CỘT (Volume cột của trạm) ====================
export const tramCotAPI = {
  getAll: async (includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/tramcot${query}`);
  },
  getById: async (id, includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/tramcot/${id}${query}`);
  },
  getByTram: async (tram_id) => {
    return apiCall(`/tramcot/tram/${tram_id}`);
  },
  create: async (tramCotData) => {
    return apiCall('/tramcot', {
      method: 'POST',
      body: JSON.stringify(tramCotData),
    });
  },
  update: async (id, tramCotData) => {
    return apiCall(`/tramcot/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tramCotData),
    });
  },
  delete: async (id) => {
    return apiCall(`/tramcot/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TRẠM VOLUME KHÁC (Volume khác của trạm) ====================
export const tramVolumeKhacAPI = {
  getAll: async (includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/tramvolume${query}`);
  },
  getById: async (id, includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/tramvolume/${id}${query}`);
  },
  getByTram: async (tram_id) => {
    return apiCall(`/tramvolume/tram/${tram_id}`);
  },
  create: async (tramVolumeData) => {
    return apiCall('/tramvolume', {
      method: 'POST',
      body: JSON.stringify(tramVolumeData),
    });
  },
  update: async (id, tramVolumeData) => {
    return apiCall(`/tramvolume/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tramVolumeData),
    });
  },
  delete: async (id) => {
    return apiCall(`/tramvolume/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TRẠM TIẾN ĐỘ ====================
export const tramTienDoAPI = {
  getAll: async (includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/tramtiendo${query}`);
  },
  getById: async (id, includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/tramtiendo/${id}${query}`);
  },
  getByHopDong: async (hopdong_id) => {
    return apiCall(`/tramtiendo/hopdong/${hopdong_id}`);
  },
  getByTramAndHopDong: async (tram_id, hopdong_id) => {
    return apiCall(`/tramtiendo/tram/${tram_id}/hopdong/${hopdong_id}`);
  },
  create: async (tiendoData) => {
    return apiCall('/tramtiendo', {
      method: 'POST',
      body: JSON.stringify(tiendoData),
    });
  },
  update: async (id, tiendoData) => {
    return apiCall(`/tramtiendo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tiendoData),
    });
  },
  delete: async (id) => {
    return apiCall(`/tramtiendo/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TRẠM THỰC TẾ CỘT ====================
export const tramThucTeCotAPI = {
  getAll: async (includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/tramthuctecot${query}`);
  },
  getById: async (id, includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/tramthuctecot/${id}${query}`);
  },
  getByHopDong: async (hopdong_id) => {
    return apiCall(`/tramthuctecot/hopdong/${hopdong_id}`);
  },
  getByTramAndHopDong: async (tram_id, hopdong_id) => {
    return apiCall(`/tramthuctecot/tram/${tram_id}/hopdong/${hopdong_id}`);
  },
  create: async (thucTeData) => {
    return apiCall('/tramthuctecot', {
      method: 'POST',
      body: JSON.stringify(thucTeData),
    });
  },
  update: async (id, thucTeData) => {
    return apiCall(`/tramthuctecot/${id}`, {
      method: 'PUT',
      body: JSON.stringify(thucTeData),
    });
  },
  delete: async (id) => {
    return apiCall(`/tramthuctecot/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TRẠM THỰC TẾ VOLUME KHÁC ====================
export const tramThucTeVolumeKhacAPI = {
  getAll: async (includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/tramthuctevolume${query}`);
  },
  getById: async (id, includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/tramthuctevolume/${id}${query}`);
  },
  getByHopDong: async (hopdong_id) => {
    return apiCall(`/tramthuctevolume/hopdong/${hopdong_id}`);
  },
  getByTramAndHopDong: async (tram_id, hopdong_id) => {
    return apiCall(`/tramthuctevolume/tram/${tram_id}/hopdong/${hopdong_id}`);
  },
  create: async (thucTeData) => {
    return apiCall('/tramthuctevolume', {
      method: 'POST',
      body: JSON.stringify(thucTeData),
    });
  },
  update: async (id, thucTeData) => {
    return apiCall(`/tramthuctevolume/${id}`, {
      method: 'PUT',
      body: JSON.stringify(thucTeData),
    });
  },
  delete: async (id) => {
    return apiCall(`/tramthuctevolume/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CHÊNH LỆCH HỢP ĐỒNG ====================
export const chenhLechHopDongAPI = {
  getAll: async (includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/chenhlech${query}`);
  },
  getById: async (id, includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/chenhlech/${id}${query}`);
  },
  getByHopDong: async (hopdong_id) => {
    return apiCall(`/chenhlech/hopdong/${hopdong_id}`);
  },
  calculate: async (hopdong_id) => {
    return apiCall(`/chenhlech/hopdong/${hopdong_id}/calculate`);
  },
  create: async (chenhLechData) => {
    return apiCall('/chenhlech', {
      method: 'POST',
      body: JSON.stringify(chenhLechData),
    });
  },
  update: async (id, chenhLechData) => {
    return apiCall(`/chenhlech/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chenhLechData),
    });
  },
  delete: async (id) => {
    return apiCall(`/chenhlech/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== LỊCH SỬ ====================
export const lichsuAPI = {
  getAll: async (limit = 100, includeRelations = false) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (includeRelations) params.append('include_relations', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/lichsu${query}`);
  },
  getById: async (id, includeRelations = false) => {
    const query = includeRelations ? '?include_relations=true' : '';
    return apiCall(`/lichsu/${id}${query}`);
  },
  getByNguoiDung: async (nguoidung_id, limit = 50) => {
    const query = `?limit=${limit}`;
    return apiCall(`/lichsu/nguoidung/${nguoidung_id}${query}`);
  },
};

// Export default object chứa tất cả APIs
export default {
  auth: authAPI,
  user: userAPI,
  khuVuc: khuVucAPI,
  tinhThanh: tinhThanhAPI,
  tram: tramAPI,
  duan: duanAPI,
  hopdong: hopdongAPI,
  thuVienCot: thuVienCotAPI,
  thuVienVolumeKhac: thuVienVolumeKhacAPI,
  tramCot: tramCotAPI,
  tramVolumeKhac: tramVolumeKhacAPI,
  tramTienDo: tramTienDoAPI,
  tramThucTeCot: tramThucTeCotAPI,
  tramThucTeVolumeKhac: tramThucTeVolumeKhacAPI,
  chenhLechHopDong: chenhLechHopDongAPI,
  lichsu: lichsuAPI,
};
