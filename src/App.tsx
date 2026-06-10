/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Document, DocType, DocStatus } from './types';
import { INITIAL_DOCUMENTS, LOGGED_IN_USER, USER_ROLE } from './data';
import Dashboard from './components/Dashboard';
import DocumentList from './components/DocumentList';
import DocumentDetails from './components/DocumentDetails';
import DocumentForm from './components/DocumentForm';
import ReportGenerator from './components/ReportGenerator';
import { 
  HeartPulse, 
  LayoutDashboard, 
  FileSearch, 
  Printer, 
  Plus, 
  HelpCircle,
  Bell,
  Menu,
  X,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Persistence state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'report'>('dashboard');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isCreatingType, setIsCreatingType] = useState<DocType | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  
  // Responsive sidebar toggles
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notification system
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'info' }[]>([]);

  // Initialize and load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('lao_health_docs');
    if (saved) {
      try {
        setDocuments(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse saved data, loading seed...', err);
        setDocuments(INITIAL_DOCUMENTS);
      }
    } else {
      setDocuments(INITIAL_DOCUMENTS);
      localStorage.setItem('lao_health_docs', JSON.stringify(INITIAL_DOCUMENTS));
    }
  }, []);

  // Sync to local storage on edits
  const saveAndSyncDocs = (newDocs: Document[]) => {
    setDocuments(newDocs);
    localStorage.setItem('lao_health_docs', JSON.stringify(newDocs));
  };

  // Toast notification helper
  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Add new document
  const handleCreateDocSave = (newDoc: Document) => {
    const updated = [...documents, newDoc];
    saveAndSyncDocs(updated);
    setIsCreatingType(null);
    triggerToast(`ບັນທຶກເອກະສານເລກທີ ${newDoc.regNo} ສຳເລັດແລ້ວ!`);
    // Auto-navigate to lists/details
    setSelectedDocId(newDoc.id);
  };

  // Update existing document properties (logs or fields)
  const handleUpdateDoc = (updatedDoc: Document) => {
    const updated = documents.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc);
    saveAndSyncDocs(updated);
    // Find if status was updated
    const oldDoc = documents.find(d => d.id === updatedDoc.id);
    if (oldDoc && oldDoc.status !== updatedDoc.status) {
      triggerToast(`ອັບເດດສະຖານະເອກະສານ ສຳເລັດ!`);
    } else {
      triggerToast('ບັນທຶກການອັບເດດຮຽບຮ້ອຍ');
    }
  };

  // Delete document
  const handleDeleteDoc = (id: string) => {
    const updated = documents.filter(doc => doc.id !== id);
    saveAndSyncDocs(updated);
    setSelectedDocId(null);
    triggerToast('ລຶບເອກະສານອອກຈາກຖານຂໍ້ມູນແລ້ວ', 'info');
  };

  // Find currently active document representation
  const activeDocument = documents.find(d => d.id === selectedDocId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row text-slate-800">
      
      {/* Toast Notification Container Wrapper */}
      <div className="fixed bottom-5 right-5 space-y-2 z-50 pointer-events-none no-print">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`p-4 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 ${
                t.type === 'success' 
                  ? 'bg-slate-900 border-blue-500/30 text-white' 
                  : 'bg-slate-900 border-slate-700 text-slate-100'
              }`}
            >
              <CheckCircle2 size={16} className={t.type === 'success' ? 'text-blue-400' : 'text-slate-400'} />
              <span>{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Persistent Beautiful Lao Ministry Side bar Navigation - Screen Left */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 no-print">
        
        {/* Brand logo & Ministry Details */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Custom vector medical SVG representational logo */}
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <HeartPulse size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide leading-tight">ລະບົບເອກະສານ ສກ</h1>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold font-mono block">Sekong Heath EDMS</span>
            </div>
          </div>
          
          {/* Mobile responsive toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* User Identity Banner */}
        <div className="px-5 py-3.5 bg-slate-850/60 flex items-center gap-2.5 border-b border-slate-800/40 text-xs">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 font-bold text-white flex items-center justify-center">
            ສວ
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-200 line-clamp-1">{LOGGED_IN_USER}</h4>
            <p className="text-[10px] text-slate-500 truncate">{USER_ROLE}</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className={`flex-1 p-4 space-y-1.5 md:block ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <button 
            id="nav-dash"
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedDocId(null);
              setIsCreatingType(null);
              setEditingDoc(null);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-xs font-bold py-3 px-3.5 rounded-lg transition flex items-center gap-3 cursor-pointer border-l-2 ${
              activeTab === 'dashboard' && !selectedDocId && !isCreatingType && !editingDoc
                ? 'bg-blue-600/10 border-blue-500 text-white' 
                : 'border-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>ແຜ່ນພະຍາກອນລວມ (Dashboard)</span>
          </button>

          <button 
            id="nav-list"
            onClick={() => {
              setActiveTab('list');
              setSelectedDocId(null);
              setIsCreatingType(null);
              setEditingDoc(null);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-xs font-bold py-3 px-3.5 rounded-lg transition flex items-center gap-3 cursor-pointer border-l-2 ${
              activeTab === 'list' && !selectedDocId && !isCreatingType && !editingDoc
                ? 'bg-blue-600/10 border-blue-500 text-white' 
                : 'border-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSearch size={16} />
            <span>ຄົ້ນຫາ & ຈັດການເອກະສານ</span>
          </button>

          <button 
            id="nav-report"
            onClick={() => {
              setActiveTab('report');
              setSelectedDocId(null);
              setIsCreatingType(null);
              setEditingDoc(null);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-xs font-bold py-3 px-3.5 rounded-lg transition flex items-center gap-3 cursor-pointer border-l-2 ${
              activeTab === 'report' && !selectedDocId && !isCreatingType && !editingDoc
                ? 'bg-blue-600/10 border-blue-500 text-white' 
                : 'border-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer size={16} />
            <span>ສ້າງບົດລາຍງານ (Reports)</span>
          </button>

          {/* Quick Creation Area */}
          <div className="pt-6 border-t border-slate-800/60 mt-6 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3">ທາງລັດບັນທຶກ (Quick Access)</h4>
            <div className="space-y-1">
              <button 
                id="nav-create-in"
                onClick={() => {
                  setIsCreatingType('incoming');
                  setSelectedDocId(null);
                  setEditingDoc(null);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-[11px] hover:bg-slate-800/30 text-blue-400 font-bold py-2 px-3 rounded-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} />
                <span>ລົງທະບຽນຂາເຂົ້າ</span>
              </button>
              <button 
                id="nav-create-out"
                onClick={() => {
                  setIsCreatingType('outgoing');
                  setSelectedDocId(null);
                  setEditingDoc(null);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-[11px] hover:bg-slate-800/30 text-indigo-400 font-bold py-2 px-3 rounded-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} />
                <span>ລົງທະບຽນຂາອອກ</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer/Credit Block of sidebar */}
        <div className="p-4 border-t border-slate-800/40 text-[10px] text-slate-500/80 space-y-1 mt-auto hidden md:block">
          <p className="flex items-center gap-1">
            <Lock size={10} className="text-blue-500" />
            <span>ເຊື່ອມຕໍ່ຂໍ້ມູນປອດໄພ</span>
          </p>
          <p>© ພະແນກສາທາລະນະສຸກ ແຂວງສາລະວັນ</p>
        </div>

      </aside>

      {/* Main Panel Content Area - Screen Right */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
        
        {/* Top bar header */}
        <header className="bg-white border-b border-slate-200/60 h-16 px-6 shrink-0 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
              {activeTab === 'dashboard' ? 'ແຜ່ນພະຍາກອນລວມ' : activeTab === 'list' ? 'ຄັງເອກະສານ' : 'ລາຍງານສະຖິຕິ'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-medium text-slate-400 hidden sm:inline">
              ວັນທີ: {new Date().toISOString().substring(0, 10)}
            </span>
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:inline"></div>
            <button className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer relative">
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Content Body Space */}
        <div className="p-6 max-w-7xl w-full mx-auto flex-1">
          <AnimatePresence mode="wait">
            
            {/* 1. If currently in Document Edit Mode */}
            {editingDoc ? (
              <motion.div 
                key="doc-form-edit-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="no-print"
              >
                <DocumentForm 
                  type={editingDoc.type}
                  documentToEdit={editingDoc}
                  existingDocuments={documents}
                  onCancel={() => setEditingDoc(null)}
                  onSave={(updatedDoc) => {
                    handleUpdateDoc(updatedDoc);
                    setEditingDoc(null);
                  }}
                />
              </motion.div>
            )
            
            // 2. If currently in Document creation mode
            : isCreatingType ? (
              <motion.div 
                key="doc-form-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="no-print"
              >
                <DocumentForm 
                  type={isCreatingType}
                  existingDocuments={documents}
                  onCancel={() => setIsCreatingType(null)}
                  onSave={handleCreateDocSave}
                />
              </motion.div>
            ) 
            
            // 3. If viewing a specific Doc's details
            : selectedDocId && activeDocument ? (
              <motion.div 
                key="doc-detail-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <DocumentDetails 
                  document={activeDocument}
                  onBack={() => setSelectedDocId(null)}
                  onUpdateDoc={handleUpdateDoc}
                  onDeleteDoc={handleDeleteDoc}
                  onEditDoc={(doc) => setEditingDoc(doc)}
                />
              </motion.div>
            )
            
            // 3. Tab: Landing Dashboard
            : activeTab === 'dashboard' ? (
              <motion.div 
                key="dashboard-tab-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Dashboard 
                  documents={documents}
                  onSelectDoc={(id) => setSelectedDocId(id)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onAddDoc={(type) => setIsCreatingType(type)}
                />
              </motion.div>
            )
            
            // 4. Tab: Main searchable database table
            : activeTab === 'list' ? (
              <motion.div 
                key="list-tab-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <DocumentList 
                  documents={documents}
                  onSelectDoc={(id) => setSelectedDocId(id)}
                  onAddDoc={(type) => setIsCreatingType(type)}
                />
              </motion.div>
            )
            
            // 5. Tab: Reports & Analytics
            : (
              <motion.div 
                key="report-tab-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <ReportGenerator documents={documents} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
