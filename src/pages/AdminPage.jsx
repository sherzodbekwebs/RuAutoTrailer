import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon, Camera, Upload, Check, ChevronDown, ListPlus, LogOut, ExternalLink, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, productsCollection, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, addDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// Custom UI Components
const Switch = ({ enabled, onChange, label }) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`${enabled ? 'bg-indigo-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    >
      <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
    </button>
    {label && <span className="text-[13px] text-gray-500 font-bold">{label}</span>}
  </div>
);

const Input = ({ label, placeholder, value, onChange, type = "text", subLabel }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
    />
    {subLabel && <p className="text-[11px] text-gray-400 font-medium ">{subLabel}</p>}
  </div>
);

const SuccessToast = ({ message, onClose }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="fixed bottom-10 right-10 z-[100] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
  >
    <div className="bg-white/20 p-2 rounded-full">
      <Check size={20} />
    </div>
    <span className="font-bold">{message}</span>
  </motion.div>
);

// Helper function to compress image
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Ensure transparency is supported by using clearRect
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Use image/webp to preserve transparency and support quality compression
        // Fallback to image/png if webp is not supported (though rare now)
        const dataUrl = canvas.toDataURL('image/webp', 0.92);
        resolve(dataUrl);
      };
    };
  });
};

export default function AdminPage({ products, onUpdate, onLogout }) {
  const [editingMode, setEditingMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  
  const initialFormData = {
    category: '',
    brand: '',
    price: '',
    status: true,
    inStock: true,
    sequence: '',
    name: '',
    description: '',
    image: '',
    gallery: [],
    specifications: [
      { id: 'S1', key: '', val: '' },
      { id: 'S2', key: '', val: '' },
    ],
    axleSpecs: [
      { id: 'A1', key: '', val: '' },
      { id: 'A2', key: '', val: '' },
    ],
    characteristicSpecs: [
      { id: 'C1', key: '', val: '' },
      { id: 'C2', key: '', val: '' },
    ],
    equipment: [
      { id: 'E1', key: '', val: '' },
      { id: 'E2', key: '', val: '' },
    ],
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const showSuccess = (msg) => setSuccessMessage(msg);

  const toggleEditing = (id = null) => {
    if (id) {
      const prod = products.find(p => p.id === id);
      setFormData({
        ...initialFormData,
        ...prod,
        name: typeof prod.name === 'object' ? prod.name.ru : (prod.name || ''),
        description: typeof prod.descriptions === 'object' ? prod.descriptions.ru : (prod.description || ''),
        specifications: prod.specifications ? prod.specifications.map((s, idx) => ({
          id: s.id || `S${idx}`,
          key: s.ru?.key || s.key || '',
          val: s.ru?.val || s.val || ''
        })) : [],
        axleSpecs: prod.axleSpecs ? prod.axleSpecs.map((s, idx) => ({
          id: s.id || `A${idx}`,
          key: s.key || '',
          val: s.val || ''
        })) : [],
        characteristicSpecs: prod.characteristicSpecs ? prod.characteristicSpecs.map((s, idx) => ({
          id: s.id || `C${idx}`,
          key: s.key || '',
          val: s.val || ''
        })) : [],
        equipment: prod.equipment ? prod.equipment.map((s, idx) => ({
          id: s.id || `E${idx}`,
          key: s.key || '',
          val: s.val || ''
        })) : [],
      });
      setEditingId(id);
    } else {
      setFormData(initialFormData);
      setEditingId(null);
    }
    setEditingMode(true);
  };

  const handleLogout = async () => {
    onLogout();
  };

  const addSpec = (section) => {
    setFormData({
      ...formData,
      [section]: [...(formData[section] || []), { id: Date.now() + Math.random(), key: '', val: '' }]
    });
  };

  const removeSpec = (section, id) => {
    setFormData({
      ...formData,
      [section]: formData[section].filter(s => s.id !== id)
    });
  };

  const handleSpecChange = (section, id, field, val) => {
    setFormData({
      ...formData,
      [section]: formData[section].map(s => s.id === id ? { ...s, [field]: val } : s)
    });
  };

  const addToGallery = async (file) => {
    if (file) {
      const compressed = await compressImage(file);
      setFormData({
        ...formData,
        gallery: [...(formData.gallery || []), compressed]
      });
    }
  };

  const removeFromGallery = (index) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const productData = { 
      ...formData,
      updatedAt: serverTimestamp(),
      shortSpecs: formData.specifications[0]?.val || ''
    };

    try {
      if (editingId) {
        const productRef = doc(db, 'products', editingId);
        await setDoc(productRef, {
          ...productData,
          updatedAt: serverTimestamp()
        }, { merge: true });
        showSuccess('Данные успешно обновлены');
      } else {
        await addDoc(productsCollection, {
          ...productData,
          createdAt: serverTimestamp()
        });
        showSuccess('Техника успешно добавлена');
      }
      setEditingMode(false);
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, editingId ? `products/${editingId}` : 'products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log('Confirmed delete for product:', id);
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'products', id));
      console.log('Delete successful');
      showSuccess('Техника удалена');
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Delete failed:', error);
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!editingMode) {
    return (
      <div className="py-12 px-6 md:px-10 max-w-7xl mx-auto">
        <AnimatePresence>
          {successMessage && <SuccessToast message={successMessage} />}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">Список техники</h1>
            <p className="text-sm font-medium text-gray-400 mt-1">Управление каталогом продукции</p>
          </div>
          <div className="flex gap-4">
            <a 
                href="/"
                className="bg-white text-gray-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all border border-gray-200"
            >
                <ExternalLink size={18} />
                <span className="hidden md:inline">На сайт</span>
            </a>
            <button 
                onClick={handleLogout}
                className="bg-gray-100 text-gray-500 p-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all border border-gray-200"
                title="Log Out"
            >
                <LogOut size={20} />
            </button>
            <button 
                onClick={() => toggleEditing()}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
                <Plus size={20} />
                Добавить новую технику
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-6 hover:shadow-md transition-all group">
              <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center p-1 border border-gray-100/50">
                <img src={product.image} className="w-full h-full object-contain" alt={product.name} />
              </div>
              <div className="flex-grow">
                <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                    {product.name}
                </h3>
                <div className="flex gap-4 mt-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.category || 'Без категории'}</span>
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{product.price}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEditing(product.id);
                  }} 
                  className="p-3 text-gray-400 hover:text-indigo-600 bg-gray-50 rounded-xl transition-all"
                  title="Редактировать"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteId(product.id);
                  }} 
                  className="p-3 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl transition-all"
                  title="Удалить"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400 font-medium">Каталог пока пуст. Добавьте первую технику.</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {confirmDeleteId && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 pb-20">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmDeleteId(null)}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl relative w-full max-w-md text-center"
              >
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Удалить технику?</h3>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                  Вы уверены, что хотите удалить эту технику из каталога? Это действие нельзя будет отменить.
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleDelete(confirmDeleteId)}
                    disabled={isLoading}
                    className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-all shadow-xl shadow-red-100 disabled:opacity-50"
                  >
                    {isLoading ? 'Удаление...' : 'Да, удалить'}
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(null)}
                    disabled={isLoading}
                    className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all"
                  >
                    Отмена
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        
        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Top Form Card */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    
                    {/* Left Side: Photo & Preview */}
                    <div className="space-y-6">
                        <div className="relative group aspect-video bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center">
                            {formData.image ? (
                                <img 
                                    src={formData.image} 
                                    className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105" 
                                    alt="Preview" 
                                />
                            ) : (
                                <div className="text-center">
                                    <Camera className="mx-auto text-gray-300 mb-2" size={32} />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Нет фото</p>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white backdrop-blur-[2px]">
                                <Upload size={24} className="mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Загрузить фото</span>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const compressed = await compressImage(file);
                                            setFormData({ ...formData, image: compressed });
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Основная фотография</label>
                          <div className="flex gap-2">
                             <label className="flex-grow flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl py-3 px-4 text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-indigo-100 transition-all shadow-sm">
                                <Upload size={16} />
                                Выбрать файл
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const compressed = await compressImage(file);
                                            setFormData({ ...formData, image: compressed });
                                        }
                                    }}
                                />
                             </label>
                             {formData.image && (
                               <button 
                                 type="button"
                                 onClick={() => setFormData({...formData, image: ''})}
                                 className="bg-red-50 text-red-500 p-3 rounded-xl border border-red-100 hover:bg-red-100 transition-all"
                                 title="Удалить фото"
                               >
                                 <X size={18} />
                               </button>
                             )}
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium text-center">Рекомендуется: PNG/JPG до 1MB</p>
                        </div>
                    </div>

                    {/* Middle: Inputs */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input 
                                label="Категория" 
                                placeholder="Например: Полуприцепы"
                                value={formData.category} 
                                onChange={v => setFormData({...formData, category: v})} 
                            />
                            <Input 
                                label="Бренд" 
                                placeholder="Например: UzAutoTrailer"
                                value={formData.brand} 
                                onChange={v => setFormData({...formData, brand: v})} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input 
                                label="Ссылка на баннер (URL)" 
                                placeholder="https://..."
                                value={formData.banner} 
                                onChange={v => setFormData({...formData, banner: v})} 
                            />
                            <Input 
                                label="Последовательность" 
                                placeholder="1" 
                                value={formData.sequence} 
                                onChange={v => setFormData({...formData, sequence: v})} 
                                subLabel="Приоритет в списке (1 - самый высокий)" 
                            />
                        </div>
                    </div>

                    {/* Right: Price & Toggles */}
                    <div className="flex flex-col justify-between py-2">
                        <div className="space-y-1">
                            <input 
                                className="w-full text-indigo-500 text-2xl font-black outline-none border-b border-indigo-200 focus:border-indigo-500 pb-1"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                placeholder="364 000 000"
                            />
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Цена (сум)</label>
                        </div>
                        
                        <div className="space-y-8 mt-12">
                            <Switch enabled={formData.status} onChange={v => setFormData({...formData, status: v})} label="Активен" />
                            <Switch enabled={formData.inStock} onChange={v => setFormData({...formData, inStock: v})} label="В наличии" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Specifications Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Technical Characteristics (Weight) */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                        Технические характеристики
                    </h2>
                    <div className="space-y-4">
                        {formData.specifications.map((spec, index) => (
                            <div key={spec.id} className="flex items-center gap-3">
                                <div className="flex-grow grid grid-cols-1 gap-2">
                                    <input 
                                        className="bg-gray-50/50 border border-gray-100 rounded-lg p-2 text-xs focus:bg-white transition-all outline-none"
                                        value={spec.key}
                                        onChange={e => handleSpecChange('specifications', spec.id, 'key', e.target.value)}
                                        placeholder="Название"
                                    />
                                    <input 
                                        className="bg-gray-50/50 border border-gray-100 rounded-lg p-2 text-xs font-bold outline-none"
                                        value={spec.val}
                                        onChange={e => handleSpecChange('specifications', spec.id, 'val', e.target.value)}
                                        placeholder="Значение"
                                    />
                                </div>
                                <button type="button" onClick={() => removeSpec('specifications', spec.id)} className="text-red-400 hover:text-red-600 p-1"><Trash size={16} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addSpec('specifications')} className="w-full py-2 border-2 border-dashed border-gray-100 rounded-lg text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all text-xs font-bold uppercase tracking-widest">+ Добавить поле</button>
                    </div>
                </div>

                {/* 2. Axles (Osit) */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                        Оси
                    </h2>
                    <div className="space-y-4">
                        {(formData.axleSpecs || []).map((spec, index) => (
                            <div key={spec.id} className="flex items-center gap-3">
                                <div className="flex-grow grid grid-cols-1 gap-2">
                                    <input 
                                        className="bg-gray-50/50 border border-gray-100 rounded-lg p-2 text-xs focus:bg-white transition-all outline-none"
                                        value={spec.key}
                                        onChange={e => handleSpecChange('axleSpecs', spec.id, 'key', e.target.value)}
                                        placeholder="Название"
                                    />
                                    <input 
                                        className="bg-gray-50/50 border border-gray-100 rounded-lg p-2 text-xs font-bold outline-none"
                                        value={spec.val}
                                        onChange={e => handleSpecChange('axleSpecs', spec.id, 'val', e.target.value)}
                                        placeholder="Значение"
                                    />
                                </div>
                                <button type="button" onClick={() => removeSpec('axleSpecs', spec.id)} className="text-red-400 hover:text-red-600 p-1"><Trash size={16} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addSpec('axleSpecs')} className="w-full py-2 border-2 border-dashed border-gray-100 rounded-lg text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all text-xs font-bold uppercase tracking-widest">+ Добавить поле</button>
                    </div>
                </div>

                {/* 3. Characteristics */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                        Характеристики
                    </h2>
                    <div className="space-y-4">
                        {(formData.characteristicSpecs || []).map((spec, index) => (
                            <div key={spec.id} className="flex items-center gap-3">
                                <div className="flex-grow grid grid-cols-1 gap-2">
                                    <input 
                                        className="bg-gray-50/50 border border-gray-100 rounded-lg p-2 text-xs focus:bg-white transition-all outline-none"
                                        value={spec.key}
                                        onChange={e => handleSpecChange('characteristicSpecs', spec.id, 'key', e.target.value)}
                                        placeholder="Название"
                                    />
                                    <input 
                                        className="bg-gray-50/50 border border-gray-100 rounded-lg p-2 text-xs font-bold outline-none"
                                        value={spec.val}
                                        onChange={e => handleSpecChange('characteristicSpecs', spec.id, 'val', e.target.value)}
                                        placeholder="Значение"
                                    />
                                </div>
                                <button type="button" onClick={() => removeSpec('characteristicSpecs', spec.id)} className="text-red-400 hover:text-red-600 p-1"><Trash size={16} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addSpec('characteristicSpecs')} className="w-full py-2 border-2 border-dashed border-gray-100 rounded-lg text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all text-xs font-bold uppercase tracking-widest">+ Добавить поле</button>
                    </div>
                </div>

                {/* 4. Equipment (Komplektatsiya) */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                        Комплектация
                    </h2>
                    <div className="space-y-4">
                        {(formData.equipment || []).map((spec, index) => (
                            <div key={spec.id} className="flex items-center gap-3">
                                <div className="flex-grow grid grid-cols-1 gap-2">
                                    <input 
                                        className="bg-gray-50/50 border border-gray-100 rounded-lg p-2 text-xs focus:bg-white transition-all outline-none"
                                        value={spec.key}
                                        onChange={e => handleSpecChange('equipment', spec.id, 'key', e.target.value)}
                                        placeholder="Название"
                                    />
                                    <input 
                                        className="bg-gray-50/50 border border-gray-100 rounded-lg p-2 text-xs font-bold outline-none"
                                        value={spec.val}
                                        onChange={e => handleSpecChange('equipment', spec.id, 'val', e.target.value)}
                                        placeholder="Значение"
                                    />
                                </div>
                                <button type="button" onClick={() => removeSpec('equipment', spec.id)} className="text-red-400 hover:text-red-600 p-1"><Trash size={16} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addSpec('equipment')} className="w-full py-2 border-2 border-dashed border-gray-100 rounded-lg text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all text-xs font-bold uppercase tracking-widest">+ Добавить поле</button>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tight flex items-center gap-3">
                    <ImageIcon size={24} className="text-indigo-500" />
                    Галерея изображений
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {formData.gallery?.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                            <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                            <button 
                                type="button"
                                onClick={() => removeFromGallery(idx)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 hover:border-indigo-300 transition-all group">
                        <Plus size={24} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-indigo-500">Добавить</span>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => addToGallery(e.target.files[0])}
                        />
                    </label>
                </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 min-h-[400px]">
                <div className="flex flex-col gap-8">
                    <div className="space-y-1">
                        <p className="text-[13px] text-gray-400 font-bold mb-4 uppercase tracking-widest">Основная информация</p>
                        <input 
                            className="w-full border border-gray-100 rounded-2xl p-6 text-gray-900 font-black text-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                            placeholder="Название автомобиля/техники..."
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-inner">
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center">
                            <span className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Редактор описания</span>
                        </div>
                        <textarea 
                            className="w-full p-8 min-h-[400px] outline-none text-gray-600 text-[16px] leading-relaxed resize-none bg-white"
                            placeholder="Подробное описание..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center gap-4">
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#34D399] text-white px-16 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#10B981] transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
                >
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button 
                    type="button"
                    onClick={() => setEditingMode(false)}
                    className="bg-white text-gray-400 px-16 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-50 transition-all border border-gray-100"
                >
                    Отменить
                </button>
            </div>

        </form>
      </div>
    </div>
  );
}
