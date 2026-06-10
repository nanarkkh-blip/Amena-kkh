/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Document, DocStatus, DocPriority, DEPARTMENTS, DocLog, CATEGORIES } from '../types';
import { 
  ArrowLeft, 
  Download, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  FileCheck, 
  History, 
  Clock, 
  CornerDownRight, 
  Plus,
  Send,
  Loader2,
  Bookmark,
  Edit,
  Printer
} from 'lucide-react';
import { LOGGED_IN_USER, USER_ROLE } from '../data';

interface DocumentDetailsProps {
  document: Document;
  onBack: () => void;
  onUpdateDoc: (updatedDoc: Document) => void;
  onDeleteDoc: (id: string) => void;
  onEditDoc: (document: Document) => void;
}

export default function DocumentDetails({ document, onBack, onUpdateDoc, onDeleteDoc, onEditDoc }: DocumentDetailsProps) {
  // State for appending logs
  const [newLogNote, setNewLogNote] = useState('');
  const [assignee, setAssignee] = useState(document.assignedTo || '');
  const [statusVal, setStatusVal] = useState<DocStatus>(document.status);
  const [priorityVal, setPriorityVal] = useState<DocPriority>(document.priority);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpenPrintSlip, setIsOpenPrintSlip] = useState(false);

  // Quick State Updates Handler
  const handleSaveChangesByField = (updatedFields: Partial<Document>, logMessage: string) => {
    setIsUpdating(true);
    setTimeout(() => {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      
      const newLog: DocLog = {
        id: `log-${Date.now()}`,
        docId: document.id,
        date: nowStr,
        action: logMessage,
        actor: LOGGED_IN_USER,
        notes: newLogNote || undefined
      };

      const updatedDoc: Document = {
        ...document,
        ...updatedFields,
        logs: [...document.logs, newLog]
      };

      onUpdateDoc(updatedDoc);
      setNewLogNote('');
      setIsUpdating(false);
    }, 400);
  };

  // Dispatch Log Note Append manually
  const handleAddCustomLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote.trim()) return;
    handleSaveChangesByField({}, 'ເພີ່ມຄຳເຫັນ/ບັນທຶກຕິດຕາມ');
  };

  // Timeline Step Status Indicator
  const getTimelineStepClass = (step: number, targetStatus: DocStatus) => {
    const statusMap: Record<DocStatus, number> = {
      'pending': 1,
      'processing': 2,
      'completed': 3,
      'archived': 4,
    };
    const currentStep = statusMap[document.status];

    if (currentStep >= step) {
      if (document.status === 'archived' && step === 4) return 'bg-slate-500 text-white border-slate-500';
      if (currentStep === step) return 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 animate-pulse';
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    return 'bg-white text-slate-300 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Title Bar with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <button 
          id="detail-back-btn"
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 border border-slate-200/60 transition cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>ກັບຄືນຫາລາຍການ</span>
        </button>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            id="detail-edit-btn"
            onClick={() => onEditDoc(document)}
            className="text-xs font-semibold text-blue-700 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 transition px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer bg-blue-50/50"
          >
            <Edit size={14} />
            <span>ແກ້ໄຂເອກະສານ</span>
          </button>

          <button 
            id="detail-print-slip-btn"
            onClick={() => setIsOpenPrintSlip(true)}
            className="text-xs font-semibold text-slate-700 hover:text-white hover:bg-slate-700 border border-slate-200 hover:border-slate-700 transition px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50"
          >
            <Printer size={14} />
            <span>ພິມໃບຕິດຕາມ</span>
          </button>

          {document.attachmentName && (
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`ກຳລັງດາວໂຫຼດໄຟລ໌ຄັດຕິດ: ${document.attachmentName}`);
              }}
              className="text-xs font-semibold text-slate-700 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/60 transition px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <Download size={14} />
              <span>ດາວໂຫຼດ ({document.attachmentSize})</span>
            </a>
          )}
          
          <button 
            id="detail-delete-btn"
            onClick={() => {
              if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບເອກະສານສະບັບນີ້ອອກຈາກລະບົບ? (ການດຳເນີນການນີ້ບໍ່ສາມາດກັບຄືນໄດ້)')) {
                onDeleteDoc(document.id);
              }
            }}
            className="text-xs font-medium text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200/60 hover:border-rose-600 transition px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>ລົບອອກ</span>
          </button>
        </div>
      </div>

      {/* Visual Tracking Progress Bar Timeline */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 relative overflow-hidden">
        
        <div className="absolute right-0 top-0 opacity-5 -translate-y-4">
          <History size={160} />
        </div>

        <div className="relative z-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">ຕິດຕາມສະຖານະການກ້າວໜ້າ (Document Journey Tracking)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="absolute hidden md:block top-4 left-10 right-10 h-0.5 bg-slate-100 -z-0"></div>
            
            {/* Step 1 */}
            <div className="flex items-center md:flex-col md:text-center gap-3 md:gap-2 relative z-10 bg-white p-2 md:p-0">
              <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold font-mono text-xs ${getTimelineStepClass(1, 'pending')}`}>1</span>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">ລົງທະບຽນເອກະສານ</h4>
                <p className="text-[10px] text-slate-400 mt-1">ເລກທີ: {document.regNo}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center md:flex-col md:text-center gap-3 md:gap-2 relative z-10 bg-white p-2 md:p-0">
              <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold font-mono text-xs ${getTimelineStepClass(2, 'processing')}`}>2</span>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">ກຳລັງດຳເນີນງານ / ມອບໝາຍ</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  {document.assignedTo ? `ມອບໃຫ້: ${document.assignedTo}` : 'ລໍຖ້າມອບໝາຍຂະແໜງ'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center md:flex-col md:text-center gap-3 md:gap-2 relative z-10 bg-white p-2 md:p-0">
              <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold font-mono text-xs ${getTimelineStepClass(3, 'completed')}`}>3</span>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">ສຳເລັດໜ້າວຽກແລ້ວ</h4>
                <p className="text-[10px] text-slate-400 mt-1">ບັນລຸວຽກຮ່ວມກັນ</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-center md:flex-col md:text-center gap-3 md:gap-2 relative z-10 bg-white p-2 md:p-0">
              <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold font-mono text-xs ${getTimelineStepClass(4, 'archived')}`}>4</span>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">ເກັບມ້ຽນເຂົ້າຄັງ</h4>
                <p className="text-[10px] text-slate-400 mt-1">ເກັບເຂົ້າແຟ້ມເອກະສານທາງການ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Full Document Info Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-xs p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-wrap justify-between items-start gap-2">
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                document.type === 'incoming' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {document.type === 'incoming' ? 'ເອກະສານຂາເຂົ້າ / INCOMING' : 'ເອກະສານຂາອອກ / OUTGOING'}
              </span>
              <h2 className="text-base font-semibold text-slate-800 mt-2 leading-relaxed">
                {document.title}
              </h2>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">ເລກທະບຽນ</span>
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">{document.regNo}</span>
            </div>
          </div>

          {/* Details Metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 font-medium block">ເລກທີເອກະສານຕົ້ນສະບັບ:</span>
              <span className="font-mono text-slate-800 font-semibold">{document.docNo}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">ປະເພດເອກະສານ:</span>
              <span className="font-semibold text-slate-800">{document.category}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">{document.type === 'incoming' ? 'ພາກສ່ວນສົ່ງມາ:' : 'ຜູ້ບັນທຶກສ້າງເລກ:'}</span>
              <span className="font-medium text-slate-800 leading-relaxed">{document.sender}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">{document.type === 'incoming' ? 'ພາກສ່ວນຮັບຜິດຊອບລະບົບ:' : 'ສົ່ງເຖິງພາກສ່ວນ:'}</span>
              <span className="font-medium text-slate-800 leading-relaxed">{document.receiver}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">ວັນທີໃນເອກະສານ:</span>
              <span className="font-medium text-slate-800 font-mono inline-flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" /> {document.docDate}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">ວັນທີໄດ້ຮັບ / ສົ່ງອອກ:</span>
              <span className="font-medium text-slate-800 font-mono inline-flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" /> {document.receivedDate}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ເນື້ອໃນຫຍໍ້ / ລາຍລະອຽດ</h4>
            <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line font-normal">
              {document.description || 'ບໍ່ມີລາຍລະອຽດເນື້ອໃນ ຫຼື ເອກະສານຄັດຕິດຕົວຢ່າງ.'}
            </p>
          </div>

          {/* Timeline History logs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <History size={15} className="text-blue-600" />
              <h4 className="text-xs font-semibold text-slate-800">ປະຫວັດການເຄື່ອນໄຫວ ແລະ ຕິດຕາມ</h4>
            </div>

            <div className="relative border-l border-slate-200 ml-3.5 space-y-6 pt-2">
              {document.logs.map((log, index) => (
                <div key={log.id} className="relative pl-6">
                  {/* Circle dot marker */}
                  <span className={`absolute -left-2 top-0.5 w-4.5 h-4.5 rounded-full border-2 bg-white flex items-center justify-center ${
                    index === document.logs.length - 1 ? 'border-blue-600 ring-4 ring-blue-50/70' : 'border-slate-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      index === document.logs.length - 1 ? 'bg-blue-600' : 'bg-slate-400'
                    }`}></span>
                  </span>

                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="font-mono text-slate-400 font-medium">{log.date}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">ຜູ້ທຳການ: {log.actor}</div>
                    {log.notes && (
                      <div className="bg-slate-50 border border-slate-150 rounded-lg p-2.5 text-xs text-slate-600 inline-block font-normal mt-1 leading-relaxed">
                        {log.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Doc Controls Form Panel */}
        <div className="space-y-6">
          
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">ແຜງຄວບຄຸມ ແລະ ອັບເດດສະຖານະ</h3>

            {/* 1. Change Status Selection */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600">ສະຖານະການດຳເນີນການຜ່ານ:</label>
              <select 
                value={statusVal}
                onChange={(e) => {
                  const val = e.target.value as DocStatus;
                  setStatusVal(val);
                  
                  const statusLabel: Record<DocStatus, string> = {
                    'pending': 'ລໍຖ້າປະຕິບັດ',
                    'processing': 'ກຳລັງດຳເນີນງານ',
                    'completed': 'ສຳເລັດໜ້າວຽກແລ້ວ',
                    'archived': 'ເກັບມ້ຽນເຂົ້າຄັງ',
                  };
                  handleSaveChangesByField({ status: val }, `ອັບເດດສະຖານະເປັນ: ${statusLabel[val]}`);
                }}
                className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg bg-white text-slate-700 font-semibold"
              >
                <option value="pending">● ລໍຖ້າດຳເນີນການ (Pending)</option>
                <option value="processing">● ກຳລັງດຳເນີນການ (Processing)</option>
                <option value="completed">✓ ສຳເລັດແລ້ວ (Completed)</option>
                <option value="archived">📦 ເກັບມ້ຽນເຂົ້າຄັງ (Archived)</option>
              </select>
            </div>

            {/* 2. Assign responsible department */}
            <div className="space-y-1 pt-1">
              <label className="block text-[11px] font-bold text-slate-600">ມອບໝາຍຂະແໜງຮັບຜິດຊອບ:</label>
              <select 
                value={assignee}
                onChange={(e) => {
                  const val = e.target.value;
                  setAssignee(val);
                  const actionLabel = val ? `ມອບໝາຍໃຫ້: ${val}` : 'ຖອນການມອບໝາຍຂະແໜງການ';
                  handleSaveChangesByField({ assignedTo: val || undefined }, actionLabel);
                }}
                className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg bg-white text-slate-700"
              >
                <option value="">-- ເລືອກຂະແໜງ --</option>
                {DEPARTMENTS.map((dept, idx) => (
                  <option key={idx} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* 3. Change priority levels */}
            <div className="space-y-1 pt-1">
              <label className="block text-[11px] font-bold text-slate-600">ກຳນົດລະດັບຄວາມດ່ວນ:</label>
              <select 
                value={priorityVal}
                onChange={(e) => {
                  const val = e.target.value as DocPriority;
                  setPriorityVal(val);
                  const priorityMsg: Record<DocPriority, string> = {
                    'normal': 'ທຳມະດາ',
                    'urgent': 'ດ່ວນ',
                    'critical': 'ດ່ວນທີ່ສຸດ'
                  };
                  handleSaveChangesByField({ priority: val }, `ປ່ຽນລະດັບຄວາມດ່ວນເປັນ: ${priorityMsg[val]}`);
                }}
                className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg bg-white text-slate-700"
              >
                <option value="normal">ທຳມະດາ</option>
                <option value="urgent">ດ່ວນ</option>
                <option value="critical">ດ່ວນທີ່ສຸດ (Critical)</option>
              </select>
            </div>

            {isUpdating && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium justify-center pt-2">
                <Loader2 size={13} className="animate-spin" />
                <span>ກຳລັງບັນທຶກສະຖານະໃໝ່...</span>
              </div>
            )}
          </div>

          {/* New Notes / Forward Remarks Form */}
          <form onSubmit={handleAddCustomLog} className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">ຂຽນຄຳເຫັນ ຫຼື ເພີ່ມບັນທຶກຕິດຕາມ</h3>
            
            <textarea 
              value={newLogNote}
              onChange={(e) => setNewLogNote(e.target.value)}
              placeholder="ປ້ອນລາຍລະອຽດຂໍ້ສັງເກດ, ຄວາມເຫັນຂອງຫົວໜ້າ, ຄຳແນະນຳໃນການ Forward ວຽກ ຫຼື ໝາຍເຫດອື່ນໆ..."
              rows={4}
              className="text-xs w-full p-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-slate-50/50 resize-none"
            />

            <button 
              id="detail-add-log-btn"
              type="submit"
              disabled={!newLogNote.trim() || isUpdating}
              className="w-full text-xs bg-blue-600 text-white font-bold py-2.5 px-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1 border border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send size={12} />
              <span>ສົ່ງຄຳເຫັນ ແລະ ອັບເດດ</span>
            </button>
          </form>

        </div>

      </div>

      {/* Official printable tracking slip preview modal */}
      {isOpenPrintSlip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 overflow-y-auto flex items-start justify-center p-4 pt-10 no-print">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Control Panel */}
            <div className="bg-slate-800 text-white px-6 py-3.5 flex justify-between items-center no-print">
              <span className="text-xs font-bold tracking-wide flex items-center gap-1.5 text-slate-200">
                <Printer size={15} className="text-blue-400" /> ພິມໃບຕິດຕາມຄວາມກ້າວໜ້າເອກະສານທາງການ
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow-xs"
                >
                  <Printer size={13} /> ພິມເອກະສານ / PDF
                </button>
                <button 
                  onClick={() => setIsOpenPrintSlip(false)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1.5 px-3 rounded-lg transition cursor-pointer"
                >
                  ປິດໜ້າຕ່າງ
                </button>
              </div>
            </div>

            {/* Print Slip Layout */}
            <div className="p-12 text-slate-800 bg-white font-sans max-w-3xl mx-auto print-card space-y-6">
              
              {/* Lao Standard Official Heading Header block */}
              <div className="text-center space-y-1 relative">
                <h2 className="text-xs sm:text-sm font-bold tracking-wider">ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ</h2>
                <h3 className="text-[10px] sm:text-xs font-bold tracking-widest">ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນາຖາວອນ</h3>
                <div className="w-48 h-0.5 border-b border-double border-slate-300 mx-auto mt-1"></div>
              </div>

              {/* Department heading banner */}
              <div className="flex justify-between items-start text-[11px] pt-2 leading-relaxed">
                <div className="space-y-1">
                  <h4 className="font-bold">ກະຊວງສາທາລະນະສຸກ</h4>
                  <p className="font-bold">ພະແນກສາທາລະນະສຸກ ແຂວງສາລະວັນ</p>
                  <p className="font-mono text-[9px] text-slate-400">ລະບົບ: EDMS HEALTH TRACKING v2.0</p>
                </div>
                
                <div className="text-right space-y-0.5 font-mono text-[10px] text-slate-700">
                  <p><b>ເລກທະບຽນຄັງ:</b> {document.regNo}</p>
                  <p><b>ວັນທີລົງລະບົບ:</b> {document.receivedDate}</p>
                </div>
              </div>

              {/* Title of the Tracking Router Sheet */}
              <div className="text-center space-y-1 pt-4">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-wide uppercase">
                  ໃບບັນທຶກຕິດຕາມຄວາມກ້າວໜ້າເອກະສານທາງການ
                </h1>
                <p className="text-[10px] text-slate-405 font-mono">(Document Routing Tracking Sheet)</p>
              </div>

              {/* Metadata Grid */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-50 p-2.5 font-bold border-b border-slate-300 text-slate-900">
                  I. ຂໍ້ມູນລາຍລະອຽດເອກະສານ (Document Information)
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-300 divide-y divide-slate-200">
                  <div className="p-2.5 space-y-1 col-span-2">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">ຫົວຂໍ້ ຫຼື ເນື້ອໃນຫຍໍ້ເອກະສານ:</span>
                    <span className="font-bold text-slate-900 leading-relaxed block">{document.title}</span>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">ເລກທີທະບຽນຄັງລະບົບ:</span>
                    <span className="font-mono font-bold text-slate-800">{document.regNo}</span>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">ເລກທີເອກະສານຕົ້ນສະບັບ:</span>
                    <span className="font-mono font-bold text-slate-800">{document.docNo}</span>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">ປະເພດເອກະສານ:</span>
                    <span className="font-bold text-slate-800">{document.category}</span>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">ທິດທາງເອກະສານ:</span>
                    <span className="font-bold text-slate-800">{document.type === 'incoming' ? 'ຂາເຂົ້າ / INCOMING' : 'ຂາອອກ / OUTGOING'}</span>
                  </div>
                  <div className="p-2.5 space-y-1 col-span-2">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">{document.type === 'incoming' ? 'ພາກສ່ວນສົ່ງມາ:' : 'ຜູ້ບັນທຶກສ້າງເລກ:'}</span>
                    <span className="font-semibold text-slate-800">{document.sender}</span>
                  </div>
                  <div className="p-2.5 space-y-1 col-span-2">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">{document.type === 'incoming' ? 'ພາກສ່ວນຮັບຜິດຊອບລະບົບ:' : 'ສົ່ງເຖິງພາກສ່ວນ:'}</span>
                    <span className="font-semibold text-slate-800">{document.receiver}</span>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">ວັນທີໃນເອກະສານ:</span>
                    <span className="font-mono font-bold text-slate-800">{document.docDate}</span>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">ວັນທີໄດ້ຮັບ/ສົ່ງອອກ:</span>
                    <span className="font-mono font-bold text-slate-800">{document.receivedDate}</span>
                  </div>
                  <div className="p-2.5 space-y-1 col-span-2">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">ເນື້ອໃນຫຍໍ້ / ລາຍລະອຽດ:</span>
                    <span className="text-slate-750 block leading-relaxed">{document.description || 'ບໍ່ມີລາຍລະອຽດເພີ່ມເຕີມ.'}</span>
                  </div>
                </div>
              </div>

              {/* Logs Breakdown */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-50 p-2.5 font-bold border-b border-slate-300 text-slate-900">
                  II. ປະຫວັດຄວາມກ້າວໜ້າ ແລະ ຄຳເຫັນຊີ້ນຳ (Journey Tracking History)
                </div>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold text-[11px]">
                      <th className="p-2 border-r border-slate-300">ວັນທີ / ເວລາ</th>
                      <th className="p-2 border-r border-slate-300">ການດຳເນີນງານ / ກິດຈະກຳ</th>
                      <th className="p-2 border-r border-slate-300">ຜູ້ຈັດການ / ຕຳແໜ່ງ</th>
                      <th className="p-2">ຄຳເຫັນ / ໝາຍເຫດ (ເຊັນກຳກັບ)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {document.logs.map((log) => (
                      <tr key={log.id} className="text-slate-800 font-normal">
                        <td className="p-2 border-r border-slate-200 font-mono text-[10px]">{log.date}</td>
                        <td className="p-2 border-r border-slate-200 font-semibold">{log.action}</td>
                        <td className="p-2 border-r border-slate-200 text-slate-600">{log.actor}</td>
                        <td className="p-2 leading-relaxed text-slate-700">
                          {log.notes || '-'}
                          <div className="h-6 border-b border-dashed border-slate-200/50 mt-1"></div>
                        </td>
                      </tr>
                    ))}
                    {/* Extra blank signature cell rows is classic for manual signoffs */}
                    <tr className="border-t border-slate-300 bg-slate-50/40 text-[10px] font-bold text-slate-550">
                      <td className="p-2 text-center" colSpan={4}>--- ເຂດສະເພາະ ສັນຍາລັກ/ລາຍເຊັນກຳກັບ ທາງກາຍະພາບ ເພື່ອ Forward ວຽກ ---</td>
                    </tr>
                    <tr>
                      <td className="p-5 border-r border-slate-200"></td>
                      <td className="p-5 border-r border-slate-200 font-semibold text-slate-400">ມອບໝາຍຂະແໜງ / ວຽກໃໝ່</td>
                      <td className="p-5 border-r border-slate-200 text-slate-400">..............................</td>
                      <td className="p-5 text-slate-400">.....................................................................</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures Section area */}
              <div className="grid grid-cols-2 gap-6 pt-12 text-center text-xs">
                
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
