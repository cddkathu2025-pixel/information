import { rtdb } from './firebase';
import { ref, get, set, child } from 'firebase/database';

const DB_REF = ref(rtdb);
const APP_PATH = 'appData/cddInfo';
export let firebaseCache = null;

export const loadFirebaseData = async () => {
  try {
    const snap = await get(child(DB_REF, APP_PATH));
    if (snap.exists()) {
      firebaseCache = snap.val();
    } else {
      firebaseCache = {};
    }
    return true;
  } catch (e) {
    console.error("Firebase RTDB load error", e);
    firebaseCache = {};
    return false;
  }
};

const getFromFirebaseCache = (key) => {
  if (!firebaseCache) {
    return null;
  }
  return firebaseCache[key] ? JSON.stringify(firebaseCache[key]) : null;
};

const DEBUG = true;

const saveToFirebase = async (key, value) => {
  if (!firebaseCache) firebaseCache = {};
  firebaseCache[key] = value;
  
  try {
    await set(ref(rtdb, `${APP_PATH}/${key}`), value);
    
    // Optional: read back to verify
    const verifySnap = await get(child(DB_REF, `${APP_PATH}/${key}`));
    if (!verifySnap.exists() && value && (Array.isArray(value) ? value.length > 0 : true)) {
      throw new Error("ไม่พบข้อมูลบนฐานข้อมูลหลังบันทึก (RTDB)");
    }
    
    return true;
  } catch (e) {
    console.error("Firebase RTDB save error", e);
    alert("❌ บันทึกฐานข้อมูลใหม่ (RTDB) ไม่สำเร็จ: " + e.message);
    throw e;
  }
};


// Database Keys
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
const GROUP_TYPES_KEY = 'ecc_group_types_db';

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

// --- Group Types ---
export function getGroupTypes() {
  const types = getFromFirebaseCache(GROUP_TYPES_KEY);
  if (!types) {
    return [
      'กลุ่มออมทรัพย์',
      'กข.คจ.',
      'กองทุนแม่',
      'ศูนย์เรียนรู้',
      'กองทุนสตรี',
      'คณะกรรมการสตรี'
    ];
  }
  return JSON.parse(types);
}

export const GROUP_TYPES = getGroupTypes();

export async function addGroupType(type) {
  const types = getGroupTypes();
  if (type && !types.includes(type)) {
    types.push(type);
    await saveToFirebase(GROUP_TYPES_KEY, types);
  }
  return types;
}

export async function deleteGroupType(type) {
  let types = getGroupTypes();
  types = types.filter(t => t !== type);
  await saveToFirebase(GROUP_TYPES_KEY, types);
  return types;
}

