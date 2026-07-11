import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DOC_REF = doc(db, 'appData', 'cddInfo');
export let firebaseCache = {};

export const loadFirebaseData = async () => {
  try {
    const snap = await getDoc(DOC_REF);
    if (snap.exists()) {
      firebaseCache = snap.data();
    } else {
      firebaseCache = {};
    }
  } catch (e) {
    console.error("Firebase load error", e);
    firebaseCache = {};
  }
};

const getFromFirebaseCache = (key) => {
  return firebaseCache[key] ? JSON.stringify(firebaseCache[key]) : null;
};

const saveToFirebase = (key, value) => {
  firebaseCache[key] = value;
  setDoc(DOC_REF, { [key]: value }, { merge: true }).catch(console.error);
};

const removeFromFirebaseCache = (key) => {
  delete firebaseCache[key];
  // Normally we would use updateDoc with deleteField() here, but setting to null is okay for now
  setDoc(DOC_REF, { [key]: null }, { merge: true }).catch(console.error);
};

// src/db.js

const DISTRICTS_KEY = 'ecc_districts_db';
const PROJECTS_KEY = 'ecc_projects_db';
const GROUPS_KEY = 'ecc_groups_db';
const BUDGET_MONTHLY_KEY = 'ecc_budget_monthly_db';
const KPIS_KEY = 'ecc_kpis_db';
const REPORTS_KEY = 'ecc_reports_db';
const WOMEN_STATS_KEY = 'ecc_women_stats_db';
const WOMEN_PROJECTS_KEY = 'ecc_women_projects_db';
const TPMAP_STATS_KEY = 'ecc_tpmap_stats_db';
const CUSTOM_SPECIAL_MENUS_KEY = 'ecc_custom_special_menus_db';
const AI_QUESTIONS_KEY = 'ecc_ai_questions_db';
const OTOP_PRODUCTS_KEY = 'ecc_otop_products_db';

export const DISTRICTS_LIST = [
  'ตำบลกะทู้',
  'ตำบลป่าตอง',
  'ตำบลกมลา'
];

export const OTOP_CATEGORIES = [
  'อาหาร',
  'เครื่องดื่ม',
  'ผ้าและเครื่องแต่งกาย',
  'ของใช้ ของตกแต่ง และของที่ระลึก',
  'สมุนไพรที่ไม่ใช่อาหาร'
];

export const AGENCIES_LIST = [
  'สำนักงานพัฒนาชุมชนอำเภอ (พช.)',
  'ที่ว่าการอำเภอ (ฝ่ายปกครอง)',
  'สำนักงานเกษตรอำเภอ',
  'สำนักงานสาธารณสุขอำเภอ',
  'ศูนย์ส่งเสริมการเรียนรู้อำเภอ (สกร./กศน.)',
  'สำนักงานพัฒนาสังคมและความมั่นคงของมนุษย์ (พม.)'
];

const GROUP_TYPES_KEY = 'ecc_group_types_db';

export function getGroupTypes() {
  let types = getFromFirebaseCache(GROUP_TYPES_KEY);
  if (!types) {
    types = [
      'กลุ่มออมทรัพย์',
      'กข.คจ.',
      'กองทุนแม่',
      'ศูนย์เรียนรู้',
      'กองทุนสตรี',
      'คณะกรรมการสตรี'
    ];
    saveToFirebase(GROUP_TYPES_KEY, types);
  } else {
    types = JSON.parse(types);
  }
  return types;
}

export const GROUP_TYPES = getGroupTypes();

export function addGroupType(type) {
  const types = getGroupTypes();
  if (type && !types.includes(type)) {
    types.push(type);
    saveToFirebase(GROUP_TYPES_KEY, types);
  }
  return types;
}

export function deleteGroupType(type) {
  let types = getGroupTypes();
  types = types.filter(t => t !== type);
  saveToFirebase(GROUP_TYPES_KEY, types);
  return types;
}

