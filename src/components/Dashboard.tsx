/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Document, CATEGORIES } from '../types';
import { 
  FileText, 
  ArrowLeftRight, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight,
  TrendingUp,
  FolderLock
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  documents: Document[];
  onSelectDoc: (id: string) => void;
  onNavigateTab: (tab: 'list' | 'report') => void;
  onAddDoc: (type: 'incoming' | 'outgoing') => void;
}

export default function Dashboard({ documents, onSelectDoc, onNavigateTab, onAddDoc }: DashboardProps) {
  // Stat calculations
  const total = documents.length;
  const incoming = documents.filter(d => d.type === 'incoming');
  const outgoing = documents.filter(d => d.type === 'outgoing');
  
  const pending = documents.filter(d => d.status === 'pending');
  const processing = documents.filter(d => d.status === 'processing');
  const completed = documents.filter(d => d.status === 'completed');
  
  const critical = documents.filter(d => d.priority === 'critical');
  const urgent = documents.filter(d => d.priority === 'urgent');

  // Chart calculation: Group documents by category
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = documents.filter(d => d.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  // Chart calculation: 7-day activity trend (simulated for visualization)
  const weekdays = ['ຈັນ', 'ອັງຄານ', 'ພຸດ', 'ພະຫັດ', 'ສຸກ', 'ເສົາ', 'ອາທິດ'];
  const dayDocCounts = [3, 2, 5, 4, 6, 1, 2]; // Simulated dynamic data based on weekdays

  const maxDayCount = Math.max(...dayDocCounts, 1);

  // List of recent 4 documents
  const recentDocs = [...documents]
    .sort((a, b) => b.receivedDate.localeCompare(a.receivedDate))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-4">
          <FileText size={240} />
        </div>
        <div className="relative z-10 max-w-4xl">
          <span className="bg-white/20 text-white font-medium text-xs px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-wider">
            ແຜ່ນພະຍາກອນລວມ (Dashboard)
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold mt-3 tracking-tight">
            ລະບົບຕິດຕາມເອກະສານ ຂາເຂົ້າ-ຂາອອກ
          </h1>
          <p className="text-blue-100 mt-2 text-sm md:text-base leading-relaxed">
            ພະແນກສາທາລະນະສຸກ ແຂວງສາລະວັນ. ຕິດຕາມການຮັບ-ສົ່ງເອກະສານທາງການຢ່າງມີປະສິດທິພາບ, 
            ວ່ອງໄວ, ໂປ່ງໃສ ແລະ ສ້າງບົດລາຍງານສະຖິຕິໄດ້ທັນທີ.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              id="dash-add-in-btn"
              onClick={() => onAddDoc('incoming')}
              className="bg-white text-blue-900 hover:bg-blue-50 transition font-bold md:text-sm text-xs px-4 py-2.5 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              ບັນທຶກເອກະສານຂາເຂົ້າ
            </button>
            <button 
              id="dash-add-out-btn"
              onClick={() => onAddDoc('outgoing')}
              className="bg-blue-800/40 hover:bg-blue-800/60 border border-blue-400/30 text-white transition font-bold md:text-sm text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              ສ້າງເອກະສານຂາອອກ
            </button>
          </div>
        </div>
      </div>

      {/* Numerical Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ເອກະສານທັງໝົດ</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{total}</h3>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-slate-600 border border-slate-100">
              <ArrowLeftRight size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs">
            <span className="text-blue-600 font-semibold flex items-center gap-1">
              • ຂາເຂົ້າ: {incoming.length}
            </span>
            <span className="text-indigo-600 font-semibold flex items-center gap-1">
              • ຂາອອກ: {outgoing.length}
            </span>
          </div>
        </div>

        {/* Pending Processing Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ກຳລັງດຳເນີນການ</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{processing.length + pending.length}</h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <span className="text-amber-600 font-semibold flex items-center gap-0.5">
              ລໍຖ້າ: {pending.length}
            </span>
            <span>|</span>
            <span className="text-amber-700 font-semibold">
              ກຳລັງເຮັດ: {processing.length}
            </span>
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ສຳເລັດແລ້ວ</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{completed.length}</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-600">
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold">
              ອັດຕາສຳເລັດ: {total > 0 ? Math.round((completed.length / total) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* urgent documents alert */}
        <div className={`rounded-xl p-5 shadow-sm hover:shadow-md transition border ${critical.length > 0 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ເອກະສານດ່ວນທີ່ສຸດ / ດ່ວນ</p>
              <h3 className={`text-3xl font-bold mt-1 ${critical.length > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-850'}`}>
                {critical.length + urgent.length}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${critical.length > 0 ? 'bg-rose-100/60 text-rose-600 border border-rose-200' : 'bg-red-50 text-rose-500'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-505">
            <span className="text-rose-600 font-bold">ດ່ວນທີ່ສຸດ: {critical.length}</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">ດ່ວນ: {urgent.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual SVG Charts & Recent Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Category Bar Chart - Left 2 Columns */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800">ຈໍານວນເອກະສານ ແຍກຕາມປະເພດ</h4>
              <p className="text-xs text-slate-400">ສະຖິຕິການບັນທຶກເອກະສານຕາມໝວດໝູ່</p>
            </div>
            <button 
              id="dash-view-reports-btn"
              onClick={() => onNavigateTab('report')}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              ເບິ່ງລາຍງານລະອຽດ <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {CATEGORIES.map((cat, i) => {
              const count = categoryCounts[cat] || 0;
              const percentage = (count / maxCategoryCount) * 100;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">{cat}</span>
                    <span className="font-mono text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-155">{count} ສະບັບ</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        i % 3 === 0 ? 'bg-blue-600' : i % 3 === 1 ? 'bg-indigo-600' : 'bg-cyan-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Recent Documents list */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-800">`ທະບຽນເອກະສານຫຼ້າສຸດ`</h4>
              <p className="text-xs text-slate-400">ມີການເຄື່ອນໄຫວໃນມໍ່ໆນີ້</p>
            </div>
            <button 
              id="dash-view-all-docs"
              onClick={() => onNavigateTab('list')}
              className="text-xs text-blue-600 hover:text-blue-705 font-bold cursor-pointer"
            >
              ທັງໝົດ
            </button>
          </div>

          {recentDocs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FolderLock className="mx-auto mb-2 opacity-30 text-slate-400" size={32} />
              <p className="text-xs">ບໍ່ມີຂໍ້ມູນເອກະສານໃນລະບົບ</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentDocs.map((doc) => (
                <div 
                  key={doc.id} 
                  id={`recent-${doc.id}`}
                  onClick={() => onSelectDoc(doc.id)}
                  className="py-3 hover:bg-slate-50 transition px-2 rounded-lg cursor-pointer flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      doc.type === 'incoming' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {doc.type === 'incoming' ? 'ຂາເຂົ້າ' : 'ຂາອອກ'}
                    </span>
                    <span className="font-mono text-slate-400 font-bold">ລົງວັນທີ: {doc.receivedDate}</span>
                  </div>
                  
                  <h5 className="text-xs font-bold text-slate-700 line-clamp-1 leading-snug">
                    {doc.title}
                  </h5>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="line-clamp-1 bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded">
                      ເກັບທີ: {doc.regNo}
                    </span>
                    <span className={`font-bold ${
                      doc.priority === 'critical' ? 'text-rose-500' 
                      : doc.priority === 'urgent' ? 'text-amber-500' 
                      : 'text-slate-400'
                    }`}>
                      {doc.priority === 'critical' ? 'ດ່ວນທີ່ສຸດ' 
                      : doc.priority === 'urgent' ? 'ດ່ວນ' 
                      : 'ປົກກະຕິ'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* SVG Graphics / Process Flow Guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">ຂັ້ນຕອນການເດີນທາງຂອງເອກະສານ (Workflows)</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold font-mono text-xs mx-auto mb-2">1</span>
            <h5 className="text-xs font-semibold text-slate-800">ບັນທຶກ/ອອກເລກ</h5>
            <p className="text-[11px] text-slate-400 mt-1">ລົງທະບຽນໃສ່ລະບົບ ແລະ ອອກເລກທີເອກະສານຢ່າງເປັນທາງການ</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs relative">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold font-mono text-xs mx-auto mb-2">2</span>
            <h5 className="text-xs font-semibold text-slate-800">ມອບໝາຍຂະແໜງ</h5>
            <p className="text-[11px] text-slate-400 mt-1">ຫົວໜ້າພະແນກກວດເຫັນດີ ແລະ ສົ່ງໃຫ້ຂະແໜງການທີ່ຮັບຜິດຊອບ</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold font-mono text-xs mx-auto mb-2">3</span>
            <h5 className="text-xs font-semibold text-slate-800">ກຳລັງຈັດຕັ້ງເອກະສານ</h5>
            <p className="text-[11px] text-slate-400 mt-1">ຂະແໜງການຈັດຕັ້ງປະຕິບັດ, ຮ່າງຄຳຕອບ ແລະ ດຳເນີນການແທ້ຈິງ</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold font-mono text-xs mx-auto mb-2">4</span>
            <h5 className="text-xs font-bold text-slate-850">ສຳເລັດ / ເກັບມ້ຽນ</h5>
            <p className="text-[11px] text-slate-400 mt-1">ບັນລຸໜ້າວຽກຮຽບຮ້ອຍ, ຈັດເກັບເຂົ້າລະບົບຄັງເອກະສານເພື່ອຄົ້ນຫາຄືນ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
