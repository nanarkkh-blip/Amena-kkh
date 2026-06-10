/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DocType, DocPriority, Document, CATEGORIES, DEPARTMENTS, DocLog } from '../types';
import { 
  X, 
  Save, 
  FileText, 
  Layers, 
  Check, 
  Calendar, 
  ArrowLeftRight, 
  Bookmark, 
  Upload,
  UserCheck
} from 'lucide-react';
import { LOGGED_IN_USER } from '../data';

interface DocumentFormProps {
  type: DocType;
  onSave: (doc: Document) => void;
  onCancel: () => void;
  existingDocuments: Document[];
  documentToEdit?: Document;
}

export default function DocumentForm({ type, onSave, onCancel, existingDocuments, documentToEdit }: DocumentFormProps) {
  // State variables
  const [docType, setDocType] = useState<DocType>(documentToEdit ? documentToEdit.type : type);
  const [regNo, setRegNo] = useState(documentToEdit ? documentToEdit.regNo : '');
  const [docNo, setDocNo] = useState(documentToEdit ? documentToEdit.docNo : '');
  const [title, setTitle] = useState(documentToEdit ? documentToEdit.title : '');
  const [category, setCategory] = useState(documentToEdit ? documentToEdit.category : CATEGORIES[0]);
  const [priority, setPriority] = useState<DocPriority>(documentToEdit ? documentToEdit.priority : 'normal');
  const [sender, setSender] = useState(documentToEdit ? documentToEdit.sender : '');
  const [receiver, setReceiver] = useState(documentToEdit ? documentToEdit.receiver : '');
  const [docDate, setDocDate] = useState(documentToEdit ? documentToEdit.docDate : '');
  const [receivedDate, setReceivedDate] = useState(documentToEdit ? documentToEdit.receivedDate : '');
  const [assignedTo, setAssignedTo] = useState(documentToEdit ? (documentToEdit.assignedTo || '') : '');
  const [description, setDescription] = useState(documentToEdit ? (documentToEdit.description || '') : '');
  
  // Custom attachment states
  const [attachmentName, setAttachmentName] = useState(documentToEdit ? (documentToEdit.attachmentName || '') : '');
  const [attachmentSize, setAttachmentSize] = useState(documentToEdit ? (documentToEdit.attachmentSize || '') : '');
  const [isFileDragging, setIsFileDragging] = useState(false);

  // Auto-generate a beautiful Lao government sequential registration number
  useEffect(() => {
    if (documentToEdit) return;

    // Current UTC date for defaults
    const today = new Date().toISOString().substring(0, 10);
    setDocDate(today);
    setReceivedDate(today);

    // Filter documents of the same direction type
    const sameTypeDocs = existingDocuments.filter(d => d.type === docType);
    
    // Parse largest registry number
    // Formats: '0124/ສກ' or '0451/ພສາ'
    let nextNum = 1;
    const regex = /^(\d+)\//;
    
    sameTypeDocs.forEach(d => {
      const match = d.regNo.match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= nextNum) {
          nextNum = num + 1;
        }
      }
    });

    const paddedNum = String(nextNum).padStart(4, '0');
    
    if (docType === 'incoming') {
      setRegNo(`${paddedNum}/ສກ`);
      setSender('');
      setReceiver('ພະແນກສາທາລະນະສຸກ ແຂວງ ສາລະວັນ');
    } else {
      setRegNo(`${paddedNum}/ສທຂ`);
      setSender('ພະແນກສາທາລະນະສຸກ ແຂວງ ສາລະວັນ');
      setReceiver('');
    }
  }, [docType, existingDocuments, documentToEdit]);

  // Handle fake file drag and drop upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragging(true);
  };

  const handleDragLeave = () => {
    setIsFileDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setAttachmentName(file.name);
      const sizeKB = Math.round(file.size / 1024);
      setAttachmentSize(sizeKB > 1000 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setAttachmentName(file.name);
      const sizeKB = Math.round(file.size / 1024);
      setAttachmentSize(sizeKB > 1000 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`);
    }
  };

  // Register / Edit Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!regNo.trim() || !docNo.trim() || !title.trim() || !sender.trim() || !receiver.trim()) {
      alert('ກະລຸນາປ້ອນຂໍ້ມູນເອກະສານທີ່ຈຳເປັນໃຫ້ຄົບຖ້ວນ!');
      return;
    }

    const logDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (documentToEdit) {
      // Create edit audit log entry
      const editLog: DocLog = {
        id: `log-${Date.now()}`,
        docId: documentToEdit.id,
        date: logDate,
        action: 'ແກ້ໄຂຂໍ້ມູນເອກະສານ',
        actor: LOGGED_IN_USER,
        notes: 'ແກ້ໄຂ ແລະ ປັບປຸງລາຍລະອຽດຂໍ້ມູນເອກະສານທາງການ'
      };

      const updatedDoc: Document = {
        ...documentToEdit,
        regNo: regNo.trim(),
        docNo: docNo.trim(),
        type: docType,
        title: title.trim(),
        sender: sender.trim(),
        receiver: receiver.trim(),
        docDate: docDate || documentToEdit.docDate,
        receivedDate: receivedDate || documentToEdit.receivedDate,
        category,
        priority,
        description: description.trim() || undefined,
        assignedTo: assignedTo || undefined,
        attachmentName: attachmentName || undefined,
        attachmentSize: attachmentSize || undefined,
        logs: [...documentToEdit.logs, editLog]
      };

      onSave(updatedDoc);
    } else {
      const docId = `doc-${Date.now()}`;

      // Initial Audit log
      const initialLog: DocLog = {
        id: `log-${Date.now()}-1`,
        docId,
        date: logDate,
        action: docType === 'incoming' ? 'ບັນທຶກເອກະສານຂາເຂົ້າໃໝ່' : 'ຈັດສ້າງເອກະສານຂາອອກໃໝ່',
        actor: LOGGED_IN_USER,
        notes: assignedTo ? `ມອບໝາຍວຽກໃຫ້: ${assignedTo}` : 'ລົງທະບຽນເລີ່ມຕົ້ນເຂົ້າຖານຂໍ້ມູນ'
      };

      const newDoc: Document = {
        id: docId,
        regNo: regNo.trim(),
        docNo: docNo.trim(),
        type: docType,
        title: title.trim(),
        sender: sender.trim(),
        receiver: receiver.trim(),
        docDate: docDate || logDate.substring(0, 10),
        receivedDate: receivedDate || logDate.substring(0, 10),
        category,
        priority,
        status: 'pending',
        description: description.trim() || undefined,
        assignedTo: assignedTo || undefined,
        attachmentName: attachmentName || undefined,
        attachmentSize: attachmentSize || undefined,
        logs: [initialLog]
      };

      onSave(newDoc);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 px-6 py-4 text-white flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold tracking-wide">
            {documentToEdit 
              ? `ແກ້ໄຂຂໍ້ມູນເອກະສານ: ${documentToEdit.regNo}` 
              : docType === 'incoming' ? 'ຟອມບັນທຶກເອກະສານຂາເຂົ້າໃໝ່' : 'ຟອມຈັດສ້າງເອກະສານຂາອອກໃໝ່'}
          </h2>
          <p className="text-[11px] text-blue-100">
            {documentToEdit 
              ? 'ປັບປຸງລາຍລະອຽດ ແລະ ຂໍ້ມູນປ່ຽນແປງຂອງເອກະສານໃຫ້ຖືກຕ້ອງ' 
              : 'ກະລຸນາຕື່ມຂໍ້ມູນໜັງສືທາງການໃຫ້ຄົບຖ້ວນ ເພື່ອລົງທະບຽນ ແລະ ຕິດຕາມ'}
          </p>
        </div>
        <button 
          onClick={onCancel}
          className="p-1 rounded-md hover:bg-slate-800 transition text-slate-400 hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Toggle docType input explicitly */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-700">ທິດທາງຂອງເອກະສານ (Direction of Document)</h4>
            <p className="text-[10px] text-slate-400">ລະບົບຈະປັບເລກທີທະບຽນໃຫ້ເໝາະສົມໂດຍອັດຕະໂນມັດ</p>
          </div>
          
          <div className="flex bg-slate-200 p-1 rounded-lg w-fit">
            <button 
              id="form-set-incoming-btn"
              type="button"
              onClick={() => setDocType('incoming')}
              className={`text-xs px-4 py-1.5 rounded-md font-bold transition cursor-pointer ${
                docType === 'incoming' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-650 hover:text-slate-800'
              }`}
            >
              ເອກະສານຂາເຂົ້າ
            </button>
            <button 
              id="form-set-outgoing-btn"
              type="button"
              onClick={() => setDocType('outgoing')}
              className={`text-xs px-4 py-1.5 rounded-md font-bold transition cursor-pointer ${
                docType === 'outgoing' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-650 hover:text-slate-800'
              }`}
            >
              ເອກະສານຂາອອກ
            </button>
          </div>
        </div>

        {/* Info Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Automatic Reg No */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">ເລກທີທະບຽນ (Reg No) <span className="text-rose-500">*</span></label>
            <input 
              id="form-reg-no"
              type="text"
              required
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="ຕົວຢ່າງ: 0025/ສທຂ.ສວ"
              className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg bg-slate-50/50 font-mono font-bold"
            />
          </div>

          {/* Core Doc No */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">ເລກທີເອກະສານຕົ້ນສະບັບ <span className="text-rose-500">*</span></label>
            <input 
              id="form-doc-no"
              type="text"
              required
              value={docNo}
              onChange={(e) => setDocNo(e.target.value)}
              placeholder="ຕົວຢ່າງ: 87/ພບ.ວຈ ຫຼື 12/ສສ.26"
              className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg font-mono font-bold"
            />
          </div>

          {/* Full Title (Lao) */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">ຫົວຂໍ້ ຫຼື ເນື້ອໃນຫຍໍ້ຂອງເອກະສານ <span className="text-rose-500">*</span></label>
            <input 
              id="form-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ຕົວຢ່າງ: ແຈ້ງການຈັດຕັ້ງປະຕິບັດການລົງຕິດຕາມສຸຂະພາບເດັກ..."
              className="text-xs w-full p-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg font-bold"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">ປະເພດເອກະສານ:</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg bg-white font-bold"
            >
              {CATEGORIES.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">ລະດັບຄວາມດ່ວນ:</label>
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value as DocPriority)}
              className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg bg-white font-bold"
            >
              <option value="normal">ປົກກະຕິ (Normal)</option>
              <option value="urgent">ດ່ວນ (Urgent)</option>
              <option value="critical">ດ່ວນທີ່ສຸດ (Critical)</option>
            </select>
          </div>

          {/* Sender */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">
              {docType === 'incoming' ? 'ພາກສ່ວນສົ່ງມາ (Sender Department) *' : 'ຜູ້ບັນທຶກ / ສ້າງເລກ (Sender) *'}
            </label>
            <input 
              id="form-sender"
              type="text"
              required
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder={docType === 'incoming' ? 'ຕົວຢ່າງ: ກະຊວງສາທາລະນະສຸກ, ກົມຄວບຄຸມ...' : 'ພະແນກສາທາລະນະສຸກ ແຂວງ ເຊກອງ'}
              className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg font-bold"
            />
          </div>

          {/* Receiver */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">
              {docType === 'incoming' ? 'ພາກສ່ວນຮັບຜິດຊອບ (Receiver) *' : 'ສົ່ງເຖິງພາກສ່ວນ (Receiver Target) *'}
            </label>
            <input 
              id="form-receiver"
              type="text"
              required
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder={docType === 'incoming' ? 'ພະແນກສາທາລະນະສຸກ ແຂວງ ສາລະວັນ' : 'ຕົວຢ່າງ: ໂຮງໝໍເມືອງ, ຫ້ອງການສາທາລະນະສຸກເມືອງ...'}
              className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg font-bold"
            />
          </div>

          {/* Doc Date */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">ວັນທີລົງໃນເອກະສານ:</label>
            <input 
              type="date"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
              className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg font-bold"
            />
          </div>

          {/* Received/Creation Date */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">
              {docType === 'incoming' ? 'ວັນທີໄດ້ຮັບ (Received Date):' : 'ວັນທີສົ່ງອອກ (Dispatched Date):'}
            </label>
            <input 
              type="date"
              value={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}
              className="text-xs w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg font-bold"
            />
          </div>

          {/* Assigned Department */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">ມອບໝາຍວຽກໃຫ້ຂະແໜງການໂດຍກົງ (ເລືອກ ຫຼື ມອບໝາຍພາຍຫຼັງ):</label>
            <select 
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="text-xs w-full p-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg bg-white font-bold"
            >
              <option value="">-- ເລືອກຂະແໜງການຜູ້ມອບໝາຍ (ຖ້າມີ) --</option>
              {DEPARTMENTS.map((dept, i) => (
                <option key={i} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">ລາຍລະອຽດ ຫຼື ສັງລວມຫຍໍ້ (ລາຍລະອຽດເພີ່ມເຕີມ):</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ປ້ອນຂໍ້ມູນເປົ້າໝາຍ, ແນວທາງປະຕິບັດ, ຫຼື ໝາຍເຫດເພີ່ມເຕີມສໍາລັບເອກະສານ..."
              rows={3}
              className="text-xs w-full p-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg resize-none"
            />
          </div>

        </div>

        {/* Drag and Drop File Upload Area */}
        <div className="space-y-2 text-xs">
          <label className="block text-[11px] font-bold text-slate-600">ຄັດຕິດໄຟລ໌ເອກະສານທາງການ (PDF, DOCX) - ຈຳລອງ:</label>
          
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              isFileDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/40'
            }`}
          >
            <input 
              id="file-upload-input"
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.xlsx,.xls"
            />
            <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
              <Upload className="mx-auto text-slate-400" size={28} />
              <div className="text-slate-600 font-semibold text-xs">ລາກ ແລະ ວາງໄຟລ໌ຢູ່ບ່ອນນີ້ ຫຼື ກົດເພື່ອເລືອກໄຟລ໌</div>
              <p className="text-[10px] text-slate-400">ຮອງຮັບໄຟລ໌ PDF, Word, Excel (ສູງສຸດ 10MB)</p>
            </label>
          </div>

          {/* Display Attached File Status */}
          {attachmentName && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-2 px-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <Bookmark className="text-blue-600" size={15} />
                <span>{attachmentName}</span>
                <span className="text-slate-400 text-[10px]">({attachmentSize})</span>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setAttachmentName('');
                  setAttachmentSize('');
                }}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition cursor-pointer"
              >
                ລົບອອກ
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <button 
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-600 hover:bg-slate-100 transition px-4 py-2.5 rounded-lg border border-slate-200 font-bold cursor-pointer"
          >
            ຍົກເລີກ
          </button>
          <button 
            id="form-submit-btn"
            type="submit"
            className="text-xs bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-1.5 border border-blue-600 shadow-sm cursor-pointer"
          >
            <Save size={15} />
            <span>ບັນທຶກ ແລະ ລົງທະບຽນ</span>
          </button>
        </div>

      </form>
    </div>
  );
}
