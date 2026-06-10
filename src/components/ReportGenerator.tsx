/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { Document, CATEGORIES } from '../types';
import { 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  TrendingUp, 
  Filter, 
  Sliders, 
  ArrowRight, 
  Globe, 
  Award,
  BookOpen
} from 'lucide-react';
import { LOGGED_IN_USER, USER_ROLE } from '../data';

interface ReportGeneratorProps {
  documents: Document[];
}

export default function ReportGenerator({ documents }: ReportGeneratorProps) {
  const [startDate, setStartDate] = useState(() => {
    // Default to start of current month
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().substring(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    // Default to today
    return new Date().toISOString().substring(0, 10);
  });
  const [docType, setDocType] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [isOpenPrintPreview, setIsOpenPrintPreview] = useState(false);

  // Filter application
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      // 1. Direction Type
      if (docType !== 'all' && doc.type !== docType) return false;

      // 2. Date ranges
      if (startDate && doc.receivedDate < startDate) return false;
      if (endDate && doc.receivedDate > endDate) return false;

      return true;
    });
  }, [documents, startDate, endDate, docType]);

  // Statistical calculations
  const stats = useMemo(() => {
    const total = filteredDocs.length;
    const incoming = filteredDocs.filter(d => d.type === 'incoming').length;
    const outgoing = filteredDocs.filter(d => d.type === 'outgoing').length;
    const pending = filteredDocs.filter(d => d.status === 'pending').length;
    const processing = filteredDocs.filter(d => d.status === 'processing').length;
    const completed = filteredDocs.filter(d => d.status === 'completed').length;
    const critical = filteredDocs.filter(d => d.priority === 'critical').length;
    const urgent = filteredDocs.filter(d => d.priority === 'urgent').length;

    // Grouping counts by category
    const categoryCounts: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
      categoryCounts[cat] = filteredDocs.filter(d => d.category === cat).length;
    });

    return {
      total,
      incoming,
      outgoing,
      pending,
      processing,
      completed,
      critical,
      urgent,
      categoryCounts
    };
  }, [filteredDocs]);

  // Command to initiate browser native printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Configuration Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 no-print">
        <div>
          <h2 className="text-base font-bold text-slate-800">ສ້າງບົດລາຍງານ ແລະ ສະຖິຕິ</h2>
          <p className="text-xs text-slate-400">ກຳນົດເງື່ອນໄຂ ຂອບເຂດວັນທີເພື່ອສັງລວມບົດລາຍງານທີ່ເປັນທາງການ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          
          {/* Start Date */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-500">ເລີ່ມຕົ້ນວັນທີ:</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2 text-slate-400" size={14} />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs pl-8 pr-2 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg bg-white text-slate-705"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-500">ສິ້ນສຸດວັນທີ:</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2 text-slate-400" size={14} />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs pl-8 pr-2 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg bg-white text-slate-705"
              />
            </div>
          </div>

          {/* Direction Type option */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-500">ທິດທາງເອກະສານ:</label>
            <select 
              value={docType}
              onChange={(e) => setDocType(e.target.value as 'all' | 'incoming' | 'outgoing')}
              className="w-full text-xs p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg bg-white text-slate-700 font-semibold"
            >
              <option value="all">ທັງໝົດ (ຂາເຂົ້າ ແລະ ຂາອອກ)</option>
              <option value="incoming">ຂາເຂົ້າ ເທົ່ານັ້ນ</option>
              <option value="outgoing">ຂາອອກ ເທົ່ານັ້ນ</option>
            </select>
          </div>

          {/* Action button */}
          <div className="flex items-end">
            <button 
              id="report-preview-btn"
              onClick={() => setIsOpenPrintPreview(true)}
              disabled={filteredDocs.length === 0}
              className="w-full text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm animate-pulse-once"
            >
              <Printer size={15} />
              <span>ສະແດງຟອມພິມລາຍງານ</span>
            </button>
          </div>

        </div>
      </div>

      {/* Visual Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        
        {/* Statistics Pie-List Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">ສັງລວມເອກະສານ</h4>
            <p className="text-[10px] text-slate-400">ອັດຕາສ່ວນການຈັດການຕາມສະຖານະ</p>
          </div>

          <div className="relative flex items-center justify-center p-4">
            {/* Visual Mini Styled SVG Donut chart representation */}
            <svg viewBox="0 0 36 36" className="w-32 h-32">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              {stats.total > 0 && (
                <>
                  {/* Completed Sector */}
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="15.915" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3.2" 
                    strokeDasharray={`${(stats.completed / stats.total) * 100} ${100 - (stats.completed / stats.total) * 100}`} 
                    strokeDashoffset="25" 
                  />
                  {/* Processing Sector */}
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="15.915" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3.2" 
                    strokeDasharray={`${(stats.processing / stats.total) * 100} ${100 - (stats.processing / stats.total) * 100}`} 
                    strokeDashoffset={25 - ((stats.completed / stats.total) * 100)} 
                  />
                </>
              )}
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-800">{stats.total}</span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">ສະບັບທັງໝົດ</span>
            </div>
          </div>

          {/* Legend list */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-50 font-medium">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>ສຳເລັດ ({stats.completed})</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>ກຳລັງເຮັດ ({stats.processing})</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>ລໍຖ້າປະຕິບັດ ({stats.pending})</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-600 col-span-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>ເອກະສານດ່ວນທີ່ສຸດ ({stats.critical})</span>
            </div>
          </div>
        </div>

        {/* Categories statistics table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm md:col-span-2 flex flex-col gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">ຈໍານວນປະເພດເອກະສານທາງການ</h4>
            <p className="text-[10px] text-slate-400">ຈັດລຽງຕາມປະເພດເອກະສານໃນຂອບເຂດວັນທີທີ່ເລືອກ</p>
          </div>

          <div className="flex-1 overflow-auto max-h-[220px] text-xs">
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between font-bold text-slate-500 text-[11px] pb-2">
                <span>ປະເພດເອກະສານ</span>
                <span>ຈຳນວນສະບັບ</span>
                <span>ເປີເຊັນສ່ວນແບ່ງ</span>
              </div>
              
              {CATEGORIES.map((cat, idx) => {
                const count = stats.categoryCounts[cat] || 0;
                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={idx} className="flex justify-between items-center py-2 text-slate-700">
                    <span className="font-semibold text-slate-800">{cat}</span>
                    <span className="font-mono font-medium">{count} ສະບັບ</span>
                    <span className="font-mono text-slate-400">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Filtered Records Table List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet size={15} className="text-blue-600" />
            <span>ລາຍການເອກະສານໃນໄລຍะນີ້ ({filteredDocs.length})</span>
          </h4>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-xs">ບໍ່ມີຂໍ້ມູນເອກະສານໃນຊ່ວງໄລຍະເວລານີ້</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="py-2.5 px-4">ເລກທະບຽນ</th>
                  <th className="py-2.5 px-4">ເລກເອກະສານ</th>
                  <th className="py-2.5 px-4">ຫົວຂໍ້ເອກະສານ</th>
                  <th className="py-2.5 px-4">ປະເພດ / ທິດທາງ</th>
                  <th className="py-2.5 px-4">ຜູ້ມອບໝາຍ</th>
                  <th className="py-2.5 px-4 text-right">ວັນທີບັນທຶກ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/40 transition">
                    <td className="py-2.5 px-4 font-mono font-semibold text-slate-800">{doc.regNo}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{doc.docNo}</td>
                    <td className="py-2.5 px-4 font-normal line-clamp-1 max-w-sm">{doc.title}</td>
                    <td className="py-2.5 px-4 font-medium">
                      <span className={`inline-block mr-1 text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        doc.type === 'incoming' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {doc.type === 'incoming' ? 'ຂາເຂົ້າ' : 'ຂາອອກ'}
                      </span>
                      {doc.category}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 text-[11px] font-medium">{doc.assignedTo || 'ບໍ່ມີ'}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-500">{doc.receivedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official printable report preview view modal */}
      {isOpenPrintPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 overflow-y-auto flex items-start justify-center p-4 pt-10">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Control Panel */}
            <div className="bg-slate-800 text-white px-6 py-3.5 flex justify-between items-center no-print">
              <span className="text-xs font-bold tracking-wide flex items-center gap-1.5 text-slate-205">
                <Award className="text-amber-400" size={16} /> ພິມລາຍງານສະຖິຕິທາງການ
              </span>
              <div className="flex gap-2">
                <button 
                  id="print-trigger-btn"
                  onClick={handlePrint}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow-xs"
                >
                  <Printer size={13} /> ພິມເອກະສານ / PDF
                </button>
                <button 
                  onClick={() => setIsOpenPrintPreview(false)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1.5 px-3 rounded-lg transition cursor-pointer"
                >
                  ປິດໜ້າຕ່າງ
                </button>
              </div>
            </div>

            {/* Official Lao Government Document Print Format Layout area */}
            <div className="p-12 text-slate-800 bg-white font-sans max-w-4xl mx-auto print-card space-y-8" style={{ minHeight: '297mm' }}>
              
              {/* Lao Standard Official Heading Header block */}
              <div className="text-center space-y-1 relative">
                <h2 className="text-sm font-bold tracking-wider">ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ</h2>
                <h3 className="text-xs font-bold tracking-widest">ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນາຖາວອນ</h3>
                <div className="w-52 h-0.5 border-b border-double border-slate-450 mx-auto mt-1 lg:w-72"></div>
              </div>

              {/* Ministry and Left Info columns */}
              <div className="flex justify-between items-start text-xs pt-3 leading-relaxed">
                <div className="space-y-1">
                  <h4 className="font-bold">ກະຊວງສາທາລະນະສຸກ</h4>
                  <p className="font-bold">ພະແນກສາທາລະນະສຸກ ແຂວງ ສາລະວັນ</p>
                  <p className="font-mono text-[10px] text-slate-500">ລະບົບ: EDMS HEALTH TRACKING v2.0</p>
                </div>
                
                <div className="text-right space-y-1 font-mono text-[11px] text-slate-700">
                  <p>ເລກທີ: 091 /ສທຂ.ສວ</p>
                  <p>ສາລະວັນ, ວັນທີ: {new Date().toISOString().substring(0, 10)}</p>
                </div>
              </div>

              {/* Title of the Report */}
              <div className="text-center space-y-2 pt-6">
                <h1 className="text-sm sm:text-base font-bold text-slate-900">
                  ບົດລາຍງານສະຖິຕິເອກະສານຂາເຂົ້າ-ຂາອອກ ຂອງພະແນກສາທາລະນະສຸກ
                </h1>
                <p className="text-xs font-medium text-slate-600">
                  ປະຈຳໄລຍະເວລາ: ແຕ່ວັນທີ <span className="font-mono font-semibold">{startDate}</span> ເຖິງວັນທີ <span className="font-mono font-semibold">{endDate}</span>
                </p>
              </div>

              {/* Written Summary Statement paragraph */}
              <div className="text-xs leading-relaxed text-justify indent-8 text-slate-800 pt-4 space-y-2 font-normal">
                <p>
                  ອີງຕາມການບັນທຶກ ແລະ ຕິດຕາມຄວາມກ້າວໜ້າຂອງເອກະສານທາງການ ຜ່ານລະບົບຄັງເອກະສານເອເລັກໂຕຣນິກ (EDMS) ຂອງພະແນກສາທາລະນະສຸກ ແຂວງ ສາລະວັນ. 
                  ໃນໄລຍະວັນທີ <span className="font-bold">{startDate}</span> ຫາ <span className="font-bold">{endDate}</span>, ພະແນກສາທາລະນະສຸກ ໄດ້ຮັບ ແລະ ຈັດສ້າງໜັງສືທາງການທັງໝົດຈຳນວນ 
                  <span className="font-bold text-slate-950 font-mono"> {stats.total} </span> ສະບັບ.
                </p>
                <p>
                  ໃນນັ້ນ, ມີເອກະສານຂາເຂົ້າທັງໝົດ <span className="font-bold font-mono">{stats.incoming}</span> ສະບັບ ແລະ ເອກະສານຂາອອກທີ່ໄດ້ຈັດສ້າງ ແລະ ສົ່ງທາງການທັງໝົດ 
                  <span className="font-bold font-mono"> {stats.outgoing}</span> ສະບັບ, ເອກະສານທັງໝົດຖືກຈັດຕັ້ງປະຕິບັດ ແລະ ມີອັດຕາການດຳເນີນງານສຳເລັດແລ້ວຄິດເປັນ 
                  <span className="font-bold font-mono"> {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span> ຂອງເອກະສານທັງໝົດໃນລະບົບ. 
                  ລາຍລະອຽດແຕ່ລະໜວດໝູ່ມີສະຫຼຸບດັ່ງລຸ່ມນີ້:
                </p>
              </div>

              {/* Print Stats Table breakdown */}
              <div className="space-y-3 pt-4">
                <h3 className="text-xs font-bold text-slate-900">• ສະຖິຕິລາຍການແຍກຕາມປະເພດ ແລະ ໝວດໝູ່ເອກະສານ</h3>
                
                <table className="w-full text-xs text-left border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                      <th className="p-2 border-r border-slate-300">ລຳດັບ</th>
                      <th className="p-2 border-r border-slate-300">ປະເພດເອກະສານທາງການ</th>
                      <th className="p-2 border-r border-slate-300 text-center">ຈຳນວນສະບັບ</th>
                      <th className="p-2 text-center">ເປີເຊັນສ່ວນແບ່ງ (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 font-normal">
                    {CATEGORIES.map((cat, idx) => {
                      const count = stats.categoryCounts[cat] || 0;
                      const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                      return (
                        <tr key={idx} className="border-b border-slate-300 text-slate-705">
                          <td className="p-2 border-r border-slate-300 font-mono text-center">{idx + 1}</td>
                          <td className="p-2 border-r border-slate-300 font-semibold">{cat}</td>
                          <td className="p-2 border-r border-slate-300 font-mono text-center">{count}</td>
                          <td className="p-2 font-mono text-center">{pct}%</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-50 font-bold text-slate-950 border-t-2 border-slate-400">
                      <td className="p-2 border-r border-slate-300 text-center" colSpan={2}>ລວມທັງໝົດທຸກປະເພດ</td>
                      <td className="p-2 border-r border-slate-300 font-mono text-center">{stats.total} ສະບັບ</td>
                      <td className="p-2 font-mono text-center">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Urgency breakdown & stats */}
              <div className="space-y-1 text-xs pt-2 leading-relaxed">
                <p>• <b>ສະຖິຕິຄວາມດ່ວນ:</b> ເອກະສານດ່ວນທີ່ສຸດ (Critical) ມີທັງໝົດ <b>{stats.critical}</b> ສະບັບ, ເອກະສານດ່ວນ (Urgent) ມີທັງໝົດ <b>{stats.urgent}</b> ສະບັບ</p>
                <p>• <b>ສະຖິຕິສະຖານະ:</b> ສຳເລັດແລ້ວ <b>{stats.completed}</b> ສະບັບ, ກຳລັງດຳເນີນງານ <b>{stats.processing}</b> ສະບັບ, ຄ້າງລໍຖ້າດຳເນີນງານ <b>{stats.pending}</b> ສະບັບ</p>
              </div>

              {/* Signatures Section area - Absolutely classic for Lao reports */}
              <div className="grid grid-cols-2 gap-6 pt-16 text-center text-xs">
                
                {/* Right Signature (Head of Department) is usually on the Right side in Laos */}
                <div className="space-y-16 col-start-2">
                  <div className="space-y-1 font-semibold">
                    <p>ຫົວໜ້າພະແນກສາທາລະນະສຸກ ແຂວງສາລະວັນ</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold underline">{USER_ROLE}</p>
                    <p className="text-[10px] text-slate-400">{LOGGED_IN_USER}</p>
                  </div>
                </div>

                {/* Left Signature (Registrar/Reporter) */}
                <div className="space-y-16 col-start-1 row-start-1">
                  <div className="space-y-1 font-semibold">
                    <p>ຫົວໜ້າຫ້ອງການບໍລິຫານ / ຜູ້ບັນທຶກສະຖິຕິ</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold underline">ນາງ ແຕງອ່ອນ</p>
                    <p className="text-[10px] text-slate-400">ພະນັກງານທະບຽນເອກະສານ</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
