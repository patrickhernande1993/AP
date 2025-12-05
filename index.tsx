import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Paperclip, 
  X,
  Menu,
  Receipt
} from 'lucide-react';

// --- Componentes ---

// 1. Sidebar de Navegação
const Sidebar = ({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) => {
  const menuItems = [
    { id: 'parcelas', label: 'Parcelas', icon: <Receipt size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-200 px-6">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <LayoutDashboard /> Gestão Apê
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

// 2. Componente de Modal para Adicionar
const AddExpenseModal = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('pending');
  const [attachment, setAttachment] = useState(null);
  const [isDescManuallyEdited, setIsDescManuallyEdited] = useState(false);
  const fileInputRef = useRef(null);

  // Lógica: Atualizar descrição automaticamente baseada na data
  useEffect(() => {
    if (date && !isDescManuallyEdited) {
      const [year, month] = date.split('-');
      // Nota: o input date retorna YYYY-MM-DD. O mês já vem "correto" (01 a 12)
      setDescription(`Parcela mensal ${month}/${year}`);
    }
  }, [date, isDescManuallyEdited]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      date,
      description,
      amount,
      status,
      attachment
    });
    // Reset form
    setDate('');
    setDescription('');
    setAmount('');
    setStatus('pending');
    setAttachment(null);
    setIsDescManuallyEdited(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Nova Parcela</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data do Boleto</label>
            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              required
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setIsDescManuallyEdited(true);
              }}
              placeholder="Ex: Parcela mensal 01/2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Valor (Opcional mas útil) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${status === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Pendente
              </button>
              <button
                type="button"
                onClick={() => setStatus('paid')}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${status === 'paid' ? 'bg-green-50 border-green-200 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Pago
              </button>
            </div>
          </div>

          {/* Anexo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comprovante</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer flex items-center gap-3 px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Paperclip size={18} className="text-gray-400" />
              <span className="text-sm text-gray-500 truncate">
                {attachment ? 'Comprovante anexado (Clique para alterar)' : 'Anexar imagem (Opcional)'}
              </span>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {attachment && (
              <div className="mt-2 relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                <img src={attachment} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setAttachment(null); }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm mt-2"
          >
            Salvar Parcela
          </button>
        </form>
      </div>
    </div>
  );
};

// 3. Visualizador de Imagem
const ImageViewerModal = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-90 p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={onClose}>
        <X size={32} />
      </button>
      <img src={src} alt="Comprovante" className="max-w-full max-h-full rounded shadow-2xl" onClick={(e) => e.stopPropagation()} />
    </div>
  );
};

// --- App Principal ---
const App = () => {
  const [activeTab, setActiveTab] = useState('parcelas');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('ape_expenses');
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    }
  }, []);

  // Salvar dados no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('ape_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (data) => {
    const newExpense = {
      ...data,
      id: crypto.randomUUID()
    };
    setExpenses(prev => [newExpense, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteExpense = (id) => {
    if (confirm('Tem certeza que deseja excluir esta parcela?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, status: e.status === 'paid' ? 'pending' : 'paid' };
      }
      return e;
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile */}
        <header className="bg-white border-b border-gray-200 md:hidden flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600">
              <Menu />
            </button>
            <span className="font-semibold text-gray-800">Gestão Apê</span>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Parcelas</h2>
                <p className="text-gray-500 text-sm mt-1">Gerencie os pagamentos do apartamento</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Incluir</span>
              </button>
            </div>

            {/* Lista de Parcelas */}
            {expenses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-indigo-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma parcela registrada</h3>
                <p className="text-gray-500 mb-6">Comece adicionando os boletos do seu apartamento.</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Adicionar primeira parcela
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4">Descrição</th>
                        <th className="px-6 py-4">Valor</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Comprovante</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {expenses.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                             {item.amount ? `R$ ${parseFloat(item.amount).toFixed(2)}` : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => toggleStatus(item.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer select-none transition-all ${
                                item.status === 'paid' 
                                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                              }`}
                            >
                              {item.status === 'paid' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                              {item.status === 'paid' ? 'Pago' : 'Pendente'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.attachment ? (
                              <button 
                                onClick={() => setViewingImage(item.attachment)}
                                className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded transition-colors"
                                title="Ver comprovante"
                              >
                                <Paperclip size={18} />
                              </button>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => deleteExpense(item.id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modais */}
      <AddExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={addExpense}
      />
      
      <ImageViewerModal 
        src={viewingImage} 
        onClose={() => setViewingImage(null)} 
      />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);