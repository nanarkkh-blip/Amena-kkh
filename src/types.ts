/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DocType = 'incoming' | 'outgoing';

export type DocPriority = 'normal' | 'urgent' | 'critical';

export type DocStatus = 'pending' | 'processing' | 'completed' | 'archived';

export interface DocLog {
  id: string;
  docId: string;
  date: string;
  action: string;
  actor: string;
  notes?: string;
}

export interface Document {
  id: string;
  regNo: string;        // ເລກທີທະບຽນ / ເລກທີຂາເຂົ້າ-ຂາອອກ
  docNo: string;        // ເລກທີເອກະສານຕົ້ນສະບັບ
  type: DocType;       // ຂາເຂົ້າ ຫຼື ຂາອອກ
  title: string;       // ຫົວຂໍ້ ຫຼື ເນື້ອໃນຫຍໍ້
  sender: string;       // ຜູ້ນໍາສົ່ງ / ພາກສ່ວນສົ່ງ
  receiver: string;     // ພາກສ່ວນຮັບ / ຫ້ອງການຮັບ
  docDate: string;      // ວັນທີລົງໃນເອກະສານ
  receivedDate: string; // ວັນທີບັນທຶກເຂົ້າລະບົບ
  category: string;     // ປະເພດເອກະສານ (ແຈ້ງການ, ໃບສະເໜີ, ຄຳສັ່ງ, ບົດລາຍງານ, ຂໍ້ຕົກລົງ...)
  priority: DocPriority; // ລະດັບຄວາມດ່ວນ (ທຳມະດາ, ດ່ວນ, ດ່ວນທີ່ສຸດ)
  status: DocStatus;   // ສະຖານະ (ລໍຖ້າ, ກຳລັງດຳເນີນການ, ສຳເລັດ, ເກັບມ້ຽນ)
  description?: string; // ລາຍລະອຽດເພີ່ມເຕີມ
  assignedTo?: string;  // ຜູ້ຮັບຜິດຊອບ / ຂະແໜງການຮັບຜິດຊອບ
  attachmentName?: string; // ຊື່ໄຟລ໌ຄັດຕິດ
  attachmentSize?: string; // ຂະໜາດໄຟລ໌ຄັດຕິດ
  logs: DocLog[];       // ປະຫວັດການເຄື່ອນໄຫວ/ຕິດຕາມ
}

export interface DocumentFilter {
  searchQuery: string;
  type: DocType | 'all';
  category: string;
  priority: DocPriority | 'all';
  status: DocStatus | 'all';
  startDate: string;
  endDate: string;
}

export const CATEGORIES = [
  'ແຈ້ງການ',
  'ໃບສະເໜີ',
  'ຄຳສັ່ງ',
  'ບົດລາຍງານ',
  'ຂໍ້ຕົກລົງ',
  'ມະຕິ',
  'ໜັງສືທາງການ',
  'ອື່ນໆ'
];

export const DEPARTMENTS = [
  'ຂະແໜງຈັດຕັ້ງ-ກວດກາ',
  'ຂະແໜງບໍລິຫານການເງິນ-ແຜນການ',
  'ຂະແໜງຄອບຄຸມພະຍາດຕິດຕໍ່',
  'ຂະແໜງປິ່ນປົວ-ຟື້ນຟູໜ້າທີ່ການ',
  'ຂະແໜງອາຫານ ແລະ ຢາ',
  'ຂະແໜງອະນາໄມ ແລະ ສົງເສີມສຸຂະພາບ',
  'ຫ້ອງການປະກັນສຸຂະພາບ',
];
