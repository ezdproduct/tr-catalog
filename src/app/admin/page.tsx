'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Database,
    Package,
    Layers,
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Upload,
    ChevronRight,
    LayoutDashboard,
    CheckCircle,
    AlertCircle,
    Lock,
    Search,
    ArrowUpRight,
    Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadProductImage, uploadCategoryBanner } from '@/lib/actions/admin';

type AdminTab = 'products' | 'categories';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<AdminTab>('products');
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [modalType, setModalType] = useState<'product' | 'category' | 'bulk'>('product');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);


    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchData = async () => {
        setLoading(true);
        const { data: p } = await supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false });
        const { data: c } = await supabase.from('categories').select('*').order('name');
        setProducts(p || []);
        setCategories(c || []);
        setLoading(false);
    };

    const handleDelete = async (type: 'products' | 'categories', id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        const { error } = await supabase.from(type).delete().eq('id', id);
        if (error) setMessage({ text: error.message, type: 'error' });
        else {
            setMessage({ text: 'Deleted successfully', type: 'success' });
            fetchData();
        }
    };

    const handleBulkFolderUpload = async (e: any) => {
        const files = Array.from(e.target.files) as File[];
        if (!files.length) return;
        if (!confirm(`Found ${files.length} files. Begin bulk import?`)) return;

        setUploading(true);
        setMessage({ text: 'Starting bulk import...', type: 'success' });
        const itemsToUpload: any = {};

        let maxDepth = 0;
        files.forEach(f => {
            const depth = f.webkitRelativePath.split('/').length;
            if (depth > maxDepth) maxDepth = depth;
        });

        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;

            const parts = file.webkitRelativePath.split('/');
            let catName = 'Upload Nhanh';
            let prodName = '';
            let isBanner = false;

            if (maxDepth >= 4) {
                // e.g. RootFolder/CategoryName/ProductName/1.jpg
                if (parts.length === 3) {
                    catName = parts[1];
                    isBanner = true;
                } else if (parts.length >= 4) {
                    catName = parts[1];
                    prodName = parts[2];
                }
            } else if (maxDepth === 3) {
                // e.g. CategoryName/ProductName/1.jpg
                if (parts.length === 2) {
                    catName = parts[0];
                    isBanner = true;
                } else if (parts.length === 3) {
                    catName = parts[0];
                    prodName = parts[1];
                }
            } else {
                // maxDepth <= 2 -> e.g. ProductName/1.jpg
                if (parts.length === 2) {
                    prodName = parts[0];
                }
            }

            if (!itemsToUpload[catName]) itemsToUpload[catName] = { banner: null, products: {} };

            if (isBanner) {
                if (!itemsToUpload[catName].banner) itemsToUpload[catName].banner = file;
            } else if (prodName) {
                if (!itemsToUpload[catName].products[prodName]) itemsToUpload[catName].products[prodName] = [];
                itemsToUpload[catName].products[prodName].push(file);
            }
        }

        try {
            for (const catName of Object.keys(itemsToUpload)) {
                const catSlug = catName.toLowerCase().replace(/ /g, '-');
                let { data: catData } = await supabase.from('categories').select('id, name').eq('slug', catSlug).maybeSingle();
                let catId = catData?.id;

                if (!catId) {
                    const { data: newCat, error } = await supabase.from('categories').insert([{ name: catName, slug: catSlug }]).select().single();
                    if (error) throw error;
                    catId = newCat.id;
                }

                if (itemsToUpload[catName].banner) {
                    const fd = new FormData();
                    fd.append('file', itemsToUpload[catName].banner);
                    const url = await uploadCategoryBanner(fd);
                    await supabase.from('categories').update({ bannerImage: url }).eq('id', catId);
                }

                for (const prodName of Object.keys(itemsToUpload[catName].products)) {
                    let { data: prodData } = await supabase.from('products').select('id, image_urls').eq('name', prodName).eq('category_id', catId).maybeSingle();
                    let prodId = prodData?.id;
                    let existingUrls = prodData?.image_urls || [];

                    if (!prodId) {
                        const { data: newProd, error } = await supabase.from('products').insert([{ name: prodName, category_id: catId, metadata: {} }]).select().single();
                        if (error) throw error;
                        prodId = newProd.id;
                    }

                    const newUrls = [];
                    for (const imgFile of itemsToUpload[catName].products[prodName]) {
                        const fd = new FormData();
                        fd.append('file', imgFile);
                        const url = await uploadProductImage(fd);
                        newUrls.push(url);
                    }

                    if (newUrls.length > 0) {
                        await supabase.from('products').update({ image_urls: [...existingUrls, ...newUrls] }).eq('id', prodId);
                    }
                }
            }
            setMessage({ text: 'Bulk import complete!', type: 'success' });
            fetchData();
        } catch (err: any) {
            console.error(err);
            setMessage({ text: 'Error during import: ' + err.message, type: 'error' });
        } finally {
            setUploading(false);
            e.target.value = ''; // reset input
        }
    };

    const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data: any = {
            name: formData.get('name'),
            category_id: formData.get('category_id') || categories[0]?.id,
            image_urls: editItem?.image_urls || [],
            metadata: {}
        };

        if (editItem) {
            const { error } = await supabase.from('products').update(data).eq('id', editItem.id);
            if (error) setMessage({ text: error.message, type: 'error' });
            else setMessage({ text: 'Product updated', type: 'success' });
        } else {
            const { error } = await supabase.from('products').insert([data]);
            if (error) setMessage({ text: error.message, type: 'error' });
            else setMessage({ text: 'Product created', type: 'success' });
        }

        setIsModalOpen(false);
        fetchData();
    };

    const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: any = {
            name: formData.get('name'),
            slug: (formData.get('name') as string).toLowerCase().replace(/ /g, '-'),
            bannerImage: editItem?.bannerImage || null
        };

        if (editItem) {
            const { error } = await supabase.from('categories').update(data).eq('id', editItem.id);
            if (error) setMessage({ text: error.message, type: 'error' });
            else setMessage({ text: 'Category updated', type: 'success' });
        } else {
            const { error } = await supabase.from('categories').insert([data]);
            if (error) setMessage({ text: error.message, type: 'error' });
            else setMessage({ text: 'Category created', type: 'success' });
        }

        setIsModalOpen(false);
        fetchData();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'category') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const url = type === 'product' ? await uploadProductImage(formData) : await uploadCategoryBanner(formData);
            if (type === 'product') {
                setEditItem({ ...editItem, image_urls: [...(editItem?.image_urls || []), url] });
            } else {
                setEditItem({ ...editItem, bannerImage: url });
            }
            setMessage({ text: 'Image uploaded', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Upload failed', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');

        let error;
        if (authMode === 'login') {
            const { error: loginError } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
            error = loginError;
        } else {
            const { error: registerError } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
            error = registerError;
            if (!error) {
                alert('Registration successful! You can now log in.');
                setAuthMode('login');
            }
        }

        if (error) setAuthError(error.message);
        setAuthLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (authLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ background: '#fff', padding: '3rem', borderRadius: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '8px' }}>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Admin Console Access</p>
                    </div>

                    {authError && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 }}>{authError}</div>}

                    <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="input-box">
                            <label>Email</label>
                            <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required placeholder="admin@example.com" />
                        </div>
                        <div className="input-box">
                            <label>Password</label>
                            <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required placeholder="••••••••" />
                        </div>

                        <button type="submit" disabled={authLoading} className="btn-black" style={{ padding: '1rem', marginTop: '1rem', height: '50px' }}>
                            {authLoading ? 'PROCESSING...' : (authMode === 'login' ? 'SIGN IN' : 'REGISTER')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>

                <style jsx global>{`
                    .input-box { display: flex; flex-direction: column; gap: 8px; }
                    .input-box label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; }
                    .input-box input { 
                        padding: 14px 18px; border-radius: 12px; border: 1px solid #f1f5f9; background: #f8fafc;
                        outline: none; font-size: 0.9rem; font-weight: 700; transition: all 0.2s;
                    }
                    .input-box input:focus { border-color: #000; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
                    .btn-black { 
                        background: #000; color: #fff; border: none; border-radius: 12px; font-weight: 900;
                        text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; cursor: pointer;
                        display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
                    }
                    .btn-black:hover { opacity: 0.9; }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            {/* Header with Logout */}
            <header style={{
                padding: '1.5rem 4rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LayoutDashboard color="white" size={18} />
                    </div>
                    <h1 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#000', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Admin Console
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginRight: '1rem' }}>
                        <button onClick={handleLogout} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginRight: '12px' }}>
                            <Lock size={12} /> LOGOUT
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            style={{
                                color: activeTab === 'products' ? '#000' : '#94a3b8',
                                background: 'transparent',
                                border: 'none',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                letterSpacing: '0.1em',
                                padding: '0.5rem 1rem',
                                borderBottom: activeTab === 'products' ? '2px solid #000' : 'none'
                            }}
                        >
                            SẢN PHẨM
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            style={{
                                color: activeTab === 'categories' ? '#000' : '#94a3b8',
                                background: 'transparent',
                                border: 'none',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                letterSpacing: '0.1em',
                                padding: '0.5rem 1rem',
                                borderBottom: activeTab === 'categories' ? '2px solid #000' : 'none'
                            }}
                        >
                            DANH MỤC
                        </button>
                    </div>

                    <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>
                    <button onClick={() => window.location.href = '/'} style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                        EXIT
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ padding: '4rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed', top: '2rem', right: '2rem', zIndex: 3000,
                                padding: '1rem 1.5rem', borderRadius: 'full', background: 'black',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '12px',
                                color: 'white'
                            }}
                        >
                            {message!.type === 'success' ? <CheckCircle color="#22c55e" size={18} /> : <AlertCircle color="#ef4444" size={18} />}
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>{message!.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">


                    {activeTab === 'products' && (
                        <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <PageHeader
                                title="Product Catalog"
                                subtitle="Manage catalog products"
                                action={
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => { setModalType('bulk'); setIsModalOpen(true); }} style={{ background: '#f8fafc', border: '1px solid #000', color: '#000', cursor: 'pointer', padding: '0.7rem 1.5rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                            <Upload size={16} /> UPLOAD TỪ THƯ MỤC
                                        </button>
                                        <button onClick={() => { setModalType('product'); setEditItem(null); setIsModalOpen(true); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <Plus size={16} /> THÊM SẢN PHẨM
                                        </button>
                                    </div>
                                }
                            />
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ width: '60px', height: '40px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                                                            {p.image_urls?.[0] && <img src={p.image_urls[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                        </div>
                                                        <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{p.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                                                        <button className="row-btn" onClick={() => { setModalType('product'); setEditItem(p); setIsModalOpen(true); }}><Edit size={14} /></button>
                                                        <button className="row-btn del" onClick={() => handleDelete('products', p.id)}><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'categories' && (
                        <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <PageHeader
                                title="Collections"
                                subtitle="Structure and banners"
                                action={
                                    <button onClick={() => { setModalType('category'); setEditItem(null); setIsModalOpen(true); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <Plus size={16} /> THÊM DANH MỤC
                                    </button>
                                }
                            />
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '80px' }}>Banner</th>
                                            <th>Name</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map(c => (
                                            <tr key={c.id}>
                                                <td>
                                                    <div style={{ width: '60px', height: '35px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden' }}>
                                                        {(c.bannerImage || c.image_url) && <img src={c.bannerImage || c.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 800 }}>{c.name}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                                                        <button className="row-btn" onClick={() => { setModalType('category'); setEditItem(c); setIsModalOpen(true); }}><Edit size={14} /></button>
                                                        <button className="row-btn del" onClick={() => handleDelete('categories', c.id)}><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Modern Modal - tr-salehub style */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 4000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '2rem'
                    }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{
                                position: 'relative', width: '100%', maxWidth: '800px',
                                maxHeight: '90vh', overflowY: 'auto',
                                background: 'white', borderRadius: '3rem', padding: '3rem',
                                boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
                            }}
                            className="no-scrollbar"
                        >
                            <div style={{ marginBottom: '2.5rem' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '4px' }}>
                                    {modalType === 'bulk' ? 'MASS IMPORT' : 'EDIT MODE'}
                                </p>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{modalType === 'bulk' ? 'Upload Folder' : `${editItem ? 'Update' : 'Add'} ${modalType}`}</h2>
                            </div>

                            {modalType === 'bulk' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', color: '#333', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                        <p style={{ fontWeight: 800, color: '#000', marginBottom: '0.5rem', fontSize: '1rem' }}>Hướng dẫn Upload Hàng Loạt:</p>
                                        <ol style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
                                            <li>Tải <b>Thư mục mẫu</b> về máy tính của bạn và giải nén.</li>
                                            <li>Thư mục cấp 1 sẽ trở thành <b>Danh Mục</b>. Hình ảnh nằm trực tiếp trong thư mục này sẽ làm <b>Banner Danh Mục</b>.</li>
                                            <li>Thư mục con nằm bên trong thư mục Danh Mục sẽ trở thành <b>Sản Phẩm</b>.</li>
                                            <li>Toàn bộ hình ảnh nằm trong thư mục Sản Phẩm sẽ là <b>Hình Ảnh Sản Phẩm</b>.</li>
                                            <li>Sau khi đã chép ảnh theo đúng cấu trúc, nhấn nút "TIẾN HÀNH UPLOAD" bên dưới và chọn thư mục gốc tương tự như mẫu.</li>
                                        </ol>
                                        <a href="/Template_Import.zip" download style={{ padding: '0.8rem 1.2rem', background: '#fff', border: '1px solid #000', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', color: '#000', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                            <Download size={14} /> TẢI THƯ MỤC MẪU
                                        </a>
                                    </div>
                                    <label style={{ background: '#000', color: '#fff', cursor: 'pointer', padding: '1.2rem', borderRadius: '12px', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '1rem', textTransform: 'uppercase' }}>
                                        <Upload size={18} /> {uploading ? 'ĐANG XỬ LÝ...' : 'TIẾN HÀNH UPLOAD (CHỌN THƯ MỤC GỐC)'}
                                        {/* @ts-ignore */}
                                        <input type="file" hidden webkitdirectory="" directory="" multiple onChange={handleBulkFolderUpload} disabled={uploading} />
                                    </label>
                                </div>
                            ) : modalType === 'product' ? (
                                <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="input-box">
                                        <label>Product Name</label>
                                        <input name="name" defaultValue={editItem?.name} required placeholder="Enter product name..." />
                                    </div>

                                    <div className="input-box">
                                        <label>Collection</label>
                                        <select name="category_id" defaultValue={editItem?.category_id || categories[0]?.id}>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>


                                    <div className="input-box">
                                        <label>Product Images</label>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                                            {editItem?.image_urls?.map((url: string, i: number) => (
                                                <div key={i} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                                                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button type="button" onClick={() => setEditItem({ ...editItem, image_urls: editItem.image_urls.filter((_: any, idx: number) => idx !== i) })} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={10} /></button>
                                                </div>
                                            ))}
                                            <label className="upload-btn" style={{ width: '60px', height: '60px' }}>
                                                {uploading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Upload size={20} /></motion.div> : <Plus size={24} />}
                                                <input type="file" hidden onChange={(e) => handleFileUpload(e, 'product')} accept="image/*" disabled={uploading} />
                                            </label>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-black" style={{ width: '100%', padding: '1.2rem', marginTop: '1rem' }}><Save size={18} /> SAVE PRODUCT</button>
                                </form>
                            ) : (
                                <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="input-box">
                                        <label>Collection Name</label>
                                        <input name="name" defaultValue={editItem?.name} required />
                                    </div>
                                    <div className="input-box">
                                        <label>Banner Asset</label>
                                        <div style={{ marginTop: '10px' }}>
                                            {editItem?.bannerImage && (
                                                <div style={{ width: '100%', height: '140px', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '12px', border: '1px solid #eee' }}>
                                                    <img src={editItem.bannerImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            )}
                                            <label className="banner-upload">
                                                <Upload size={18} /> {uploading ? 'UPLOADING...' : 'SOURCE ASSET'}
                                                <input type="file" hidden onChange={(e) => handleFileUpload(e, 'category')} accept="image/*" disabled={uploading} />
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-black" style={{ width: '100%', padding: '1.2rem', marginTop: '1rem' }}><Save size={18} /> Update Structure</button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .input-box { display: flex; flex-direction: column; gap: 8px; }
        .input-box label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; }
        .input-box input, .input-box select { 
            padding: 14px 18px; border-radius: 12px; border: 1px solid #f1f5f9; background: #f8fafc;
            outline: none; font-size: 0.9rem; font-weight: 700; transition: all 0.2s;
        }
        .input-box input:focus { border-color: #000; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        
        .btn-black { 
          background: #000; color: #fff; border: none; border-radius: 12px; font-weight: 900;
          text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
        }
        .btn-black:hover { transform: scale(0.98); opacity: 0.9; }

        .row-btn {
          width: 32px; height: 32px; border-radius: 10px; border: 1px solid #f1f5f9; background: #fff;
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;
        }
        .row-btn:hover { background: #000; color: #fff; }
        .row-btn.del:hover { background: #ef4444; color: #fff; border-color: #ef4444;}
        
        .tag { padding: 4px 8px; border-radius: 6px; font-size: 8px; font-weight: 900; text-transform: uppercase; }
        .tag.featured { background: #fef2f2; color: var(--primary); }
        .tag.standard { background: #f1f5f9; color: #64748b; }
        
        .table-container { background: #fff; border-radius: 2rem; border: 1px solid #f1f5f9; overflow: hidden; margin-top: 1rem; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 20px 24px; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #f1f5f9; }
        td { padding: 16px 24px; font-size: 0.85rem; border-bottom: 1px solid #f8fafc; color: #334155; }
        tr:hover td { background: #f8fafc; }
        
        .upload-btn { 
          width: 50px; height: 50px; border-radius: 12px; border: 2px dashed #cbd5e1;
          display: flex; align-items: center; justify-content: center; cursor: pointer; color: #cbd5e1;
        }
        .banner-upload {
          width: 100%; height: 44px; border-radius: 12px; border: 2px dashed #f1f5f9;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; font-size: 10px; font-weight: 900; color: #94a3b8;
        }
      `}</style>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px', border: 'none',
                background: active ? '#000' : 'transparent',
                color: active ? '#fff' : '#64748b',
                fontWeight: active ? 900 : 700,
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'left'
            }}
        >
            {icon}
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
        </button>
    );
}

function PageHeader({ title, subtitle, action }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)', marginBottom: '4px' }}>
                    ADMIN CONSOLE
                </p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#000' }}>{title}</h2>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>{subtitle}</p>
            </div>
            {action}
        </div>
    );
}

function SummaryCard({ label, value, color = '#000' }: any) {
    return (
        <div style={{
            background: '#fff', padding: '2rem', borderRadius: '2rem',
            border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: color }} />
            <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>{label}</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#000', letterSpacing: '-0.02em' }}>{value}</div>
        </div>
    );
}