// Seed names for group presidents and villages
const FIRST_NAMES = ['สมชาย', 'สมศักดิ์', 'ประเสริฐ', 'วิชัย', 'มานะ', 'กิตติ', 'ธีรพล', 'เอกชัย', 'สุรพล', 'นิรันดร์', 'อนันต์', 'จิราพร', 'สุภาพร', 'พรทิพย์', 'นงลักษณ์', 'อารีย์', 'วรรณา', 'สมจิตร', 'ศิริพร', 'รัตนา', 'บุญยืน', 'ทวี', 'สมาน', 'ชลอ', 'ประจวบ', 'ปรีชา', 'สุชาติ', 'นพดล', 'อำพล', 'วิไล'];
const LAST_NAMES = ['ใจดี', 'รักชาติ', 'มั่นคง', 'รักดี', 'มีสุข', 'สีทอง', 'เจริญสุข', 'แสนดี', 'ทองแท้', 'แก้วใส', 'วงศ์คำ', 'บุญมี', 'งามตา', 'พัฒนา', 'ชูใจ', 'ยิ่งยง', 'แสงสว่าง', 'เกียรติภูมิ', 'สมบูรณ์', 'ปัญญาดี', 'แก้ววิจิตร', 'ดีใจ', 'สุขสำราญ', 'ศรีเมือง', 'ยอดรัก', 'เจริญผล', 'จันทร์กระจ่าง', 'เรืองรอง', 'สุขสันต์', 'รักษาแก้ว'];
const VILLAGES = ['บ้านดง', 'บ้านใหม่', 'บ้านกลาง', 'บ้านดอน', 'บ้านป่า', 'บ้านทุ่ง', 'บ้านศรี', 'บ้านทอง', 'บ้านยาง', 'บ้านหวาย', 'บ้านน้ำ', 'บ้านดอย', 'บ้านสัน', 'บ้านเหนือ', 'บ้านใต้', 'บ้านหลวง', 'บ้านสวน', 'บ้านไร่', 'บ้านโกรก', 'บ้านหนอง'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone() {
  const prefix = getRandomItem(['081', '082', '083', '084', '085', '086', '089', '091', '092', '095']);
  const part1 = Math.floor(100 + Math.random() * 900);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${part1}-${part2}`;
}

// Initialize mock data
export function initializeECCDatabase() {
  // 1. Districts DB
  let districts = getFromFirebaseCache(DISTRICTS_KEY);
  if (districts && (districts.includes('เชียงใหม่') || districts.includes('อ.เมือง'))) {
    removeFromFirebaseCache(DISTRICTS_KEY);
    removeFromFirebaseCache(PROJECTS_KEY);
    removeFromFirebaseCache(GROUPS_KEY);
    removeFromFirebaseCache(BUDGET_MONTHLY_KEY);
    removeFromFirebaseCache(KPIS_KEY);
    removeFromFirebaseCache(REPORTS_KEY);
    removeFromFirebaseCache(WOMEN_STATS_KEY);
    removeFromFirebaseCache(WOMEN_PROJECTS_KEY);
    removeFromFirebaseCache(TPMAP_STATS_KEY);
    removeFromFirebaseCache(CUSTOM_SPECIAL_MENUS_KEY);
    removeFromFirebaseCache('ecc_documents_db');
    districts = null;
  }
  
  if (!districts) {
    districts = [
      {
        name: 'ตำบลกะทู้',
        villages: 8,
        households: 14500,
        population: { male: 16500, female: 18100, elderly: 4500, kids: 3800, disabled: 210 },
        economy: { avgIncome: 185000, jobGroups: 15, otopProducers: 18 },
        budget: { received: 8500000, allocated: 8500000, committed: 7500000, disbursed: 7200000 },
        kpi: { total: 2, success: 0, inProgress: 2, atRisk: 0 },
        otopSales: 12400000,
        otopStars: { 5: 6, 4: 8, 3: 4, 2: 0, 1: 0 },
        lat: 7.9150,
        lng: 98.3400
      },
      {
        name: 'ตำบลป่าตอง',
        villages: 5,
        households: 11200,
        population: { male: 12100, female: 13500, elderly: 2800, kids: 2200, disabled: 120 },
        economy: { avgIncome: 245000, jobGroups: 24, otopProducers: 32 },
        budget: { received: 12000000, allocated: 12000000, committed: 10200000, disbursed: 9800000 },
        kpi: { total: 2, success: 1, inProgress: 1, atRisk: 0 },
        otopSales: 28600000,
        otopStars: { 5: 12, 4: 14, 3: 6, 2: 0, 1: 0 },
        lat: 7.8920,
        lng: 98.2970
      },
      {
        name: 'ตำบลกมลา',
        villages: 6,
        households: 6800,
        population: { male: 7800, female: 8200, elderly: 1900, kids: 1500, disabled: 90 },
        economy: { avgIncome: 165000, jobGroups: 12, otopProducers: 15 },
        budget: { received: 6500000, allocated: 6500000, committed: 5800000, disbursed: 5500000 },
        kpi: { total: 1, success: 1, inProgress: 0, atRisk: 0 },
        otopSales: 9400000,
        otopStars: { 5: 4, 4: 6, 3: 5, 2: 0, 1: 0 },
        lat: 7.9540,
        lng: 98.2850
      }
    ];
    saveToFirebase(DISTRICTS_KEY, districts);
  } else {
    districts = JSON.parse(districts);
  }

  // 2. Projects DB
  let projects = getFromFirebaseCache(PROJECTS_KEY);
  if (!projects) {
    projects = [
      {
        id: 'proj_1',
        name: 'โครงการพัฒนาหมู่บ้านเศรษฐกิจพอเพียงต้นแบบ',
        district: 'ตำบลกะทู้',
        budget: 450000,
        spent: 450000,
        status: 'เสร็จแล้ว',
        progress: 100,
        stage: 'ส่งมอบงานเรียบร้อย',
        lat: 7.9150,
        lng: 98.3400,
        manager: 'นายวิเชียร สุขสำราญ',
        image: 'https://images.unsplash.com/photo-1590682680394-b5594b596387?w=150&auto=format&fit=crop'
      },
      {
        id: 'proj_2',
        name: 'โครงการส่งเสริมกระบวนการเรียนรู้ชุมชนเพื่อการพึ่งตนเอง',
        district: 'ตำบลป่าตอง',
        budget: 320000,
        spent: 280000,
        status: 'ดำเนินการ',
        progress: 75,
        stage: 'กำลังดำเนินกิจกรรมรุ่นที่ 2',
        lat: 7.8920,
        lng: 98.2970,
        manager: 'นางดวงพร จันทร์สว่าง',
        image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=150&auto=format&fit=crop'
      },
      {
        id: 'proj_3',
        name: 'โครงการขยายผลการพัฒนาศูนย์จัดการกองทุนชุมชนดีเด่น',
        district: 'ตำบลกมลา',
        budget: 250000,
        spent: 240000,
        status: 'เสร็จแล้ว',
        progress: 100,
        stage: 'สรุปบทเรียนและปิดโครงการ',
        lat: 7.9540,
        lng: 98.2850,
        manager: 'นายสมบัติ ศรีเมือง',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150&auto=format&fit=crop'
      },
      {
        id: 'proj_4',
        name: 'โครงการพัฒนาบรรจุภัณฑ์ผลิตภัณฑ์ OTOP สู่สากล',
        district: 'ตำบลกะทู้',
        budget: 500000,
        spent: 250000,
        status: 'ดำเนินการ',
        progress: 50,
        stage: 'ตรวจรับบรรจุภัณฑ์ต้นแบบ',
        lat: 7.9130,
        lng: 98.3380,
        manager: 'นางวรรณี งามดี',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=150&auto=format&fit=crop'
      },
      {
        id: 'proj_5',
        name: 'โครงการส่งเสริมช่องทางจำหน่ายผลิตภัณฑ์ชุมชนออนไลน์',
        district: 'ตำบลป่าตอง',
        budget: 380000,
        spent: 375000,
        status: 'เสร็จแล้ว',
        progress: 100,
        stage: 'จัดตั้งเพจร้านค้าชุมชนสำเร็จ',
        lat: 7.8950,
        lng: 98.2990,
        manager: 'นายธนา วงศ์คำ',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&auto=format&fit=crop'
      },
      {
        id: 'proj_6',
        name: 'โครงการพัฒนาทักษะอาชีพระยะสั้นแก้ปัญหาความยากจน',
        district: 'ตำบลกมลา',
        budget: 600000,
        spent: 420000,
        status: 'ล่าช้า',
        progress: 40,
        stage: 'อยู่ระหว่างขอขยายเวลาสัญญาจ้างวิทยากร',
        lat: 7.9510,
        lng: 98.2820,
        manager: 'นายเกรียงศักดิ์ รักดี',
        image: 'https://images.unsplash.com/photo-1521791136368-1a46827d0515?w=150&auto=format&fit=crop'
      },
      {
        id: 'proj_7',
        name: 'โครงการปรับปรุงและพัฒนาอาชีพสตรีระดับอำเภอ',
        district: 'ตำบลกะทู้',
        budget: 280000,
        spent: 250000,
        status: 'ดำเนินการ',
        progress: 85,
        stage: 'อยู่ระหว่างฝึกปฏิบัติกลุ่มย่อย',
        lat: 7.9170,
        lng: 98.3420,
        manager: 'นางจารุวรรณ ปัญญาดี',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop'
      },
      {
        id: 'proj_8',
        name: 'โครงการสร้างรายได้จากกิจกรรมการท่องเที่ยววิถีชุมชน',
        district: 'ตำบลป่าตอง',
        budget: 800000,
        spent: 480000,
        status: 'ล่าช้า',
        progress: 30,
        stage: 'จัดทำป้ายเส้นทางนำเที่ยวล่าช้าเนื่องจากฝนตกหนัก',
        lat: 7.8880,
        lng: 98.2950,
        manager: 'นายณรงค์ สีทอง',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&auto=format&fit=crop'
      }
    ];
    saveToFirebase(PROJECTS_KEY, projects);
  } else {
    projects = JSON.parse(projects);
  }

  // 3. Groups / Organizations DB (Seed 342 groups utilizing exact user specifications)
  let groups = getFromFirebaseCache(GROUPS_KEY);
  
  if (!groups) {
    const initial6 = [
      { id: 'group_1', name: 'กองทุนแม่ของแผ่นดินบ้านดง', type: 'กองทุนแม่', district: 'ตำบลกะทู้', agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)', president: 'นายสมชาย ใจดี', phone: '081-234-5678', members: 35, status: 'ปกติ' },
      { id: 'group_2', name: 'กลุ่มออมทรัพย์เพื่อการผลิตบ้านดง', type: 'กลุ่มออมทรัพย์', district: 'ตำบลกะทู้', agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)', president: 'นางสาวสุภัญญา รักดี', phone: '082-345-6789', members: 28, status: 'ปกติ' },
      { id: 'group_3', name: 'กข.คจ. บ้านดง', type: 'กข.คจ.', district: 'ตำบลกะทู้', agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)', president: 'นายวิชัย มั่นคง', phone: '083-456-7890', members: 15, status: 'ติดตาม' },
      { id: 'group_4', name: 'ศูนย์เรียนรู้การพัฒนาชุมชนบ้านดง', type: 'ศูนย์เรียนรู้', district: 'ตำบลกะทู้', agency: 'ที่ว่าการอำเภอ (ฝ่ายปกครอง)', president: 'นางทองดี ศรีงาม', phone: '084-567-8901', members: 22, status: 'ปกติ' },
      { id: 'group_5', name: 'กองทุนพัฒนาบทบาทสตรีบ้านดง', type: 'กองทุนสตรี', district: 'ตำบลกะทู้', agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)', president: 'นางบุญมี แก้วใส', phone: '085-678-9012', members: 45, status: 'ปกติ' },
      { id: 'group_6', name: 'คณะกรรมการพัฒนาสตรีบ้านดง', type: 'คณะกรรมการสตรี', district: 'ตำบลกะทู้', agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)', president: 'นางอารีย์ แสงสว่าง', phone: '086-789-0123', members: 15, status: 'ปกติ' }
    ];

    const seededGroups = [...initial6];
    let idCounter = 7;

    const groupTypes = GROUP_TYPES;
    const districts = DISTRICTS_LIST;
    const agencies = AGENCIES_LIST;

    for (let i = 0; i < 336; i++) {
      const type = groupTypes[i % groupTypes.length];
      const district = districts[Math.floor(i / (336 / districts.length)) % districts.length];
      const agency = agencies[Math.floor(i / (336 / (districts.length * agencies.length))) % agencies.length];
      
      const villageName = getRandomItem(VILLAGES);
      const presidentPrefix = getRandomItem(['นาย', 'นาง', 'นางสาว']);
      const president = `${presidentPrefix}${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`;
      
      let name = '';
      if (type === 'กองทุนแม่') {
        name = `กองทุนแม่ของแผ่นดิน${villageName} ${district}`;
      } else if (type === 'กลุ่มออมทรัพย์') {
        name = `กลุ่มออมทรัพย์เพื่อการผลิต${villageName} ${district}`;
      } else if (type === 'กข.คจ.') {
        name = `กข.คจ. ${villageName} ${district}`;
      } else if (type === 'ศูนย์เรียนรู้') {
        name = `ศูนย์เรียนรู้การพัฒนาชุมชน${villageName} ${district}`;
      } else if (type === 'กองทุนสตรี') {
        name = `กองทุนพัฒนาบทบาทสตรี${villageName} ${district}`;
      } else if (type === 'คณะกรรมการสตรี') {
        name = `คณะกรรมการพัฒนาสตรี${villageName} ${district}`;
      } else {
        name = `${type}${villageName} ${district}`;
      }

      const members = Math.floor(Math.random() * 40) + 10;
      const rand = Math.random();
      const status = rand > 0.2 ? 'ปกติ' : rand > 0.08 ? 'ติดตาม' : 'แก้ไข';

      seededGroups.push({
        id: `group_${idCounter++}`,
        name,
        type,
        district,
        agency,
        president,
        phone: generatePhone(),
        members,
        status
      });
    }

    saveToFirebase(GROUPS_KEY, seededGroups);
    groups = seededGroups;
  } else {
    groups = JSON.parse(groups);
  }

  // 4. Monthly Budget Allocation
  let budgetMonthly = getFromFirebaseCache(BUDGET_MONTHLY_KEY);
  if (!budgetMonthly) {
    budgetMonthly = [
      { month: 'ต.ค.', target: 12000000, actual: 11500000, status: 'เบิกจ่ายแล้ว' },
      { month: 'พ.ย.', target: 15000000, actual: 13800000, status: 'เบิกจ่ายแล้ว' },
      { month: 'ธ.ค.', target: 18000000, actual: 16500000, status: 'เบิกจ่ายแล้ว' },
      { month: 'ม.ค.', target: 22000000, actual: 20200000, status: 'เบิกจ่ายแล้ว' },
      { month: 'ก.พ.', target: 26000000, actual: 24100000, status: 'เบิกจ่ายแล้ว' },
      { month: 'มี.ค.', target: 35000000, actual: 32000000, status: 'เบิกจ่ายแล้ว' },
      { month: 'เม.ย.', target: 48000000, actual: 44200000, status: 'เบิกจ่ายแล้ว' },
      { month: 'พ.ค.', target: 65000000, actual: 59800000, status: 'เบิกจ่ายแล้ว' },
      { month: 'มิ.ย.', target: 82000000, actual: 75900000, status: 'เบิกจ่ายแล้ว' },
      { month: 'ก.ค.', target: 110000000, actual: 98000000, status: 'เบิกจ่ายแล้ว' },
      { month: 'ส.ค.', target: 132000000, actual: 0, status: 'ยังไม่เบิกจ่าย' },
      { month: 'ก.ย.', target: 153500000, actual: 0, status: 'ยังไม่เบิกจ่าย' }
    ];
    saveToFirebase(BUDGET_MONTHLY_KEY, budgetMonthly);
  } else {
    budgetMonthly = JSON.parse(budgetMonthly).map(b => ({ 
      ...b, 
      planName: b.planName || '',
      budgetType: b.budgetType || 'โครงการยุทธศาสตร์',
      status: b.status || (b.actual > 0 ? 'เบิกจ่ายแล้ว' : 'ยังไม่เบิกจ่าย') 
    }));
  }

  // 5. KPIs DB
  let kpis = getFromFirebaseCache(KPIS_KEY);
  if (!kpis) {
    kpis = [
      { id: 'kpi_1', name: 'ร้อยละของหมู่บ้านที่มีการจัดตั้งกองทุนแม่สำเร็จ', target: 100, actual: 95, unit: '%', status: 'ดำเนินการ', district: 'ตำบลกะทู้', agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)' },
      { id: 'kpi_2', name: 'จำนวนกลุ่มออมทรัพย์เพื่อการผลิตที่ผ่านเกณฑ์ประเมินระดับดี', target: 15, actual: 12, unit: 'กลุ่ม', status: 'ดำเนินการ', district: 'ตำบลป่าตอง', agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)' },
      { id: 'kpi_3', name: 'ร้อยละการชำระคืนเงินกู้ยืมกองทุนสตรีตรงตามกำหนด', target: 90, actual: 92, unit: '%', status: 'สำเร็จ', district: 'ตำบลกมลา', agency: 'สำนักงานพัฒนาสังคมและความมั่นคงของมนุษย์ (พม.)' },
      { id: 'kpi_4', name: 'จำนวนศูนย์เรียนรู้การพัฒนาชุมชนต้นแบบที่มีผลงานประจักษ์', target: 5, actual: 2, unit: 'แห่ง', status: 'มีความเสี่ยง', district: 'ตำบลกะทู้', agency: 'ที่ว่าการอำเภอ (ฝ่ายปกครอง)' },
      { id: 'kpi_5', name: 'ร้อยละของสมาชิกกองทุนแม่ที่เข้าร่วมการฝึกอบรมสัมมาชีพ', target: 80, actual: 85, unit: '%', status: 'สำเร็จ', district: 'ตำบลป่าตอง', agency: 'ศูนย์ส่งเสริมการเรียนรู้อำเภอ (สกร./กศน.)' }
    ];
    saveToFirebase(KPIS_KEY, kpis);
  } else {
    kpis = JSON.parse(kpis);
  }

  // 6. Reports DB
  let reports = getFromFirebaseCache(REPORTS_KEY);
  if (!reports) {
    reports = [
      { id: 'rep_1', projectName: 'โครงการวัดประชารัฐสร้างสุข', month: 'ต.ค.', status: 'รายงานแล้ว', deadlineDate: '20 ต.ค. 2567', updatedAt: '2026-06-25' },
      { id: 'rep_2', projectName: 'โครงการวัดประชารัฐสร้างสุข', month: 'พ.ย.', status: 'รายงานแล้ว', deadlineDate: '20 พ.ย. 2567', updatedAt: '2026-06-25' },
      { id: 'rep_3', projectName: 'โครงการวัดประชารัฐสร้างสุข', month: 'ธ.ค.', status: 'รายงานแล้ว', deadlineDate: '20 ธ.ค. 2567', updatedAt: '2026-06-25' },
      { id: 'rep_4', projectName: 'โครงการวัดประชารัฐสร้างสุข', month: 'ม.ค.', status: 'รายงานแล้ว', deadlineDate: '20 ม.ค. 2568', updatedAt: '2026-06-25' },
      { id: 'rep_5', projectName: 'โครงการวัดประชารัฐสร้างสุข', month: 'ก.พ.', status: 'รายงานแล้ว', deadlineDate: '20 ก.พ. 2568', updatedAt: '2026-06-25' },
      { id: 'rep_6', projectName: 'โครงการวัดประชารัฐสร้างสุข', month: 'มี.ค.', status: 'รายงานแล้ว', deadlineDate: '20 มี.ค. 2568', updatedAt: '2026-06-25' },
      { id: 'rep_7', projectName: 'โครงการวัดประชารัฐสร้างสุข', month: 'เม.ย.', status: 'รายงานแล้ว', deadlineDate: '20 เม.ย. 2568', updatedAt: '2026-06-25' },
      { id: 'rep_8', projectName: 'โครงการวัดประชารัฐสร้างสุข', month: 'พ.ค.', status: 'กำลังดำเนินการ', deadlineDate: '20 พ.ค. 2568', updatedAt: '2026-06-25' },
      { id: 'rep_9', projectName: 'โครงการวัดประชารัฐสร้างสุข', month: 'มิ.ย.', status: 'ยังไม่รายงาน', deadlineDate: '20 มิ.ย. 2568', updatedAt: '2026-06-25' },
      { id: 'rep_10', projectName: 'โครงการวัดประชารัฐสร้างสุข', month: 'ก.ค.', status: 'ยังไม่รายงาน', deadlineDate: '20 ก.ค. 2568', updatedAt: '2026-06-25' },
      { id: 'rep_11', projectName: 'โครงการหนึ่งตำบลหนึ่งผลิตภัณฑ์ (OTOP) กะทู้', month: 'พ.ค.', status: 'รายงานแล้ว', deadlineDate: '20 พ.ค. 2568', updatedAt: '2026-06-25' },
      { id: 'rep_12', projectName: 'โครงการหนึ่งตำบลหนึ่งผลิตภัณฑ์ (OTOP) กะทู้', month: 'มิ.ย.', status: 'กำลังดำเนินการ', deadlineDate: '20 มิ.ย. 2568', updatedAt: '2026-06-25' },
      { id: 'rep_13', projectName: 'โครงการพัฒนาหมู่บ้านเศรษฐกิจพอเพียงกะทู้', month: 'มิ.ย.', status: 'รายงานแล้ว', deadlineDate: '20 มิ.ย. 2568', updatedAt: '2026-06-25' }
    ];
    saveToFirebase(REPORTS_KEY, reports);
  } else {
    reports = JSON.parse(reports);
  }

  // 7. Women Stats
  let womenStats = getFromFirebaseCache(WOMEN_STATS_KEY);
  if (!womenStats) {
    womenStats = { registeredMembers: 124500, revolvingFund: 34500000 };
    saveToFirebase(WOMEN_STATS_KEY, womenStats);
  }

  // 8. Women Projects
  let womenProjects = getFromFirebaseCache(WOMEN_PROJECTS_KEY);
  if (!womenProjects) {
    womenProjects = [
      { id: 'wp_1', name: 'กลุ่มทอผ้าสตรีล้านนา', groupsCount: '42 กลุ่ม', paybackRate: '98.5%' },
      { id: 'wp_2', name: 'กลุ่มแปรรูปอาหารสตรี', groupsCount: '35 กลุ่ม', paybackRate: '96.2%' }
    ];
    saveToFirebase(WOMEN_PROJECTS_KEY, womenProjects);
  }

  // 9. TPMAP Stats
  let tpmapStats = getFromFirebaseCache(TPMAP_STATS_KEY);
  if (!tpmapStats) {
    tpmapStats = { health: 120, living: 210, income: 290 };
    saveToFirebase(TPMAP_STATS_KEY, tpmapStats);
  }

  // 10. Custom Special Menus
  let customMenus = getFromFirebaseCache(CUSTOM_SPECIAL_MENUS_KEY);
  if (!customMenus) {
    customMenus = [
      { id: 'csm_1', name: 'โครงการพระราชดำริกะทู้', content: 'สรุปการดำเนินงานโครงการอันเนื่องมาจากพระราชดำริในพื้นที่อำเภอกะทู้:\n\n1. โครงการพัฒนาพื้นที่ลุ่มน้ำกมลา อันเนื่องมาจากพระราชดำริ\n2. โครงการอ่างเก็บน้ำบางวาด (แหล่งน้ำสำคัญหล่อเลี้ยงการประปาและการท่องเที่ยวอำเภอกะทู้)\n3. กิจกรรมปลูกป่าทดแทนในเขตป่าสงวนแห่งชาติเทือกเขานาคเกิด' }
    ];
    saveToFirebase(CUSTOM_SPECIAL_MENUS_KEY, customMenus);
  }

  // 11. AI Questions
  let aiQuestions = getFromFirebaseCache(AI_QUESTIONS_KEY);
  if (!aiQuestions) {
    aiQuestions = [
      { id: 'aiq_1', label: '📊 สรุปความก้าวหน้าทั้งจังหวัด', query: 'สรุปผลการดำเนินงานภาพรวม', answer: '' },
      { id: 'aiq_2', label: '📉 อำเภอที่มีงบเบิกจ่ายต่ำสุด', query: 'ตำบลใดเบิกจ่ายต่ำสุด', answer: '' },
      { id: 'aiq_3', label: '⚠️ ตัวชี้วัดเสี่ยงไม่ผ่านเป้า', query: 'ตำบลใดมีความเสี่ยงไม่ผ่าน KPI', answer: '' },
      { id: 'aiq_4', label: '🚨 ตรวจสอบโครงการวิกฤต', query: 'รายงานโครงการที่ล่าช้า', answer: '' }
    ];
    saveToFirebase(AI_QUESTIONS_KEY, aiQuestions);
  }

  // 12. OTOP Products
  let otopProducts = getFromFirebaseCache(OTOP_PRODUCTS_KEY);
  if (otopProducts && (!otopProducts.includes('"type":') || !otopProducts.includes('"district":'))) {
    removeFromFirebaseCache(OTOP_PRODUCTS_KEY);
    otopProducts = null;
  }
  if (!otopProducts) {
    otopProducts = [
      { id: 'op_1', name: 'น้ำพริกกุ้งเสียบป่าตอง', type: 'อาหาร', district: 'ตำบลป่าตอง', sale: 4500000, star: 5 },
      { id: 'op_2', name: 'มุกแท้กมลา', type: 'ของใช้ ของตกแต่ง และของที่ระลึก', district: 'ตำบลกมลา', sale: 3800000, star: 5 },
      { id: 'op_3', name: 'เม็ดมะม่วงหิมพานต์คั่วโบราณกะทู้', type: 'อาหาร', district: 'ตำบลกะทู้', sale: 3200000, star: 5 },
      { id: 'op_4', name: 'ผ้าบาติกเขียนมือกมลา', type: 'ผ้าและเครื่องแต่งกาย', district: 'ตำบลกมลา', sale: 2800000, star: 4 },
      { id: 'op_5', name: 'สับปะรดภูเก็ตหวานฉ่ำกะทู้', type: 'อาหาร', district: 'ตำบลกะทู้', sale: 2500000, star: 5 },
      { id: 'op_6', name: 'ไวน์สับปะรดภูเก็ต', type: 'เครื่องดื่ม', district: 'ตำบลป่าตอง', sale: 1800000, star: 4 },
      { id: 'op_7', name: 'น้ำมันมะพร้าวสกัดเย็นกะทู้', type: 'สมุนไพรที่ไม่ใช่อาหาร', district: 'ตำบลกะทู้', sale: 1500000, star: 5 }
    ];
    saveToFirebase(OTOP_PRODUCTS_KEY, otopProducts);
  }

  return { districts, projects, groups, budgetMonthly, kpis, reports };
}

// Getters
export function getDistricts() {
  initializeECCDatabase();
  const districts = JSON.parse(getFromFirebaseCache(DISTRICTS_KEY)) || [];
  const kpis = getKPIs();
  const otopProducts = JSON.parse(getFromFirebaseCache(OTOP_PRODUCTS_KEY)) || [];
  
  return districts.map(d => {
    const districtKpis = kpis.filter(k => k.district === d.name);
    const districtOtopSales = otopProducts.filter(p => p.district === d.name).reduce((sum, p) => sum + (p.sale || 0), 0);
    
    const kpiObj = districtKpis.length > 0 ? {
      total: districtKpis.length,
      success: districtKpis.filter(k => k.status === 'สำเร็จ').length,
      inProgress: districtKpis.filter(k => k.status === 'ดำเนินการ').length,
      atRisk: districtKpis.filter(k => k.status === 'มีความเสี่ยง').length
    } : d.kpi;

    return {
      ...d,
      otopSales: districtOtopSales,
      kpi: kpiObj
    };
  });
}

export function saveDistricts(districts) {
  saveToFirebase(DISTRICTS_KEY, districts);
}

export function getProjects() {
  initializeECCDatabase();
  return JSON.parse(getFromFirebaseCache(PROJECTS_KEY));
}

export function saveProjects(projects) {
  saveToFirebase(PROJECTS_KEY, projects);
}

export function getGroups() {
  initializeECCDatabase();
  const groups = JSON.parse(getFromFirebaseCache(GROUPS_KEY));
  const types = getGroupTypes();
  // Automatic migration: if cached groups use old categories, wipe and re-seed
  
  return groups;
}

export function saveGroups(groups) {
  saveToFirebase(GROUPS_KEY, groups);
}

export function getMonthlyBudgets() {
  initializeECCDatabase();
  return JSON.parse(getFromFirebaseCache(BUDGET_MONTHLY_KEY));
}

export function saveMonthlyBudgets(budgets) {
  saveToFirebase(BUDGET_MONTHLY_KEY, budgets);
}

// CRUD for Projects
export function addProject(project) {
  const projects = getProjects();
  const newProj = {
    ...project,
    id: `proj_${Date.now()}`
  };
  projects.push(newProj);
  saveProjects(projects);
  
  const districts = getDistricts();
  const dIndex = districts.findIndex(d => d.name === project.district);
  if (dIndex !== -1) {
    districts[dIndex].budget.disbursed += project.spent;
    saveDistricts(districts);
  }

  return newProj;
}

export function updateProject(id, updatedProject) {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    const oldProj = projects[index];
    projects[index] = { ...oldProj, ...updatedProject };
    saveProjects(projects);

    const districts = getDistricts();
    const dIndex = districts.findIndex(d => d.name === oldProj.district);
    if (dIndex !== -1) {
      districts[dIndex].budget.disbursed += (updatedProject.spent - oldProj.spent);
      saveDistricts(districts);
    }

    return projects[index];
  }
  return null;
}

export function deleteProject(id) {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    const oldProj = projects[index];
    const updated = projects.filter(p => p.id !== id);
    saveProjects(updated);

    const districts = getDistricts();
    const dIndex = districts.findIndex(d => d.name === oldProj.district);
    if (dIndex !== -1) {
      districts[dIndex].budget.disbursed -= oldProj.spent;
      saveDistricts(districts);
    }
    return updated;
  }
  return projects;
}

// CRUD for Groups
export function addGroup(group) {
  const groups = getGroups();
  const newGroup = {
    ...group,
    id: `group_${Date.now()}`
  };
  groups.unshift(newGroup);
  saveGroups(groups);
  return newGroup;
}

export function updateGroup(id, updatedGroup) {
  const groups = getGroups();
  const index = groups.findIndex(g => g.id === id);
  if (index !== -1) {
    groups[index] = { ...groups[index], ...updatedGroup };
    saveGroups(groups);
    return groups[index];
  }
  return null;
}

export function deleteGroup(id) {
  let groups = getGroups();
  groups = groups.filter(g => g.id !== id);
  saveGroups(groups);
  return groups;
}

// Simulated AI Q&A Analyzer
export function queryAI(prompt) {
  const districts = getDistricts();
  const projects = getProjects();
  const query = prompt.toLowerCase();

  const formatNum = (val) => new Intl.NumberFormat('th-TH').format(val);

  // Check custom questions database first
  const customQuestions = getAiQuestions();
  const matchedQ = customQuestions.find(q => q.query.toLowerCase() === query || q.label.toLowerCase() === query);
  if (matchedQ && matchedQ.answer) {
    return matchedQ.answer;
  }

  if (query.includes('เบิกจ่ายต่ำสุด') || query.includes('เบิกจ่ายน้อยสุด') || query.includes('เบิกจ่ายแย่สุด')) {
    let minRate = 100;
    let minDistrict = null;
    districts.forEach(d => {
      const rate = (d.budget.disbursed / d.budget.received) * 100;
      if (rate < minRate) {
        minRate = rate;
        minDistrict = d;
      }
    });

    return `จากการวิเคราะห์งบประมาณพัฒนาชุมชนรายตำบลของอำเภอกะทู้พบว่า **${minDistrict.name}** มีอัตราการเบิกจ่ายต่ำที่สุด อยู่ที่ **${minRate.toFixed(2)}%** (ได้รับจัดสรร ${formatNum(minDistrict.budget.received)} บาท, เบิกจ่ายแล้ว ${formatNum(minDistrict.budget.disbursed)} บาท, คงเหลือ ${formatNum(minDistrict.budget.received - minDistrict.budget.disbursed)} บาท) 

💡 *ข้อแนะนำผู้บริหาร:* ควรลงพื้นที่และส่งทีมงานเข้าไปช่วยเหลือหน่วยงานรับผิดชอบในพื้นที่นั้นๆ เพื่อเร่งแก้ไขปัญหาทันที`;
  }

  if (query.includes('เบิกจ่ายสูงสุด') || query.includes('เบิกจ่ายมากสุด') || query.includes('เบิกจ่ายดีสุด')) {
    let maxRate = 0;
    let maxDistrict = null;
    districts.forEach(d => {
      const rate = (d.budget.disbursed / d.budget.received) * 100;
      if (rate > maxRate) {
        maxRate = rate;
        maxDistrict = d;
      }
    });

    return `พื้นที่ที่มีอัตราการเบิกจ่ายงบประมาณสูงสุดของอำเภอกะทู้คือ **${maxDistrict.name}** เบิกจ่ายแล้ว **${maxRate.toFixed(2)}%** (เบิกจ่ายแล้ว ${formatNum(maxDistrict.budget.disbursed)} บาท จากที่ได้รับจัดสรร ${formatNum(maxDistrict.budget.received)} บาท) ถือว่าเป็นไปตามแผนงานที่กำหนด`;
  }

  if (query.includes('kpi') || query.includes('ตัวชี้วัด') || query.includes('ไม่ผ่าน')) {
    const sortedByRisk = [...districts].sort((a, b) => b.kpi.atRisk - a.kpi.atRisk);
    const topRisk = sortedByRisk[0];
    
    let response = `จากการตรวจสอบตัวชี้วัดผลงาน (KPI) ทั้งอำเภอกะทู้ มีตัวชี้วัดที่อยู่ในสถานะ **"เสี่ยงไม่บรรลุเป้าหมาย"** มากที่สุดที่ **${topRisk.name}** จำนวน **${topRisk.kpi.atRisk} ตัวชี้วัด** (สำเร็จ ${topRisk.kpi.success}, อยู่ระหว่างดำเนินการ ${topRisk.kpi.inProgress})
    
    รายละเอียดตำบลที่มีความเสี่ยงด้านตัวชี้วัด: \n`;
    sortedByRisk.forEach(d => {
      if (d.kpi.atRisk > 0) {
        response += `- **${d.name}**: เสี่ยงไม่บรรลุ ${d.kpi.atRisk} ตัวชี้วัด (สำเร็จคิดเป็น ${((d.kpi.success / d.kpi.total) * 100).toFixed(0)}%)\n`;
      }
    });

    response += `\n⚠️ *โครงการเป้าหมายที่ควรตรวจสอบเพิ่มเติม:* โครงการฝึกอาชีพและพัฒนาทักษะ OTOP ในพื้นที่เนื่องจากยังทำยอดขายไม่ได้เกณฑ์ที่กำหนด`;
    return response;
  }

  if (query.includes('ล่าช้า') || query.includes('ช้า') || query.includes('โครงการที่ยังไม่เสร็จ')) {
    const delayedProjects = projects.filter(p => p.status === 'ล่าช้า');
    if (delayedProjects.length === 0) {
      return `จากการตรวจสอบในฐานข้อมูลโครงการติดตามทั้งหมด ไม่พบโครงการใดที่มีสถานะล่าช้า (🔴 วิกฤต) ในขณะนี้ครับ`;
    }

    let response = `พบโครงการที่มีสถานะ **"ล่าช้ากว่ากำหนด" (🔴 วิกฤต)** จำนวน **${delayedProjects.length} โครงการ** ดังนี้:\n\n`;
    delayedProjects.forEach((p, idx) => {
      response += `${idx + 1}. **${p.name}** (${p.district})\n   - งบประมาณ: ${formatNum(p.budget)} บาท\n   - ผู้รับผิดชอบ: ${p.manager}\n   - พิกัดพื้นที่: Lat ${p.lat}, Lng ${p.lng}\n\n`;
    });
    
    response += `💡 *ข้อแนะนำผู้บริหาร:* ควรทำหนังสือแจ้งเตือนหรือให้ผู้รับผิดชอบโครงการรายงานปัญหาอุปสรรคเพื่อเสนอต่อพัฒนาการอำเภอกะทู้โดยด่วน`;
    return response;
  }

  if (query.includes('สรุปผล') || query.includes('ภาพรวม') || query.includes('รายงาน')) {
    const totalRec = districts.reduce((sum, d) => sum + d.budget.received, 0);
    const totalDisb = districts.reduce((sum, d) => sum + d.budget.disbursed, 0);
    const totalRisk = districts.reduce((sum, d) => sum + d.kpi.atRisk, 0);
    const totalSucc = districts.reduce((sum, d) => sum + d.kpi.success, 0);
    const totalKPIs = districts.reduce((sum, d) => sum + d.kpi.total, 0);
    const totalSales = districts.reduce((sum, d) => sum + d.otopSales, 0);

    return `### 📊 สรุปรายงานสถานะภาพรวมอำเภอกะทู้ (ECC Summary)
    
1. **งบประมาณและการเบิกจ่าย**:
   - งบได้รับจัดสรรทั้งหมด: **${formatNum(totalRec)} บาท**
   - เบิกจ่ายแล้ว: **${formatNum(totalDisb)} บาท** (คิดเป็น **${((totalDisb / totalRec) * 100).toFixed(2)}%**)
   - สถานะความมั่นคงทางการคลัง: 🟢 **ปกติ** (เป็นไปตามเป้าหมายไตรมาส 3)
 
2. **ตัวชี้วัดความสำเร็จ (KPIs)**:
   - ผ่านเป้าหมายแล้ว: **${totalSucc} ตัวชี้วัด** จากทั้งหมด ${totalKPIs} ตัวชี้วัด (คิดเป็น **${((totalSucc / totalKPIs) * 100).toFixed(2)}%**)
   - อยู่ในเกณฑ์เสี่ยงสีแดง: **${totalRisk} ตัวชี้วัด** (กระจายอยู่ในพื้นที่ ตำบลกมลา)
 
3. **เศรษฐกิจชุมชน OTOP**:
   - ยอดจำหน่าย OTOP สะสม: **${formatNum(totalSales)} บาท**
   - จำนวนผู้ประกอบการจดทะเบียน: **${districts.reduce((sum, d) => sum + d.economy.otopProducers, 0)} ราย**
   - ตำบลที่ทำยอดขาย OTOP สูงสุด: **ตำบลป่าตอง** (${formatNum(districts.find(d => d.name === 'ตำบลป่าตอง').otopSales)} บาท)
 
4. **โครงการติดตามการดำเนินงาน**:
   - จำนวนโครงการทั้งหมด: **${projects.length} โครงการหลัก**
   - สถานะการเบิกจ่ายล่าช้า: **${projects.filter(p => p.status === 'ล่าช้า').length} โครงการ** (ระดับวิกฤตสีแดง)`;
  }

  return `สวัสดีครับท่านผู้บริหาร ผมคือ AI Assistant ประจำ Command Center 
ขออภัยด้วยครับที่ผมไม่สามารถค้นหาข้อมูลที่ตรงกับ *" ${prompt} "* ได้โดยตรง 

ท่านสามารถเลือกถามคำถามด่วนที่เกี่ยวกับข้อมูลสถิติโดยตรงได้ดังนี้ครับ:
1. **"สรุปผลการดำเนินงานภาพรวม"** (เพื่อดูตัวเลขเศรษฐกิจ, KPI, และงบประมาณในระดับตำบล)
2. **"ตำบลใดเบิกจ่ายต่ำสุด"** (เพื่อตรวจสอบการเบิกจ่ายล่าช้า)
3. **"ตำบลใดมีความเสี่ยงไม่ผ่าน KPI"** (เพื่อดูตัวชี้วัดสถานะสีแดง)
4. **"รายงานโครงการที่ล่าช้า"** (เพื่อติดตามโครงการสถานะสีแดงในระบบติดตาม)`;
}

// CRUD for KPIs
export function getKPIs() {
  initializeECCDatabase();
  return JSON.parse(getFromFirebaseCache(KPIS_KEY)) || [];
}

export function saveKPIs(kpis) {
  saveToFirebase(KPIS_KEY, kpis);
}

export function addKPI(kpi) {
  const kpis = getKPIs();
  const newKpi = {
    ...kpi,
    id: `kpi_${Date.now()}`
  };
  kpis.unshift(newKpi);
  saveKPIs(kpis);
  return newKpi;
}

export function updateKPI(id, updatedKpi) {
  const kpis = getKPIs();
  const index = kpis.findIndex(k => k.id === id);
  if (index !== -1) {
    kpis[index] = { ...kpis[index], ...updatedKpi };
    saveKPIs(kpis);
    return kpis[index];
  }
  return null;
}

export function deleteKPI(id) {
  let kpis = getKPIs();
  kpis = kpis.filter(k => k.id !== id);
  saveKPIs(kpis);
  return kpis;
}

// CRUD for Report Tracking
export function getReports() {
  initializeECCDatabase();
  return JSON.parse(getFromFirebaseCache(REPORTS_KEY)) || [];
}

export function saveReports(reports) {
  saveToFirebase(REPORTS_KEY, reports);
}

export function addReport(report) {
  const reports = getReports();
  const newReport = {
    ...report,
    id: `rep_${Date.now()}`,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  reports.unshift(newReport);
  saveReports(reports);
  return newReport;
}

export function updateReport(id, updatedReport) {
  const reports = getReports();
  const index = reports.findIndex(r => r.id === id);
  if (index !== -1) {
    reports[index] = { 
      ...reports[index], 
      ...updatedReport,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    saveReports(reports);
    return reports[index];
  }
  return null;
}

export function deleteReport(id) {
  let reports = getReports();
  reports = reports.filter(r => r.id !== id);
  saveReports(reports);
  return reports;
}

// Special Portals data getters/setters/CRUD
export function getWomenStats() {
  initializeECCDatabase();
  return JSON.parse(getFromFirebaseCache(WOMEN_STATS_KEY)) || { registeredMembers: 124500, revolvingFund: 34500000 };
}

export function saveWomenStats(stats) {
  saveToFirebase(WOMEN_STATS_KEY, stats);
}

export function getWomenProjects() {
  initializeECCDatabase();
  return JSON.parse(getFromFirebaseCache(WOMEN_PROJECTS_KEY)) || [];
}

export function saveWomenProjects(projects) {
  saveToFirebase(WOMEN_PROJECTS_KEY, projects);
}

export function addWomenProject(project) {
  const projects = getWomenProjects();
  const newProj = {
    ...project,
    id: `wp_${Date.now()}`
  };
  projects.push(newProj);
  saveWomenProjects(projects);
  return newProj;
}

export function updateWomenProject(id, updated) {
  const projects = getWomenProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updated };
    saveWomenProjects(projects);
    return projects[index];
  }
  return null;
}

export function deleteWomenProject(id) {
  let projects = getWomenProjects();
  projects = projects.filter(p => p.id !== id);
  saveWomenProjects(projects);
  return projects;
}

export function getTpmapStats() {
  initializeECCDatabase();
  return JSON.parse(getFromFirebaseCache(TPMAP_STATS_KEY)) || { health: 120, living: 210, income: 290 };
}

export function saveTpmapStats(stats) {
  saveToFirebase(TPMAP_STATS_KEY, stats);
}

export function getCustomSpecialMenus() {
  initializeECCDatabase();
  return JSON.parse(getFromFirebaseCache(CUSTOM_SPECIAL_MENUS_KEY)) || [];
}

export function saveCustomSpecialMenus(menus) {
  saveToFirebase(CUSTOM_SPECIAL_MENUS_KEY, menus);
}

export function addCustomSpecialMenu(menu) {
  const menus = getCustomSpecialMenus();
  const newMenu = {
    ...menu,
    id: `csm_${Date.now()}`
  };
  menus.push(newMenu);
  saveCustomSpecialMenus(menus);
  return newMenu;
}

export function updateCustomSpecialMenu(id, updated) {
  const menus = getCustomSpecialMenus();
  const index = menus.findIndex(m => m.id === id);
  if (index !== -1) {
    menus[index] = { ...menus[index], ...updated };
    saveCustomSpecialMenus(menus);
    return menus[index];
  }
  return null;
}

export function deleteCustomSpecialMenu(id) {
  let menus = getCustomSpecialMenus();
  menus = menus.filter(m => m.id !== id);
  saveCustomSpecialMenus(menus);
  return menus;
}

export function getAiQuestions() {
  initializeECCDatabase();
  return JSON.parse(getFromFirebaseCache(AI_QUESTIONS_KEY)) || [];
}

export function saveAiQuestions(questions) {
  saveToFirebase(AI_QUESTIONS_KEY, questions);
}

export function addAiQuestion(question) {
  const questions = getAiQuestions();
  const newQ = {
    ...question,
    id: `aiq_${Date.now()}`
  };
  questions.push(newQ);
  saveAiQuestions(questions);
  return newQ;
}

export function updateAiQuestion(id, updated) {
  const questions = getAiQuestions();
  const index = questions.findIndex(q => q.id === id);
  if (index !== -1) {
    questions[index] = { ...questions[index], ...updated };
    saveAiQuestions(questions);
    return questions[index];
  }
  return null;
}

export function deleteAiQuestion(id) {
  let questions = getAiQuestions();
  questions = questions.filter(q => q.id !== id);
  saveAiQuestions(questions);
  return questions;
}

export function getOtopProducts() {
  initializeECCDatabase();
  const products = JSON.parse(getFromFirebaseCache(OTOP_PRODUCTS_KEY)) || [];
  return products.sort((a, b) => (b.sale || 0) - (a.sale || 0));
}

export function saveOtopProducts(products) {
  saveToFirebase(OTOP_PRODUCTS_KEY, products);
}

export function addOtopProduct(product) {
  const products = getOtopProducts();
  const newProduct = {
    ...product,
    id: `op_${Date.now()}`
  };
  products.push(newProduct);
  saveOtopProducts(products);
  return newProduct;
}

export function updateOtopProduct(id, updated) {
  const products = getOtopProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updated };
    saveOtopProducts(products);
    return products[index];
  }
  return null;
}

export function deleteOtopProduct(id) {
  let products = getOtopProducts();
  products = products.filter(p => p.id !== id);
  saveOtopProducts(products);
  return products;
}

export function validateUserLogin(username, password) {
  const users = [
    { username: 'executive', password: 'executive123', name: 'พัฒนาการอำเภอกะทู้', role: 'executive' },
    { username: 'admin', password: 'admin123', name: 'ผู้ดูแลระบบ (Admin)', role: 'admin' }
  ];
  const match = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  if (match) {
    const { password: _, ...userWithoutPassword } = match;
    return userWithoutPassword;
  }
  return null;
}

const DOCUMENTS_KEY = 'ecc_documents_db';

export function getDocuments() {
  let docs = getFromFirebaseCache(DOCUMENTS_KEY);
  if (!docs) {
    docs = [
      { id: 'doc_1', name: 'ใบสมัครลงทะเบียนผู้ผลิต ผู้ประกอบการ OTOP', type: 'PDF', size: '245 KB', category: 'OTOP', link: 'https://cdd.go.th/otop-register-form' },
      { id: 'doc_2', name: 'แบบคำขออนุมัติใช้เครื่องหมายสัญลักษณ์ผลิตภัณฑ์ OTOP', type: 'PDF', size: '180 KB', category: 'OTOP', link: 'https://cdd.go.th/otop-logo-request' },
      { id: 'doc_3', name: 'คู่มือเกณฑ์มาตรฐานการคัดสรรดาวผลิตภัณฑ์ OTOP', type: 'PDF', size: '1.2 MB', category: 'OTOP', link: 'https://cdd.go.th/otop-star-criteria' },
      { id: 'doc_4', name: 'ใบสมัครสมาชิกกองทุนพัฒนาสตรี (ประเภทบุคคลธรรมดา)', type: 'PDF', size: '190 KB', category: 'กองทุนสตรี', link: 'https://womenfund.cdd.go.th/member-apply' },
      { id: 'doc_5', name: 'แบบเสนอโครงการขอรับการสนับสนุนเงินกู้ยืมสตรี', type: 'DOCX', size: '85 KB', category: 'กองทุนสตรี', link: 'https://womenfund.cdd.go.th/project-proposal' },
      { id: 'doc_6', name: 'แบบรายงานผลสำเร็จการดำเนินงานโครงการสตรีประจำไตรมาส', type: 'PDF', size: '310 KB', category: 'กองทุนสตรี', link: 'https://womenfund.cdd.go.th/quarter-report' },
      { id: 'doc_7', name: 'คำขอจดทะเบียนจัดตั้งกลุ่มออมทรัพย์เพื่อการผลิต', type: 'PDF', size: '215 KB', category: 'องค์กรชุมชน', link: 'https://cdd.go.th/saving-group-setup' },
      { id: 'doc_8', name: 'แบบฟอร์มจัดตั้งและเสนอชื่อกองทุนแม่ของแผ่นดิน', type: 'PDF', size: '150 KB', category: 'องค์กรชุมชน', link: 'https://cdd.go.th/mother-fund-setup' },
      { id: 'doc_9', name: 'คู่มือระเบียบปฏิบัติและแนวทางโครงการ กข.คจ.', type: 'PDF', size: '1.8 MB', category: 'องค์กรชุมชน', link: 'https://cdd.go.th/kbkj-manual' }
    ];
    saveToFirebase(DOCUMENTS_KEY, docs);
  } else {
    docs = JSON.parse(docs);
  }
  return docs;
}

export function saveDocuments(docs) {
  saveToFirebase(DOCUMENTS_KEY, docs);
}

export function addDocument(doc) {
  const docs = getDocuments();
  const newDoc = {
    ...doc,
    id: `doc_${Date.now()}`
  };
  docs.push(newDoc);
  saveDocuments(docs);
  return newDoc;
}

export function updateDocument(id, updated) {
  const docs = getDocuments();
  const index = docs.findIndex(d => d.id === id);
  if (index !== -1) {
    docs[index] = { ...docs[index], ...updated };
    saveDocuments(docs);
    return docs[index];
  }
  return null;
}

export function deleteDocument(id) {
  let docs = getDocuments();
  docs = docs.filter(d => d.id !== id);
  saveDocuments(docs);
  return docs;
}
