/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Document } from './types';

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    regNo: '0124/ສກ',
    docNo: '87/ພບ.ວຈ',
    type: 'incoming',
    title: 'ແຈ້ງການຈັດຕັ້ງປະຕິບັດການສັກຢາວັກຊີນກັນໂຄວິດ-19 ເຂັມຊຸກຍູ້ ຮອບໃຫມ່ປີ 2026',
    sender: 'ກະຊວງສາທາລະນະສຸກ, ກົມຄວບຄຸມພະຍາດຕິດຕໍ່',
    receiver: 'ພະແນກສາທາລະນະສຸກ ແຂວງ ສາລະວັນ',
    docDate: '2026-05-15',
    receivedDate: '2026-05-16',
    category: 'ແຈ້ງການ',
    priority: 'urgent',
    status: 'processing',
    description: 'ເພີ່ມທະວີການສັກຢາວັກຊີນຮອບຊຸກຍູ້ໃຫ້ແກ່ປະຊາຊົນເຂດຫ່າງໄກສອກຫຼີກ ເພື່ອປ້ອງກັນການແພ່ລະບາດໃນລະດູຝົນ.',
    assignedTo: 'ຂະແໜງກັນພະຍາດ ແລະ ສົ່ງເສີມສຸຂະພາບ',
    attachmentName: 'vaccination_plan_2026.pdf',
    attachmentSize: '2.4 MB',
    logs: [
      {
        id: 'log-1-1',
        docId: 'doc-1',
        date: '2026-05-16 08:30',
        action: 'ບັນທຶກເອກະສານຂາເຂົ້າ',
        actor: 'ທ້າວ ສົມພອນ ແກ້ວມະນີ (ຫ້ອງການບໍລິຫານ)',
        notes: 'ຮັບເອກະສານທາງການສະບັບແທ້ແລະໄຟລ໌ສະແກນ'
      },
      {
        id: 'log-1-2',
        docId: 'doc-1',
        date: '2026-05-16 10:15',
        action: 'ສົ່ງສົ່ງໃຫ້ຂະແໜງການ',
        actor: 'ນາງ ວັນເພັງ ບຸນມີ (ຫົວໜ້າຫ້ອງການບໍລິຫານ)',
        notes: 'ສົ່ງໃຫ້ຂະແໜງກັນພະຍາດເພື່ອວາງແຜນການຈັດຕັ້ງປະຕິບັດ'
      }
    ]
  },
  {
    id: 'doc-2',
    regNo: '0125/ສກ',
    docNo: '142/ກອ.ອຢ',
    type: 'incoming',
    title: 'ຄໍາສັ່ງເພີ່ມທະວີການຕິດຕາມກວດກາຄວາມປອດໄພຂອງຢາປິ່ນປົວພະຍາດທີ່ນໍາເຂົ້າບໍ່ຖືກຕ້ອງ',
    sender: 'ກົມອາຫານ ແລະ ຢາ, ກະຊວງສາທາລະນະສຸກ',
    receiver: 'ພະແນກສາທາລະນະສຸກ ແຂວງ ເຊກອງ',
    docDate: '2026-05-18',
    receivedDate: '2026-05-19',
    category: 'ຄຳສັ່ງ',
    priority: 'critical',
    status: 'pending',
    description: 'ລົງກວດກາຮ້ານຂາຍຢາທົ່ວແຂວງ ແລະ ຢຶດຢາທີ່ເສື່ອມຄຸນນະພາບ ຫຼື ບໍ່ມີທະບຽນ.',
    assignedTo: 'ຂະແໜງອາຫານ ແລະ ຢາ',
    attachmentName: 'drug_regulation_directive.pdf',
    attachmentSize: '1.8 MB',
    logs: [
      {
        id: 'log-2-1',
        docId: 'doc-2',
        date: '2026-05-19 09:00',
        action: 'ບັນທຶກເອກະສານຂາເຂົ້າ',
        actor: 'ທ້າວ ສົມພອນ ແກ້ວມະນີ (ຫ້ອງການບໍລິຫານ)',
        notes: 'ສະບັບດ່ວນທີ່ສຸດ ເຂົ້າຫ້ອງການ'
      }
    ]
  },
  {
    id: 'doc-3',
    regNo: '0451/ພສາ',
    docNo: '302/ພສາ.26',
    type: 'outgoing',
    title: 'ໃບສະເໜີຂໍອະນຸມັດງົບປະມານສົມທົບຊື້ອຸປະກອນການແພດ ສໍາລັບໂຮງໝໍເມືອງ',
    sender: 'ພະແນກສາທາລະນະສຸກ ແຂວງ ເຊກອງ',
    receiver: 'ພະແນກແຜນການ ແລະ ການລົງທຶນ ແຂວງ',
    docDate: '2026-05-20',
    receivedDate: '2026-05-20',
    category: 'ໃບສະເໜີ',
    priority: 'urgent',
    status: 'completed',
    description: 'ຂໍງົບປະມານເພີ່ມເຕີມໃນການຈັດຊື້ເຄື່ອງຊ່ວຍຫາຍໃຈ ແລະ ເຄື່ອງຕິດຕາມສັນຍານຊີບ 2 ຊຸດ.',
    assignedTo: 'ຂະແໜງແຜນການ ແລະ ການເງິນ',
    attachmentName: 'budget_request_medical_equipment.pdf',
    attachmentSize: '3.1 MB',
    logs: [
      {
        id: 'log-3-1',
        docId: 'doc-3',
        date: '2026-05-20 11:00',
        action: 'ສ້າງເອກະສານຂາອອກ',
        actor: 'ນາງ ມາລີ ວົງສາ (ຂະແໜງແຜນການ)',
        notes: 'ຮ່າງເອກະສານສະເໜີງົບປະມານ'
      },
      {
        id: 'log-3-2',
        docId: 'doc-3',
        date: '2026-05-20 14:30',
        action: 'ເຊັນອະນຸມັດ ແລະ ປຶກສາຫາລື',
        actor: 'ດຣ. ສີສະຫວາດ ຈັນທະມາລີ (ຫົວໜ້າພະແນກ)',
        notes: 'ເຊັນອະນຸມັດອອກທາງການຢ່າງເປັນທາງການ'
      },
      {
        id: 'log-3-3',
        docId: 'doc-3',
        date: '2026-05-22 16:00',
        action: 'ຊຳລະ/ໄດ້ຮັບອະນຸມັດແລ້ວ',
        actor: 'ນາງ ມາລີ ວົງສາ (ຂະແໜງແຜນການ)',
        notes: 'ໄດ້ຮັບໜັງສືອະນຸມັດງົບປະມານສົມທົບຮຽບຮ້ອຍແລ້ວ'
      }
    ]
  },
  {
    id: 'doc-4',
    regNo: '0126/ສກ',
    docNo: '12/ສສ.26',
    type: 'incoming',
    title: 'ບົດລາຍງານການເຝົ້າລະວັງໄຂ້ເລືອດອອກ ແລະ ໄຂ້ຍຸງລາຍ ປະຈໍາໄຕມາດ 1 ປີ 2026',
    sender: 'ສູນວິເຄາະ ແລະ ລະບາດວິທະຍາ, ກະຊວງສາທາລະນະສຸກ',
    receiver: 'ພະແນກສາທາລະນະສຸກ ແຂວງ ສາລະວັນ',
    docDate: '2026-05-22',
    receivedDate: '2026-05-24',
    category: 'ບົດລາຍງານ',
    priority: 'normal',
    status: 'completed',
    description: 'ສະຖິຕິການກວດພົບເຊື້ອ ແລະ ແຜນທີ່ຄວາມສ່ຽງ ຂອງແຂວງພາກໃຕ້.',
    assignedTo: 'ຂະແໜງກັນພະຍາດ ແລະ ສົ່ງເສີມສຸຂະພາບ',
    attachmentName: 'dengue_q1_report_laos.pdf',
    attachmentSize: '4.5 MB',
    logs: [
      {
        id: 'log-4-1',
        docId: 'doc-4',
        date: '2026-05-24 10:00',
        action: 'ບັນທຶກເອກະສານຂາເຂົ້າ',
        actor: 'ທ້າວ ສົມພອນ ແກ້ວມະນີ (ຫ້ອງການບໍລິຫານ)',
        notes: 'ລົງທະບຽນຂາເຂົ້າ'
      },
      {
        id: 'log-4-2',
        docId: 'doc-4',
        date: '2026-05-26 15:45',
        action: 'ອ່ານ ແລະ ບັນທຶກຂໍ້ສະຫຼຸບ',
        actor: 'ດຣ. ຈັນທິລາດ ສີຫາລາດ (ຂະແໜງກັນພະຍາດ)',
        notes: 'ກອງປະຊຸມມີມະຕິແນະນຳໃຫ້ທຸກເມືອງສີດຢາຂ້າຍຸງແລະທຳລາຍແຫຼ່ງເພາະພັນ'
      }
    ]
  },
  {
    id: 'doc-5',
    regNo: '0452/ພສາ',
    docNo: '310/ພສາ.26',
    type: 'outgoing',
    title: 'ຂໍ້ຕົກລົງແຕ່ງຕັ້ງຄະນະກຳມະການຮັບຜິດຊອບລົງກວດກາຄຸນນະພາບນ້ຳປະປາ ແລະ ສຸຂະອະນາໄມຕົວເມືອງ',
    sender: 'ພະແນກສາທາລະນະສຸກ ແຂວງ ເຊກອງ',
    receiver: 'ບັນດາຂະແໜງການອ້ອມຂ້າງ, ໂຮງໝໍແຂວງ, ແລະ ສາທາລະນະສຸກເມືອງ',
    docDate: '2026-05-25',
    receivedDate: '2026-05-25',
    category: 'ຂໍ້ຕົກລົງ',
    priority: 'normal',
    status: 'processing',
    description: 'ແຕ່ງຕັ້ງພະນັກງານວິຊາການຈຳນວນ 7 ທ່ານ ເພື່ອລົງກວດກາຮ້ານອາຫານ ແລະ ແຫຼ່ງນ້ຳບໍລິໂພກໃນຊ່ວງລະດູຮ້ອນ.',
    assignedTo: 'ຂະແໜງກວດກາ ແລະ ປະກັນສຸຂະພາບ',
    attachmentName: 'committee_appointment_water_quality.pdf',
    attachmentSize: '1.2 MB',
    logs: [
      {
        id: 'log-5-1',
        docId: 'doc-5',
        date: '2026-05-25 14:00',
        action: 'ຈັດສ້າງ ແລະ ອອກເລກຂໍ້ຕົກລົງ',
        actor: 'ນາງ ແສງດາວ ແກ້ວວົງສາ (ຂະແໜງຈັດຕັ້ງ)',
        notes: 'ຜ່ານການເຫັນດີຂອງຫົວໜ້າພະແນກ'
      }
    ]
  },
  {
    id: 'doc-6',
    regNo: '0453/ພສາ',
    docNo: '315/ພສາ.26',
    type: 'outgoing',
    title: 'ແຈ້ງການເຖິງໂຮງໝໍເມືອງ ແລະ ສຸກສາລາ ເພີ່ມທະວີການເຝົ້າລະວັງພະຍາດຖອກທ້ອງຮ້າຍແຮງໃນເດັກ',
    sender: 'ພະແນກສາທາລະນະສຸກ ແຂວງສາລະວັນ',
    receiver: 'ຫົວໜ້າຫ້ອງການສາທາລະນະສຸກ 4 ຕົວເມືອງ, ໂຮງໝໍເມືອງ ແລະ ສຸກສາລາທົ່ວແຂວງ',
    docDate: '2026-05-28',
    receivedDate: '2026-05-28',
    category: 'ແຈ້ງການ',
    priority: 'urgent',
    status: 'completed',
    description: 'ຍ້ອນມີລາຍງານການເພີ່ມຂຶ້ນຂອງຄົນເຈັບເດັກນ້ອຍທີ່ມີอาการຖອກທ້ອງເນື່ອງຈາກການບໍລິໂພກອາຫານ ແລະ ນ້ຳທີ່ບໍ່ສະອາດ.',
    assignedTo: 'ຂະແໜງກັນພະຍາດ ແລະ ສົ່ງເສີມສຸຂະພາບ',
    attachmentName: 'urgent_notice_rotavirus_diarrhea.pdf',
    attachmentSize: '950 KB',
    logs: [
      {
        id: 'log-6-1',
        docId: 'doc-6',
        date: '2026-05-28 09:30',
        action: 'ສ້າງແຈ້ງການດ່ວນ',
        actor: 'ດຣ. ຈັນທິລາດ ສີຫາລາດ (ຂະແໜງກັນພະຍາດ)',
        notes: 'ຮ່າງເນື້ອໃນດ່ວນທີ່ສຸດ'
      },
      {
        id: 'log-6-2',
        docId: 'doc-6',
        date: '2026-05-28 11:00',
        action: 'ລົງລາຍເຊັນອະນຸມັດ',
        actor: 'ດຣ. ບຸນໂຮມ ໂງ່ນກະເສີມສຸກ (ຫົວໜ້າພະແນກ)',
        notes: 'ອະນຸມັດອອກເລກທີສົ່ງທາງ Telegram, E-mail ແລະ ສົ່ງສະບັບຈິງ'
      }
    ]
  }
];
export const LOGGED_IN_USER = 'ດຣ. ບຸນໂຮມ ໂງ່ນກະເສີມສຸກ (ຫົວໜ້າພະແນກ)';
export const USER_ROLE = 'ຫົວໜ້າພະແນກສາທາລະນະສຸກ';