// --- Districts ---
const DEFAULT_DISTRICTS = [
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

export function getDistricts() {
  const data = getFromFirebaseCache(DISTRICTS_KEY);
  let districts = data ? JSON.parse(data) : JSON.parse(JSON.stringify(DEFAULT_DISTRICTS));
  
  const kpis = getKPIs();
  const otopProducts = getOtopProducts();
  
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

export async function saveDistricts(districts) {
  await saveToFirebase(DISTRICTS_KEY, districts);
}

// --- Projects ---
export function getProjects() {
  const data = getFromFirebaseCache(PROJECTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveProjects(projects) {
  await saveToFirebase(PROJECTS_KEY, projects);
}

export async function addProject(project) {
  const projects = getProjects();
  const newProj = {
    ...project,
    id: `proj_${Date.now()}`
  };
  projects.push(newProj);
  await saveProjects(projects);
  
  const districts = getDistricts();
  const dIndex = districts.findIndex(d => d.name === project.district);
  if (dIndex !== -1) {
    districts[dIndex].budget.disbursed += project.spent;
    await saveDistricts(districts);
  }
  return newProj;
}

export async function updateProject(id, updatedProject) {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    const oldProj = projects[index];
    projects[index] = { ...oldProj, ...updatedProject };
    await saveProjects(projects);

    const districts = getDistricts();
    const dIndex = districts.findIndex(d => d.name === oldProj.district);
    if (dIndex !== -1) {
      districts[dIndex].budget.disbursed += (updatedProject.spent - oldProj.spent);
      await saveDistricts(districts);
    }
    return projects[index];
  }
  return null;
}

export async function deleteProject(id) {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    const oldProj = projects[index];
    const updated = projects.filter(p => p.id !== id);
    await saveProjects(updated);

    const districts = getDistricts();
    const dIndex = districts.findIndex(d => d.name === oldProj.district);
    if (dIndex !== -1) {
      districts[dIndex].budget.disbursed -= oldProj.spent;
      await saveDistricts(districts);
    }
    return updated;
  }
  return projects;
}

// --- Groups ---
export function getGroups() {
  const data = getFromFirebaseCache(GROUPS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveGroups(groups) {
  await saveToFirebase(GROUPS_KEY, groups);
}

export async function addGroup(group) {
  const groups = getGroups();
  const newGroup = {
    ...group,
    id: `group_${Date.now()}`
  };
  groups.unshift(newGroup);
  await saveGroups(groups);
  return newGroup;
}

export async function updateGroup(id, updatedGroup) {
  const groups = getGroups();
  const index = groups.findIndex(g => g.id === id);
  if (index !== -1) {
    groups[index] = { ...groups[index], ...updatedGroup };
    await saveGroups(groups);
    return groups[index];
  }
  return null;
}

export async function deleteGroup(id) {
  let groups = getGroups();
  groups = groups.filter(g => g.id !== id);
  await saveGroups(groups);
  return groups;
}

// --- Budgets ---
export function getMonthlyBudgets() {
  const data = getFromFirebaseCache(BUDGET_MONTHLY_KEY);
  if (!data) return [];
  return JSON.parse(data).map(b => ({ 
    ...b, 
    planName: b.planName || '',
    budgetType: b.budgetType || 'โครงการยุทธศาสตร์',
    status: b.status || (b.actual > 0 ? 'เบิกจ่ายแล้ว' : 'ยังไม่เบิกจ่าย') 
  }));
}

export async function saveMonthlyBudgets(budgets) {
  await saveToFirebase(BUDGET_MONTHLY_KEY, budgets);
}

// --- KPIs ---
export function getKPIs() {
  const data = getFromFirebaseCache(KPIS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveKPIs(kpis) {
  await saveToFirebase(KPIS_KEY, kpis);
}

export async function addKPI(kpi) {
  const kpis = getKPIs();
  const newKpi = {
    ...kpi,
    id: `kpi_${Date.now()}`
  };
  kpis.unshift(newKpi);
  await saveKPIs(kpis);
  return newKpi;
}

export async function updateKPI(id, updatedKpi) {
  const kpis = getKPIs();
  const index = kpis.findIndex(k => k.id === id);
  if (index !== -1) {
    kpis[index] = { ...kpis[index], ...updatedKpi };
    await saveKPIs(kpis);
    return kpis[index];
  }
  return null;
}

export async function deleteKPI(id) {
  let kpis = getKPIs();
  kpis = kpis.filter(k => k.id !== id);
  await saveKPIs(kpis);
  return kpis;
}

// --- Reports ---
export function getReports() {
  const data = getFromFirebaseCache(REPORTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveReports(reports) {
  await saveToFirebase(REPORTS_KEY, reports);
}

export async function addReport(report) {
  const reports = getReports();
  const newReport = {
    ...report,
    id: `rep_${Date.now()}`,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  reports.unshift(newReport);
  await saveReports(reports);
  return newReport;
}

export async function updateReport(id, updatedReport) {
  const reports = getReports();
  const index = reports.findIndex(r => r.id === id);
  if (index !== -1) {
    reports[index] = { 
      ...reports[index], 
      ...updatedReport,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    await saveReports(reports);
    return reports[index];
  }
  return null;
}

export async function deleteReport(id) {
  let reports = getReports();
  reports = reports.filter(r => r.id !== id);
  await saveReports(reports);
  return reports;
}

// --- Women Stats ---
export function getWomenStats() {
  const data = getFromFirebaseCache(WOMEN_STATS_KEY);
  return data ? JSON.parse(data) : { 
    registeredMembers: 124500, 
    revolvingFund: 34500000,
    overduePercent: 5.2,
    totalProjects: 120,
    overdueProjects: 8,
    litigatedProjects: 2,
    nearingExpirationProjects: 1
  };
}

export async function saveWomenStats(stats) {
  await saveToFirebase(WOMEN_STATS_KEY, stats);
}

// --- Women Projects ---
export function getWomenProjects() {
  const data = getFromFirebaseCache(WOMEN_PROJECTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveWomenProjects(projects) {
  await saveToFirebase(WOMEN_PROJECTS_KEY, projects);
}

export async function addWomenProject(project) {
  const projects = getWomenProjects();
  const newProj = {
    ...project,
    id: `wp_${Date.now()}`
  };
  projects.push(newProj);
  await saveWomenProjects(projects);
  return newProj;
}

export async function updateWomenProject(id, updated) {
  const projects = getWomenProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updated };
    await saveWomenProjects(projects);
    return projects[index];
  }
  return null;
}

export async function deleteWomenProject(id) {
  let projects = getWomenProjects();
  projects = projects.filter(p => p.id !== id);
  await saveWomenProjects(projects);
  return projects;
}

// --- TPMAP Stats ---
export function getTpmapStats() {
  const data = getFromFirebaseCache(TPMAP_STATS_KEY);
  return data ? JSON.parse(data) : { health: 120, living: 210, income: 290 };
}

export async function saveTpmapStats(stats) {
  await saveToFirebase(TPMAP_STATS_KEY, stats);
}

// --- Custom Special Menus ---
export function getCustomSpecialMenus() {
  const data = getFromFirebaseCache(CUSTOM_SPECIAL_MENUS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveCustomSpecialMenus(menus) {
  await saveToFirebase(CUSTOM_SPECIAL_MENUS_KEY, menus);
}

export async function addCustomSpecialMenu(menu) {
  const menus = getCustomSpecialMenus();
  const newMenu = {
    ...menu,
    id: `csm_${Date.now()}`
  };
  menus.push(newMenu);
  await saveCustomSpecialMenus(menus);
  return newMenu;
}

export async function updateCustomSpecialMenu(id, updated) {
  const menus = getCustomSpecialMenus();
  const index = menus.findIndex(m => m.id === id);
  if (index !== -1) {
    menus[index] = { ...menus[index], ...updated };
    await saveCustomSpecialMenus(menus);
    return menus[index];
  }
  return null;
}

export async function deleteCustomSpecialMenu(id) {
  let menus = getCustomSpecialMenus();
  menus = menus.filter(m => m.id !== id);
  await saveCustomSpecialMenus(menus);
  return menus;
}

// --- AI Questions ---
export function getAiQuestions() {
  const data = getFromFirebaseCache(AI_QUESTIONS_KEY);
  return data ? JSON.parse(data) : [
    { id: 'aiq_1', label: '📊 สรุปความก้าวหน้าทั้งจังหวัด', query: 'สรุปผลการดำเนินงานภาพรวม', answer: '' },
    { id: 'aiq_2', label: '📉 อำเภอที่มีงบเบิกจ่ายต่ำสุด', query: 'ตำบลใดเบิกจ่ายต่ำสุด', answer: '' },
    { id: 'aiq_3', label: '⚠️ ตัวชี้วัดเสี่ยงไม่ผ่านเป้า', query: 'ตำบลใดมีความเสี่ยงไม่ผ่าน KPI', answer: '' },
    { id: 'aiq_4', label: '🚨 ตรวจสอบโครงการวิกฤต', query: 'รายงานโครงการที่ล่าช้า', answer: '' }
  ];
}

export async function saveAiQuestions(questions) {
  await saveToFirebase(AI_QUESTIONS_KEY, questions);
}

export async function addAiQuestion(question) {
  const questions = getAiQuestions();
  const newQ = {
    ...question,
    id: `aiq_${Date.now()}`
  };
  questions.push(newQ);
  await saveAiQuestions(questions);
  return newQ;
}

export async function updateAiQuestion(id, updated) {
  const questions = getAiQuestions();
  const index = questions.findIndex(q => q.id === id);
  if (index !== -1) {
    questions[index] = { ...questions[index], ...updated };
    await saveAiQuestions(questions);
    return questions[index];
  }
  return null;
}

export async function deleteAiQuestion(id) {
  let questions = getAiQuestions();
  questions = questions.filter(q => q.id !== id);
  await saveAiQuestions(questions);
  return questions;
}

// --- OTOP Products ---
export function getOtopProducts() {
  const data = getFromFirebaseCache(OTOP_PRODUCTS_KEY);
  const products = data ? JSON.parse(data) : [
    { id: 'op_1', name: 'น้ำพริกกุ้งเสียบป่าตอง', type: 'อาหาร', district: 'ตำบลป่าตอง', sale: 4500000, star: 5 },
    { id: 'op_2', name: 'มุกแท้กมลา', type: 'ของใช้ ของตกแต่ง และของที่ระลึก', district: 'ตำบลกมลา', sale: 3800000, star: 5 },
    { id: 'op_3', name: 'เม็ดมะม่วงหิมพานต์คั่วโบราณกะทู้', type: 'อาหาร', district: 'ตำบลกะทู้', sale: 3200000, star: 5 },
    { id: 'op_4', name: 'ผ้าบาติกเขียนมือกมลา', type: 'ผ้าและเครื่องแต่งกาย', district: 'ตำบลกมลา', sale: 2800000, star: 4 },
    { id: 'op_5', name: 'สับปะรดภูเก็ตหวานฉ่ำกะทู้', type: 'อาหาร', district: 'ตำบลกะทู้', sale: 2500000, star: 5 },
    { id: 'op_6', name: 'ไวน์สับปะรดภูเก็ต', type: 'เครื่องดื่ม', district: 'ตำบลป่าตอง', sale: 1800000, star: 4 },
    { id: 'op_7', name: 'น้ำมันมะพร้าวสกัดเย็นกะทู้', type: 'สมุนไพรที่ไม่ใช่อาหาร', district: 'ตำบลกะทู้', sale: 1500000, star: 5 }
  ];
  return products.sort((a, b) => (b.sale || 0) - (a.sale || 0));
}

export async function saveOtopProducts(products) {
  await saveToFirebase(OTOP_PRODUCTS_KEY, products);
}

export async function addOtopProduct(product) {
  const products = getOtopProducts();
  const newProd = {
    ...product,
    id: `op_${Date.now()}`
  };
  products.push(newProd);
  await saveOtopProducts(products);
  return newProd;
}

export async function updateOtopProduct(id, updated) {
  const products = getOtopProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updated };
    await saveOtopProducts(products);
    return products[index];
  }
  return null;
}

export async function deleteOtopProduct(id) {
  let products = getOtopProducts();
  products = products.filter(p => p.id !== id);
  await saveOtopProducts(products);
  return products;
}

// --- Documents ---
const DOCUMENTS_KEY = 'ecc_documents_db';

export function getDocuments() {
  const data = getFromFirebaseCache(DOCUMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveDocuments(documents) {
  await saveToFirebase(DOCUMENTS_KEY, documents);
}

export async function addDocument(document) {
  const documents = getDocuments();
  const newDoc = {
    ...document,
    id: `doc_${Date.now()}`
  };
  documents.unshift(newDoc);
  await saveDocuments(documents);
  return newDoc;
}

export async function updateDocument(id, updated) {
  const documents = getDocuments();
  const index = documents.findIndex(d => d.id === id);
  if (index !== -1) {
    documents[index] = { ...documents[index], ...updated };
    await saveDocuments(documents);
    return documents[index];
  }
  return null;
}

export async function deleteDocument(id) {
  let documents = getDocuments();
  documents = documents.filter(d => d.id !== id);
  await saveDocuments(documents);
  return documents;
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

export function getUserRoleByEmail(email) {
  const normalizedEmail = (email || '').toLowerCase().trim();
  if (normalizedEmail === 'executive@cddkathu.com' || normalizedEmail === 'cdd@kathu.com') {
    return { name: 'ผู้ใช้งาน', role: 'executive', email: normalizedEmail };
  }
  if (normalizedEmail === 'admin@cddkathu.com' || normalizedEmail === 'cddkathu@2569.com') {
    return { name: 'แอดมิน (Admin)', role: 'admin', email: normalizedEmail };
  }
  return null;
}
