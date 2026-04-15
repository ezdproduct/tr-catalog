'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import {
  Box, List, LogOut, Plus, Search, Edit, Trash2, X, Menu, Settings, DollarSign, ChevronLeft, ChevronRight, ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/routing';

// Import Server Actions
import { getProducts, createProduct, deleteProduct, updateProduct, getMediaLibrary } from '@/lib/actions/products';
import { getCategories, createCategory, deleteCategory, updateCategory } from '@/lib/actions/categories';

const PAGE_SIZE = 6;

const sidebarItems = [
  { id: 'Catalog', icon: <Box size={20} />, label: 'Quản lý Catalog' },
  { id: 'Media', icon: <ImageIcon size={20} />, label: 'Thư viện Media' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Catalog');
  const [selectedCatId, setSelectedCatId] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'Products' | 'Categories'>('Products');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'Catalog') {
        const { data: cats } = await getCategories(1, 100);
        setCategories(cats || []);
        const { data, count } = await getProducts(currentPage, PAGE_SIZE, debouncedSearch, selectedCatId === 'all' ? undefined : selectedCatId);
        setProducts(data || []);
        setTotalCount(count || 0);
      } else {
        const media = await getMediaLibrary();
        setMediaItems(media);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCatId, currentPage, debouncedSearch, activeTab]);

  const openAddProduct = () => {
    setModalType('Products');
    setEditingItem(null);
    setShowModal(true);
  };

  const openAddCategory = () => {
    setModalType('Categories');
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditProduct = (item: any) => {
    setModalType('Products');
    setEditingItem(item);
    setShowModal(true);
  };

  const openEditCategory = (cat: any) => {
    setModalType('Categories');
    setEditingItem(cat);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Xóa vĩnh viễn sản phẩm này?')) {
      await deleteProduct(id);
      fetchData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Xóa danh mục này sẽ ảnh hưởng đến các sản phẩm bên trong. Tiếp tục?')) {
      await deleteCategory(id);
      fetchData();
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#1a1a1a' }}>

      <header className="mobile-header">
        <h2 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ef4444' }}>TRANSFORMER ROBOTICS</h2>
        <button onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
      </header>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 1rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ef4444' }}>TRANSFORMER ROBOTICS</h2>
            <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Quản lý kho</p>
          </div>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem',
                borderRadius: '12px', background: activeTab === item.id ? '#ef4444' : 'transparent',
                color: activeTab === item.id ? '#ffffff' : '#1a1a1a',
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
        {activeTab === 'Catalog' ? (
          <>
            <div className="main-header">
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, flexShrink: 0 }}>Catalog</h1>

              <div className="search-wrapper">
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none', background: 'transparent', outline: 'none', width: '100%',
                    fontSize: '0.95rem', fontWeight: 600, color: '#1a1a1a'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
                <button onClick={openAddCategory} style={{
                  background: 'white', color: '#ef4444', padding: '0.8rem 1.2rem',
                  borderRadius: '10px', fontWeight: 700, cursor: 'pointer', border: '2px solid #ef4444',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <Plus size={20} /> DANH MỤC
                </button>
                <button onClick={openAddProduct} style={{
                  background: '#ef4444', color: 'white', padding: '0.8rem 1.2rem',
                  borderRadius: '10px', fontWeight: 700, cursor: 'pointer', border: 'none',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <Plus size={20} /> SẢN PHẨM
                </button>
              </div>
            </div>

            {/* Category Selector Bar */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#64748b' }}>DANH MỤC</h3>
              </div>
              <div style={{
                display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem',
                scrollbarWidth: 'none', msOverflowStyle: 'none'
              }}>
                <button
                  onClick={() => { setSelectedCatId('all'); setCurrentPage(1); }}
                  style={{
                    padding: '0.6rem 1.2rem', borderRadius: '10px', whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer',
                    background: selectedCatId === 'all' ? '#1a1a1a' : 'white',
                    color: selectedCatId === 'all' ? 'white' : '#64748b',
                    border: '1px solid #e2e8f0', transition: '0.2s'
                  }}
                >
                  Tất cả
                </button>
                {categories.map((cat) => (
                  <div key={cat.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <button
                      onClick={() => { setSelectedCatId(cat.id); setCurrentPage(1); }}
                      style={{
                        padding: '0.6rem 2.8rem 0.6rem 1.2rem', borderRadius: '10px', whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer',
                        background: selectedCatId === cat.id ? '#1a1a1a' : 'white',
                        color: selectedCatId === cat.id ? 'white' : '#64748b',
                        border: '1px solid #e2e8f0', transition: '0.2s'
                      }}
                    >
                      {cat.name}
                    </button>
                    <div style={{ position: 'absolute', right: '0.5rem', display: 'flex', gap: '0.2rem' }}>
                      <button onClick={() => openEditCategory(cat)} style={{ background: 'none', border: 'none', padding: '0.2rem', cursor: 'pointer', color: selectedCatId === cat.id ? '#ef4444' : '#94a3b8' }}><Settings size={14} /></button>
                      <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'none', border: 'none', padding: '0.2rem', cursor: 'pointer', color: '#fca5a5' }}><X size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
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
                        <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem' }}>MÔ TẢ</th>
                        <th style={{ padding: '1.2rem 1rem', textAlign: 'right', fontSize: '0.8rem' }}>THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item: any) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '1rem' }}>
                            <img src={item.image_urls?.[0]} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', background: '#f1f5f9' }} />
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 700 }}>{item.name}</td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                            {item.description || 'Chưa có mô tả'}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button onClick={() => openEditProduct(item)} style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '8px', border: 'none' }}><Edit size={16} /></button>
                              <button onClick={() => handleDeleteProduct(item.id)} style={{ background: '#fff1f2', padding: '0.6rem', borderRadius: '8px', border: 'none' }}><Trash2 size={16} color="#ef4444" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-only cards-view">
                  {products.map((item: any) => (
                    <div key={item.id} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <img src={item.image_urls?.[0]} style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{item.name}</h3>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', borderTop: '1px solid #f8fafc', paddingTop: '1rem' }}>
                        <button onClick={() => openEditProduct(item)} style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '10px', border: 'none' }}><Edit size={18} /></button>
                        <button onClick={() => handleDeleteProduct(item.id)} style={{ background: '#fff1f2', padding: '0.8rem', borderRadius: '10px', border: 'none' }}><Trash2 size={18} color="#ef4444" /></button>
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
          </>
        ) : (
          <div style={{ padding: '0.5rem' }}>
            <div className="main-header" style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Thư viện Media</h1>
              <p style={{ color: '#64748b', fontWeight: 600 }}>{mediaItems.length} hình ảnh trong hệ thống</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1.5rem'
            }}>
              {mediaItems.map((url, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  aspectRatio: '1/1'
                }}>
                  <img
                    src={url}
                    alt={`Media ${idx}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: '0.2s', cursor: 'pointer'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                      alert('Đã sao chép liên kết ảnh!');
                    }}
                  >
                    <button style={{
                      padding: '0.5rem 1rem', background: 'white', border: 'none',
                      borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem'
                    }}>
                      SAO CHÉP LINK
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showModal && (
          <WorkerFriendlyModal
            activeTab={modalType}
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
        .main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; gap: 2rem; }
        .search-wrapper { 
          flex: 1; 
          max-width: 500px; 
          background: white; 
          padding: 0.8rem 1.2rem; 
          border-radius: 12px; 
          display: flex; 
          align-items: center; 
          gap: 0.8rem; 
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
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
          .main-header { flex-direction: column; align-items: stretch; gap: 1rem; }
          .search-wrapper { max-width: none; order: 2; }
          .main-header h1 { order: 1; font-size: 1.5rem !important; }
          .main-header button { order: 3; }
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

  // Trạng thái ảnh cũ
  const [existingImages, setExistingImages] = useState<string[]>(() => {
    if (!item) return [];
    if (activeTab === 'Products') return item.image_urls || [];
    return item.image_url ? [item.image_url] : [];
  });

  // Trạng thái ảnh mới chọn
  const [newFiles, setNewFiles] = useState<{ file: File, preview: string }[]>([]);

  // Media Library Selection
  const [mediaLibrary, setMediaLibrary] = useState<string[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    getCategories(1, 100).then(res => {
      setCategories(res.data || []);
      if (item?.category_id) setSelectedCategoryId(item.category_id);
    });
    getMediaLibrary().then(setMediaLibrary);
  }, [item]);

  useEffect(() => {
    return () => {
      newFiles.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [newFiles]);

  const addField = () => setFields([...fields, { key: '', value: '' }]);
  const updateField = (index: number, k: string, v: string) => {
    const newFields = [...fields];
    newFields[index] = { key: k, value: v };
    setFields(newFields);
  };

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (files.length === 0) return;

    const newFilesWithPreview = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    if (activeTab === 'Products') {
      setNewFiles(prev => [...prev, ...newFilesWithPreview]);
    } else {
      setNewFiles(newFilesWithPreview.slice(0, 1));
      setExistingImages([]);
    }
    e.target.value = null;
  };

  const handleSelectFromLibrary = (url: string) => {
    if (activeTab === 'Products') {
      if (!existingImages.includes(url)) {
        setExistingImages(prev => [...prev, url]);
      }
    } else {
      setExistingImages([url]);
      setNewFiles([]); // Clear new file if choosing from library for category
    }
    setShowLibrary(false);
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const metadata: any = {};
    fields.forEach(f => { if (f.key) metadata[f.key] = f.value; });
    formData.append('metadata', JSON.stringify(metadata));

    if (activeTab === 'Products') {
      formData.append('existing_images', JSON.stringify(existingImages));
      newFiles.forEach(f => formData.append('images', f.file));
    } else {
      formData.append('existing_image', existingImages[0] || '');
      if (newFiles.length > 0) {
        formData.append('image', newFiles[0].file);
      }
    }

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
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', width: '100%', maxWidth: '600px', padding: '2rem', borderRadius: '32px', maxHeight: '95vh', overflowY: 'auto', position: 'relative' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                {activeTab === 'Products' ? 'Hình ảnh (Nhiều ảnh):' : 'Hình ảnh (1 ảnh):'}
              </label>
              <button
                type="button"
                onClick={() => setShowLibrary(true)}
                style={{ background: '#3b82f6', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ImageIcon size={14} /> CHỌN TỪ THƯ VIỆN
              </button>
            </div>

            <input
              type="file"
              multiple={activeTab === 'Products'}
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* Existing Images Gallery */}
            {existingImages.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Ảnh đã chọn:</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {existingImages.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                      <button type="button" onClick={() => handleRemoveExistingImage(idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', padding: 0 }}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Files Preview */}
            {newFiles.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.5rem' }}>Ảnh mới chuẩn bị tải lên:</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {newFiles.map((nf, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <img src={nf.preview} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: '2px solid #3b82f6' }} />
                      <button type="button" onClick={() => handleRemoveNewFile(idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', padding: 0 }}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Media Library Picker Modal (Overlay) */}
          <AnimatePresence>
            {showLibrary && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 100, display: 'flex', flexDirection: 'column', borderRadius: '32px' }}
              >
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1rem' }}>CHỌN ẢNH TỪ HỆ THỐNG</h3>
                  <button type="button" onClick={() => setShowLibrary(false)} style={{ background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                  {mediaLibrary.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectFromLibrary(url)}
                      style={{
                        aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                        border: existingImages.includes(url) ? '3px solid #ef4444' : '1px solid #f1f5f9',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                  {mediaLibrary.length === 0 && <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#94a3b8', padding: '2rem' }}>Chưa có ảnh nào trong thư viện.</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>Thông số kĩ thuật / Metadata:</label>
              <button type="button" onClick={addField} style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.85rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>+ THÊM DÒNG</button>
            </div>
            {fields.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <input placeholder="Tên (Loại gỗ)" value={f.key} onChange={(e) => updateField(i, e.target.value, f.value)} style={{ flex: 1, padding: '0.7rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem' }} />
                <input placeholder="Giá trị (Gỗ sồi)" value={f.value} onChange={(e) => updateField(i, f.key, e.target.value)} style={{ flex: 1, padding: '0.7rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem' }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '1rem', borderRadius: '15px', background: '#f1f5f9', fontWeight: 700, border: 'none', cursor: 'pointer' }}>HỦY</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '1rem', borderRadius: '15px', background: '#ef4444', color: 'white', fontWeight: 900, border: 'none', cursor: 'pointer' }}>
              {loading ? 'ĐANG LƯU...' : 'LƯU DỮ LIỆU'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
