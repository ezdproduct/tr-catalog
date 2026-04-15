'use client';
import { useState, useEffect } from 'react';
import {
  Box, List, LogOut, Plus, Search, Edit, Trash2, X, Menu, Settings, DollarSign, ChevronLeft, ChevronRight, ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/routing';

// Import Server Actions
import { getProducts, createProduct, deleteProduct, updateProduct } from '@/lib/actions/products';
import { getCategories, createCategory, deleteCategory, updateCategory } from '@/lib/actions/categories';

const PAGE_SIZE = 6;

const sidebarItems = [
  { icon: <Box size={20} />, label: 'Sản phẩm' },
  { icon: <List size={20} />, label: 'Danh mục' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Sản phẩm');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'Sản phẩm') {
        const { data: products, count } = await getProducts(currentPage, PAGE_SIZE);
        setData(products || []);
        setTotalCount(count || 0);
      } else {
        const { data: cats, count } = await getCategories(currentPage, PAGE_SIZE);
        setData(cats || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage]);

  const handleTabChange = (label: string) => {
    setActiveTab(label);
    setCurrentPage(1);
  };

  const openAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Xóa vĩnh viễn dữ liệu này?')) {
      if (activeTab === 'Sản phẩm') await deleteProduct(id);
      else await deleteCategory(id);
      fetchData();
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#1a1a1a' }}>

      <header className="mobile-header">
        <h2 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ef4444' }}>ROBOTICS ADMIN</h2>
        <button onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
      </header>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 1rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ef4444' }}>T. ROBOTICS</h2>
            <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Quản lý kho</p>
          </div>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleTabChange(item.label)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem',
                borderRadius: '12px', background: activeTab === item.label ? '#ef4444' : 'transparent',
                color: activeTab === item.label ? '#ffffff' : '#1a1a1a',
                border: 'none', fontWeight: 700, cursor: 'pointer', transition: '0.2s'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', color: '#ef4444', fontWeight: 800, textDecoration: 'none' }}>
          <LogOut size={18} /> THOÁT
        </Link>
      </aside>

      <main className="main-content">
        <div className="main-header">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{activeTab}</h1>
          <button onClick={openAdd} style={{
            background: '#ef4444', color: 'white', padding: '0.8rem 1.5rem',
            borderRadius: '10px', fontWeight: 700, cursor: 'pointer', border: 'none',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <Plus size={20} /> THÊM {activeTab === 'Sản phẩm' ? 'SẢN PHẨM' : 'DANH MỤC'}
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: '#64748b' }}>Đang tải...</div>
        ) : (
          <>
            <div className="desktop-only table-view">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>
                    <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem' }}>ẢNH/ICON</th>
                    <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem' }}>TÊN</th>
                    <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem' }}>MÔ TẢ / GIÁ</th>
                    <th style={{ padding: '1.2rem 1rem', textAlign: 'right', fontSize: '0.8rem' }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '1rem' }}>
                        <img src={activeTab === 'Sản phẩm' ? item.image_urls?.[0] : item.image_url} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', background: '#f1f5f9' }} />
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700 }}>{item.name}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                        {activeTab === 'Sản phẩm' ? (
                          <span style={{ color: '#ef4444', fontWeight: 800 }}>$ {(item.price || 0).toLocaleString()}</span>
                        ) : (
                          item.description || 'Chưa có mô tả'
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => openEdit(item)} style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '8px', border: 'none' }}><Edit size={16} /></button>
                          <button onClick={() => handleDelete(item.id)} style={{ background: '#fff1f2', padding: '0.6rem', borderRadius: '8px', border: 'none' }}><Trash2 size={16} color="#ef4444" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-only cards-view">
              {data.map((item: any) => (
                <div key={item.id} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <img src={activeTab === 'Sản phẩm' ? item.image_urls?.[0] : item.image_url} style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{item.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                        {activeTab === 'Sản phẩm' ? `$ ${(item.price || 0).toLocaleString()}` : item.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', borderTop: '1px solid #f8fafc', paddingTop: '1rem' }}>
                    <button onClick={() => openEdit(item)} style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '10px', border: 'none' }}><Edit size={18} /></button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: '#fff1f2', padding: '0.8rem', borderRadius: '10px', border: 'none' }}><Trash2 size={18} color="#ef4444" /></button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '3rem', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{ padding: '0.8rem', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{
                        width: '45px', height: '45px', borderRadius: '12px',
                        background: currentPage === i + 1 ? '#ef4444' : 'white',
                        color: currentPage === i + 1 ? 'white' : '#1a1a1a',
                        border: '1px solid #e2e8f0', fontWeight: 900,
                        cursor: 'pointer', transition: '0.2s',
                        boxShadow: currentPage === i + 1 ? '0 8px 20px rgba(239, 68, 68, 0.25)' : 'none'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{ padding: '0.8rem', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                  Trang {currentPage} / {totalPages} — Tổng {totalCount} mục
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <AnimatePresence>
        {showModal && (
          <WorkerFriendlyModal
            activeTab={activeTab === 'Sản phẩm' ? 'Products' : 'Categories'}
            item={editingItem}
            onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); fetchData(); }}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .sidebar { width: 260px; background: white; padding: 2rem 1.5rem; position: fixed; height: 100vh; z-index: 1100; left: 0; top: 0; border-right: 1px solid #f1f5f9; }
        .main-content { flex: 1; margin-left: 260px; padding: 3rem; width: calc(100% - 260px); }
        .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: white; padding: 0 1.5rem; border-bottom: 1px solid #eee; z-index: 1000; align-items: center; justify-content: space-between; }
        .main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .table-view { background: white; border-radius: 20px; padding: 1rem; box-shadow: 0 10px 40px rgba(0,0,0,0.01); }
        .cards-view { display: none; }
        .close-btn { display: none; background: none; border: none; }

        @media (max-width: 1024px) {
          .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-left: 0; width: 100%; padding: 80px 1rem 2rem; }
          .mobile-header { display: flex; }
          .cards-view { display: block; }
          .table-view { display: none; }
          .close-btn { display: block; }
          .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1050; }
        }
      `}</style>
    </div>
  );
}

function WorkerFriendlyModal({ activeTab, item, onClose, onSuccess }: any) {
  const [fields, setFields] = useState<{ key: string, value: string }[]>(
    item?.metadata ? Object.entries(item.metadata).map(([k, v]) => ({ key: k, value: v as string })) : []
  );
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(item?.category_id || '');

  useEffect(() => {
    getCategories(1, 100).then(res => {
      setCategories(res.data || []);
      // If categories load after mount and item exists, ensure selected is correct
      if (item?.category_id) setSelectedCategoryId(item.category_id);
    });
  }, [item]);

  const addField = () => setFields([...fields, { key: '', value: '' }]);
  const updateField = (index: number, k: string, v: string) => {
    const newFields = [...fields];
    newFields[index] = { key: k, value: v };
    setFields(newFields);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const metadata: any = {};
    fields.forEach(f => { if (f.key) metadata[f.key] = f.value; });
    formData.append('metadata', JSON.stringify(metadata));

    try {
      if (item) {
        if (activeTab === 'Products') await updateProduct(item.id, formData);
        else await updateCategory(item.id, formData);
      } else {
        if (activeTab === 'Products') await createProduct(formData);
        else await createCategory(formData);
      }
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Lỗi không xác định!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', width: '100%', maxWidth: '600px', padding: '2rem', borderRadius: '32px', maxHeight: '95vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2rem' }}>{item ? 'CẬP NHẬT' : 'THÊM MỚI'} {activeTab === 'Products' ? 'SẢN PHẨM' : 'DANH MỤC'}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>Tên hiển thị:</label>
            <input name="name" defaultValue={item?.name} className="form-input" required placeholder="Nhập tên..." />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>Mô tả ngắn:</label>
            <textarea name="description" defaultValue={item?.description} className="form-input" style={{ height: '80px', borderRadius: '15px', padding: '1rem' }} placeholder="Giới thiệu về sản phẩm/danh mục..." />
          </div>

          {activeTab === 'Products' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>Giá bán ($):</label>
                <input name="price" type="number" defaultValue={item?.price} className="form-input" required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>Danh mục:</label>
                <select
                  name="category_id"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Chọn một danh mục</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>Đường dẫn (Slug):</label>
              <input name="slug" defaultValue={item?.slug} className="form-input" required placeholder="tu-bep-thong-minh" />
            </div>
          )}

          <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.8rem', fontSize: '0.9rem' }}>Hình ảnh (Nhiều ảnh cho sản phẩm):</label>
            <input name={activeTab === 'Products' ? 'images' : 'image'} type="file" multiple={activeTab === 'Products'} accept="image/*" />
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>Thông số kĩ thuật / Metadata:</label>
              <button type="button" onClick={addField} style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.85rem' }}>+ THÊM DÒNG</button>
            </div>
            {fields.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <input placeholder="Tên (Loại gỗ)" value={f.key} onChange={(e) => updateField(i, e.target.value, f.value)} style={{ flex: 1, padding: '0.7rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem' }} />
                <input placeholder="Valor (Gỗ sồi)" value={f.value} onChange={(e) => updateField(i, f.key, e.target.value)} style={{ flex: 1, padding: '0.7rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem' }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '1rem', borderRadius: '15px', background: '#f1f5f9', fontWeight: 700 }}>HỦY</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '1rem', borderRadius: '15px', background: '#ef4444', color: 'white', fontWeight: 900 }}>
              {loading ? 'ĐANG LƯU...' : 'LƯU DỮ LIỆU'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
