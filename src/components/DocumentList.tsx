/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Document, DocumentFilter, CATEGORIES, DocPriority, DocStatus, DocType } from '../types';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar, 
  Bookmark, 
  AlertCircle, 
  Eye, 
  Plus,
  ArrowDownToLine,
  ChevronDown
} from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  onSelectDoc: (id: string) => void;
  onAddDoc: (type: DocType) => void;
}

export default function DocumentList({ documents, onSelectDoc, onAddDoc }: DocumentListProps) {
  // State for filtering
  const [filter, setFilter] = useState<DocumentFilter>({
    searchQuery: '',
    type: 'all',
    category: '',
    priority: 'all',
    status: 'all',
    startDate: '',
    endDate: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter application
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      // 1. Text search
      const query = filter.searchQuery.toLowerCase().trim();
      if (query) {
        const titleMatch = doc.title.toLowerCase().includes(query);
        const regNoMatch = doc.regNo.toLowerCase().includes(query);
        const docNoMatch = doc.docNo.toLowerCase().includes(query);
        const senderMatch = doc.sender.toLowerCase().includes(query);
        const receiverMatch = doc.receiver.toLowerCase().includes(query);
        const descMatch = doc.description?.toLowerCase().includes(query) || false;
        
        if (!titleMatch && !regNoMatch && !docNoMatch && !senderMatch && !receiverMatch && !descMatch) {
          return false;
        }
      }

      // 2. Type
      if (filter.type !== 'all' && doc.type !== filter.type) return false;

      // 3. Category
      if (filter.category && doc.category !== filter.category) return false;

      // 4. Priority
      if (filter.priority !== 'all' && doc.priority !== filter.priority) return false;

      // 5. Status
      if (filter.status !== 'all' && doc.status !== filter.status) return false;

      // 6. Start date
      if (filter.startDate && doc.receivedDate < filter.startDate) return false;

      // 7. End date
      if (filter.endDate && doc.receivedDate > filter.endDate) return false;

      return true;
    });
  }, [documents, filter]);

  // Reset filters
  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      type: 'all',
      category: '',
      priority: 'all',
      status: 'all',
      startDate: '',
      endDate: ''
    });
  };

  // Badge styles helper
  const getPriorityBadge = (p: DocPriority) => {
    switch (p) {
      case 'critical':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">ດ່ວນທີ່ສຸດ</span>;
      case 'urgent':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">ດ່ວນ</span>;
      default:
        return <span className="bg-slate-50 text-slate-600 border border-slate-205 text-[11px] font-medium px-2 py-0.5 rounded-md">ທຳມະດາ</span>;
    }
  };

  const getStatusBadge = (s: DocStatus) => {
    switch (s) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">● ລໍຖ້າປະຕິບັດ</span>;
      case 'processing':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">● ກຳລັງດຳເນີນ</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">✓ สำເລັດແລ້ວ</span>;
      case 'archived':
        return <span className="bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">ເກັບມ້ຽນແລ້ວ</span>;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header and Quick Creation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">ຄົ້ນຫາ ແລະ ຈັດການເອກະສານ</h2>
          <p className="text-xs text-slate-400">ເອກະສານທັງໝົດໃນລະບົບ ({filteredDocs.length} ລາຍການ ຈາກທັງໝົດ {documents.length})</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            id="list-add-in"
            onClick={() => onAddDoc('incoming')}
            className="flex-1 sm:flex-none text-xs bg-blue-600 text-white hover:bg-blue-700 transition font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus size={15} /> ບັນທຶກຂາເຂົ້າ
          </button>
          <button 
            id="list-add-out"
            onClick={() => onAddDoc('outgoing')}
            className="flex-1 sm:flex-none text-xs bg-indigo-600 text-white hover:bg-indigo-700 transition font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus size={15} /> ບັນທຶກຂາອອກ
          </button>
        </div>
      </div>

      {/* Filter Options Controls Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        
        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={17} />
            <input 
              id="list-search-input"
              type="text" 
              placeholder="ຄົ້ນຫາຜ່ານຫົວຂໍ້ເອກະສານ, ເລກທີຂາເຂົ້າ-ອອກ, ຜູ້ນຳສົ່ງ, ຄຳອະທິບາຍ..."
              value={filter.searchQuery}
              onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
              className="text-xs w-full pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-slate-50/55"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              id="list-toggle-adv-btn"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`text-xs border px-3 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 shadow-xs ${
                showAdvanced ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Filter size={14} />
              <span>ໂຕຕອງເພີ່ມເຕີມ</span>
              <ChevronDown size={14} className={`transition ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
            
            <button 
              id="list-clear-filters"
              onClick={handleResetFilters}
              title="ລ້າງຄ່າໂຕຕອງທັງໝົດ"
              className="text-xs border border-slate-250 bg-white hover:bg-slate-50 text-slate-500 font-medium p-2 rounded-lg cursor-pointer flex items-center justify-center"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Advanced Filters Collapse Wrapper */}
        {showAdvanced && (
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-3">
            {/* 1. Document Type */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">ປະເພດທິດທາງ:</label>
              <select 
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value as DocType | 'all' })}
                className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md bg-white text-slate-700"
              >
                <option value="all">ທັງໝົດ</option>
                <option value="incoming">ຂາເຂົ້າ</option>
                <option value="outgoing">ຂາອອກ</option>
              </select>
            </div>

            {/* 2. Category */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">ປະເພດເອກະສານ:</label>
              <select 
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md bg-white text-slate-700"
              >
                <option value="">ທັງໝົດ</option>
                {CATEGORIES.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* 3. Priority */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">ລະດັບຄວາມດ່ວນ:</label>
              <select 
                value={filter.priority}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value as DocPriority | 'all' })}
                className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md bg-white text-slate-700"
              >
                <option value="all">ທັງໝົດ</option>
                <option value="normal">ທຳມະດາ</option>
                <option value="urgent">ດ່ວນ</option>
                <option value="critical">ດ່ວນທີ່ສຸດ</option>
              </select>
            </div>

            {/* 4. Status */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">ສະຖານະ:</label>
              <select 
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value as DocStatus | 'all' })}
                className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md bg-white text-slate-700"
              >
                <option value="all">ທັງໝົດ</option>
                <option value="pending">ລໍຖ້າປະຕິບັດ</option>
                <option value="processing">ກຳລັງດຳເນີນການ</option>
                <option value="completed">ສຳເລັດແລ້ວ</option>
                <option value="archived">ເກັບມ້ຽນແລ້ວ</option>
              </select>
            </div>

            {/* 5. Date Search Scope */}
            <div className="sm:col-span-2 md:col-span-1 lg:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 mb-1"><b>ວັນທີ ລະຫວ່າງ:</b></label>
              <div className="flex gap-1">
                <input 
                  type="date" 
                  value={filter.startDate}
                  onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                  className="text-xs w-full p-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md bg-white text-slate-700"
                />
                <span className="text-slate-400 self-center">➔</span>
                <input 
                  type="date" 
                  value={filter.endDate}
                  onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                  className="text-xs w-full p-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md bg-white text-slate-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Results Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <AlertCircle className="mx-auto mb-3 opacity-30 text-slate-400" size={40} />
            <h3 className="text-sm font-bold text-slate-800">ບໍ່ພົບເອກະສານທີ່ທ່ານກໍາລັງຊອກຫາ</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              ລອງປ່ຽນຄຳຄົ້ນຫາ, ຜ່ອນຍ່ອນໂຕຕອງ ຫຼື ສ້າງເອກະສານໃໝ່ເຂົ້າລະບົບໂດຍການກົດປຸ່ມບັນທຶກຂ້າງເທິງ.
            </p>
            <button 
              onClick={handleResetFilters}
              className="mt-4 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition px-4 py-2 rounded-lg cursor-pointer"
            >
              ລ້າງຄ່າໂຕຕອງເພື່ອເລີ່ມໃໝ່
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-750 text-xs font-bold">
                  <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-400">ປະເພດເອກະສານ</th>
                  <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-400">ເລກທະບຽນ / ເລກທີຄຳສັ່ງ</th>
                  <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-400">ຫົວຂໍ້ ຫຼື ເນື້ອໃນຫຍۆ້</th>
                  <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-400">ພາກສ່ວນສົ່ງ / ຮັບ</th>
                  <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-400">ຄວາມດ່ວນ / ສະຖານະ</th>
                  <th className="py-3 px-4 text-right text-[11px] uppercase tracking-wider text-slate-400">ວັນທີບັນທຶກ</th>
                  <th className="py-3 px-4 text-center text-[11px] uppercase tracking-wider text-slate-400">ຈັດການ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr 
                    key={doc.id} 
                    id={`doc-row-${doc.id}`}
                    className="hover:bg-slate-50/70 transition cursor-pointer text-slate-700 text-xs group"
                    onClick={() => onSelectDoc(doc.id)}
                  >
                    {/* Direction type badge */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block w-fit text-[10px] font-bold px-2 py-0.5 rounded ${
                          doc.type === 'incoming' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {doc.type === 'incoming' ? 'ຂາເຂົ້າ' : 'ຂາອອກ'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{doc.category}</span>
                      </div>
                    </td>

                    {/* Registration IDs */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-800">
                        {doc.regNo}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ເລກເອກະສານ: {doc.docNo}
                      </div>
                    </td>

                    {/* Document Title Summary */}
                    <td className="py-3.5 px-4 max-w-xs md:max-w-sm">
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-700 line-clamp-2 leading-relaxed">
                        {doc.title}
                      </h4>
                      {doc.attachmentName && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 font-medium bg-slate-50 border border-slate-150 rounded px-1.5 py-0.5 w-fit">
                          <Bookmark size={10} className="text-blue-500" />
                          <span>{doc.attachmentName}</span>
                          <span>•</span>
                          <span className="font-mono text-[9px]">{doc.attachmentSize}</span>
                        </div>
                      )}
                    </td>

                    {/* Sender/Receiver details */}
                    <td className="py-3.5 px-4 max-w-[170px]">
                      <div className="text-slate-750 line-clamp-1 font-bold">
                        {doc.type === 'incoming' ? doc.sender : doc.receiver}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-bold flex items-center justify-between">
                        <span>{doc.type === 'incoming' ? 'ຈາກ' : 'ສົ່ງເຖິງ'}</span>
                        {doc.assignedTo && <span className="text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded text-[9px]">ມອບໃຫ້: {doc.assignedTo}</span>}
                      </div>
                    </td>

                    {/* Priority and Status Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 w-fit">
                        {getPriorityBadge(doc.priority)}
                        {getStatusBadge(doc.status)}
                      </div>
                    </td>

                    {/* System Dates */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500 font-bold">
                      <div className="text-slate-700">{doc.receivedDate}</div>
                      <div className="text-[10px] text-slate-400">ລົງວັນທີ: {doc.docDate}</div>
                    </td>

                    {/* View CTA btn */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center items-center">
                        <button 
                          id={`view-btn-${doc.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDoc(doc.id);
                          }}
                          className="p-1 px-2.5 bg-slate-50 group hover:bg-blue-50 hover:text-blue-700 text-slate-500 border border-slate-200/60 hover:border-blue-200 rounded-lg transition text-[11px] font-bold cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Eye size={13} />
                          <span>ເບິ່ງ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
