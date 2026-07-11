// src/App.jsx
import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  ChevronRight,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Home,
  Map,
  MapPin,
  Users,
  CheckCircle2,
  DollarSign,
  FileText,
  Settings,
  X,
  Info,
  AlertTriangle,
  RefreshCw,
  Send,
  Printer,
  ShoppingBag,
  Database,
  Lock,
  Unlock,
  LogIn,
  LogOut,
  Download
} from 'lucide-react';
import {
  getDistricts,
  saveDistricts,
  getProjects,
  getMonthlyBudgets,
  saveMonthlyBudgets,
  addProject,
  updateProject,
  deleteProject,
  getGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  queryAI,
  DISTRICTS_LIST,
  AGENCIES_LIST,
  getGroupTypes,
  addGroupType,
  deleteGroupType,
  getKPIs,
  addKPI,
  updateKPI,
  deleteKPI,
  getReports,
  addReport,
  updateReport,
  deleteReport,
  getWomenStats,
  saveWomenStats,
  getWomenProjects,
  addWomenProject,
  updateWomenProject,
  deleteWomenProject,
  getTpmapStats,
  saveTpmapStats,
  getCustomSpecialMenus,
  addCustomSpecialMenu,
  updateCustomSpecialMenu,
  deleteCustomSpecialMenu,
  getAiQuestions,
  addAiQuestion,
  updateAiQuestion,
  deleteAiQuestion,
  getOtopProducts,
  addOtopProduct,
  updateOtopProduct,
  deleteOtopProduct,
  OTOP_CATEGORIES,
  validateUserLogin,
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument
} from './db';
import './App.css';

// SVG Donut Chart Component
const DonutChart = ({ segments, size = 130, strokeWidth = 10, centerValue, centerLabel }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~282.74
  let accumulatedPercent = 0;

  return (
    <div className="svg-donut-wrapper">
      <svg width={size} height={size} viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="55" cy="55" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        {segments.map((seg, idx) => {
          const percentage = (seg.value / seg.total) * 100;
          if (percentage <= 0 || isNaN(percentage)) return null;
          const strokeLength = (circumference * percentage) / 100;
          const strokeOffset = circumference - strokeLength - (circumference * accumulatedPercent) / 100;
          accumulatedPercent += percentage;

          return (
            <circle
              key={idx}
              cx="55"
              cy="55"
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          );
        })}
      </svg>
      <div className="donut-label" style={{ transform: 'rotate(0deg)' }}>
        <span className="value">{centerValue}</span>
        <span className="label" style={{ fontSize: '9px' }}>{centerLabel}</span>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '32px', 
          fontFamily: 'Sarabun, sans-serif', 
          color: '#ef4444', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fee2e2', 
          borderRadius: '8px', 
          margin: '40px auto',
          maxWidth: '600px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'left'
        }}>
          <h2 style={{ marginTop: 0 }}>⚠️ เกิดข้อผิดพลาดในการแสดงผลหน้าจอ (Rendering Error)</h2>
          <p>ระบบตรวจพบปัญหาในการประมวลผลข้อมูล:</p>
          <pre style={{ 
            backgroundColor: '#1e293b', 
            color: '#f8fafc',
            padding: '16px', 
            borderRadius: '6px', 
            overflowX: 'auto',
            fontSize: '14px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {this.state.error && this.state.error.stack ? this.state.error.stack : (this.state.error && this.state.error.toString())}
          </pre>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button 
              onClick={async () => {
                localStorage.removeItem('ecc_districts_db');
                localStorage.removeItem('ecc_projects_db');
                localStorage.removeItem('ecc_groups_db');
                localStorage.removeItem('ecc_budget_monthly_db');
                localStorage.removeItem('ecc_reports_db');
                localStorage.removeItem('ecc_women_stats_db');
                localStorage.removeItem('ecc_women_projects_db');
                localStorage.removeItem('ecc_tpmap_stats_db');
                localStorage.removeItem('ecc_custom_special_menus_db');
                localStorage.removeItem('ecc_otop_products_db');
                window.location.reload();
              }}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#ef4444', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              🔄 รีเซ็ตข้อมูลดิบระบบกลับเป็นค่าเริ่มต้น
            </button>
            <button 
              onClick={async () => window.location.reload()}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#94a3b8', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              ดึงข้อมูลใหม่ (Reload)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <DashboardApp />
    </ErrorBoundary>
  );
}

function DashboardApp() {
  // Login Session states
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('ecc_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const user = validateUserLogin(loginUsername, loginPassword);
    if (user) {
      sessionStorage.setItem('ecc_current_user', JSON.stringify(user));
      setCurrentUser(user);
      if (user.role === 'admin') {
        setIsAdminMode(true);
        setActiveMenu('AdminPanel');
      } else {
        setIsAdminMode(false);
        setActiveMenu('ภาพรวมบริหาร');
      }
    } else {
      setLoginError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ecc_current_user');
    setCurrentUser(null);
    setIsAdminMode(false);
    setActiveMenu('ภาพรวมบริหาร');
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
  };

  // Navigation & Role states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('ภาพรวมบริหาร');
  const [specialPortalsOpen, setSpecialPortalsOpen] = useState(true);
  const [groupMenuExpanded, setGroupMenuExpanded] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Tab states
  const [kpiTab, setKpiTab] = useState('overall'); // 'overall', 'ranking'
  const [budgetTab, setBudgetTab] = useState('financial'); // 'financial', 'monthly'
  const [basicInfoTab, setBasicInfoTab] = useState('demographics'); // 'demographics', 'economy'
  const [specialTab, setSpecialTab] = useState('women'); // 'women', 'tpmap'
  const [adminTab, setAdminTab] = useState('groups'); // 'groups', 'projects', 'districts'

  // DB States - Load directly to prevent empty array rendering errors
  const [districts, setDistricts] = useState(() => getDistricts());
  const [projects, setProjects] = useState(() => getProjects());
  const [groups, setGroups] = useState(() => getGroups());
  const [monthlyBudgets, setMonthlyBudgets] = useState(() => getMonthlyBudgets());
  const [kpis, setKPIs] = useState(() => getKPIs());
  const [groupTypes, setGroupTypes] = useState(() => getGroupTypes());
  const [reports, setReports] = useState(() => getReports());
  const [selectedKPI, setSelectedKPI] = useState(null);
  
  // Special Portals States
  const [womenStats, setWomenStats] = useState(() => getWomenStats());
  const [womenProjects, setWomenProjects] = useState(() => getWomenProjects());
  const [tpmapStats, setTpmapStats] = useState(() => getTpmapStats());
  const [selectedWomenProject, setSelectedWomenProject] = useState(null);
  
  // Forms for special menus
  const [womenStatsForm, setWomenStatsForm] = useState({
    registeredMembers: 124500,
    revolvingFund: 34500000
  });
  const [womenProjForm, setWomenProjForm] = useState({
    name: '',
    groupsCount: '',
    paybackRate: ''
  });
  const [tpmapStatsForm, setTpmapStatsForm] = useState({
    health: 120,
    living: 210,
    income: 290
  });

  const [customSpecialMenus, setCustomSpecialMenus] = useState(() => getCustomSpecialMenus());
  const [selectedCustomSpecialMenu, setSelectedCustomSpecialMenu] = useState(null);
  const [customSpecialMenuForm, setCustomSpecialMenuForm] = useState({
    name: '',
    content: ''
  });

  const [aiQuestions, setAiQuestions] = useState(() => getAiQuestions());
  const [selectedAiQuestion, setSelectedAiQuestion] = useState(null);
  const [aiQuestionForm, setAiQuestionForm] = useState({
    label: '',
    query: '',
    answer: ''
  });

  // OTOP Products States
  const [otopProducts, setOtopProducts] = useState(() => getOtopProducts());
  const [selectedOtopProduct, setSelectedOtopProduct] = useState(null);
  const [otopCategoryFilter, setOtopCategoryFilter] = useState('ทั้งหมด');
  const [otopCountFilterDistrict, setOtopCountFilterDistrict] = useState('ทั้งหมด');
  const [otopAdminSearchQuery, setOtopAdminSearchQuery] = useState('');
  const [otopAdminCategoryFilter, setOtopAdminCategoryFilter] = useState('ทั้งหมด');
  const [otopAdminDistrictFilter, setOtopAdminDistrictFilter] = useState('ทั้งหมด');
  const [otopProductForm, setOtopProductForm] = useState({
    name: '',
    type: 'อาหาร',
    district: 'ตำบลกะทู้',
    sale: '',
    star: 5
  });

  // Documents States
  const [documents, setDocuments] = useState(() => getDocuments());
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentForm, setDocumentForm] = useState({
    name: '',
    category: 'OTOP',
    type: 'PDF',
    size: '100 KB',
    link: ''
  });

  // Selected GIS District
  const [selectedGisDistrict, setSelectedGisDistrict] = useState('ตำบลกะทู้');

  // AI Assistant States
  const [aiInput, setAiInput] = useState('');
  const [aiChat, setAiChat] = useState([
    {
      sender: 'assistant',
      text: 'สวัสดีครับท่านผู้บริหาร ผมคือ **ECC AI Executive Assistant** ยินดีต้อนรับเข้าสู่ศูนย์บัญชาการข้อมูลแผนงานพัฒนาชุมชนครับ\n\nท่านสามารถเลือกคำถามวิเคราะห์สถิติด้านล่าง หรือพิมพ์คำถามที่ต้องการถามเกี่ยวกับ งบประมาณเบิกจ่าย, ตัวชี้วัดเสี่ยง หรือ โครงการล่าช้า ได้เลยครับ'
    }
  ]);

  // UI Filters for Groups (Executive view & Admin view)
  const [groupDistrictFilter, setGroupDistrictFilter] = useState('ทั้งหมด');
  const [groupStatusFilter, setGroupStatusFilter] = useState('ทั้งหมด');
  const [groupTypeFilter, setGroupTypeFilter] = useState('ทั้งหมด');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [groupSearchTrigger, setGroupSearchTrigger] = useState('');

  // UI Filters for Projects (Admin view)
  const [projSearchQuery, setProjSearchQuery] = useState('');
  const [projStatusFilter, setProjStatusFilter] = useState('ทั้งหมด');

  // UI Filters for Reports
  const [reportProjectFilter, setReportProjectFilter] = useState('ทั้งหมด');
  const [reportMonthFilter, setReportMonthFilter] = useState('ทั้งหมด');
  const [reportStatusFilter, setReportStatusFilter] = useState('ทั้งหมด');

  // Report Form States
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportFormData, setReportFormData] = useState({
    projectName: '',
    month: 'ต.ค.',
    status: 'ยังไม่รายงาน',
    deadlineDate: ''
  });

  // Pagination states
  const [groupsCurrentPage, setGroupsCurrentPage] = useState(1);
  const groupsItemsPerPage = 5;

  // Modals state
  const [modalType, setModalType] = useState(null); 
  // 'group_add', 'group_edit', 'group_view', 'group_delete', 'project_add', 'project_edit', 'project_view', 'project_delete', 'district_edit', 'indicators', 'budget'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Form states
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    type: 'กองทุนแม่',
    district: 'ตำบลกะทู้',
    agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)',
    president: '',
    phone: '',
    members: '',
    status: 'ปกติ'
  });

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgetFormData, setBudgetFormData] = useState({
    month: 'ต.ค.',
    year: '2567',
    planName: '',
    budgetType: 'โครงการยุทธศาสตร์',
    target: '',
    actual: '',
    status: 'ยังไม่เบิกจ่าย'
  });

  const [projFormData, setProjFormData] = useState({
    name: '',
    district: 'ตำบลกะทู้',
    budget: '',
    spent: '',
    status: 'ดำเนินการ',
    progress: '0',
    stage: 'เตรียมการ',
    lat: '7.9150',
    lng: '98.3400',
    manager: '',
    image: ''
  });

  const [districtFormData, setDistrictFormData] = useState({
    villages: 0,
    households: 0,
    male: 0,
    female: 0,
    elderly: 0,
    kids: 0,
    disabled: 0,
    avgIncome: 0,
    budgetReceived: 0,
    budgetCommitted: 0,
    budgetDisbursed: 0,
    otopSales: 0,
    kpiTotal: 20,
    kpiSuccess: 0,
    kpiInProgress: 0,
    kpiAtRisk: 0
  });

  // Reload data from local database
  const reloadData = async () => {
    await loadFirebaseData();
    setDistricts(getDistricts());
    setProjects(getProjects());
    setGroups(getGroups());
    setMonthlyBudgets(getMonthlyBudgets());
    setKPIs(getKPIs());
    setGroupTypes(getGroupTypes());
    setReports(getReports());
    setWomenStats(getWomenStats());
    setWomenProjects(getWomenProjects());
    setTpmapStats(getTpmapStats());
    setCustomSpecialMenus(getCustomSpecialMenus());
    setAiQuestions(getAiQuestions());
    setOtopProducts(getOtopProducts());
    setDocuments(getDocuments());
  };

  const formatCurrency = (val) => new Intl.NumberFormat('th-TH').format(val);

  // Group CRUD Handlers
  const handleOpenAddGroup = () => {
    setGroupFormData({
      name: '',
      type: 'กองทุนแม่',
      district: 'ตำบลกะทู้',
      agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)',
      president: '',
      phone: '',
      members: '',
      status: 'ปกติ'
    });
    setModalType('group_add');
  };

  const handleOpenEditGroup = (g) => {
    setSelectedGroup(g);
    setGroupFormData({
      name: g.name,
      type: g.type,
      district: g.district,
      agency: g.agency,
      president: g.president,
      phone: g.phone,
      members: g.members.toString(),
      status: g.status
    });
    setModalType('group_edit');
  };

  const handleOpenViewGroup = (g) => {
    setSelectedGroup(g);
    setModalType('group_view');
  };

  const handleOpenDeleteGroup = (g) => {
    setSelectedGroup(g);
    setModalType('group_delete');
  };

  const handleSubmitGroup = async (e) => {
    try {
    e.preventDefault();
    if (!groupFormData.name || !groupFormData.president || !groupFormData.phone || !groupFormData.members) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    const payload = {
      name: groupFormData.name,
      type: groupFormData.type,
      district: groupFormData.district,
      agency: groupFormData.agency,
      president: groupFormData.president,
      phone: groupFormData.phone,
      members: parseInt(groupFormData.members, 10) || 0,
      status: groupFormData.status
    };

    if (modalType === 'group_add') {
      await addGroup(payload);
      alert('เพิ่มกลุ่ม/องค์กรสำเร็จเรียบร้อยแล้ว!');
    } else if (modalType === 'group_edit') {
      await updateGroup(selectedGroup.id, payload);
      alert('แก้ไขข้อมูลกลุ่ม/องค์กรสำเร็จเรียบร้อยแล้ว!');
    }

    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGroupConfirm = async () => {
    try {
    await deleteGroup(selectedGroup.id);
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Budget CRUD Handlers
  const handleOpenAddBudget = () => {
    setBudgetFormData({
      month: 'ต.ค.',
      year: '2567',
      planName: '',
      budgetType: 'โครงการยุทธศาสตร์',
      target: '',
      actual: '',
      status: 'ยังไม่เบิกจ่าย'
    });
    setModalType('budget_add');
  };

  const handleOpenEditBudget = (b) => {
    setSelectedBudget(b);
    setBudgetFormData({
      month: b.month,
      year: b.year || '2567',
      planName: b.planName || '',
      budgetType: b.budgetType || 'โครงการยุทธศาสตร์',
      target: b.target.toString(),
      actual: b.actual.toString(),
      status: b.status || 'ยังไม่เบิกจ่าย'
    });
    setModalType('budget_edit');
  };

  const handleSaveBudget = async (e) => {
    try {
    e.preventDefault();
    let updatedBudgets = [...monthlyBudgets];
    const targetVal = parseFloat(budgetFormData.target) || 0;
    // Calculate actual automatically based on status
    const actualVal = budgetFormData.status === 'เบิกจ่ายแล้ว' ? targetVal : 0;
    
    if (modalType === 'budget_add') {
      const newB = {
        month: budgetFormData.month,
        year: budgetFormData.year,
        planName: budgetFormData.planName,
        budgetType: budgetFormData.budgetType,
        target: targetVal,
        actual: actualVal,
        status: budgetFormData.status
      };
      updatedBudgets.push(newB);
    } else if (modalType === 'budget_edit' && selectedBudget) {
      const index = updatedBudgets.findIndex(b => b.month === selectedBudget.month && b.year === selectedBudget.year);
      if (index !== -1) {
        updatedBudgets[index] = {
          ...updatedBudgets[index],
          month: budgetFormData.month,
          year: budgetFormData.year,
          planName: budgetFormData.planName,
          budgetType: budgetFormData.budgetType,
          target: targetVal,
          actual: actualVal,
          status: budgetFormData.status
        };
      }
    }
    
    await saveMonthlyBudgets(updatedBudgets);
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBudget = async () => {
    try {
    if (!selectedBudget) return;
    const updatedBudgets = monthlyBudgets.filter(b => !(b.month === selectedBudget.month && b.year === selectedBudget.year));
    await saveMonthlyBudgets(updatedBudgets);
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Project CRUD Handlers
  const handleOpenAddProject = () => {
    setProjFormData({
      name: '',
      district: 'ตำบลกะทู้',
      budget: '',
      spent: '',
      status: 'ดำเนินการ',
      progress: '0',
      stage: 'เตรียมการ',
      lat: '7.9150',
      lng: '98.3400',
      manager: '',
      image: 'https://images.unsplash.com/photo-1590682680394-b5594b596387?w=150&auto=format&fit=crop'
    });
    setModalType('project_add');
  };

  const handleOpenEditProject = (p) => {
    setSelectedProject(p);
    setProjFormData({
      name: p.name,
      district: p.district,
      budget: p.budget.toString(),
      spent: p.spent.toString(),
      status: p.status,
      progress: (p.progress || 0).toString(),
      stage: p.stage || 'เตรียมการ',
      lat: p.lat.toString(),
      lng: p.lng.toString(),
      manager: p.manager,
      image: p.image
    });
    setModalType('project_edit');
  };



  const handleOpenDeleteProject = (p) => {
    setSelectedProject(p);
    setModalType('project_delete');
  };

  const handleSubmitProject = async (e) => {
    try {
    e.preventDefault();
    if (!projFormData.name || !projFormData.budget || !projFormData.spent || !projFormData.manager) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const payload = {
      name: projFormData.name,
      district: projFormData.district,
      budget: parseFloat(projFormData.budget) || 0,
      spent: parseFloat(projFormData.spent) || 0,
      status: projFormData.status,
      progress: parseInt(projFormData.progress, 10) || 0,
      stage: projFormData.stage || 'เตรียมการ',
      lat: parseFloat(projFormData.lat) || 18.7880,
      lng: parseFloat(projFormData.lng) || 98.9860,
      manager: projFormData.manager,
      image: projFormData.image || 'https://images.unsplash.com/photo-1590682680394-b5594b596387?w=150&auto=format&fit=crop'
    };

    if (modalType === 'project_add') {
      await addProject(payload);
      alert('เพิ่มโครงการใหม่สำเร็จเรียบร้อยแล้ว!');
    } else if (modalType === 'project_edit') {
      await updateProject(selectedProject.id, payload);
      alert('แก้ไขข้อมูลโครงการสำเร็จเรียบร้อยแล้ว!');
    }

    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProjConfirm = async () => {
    try {
    await deleteProject(selectedProject.id);
    alert('ลบโครงการสำเร็จเรียบร้อยแล้ว!');
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Report CRUD Handlers
  const handleOpenAddReport = () => {
    setReportFormData({
      projectName: '',
      month: 'ต.ค.',
      status: 'ยังไม่รายงาน',
      deadlineDate: '20 ต.ค. 2567'
    });
    setModalType('report_add');
  };

  const handleOpenEditReport = (r) => {
    setSelectedReport(r);
    setReportFormData({
      projectName: r.projectName,
      month: r.month,
      status: r.status,
      deadlineDate: r.deadlineDate || ''
    });
    setModalType('report_edit');
  };

  const handleOpenDeleteReport = (r) => {
    setSelectedReport(r);
    setModalType('report_delete');
  };

  const handleSubmitReport = async (e) => {
    try {
    e.preventDefault();
    if (!reportFormData.projectName || !reportFormData.month) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    const payload = {
      projectName: reportFormData.projectName,
      month: reportFormData.month,
      status: reportFormData.status,
      deadlineDate: reportFormData.deadlineDate || `วันที่ 20 ของเดือน`
    };

    if (modalType === 'report_add') {
      await addReport(payload);
      alert('เพิ่มรายการติดตามรายงานสำเร็จเรียบร้อยแล้ว!');
    } else if (modalType === 'report_edit') {
      await updateReport(selectedReport.id, payload);
      alert('แก้ไขข้อมูลติดตามรายงานสำเร็จเรียบร้อยแล้ว!');
    }

    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReportConfirm = async () => {
    try {
    await deleteReport(selectedReport.id);
    alert('ลบรายการติดตามรายงานสำเร็จเรียบร้อยแล้ว!');
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Women Projects CRUD Handlers
  const handleSubmitWomenProject = async (e) => {
    try {
    e.preventDefault();
    if (!womenProjForm.name || !womenProjForm.groupsCount || !womenProjForm.paybackRate) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const payload = {
      name: womenProjForm.name,
      groupsCount: womenProjForm.groupsCount,
      paybackRate: womenProjForm.paybackRate
    };
    if (modalType === 'women_proj_add') {
      await addWomenProject(payload);
      alert('เพิ่มโครงการสตรีสำเร็จเรียบร้อยแล้ว!');
    } else if (modalType === 'women_proj_edit') {
      await updateWomenProject(selectedWomenProject.id, payload);
      alert('แก้ไขโครงการสตรีสำเร็จเรียบร้อยแล้ว!');
    }
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWomenProjectConfirm = async () => {
    try {
    await deleteWomenProject(selectedWomenProject.id);
    alert('ลบโครงการสตรีสำเร็จเรียบร้อยแล้ว!');
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Custom Special Menus CRUD Handlers
  const handleSubmitCustomSpecialMenu = async (e) => {
    try {
    e.preventDefault();
    if (!customSpecialMenuForm.name || !customSpecialMenuForm.content) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const payload = {
      name: customSpecialMenuForm.name,
      content: customSpecialMenuForm.content
    };
    if (modalType === 'custom_menu_add') {
      await addCustomSpecialMenu(payload);
      alert('เพิ่มรายการเมนูพิเศษใหม่สำเร็จเรียบร้อยแล้ว!');
    } else if (modalType === 'custom_menu_edit') {
      await updateCustomSpecialMenu(selectedCustomSpecialMenu.id, payload);
      alert('แก้ไขข้อมูลเมนูพิเศษสำเร็จเรียบร้อยแล้ว!');
    }
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCustomSpecialMenuConfirm = async () => {
    try {
    await deleteCustomSpecialMenu(selectedCustomSpecialMenu.id);
    alert('ลบรายการเมนูพิเศษสำเร็จเรียบร้อยแล้ว!');
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // AI Questions CRUD Handlers
  const handleSubmitAiQuestion = async (e) => {
    try {
    e.preventDefault();
    if (!aiQuestionForm.label || !aiQuestionForm.query) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const payload = {
      label: aiQuestionForm.label,
      query: aiQuestionForm.query,
      answer: aiQuestionForm.answer
    };
    if (modalType === 'ai_question_add') {
      await addAiQuestion(payload);
      alert('เพิ่มคำถามวิเคราะห์ AI สำเร็จเรียบร้อยแล้ว!');
    } else if (modalType === 'ai_question_edit') {
      await updateAiQuestion(selectedAiQuestion.id, payload);
      alert('แก้ไขคำถามวิเคราะห์ AI สำเร็จเรียบร้อยแล้ว!');
    }
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAiQuestionConfirm = async () => {
    try {
    await deleteAiQuestion(selectedAiQuestion.id);
    alert('ลบคำถามวิเคราะห์ AI สำเร็จเรียบร้อยแล้ว!');
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // OTOP Product CRUD Handlers
  const handleSubmitOtopProduct = async (e) => {
    try {
    e.preventDefault();
    if (!otopProductForm.name || !otopProductForm.sale) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const payload = {
      name: otopProductForm.name,
      type: otopProductForm.type || 'อาหาร',
      district: otopProductForm.district || 'ตำบลกะทู้',
      sale: parseInt(otopProductForm.sale, 10) || 0,
      star: parseInt(otopProductForm.star, 10) || 5
    };
    if (modalType === 'otop_product_add') {
      await addOtopProduct(payload);
      alert('เพิ่มสินค้า OTOP สำเร็จเรียบร้อยแล้ว!');
    } else if (modalType === 'otop_product_edit') {
      await updateOtopProduct(selectedOtopProduct.id, payload);
      alert('แก้ไขสินค้า OTOP สำเร็จเรียบร้อยแล้ว!');
    }
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOtopProductConfirm = async () => {
    try {
    await deleteOtopProduct(selectedOtopProduct.id);
    alert('ลบสินค้า OTOP สำเร็จเรียบร้อยแล้ว!');
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Document CRUD Handlers
  const handleSubmitDocument = async (e) => {
    try {
    e.preventDefault();
    if (!documentForm.name || !documentForm.link) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const payload = {
      name: documentForm.name,
      category: documentForm.category || 'OTOP',
      type: documentForm.type || 'PDF',
      size: documentForm.size || '100 KB',
      link: documentForm.link
    };
    if (modalType === 'document_add') {
      await addDocument(payload);
      alert('เพิ่มแบบฟอร์ม/เอกสารสำเร็จเรียบร้อยแล้ว!');
    } else if (modalType === 'document_edit') {
      await updateDocument(selectedDocument.id, payload);
      alert('แก้ไขข้อมูลสำเร็จเรียบร้อยแล้ว!');
    }
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocumentConfirm = async () => {
    try {
    await deleteDocument(selectedDocument.id);
    alert('ลบแบบฟอร์ม/เอกสารสำเร็จเรียบร้อยแล้ว!');
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // KPI CRUD Handlers & Form State
  const [kpiFormData, setKpiFormData] = useState({
    name: '',
    target: '',
    actual: '',
    unit: '%',
    status: 'ดำเนินการ',
    district: 'ตำบลกะทู้',
    agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)'
  });

  const handleOpenAddKPI = () => {
    setKpiFormData({
      name: '',
      target: '',
      actual: '',
      unit: '%',
      status: 'ดำเนินการ',
      district: 'ตำบลกะทู้',
      agency: 'สำนักงานพัฒนาชุมชนอำเภอ (พช.)'
    });
    setModalType('kpi_add');
  };

  const handleOpenEditKPI = (k) => {
    setSelectedKPI(k);
    setKpiFormData({
      name: k.name,
      target: k.target.toString(),
      actual: k.actual.toString(),
      unit: k.unit,
      status: k.status,
      district: k.district,
      agency: k.agency
    });
    setModalType('kpi_edit');
  };

  const handleSubmitKPI = async (e) => {
    try {
    e.preventDefault();
    if (!kpiFormData.name || !kpiFormData.target || !kpiFormData.actual) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const payload = {
      name: kpiFormData.name,
      target: parseFloat(kpiFormData.target) || 0,
      actual: parseFloat(kpiFormData.actual) || 0,
      unit: kpiFormData.unit,
      status: kpiFormData.status,
      district: kpiFormData.district,
      agency: kpiFormData.agency
    };

    if (modalType === 'kpi_add') {
      await addKPI(payload);
      alert('เพิ่มตัวชี้วัดใหม่สำเร็จเรียบร้อยแล้ว!');
    } else if (modalType === 'kpi_edit') {
      await updateKPI(selectedKPI.id, payload);
      alert('แก้ไขข้อมูลตัวชี้วัดสำเร็จเรียบร้อยแล้ว!');
    }

    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteKPIConfirm = async () => {
    try {
    await deleteKPI(selectedKPI.id);
    alert('ลบตัวชี้วัดสำเร็จเรียบร้อยแล้ว!');
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // District Edit Handlers
  const handleOpenEditDistrict = (d) => {
    setSelectedDistrict(d);
    setDistrictFormData({
      villages: d.villages,
      households: d.households,
      male: d.population.male,
      female: d.population.female,
      elderly: d.population.elderly,
      kids: d.population.kids,
      disabled: d.population.disabled,
      avgIncome: d.economy.avgIncome,
      budgetReceived: d.budget.received,
      budgetCommitted: d.budget.committed,
      budgetDisbursed: d.budget.disbursed,
      otopSales: d.otopSales,
      kpiTotal: d.kpi.total,
      kpiSuccess: d.kpi.success,
      kpiInProgress: d.kpi.inProgress,
      kpiAtRisk: d.kpi.atRisk
    });
    setModalType('district_edit');
  };

  const handleSubmitDistrictEdit = async (e) => {
    try {
    e.preventDefault();
    const updated = districts.map(d => {
      if (d.name === selectedDistrict.name) {
        return {
          ...d,
          villages: parseInt(districtFormData.villages, 10) || 0,
          households: parseInt(districtFormData.households, 10) || 0,
          population: {
            male: parseInt(districtFormData.male, 10) || 0,
            female: parseInt(districtFormData.female, 10) || 0,
            elderly: parseInt(districtFormData.elderly, 10) || 0,
            kids: parseInt(districtFormData.kids, 10) || 0,
            disabled: parseInt(districtFormData.disabled, 10) || 0
          },
          economy: {
            ...d.economy,
            avgIncome: parseInt(districtFormData.avgIncome, 10) || 0
          },
          budget: {
            received: parseInt(districtFormData.budgetReceived, 10) || 0,
            allocated: parseInt(districtFormData.budgetReceived, 10) || 0,
            committed: parseInt(districtFormData.budgetCommitted, 10) || 0,
            disbursed: parseInt(districtFormData.budgetDisbursed, 10) || 0
          },
          otopSales: parseInt(districtFormData.otopSales, 10) || 0,
          kpi: {
            total: parseInt(districtFormData.kpiTotal, 10) || 20,
            success: parseInt(districtFormData.kpiSuccess, 10) || 0,
            inProgress: parseInt(districtFormData.kpiInProgress, 10) || 0,
            atRisk: parseInt(districtFormData.kpiAtRisk, 10) || 0
          }
        };
      }
      return d;
    });
    await saveDistricts(updated);
    await reloadData();
      setModalType(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Group submenu click helper
  const handleSubmenuGroupClick = (type) => {
    setActiveMenu(type);
    setIsAdminMode(false);
    setGroupTypeFilter(type);
    setGroupDistrictFilter('ทั้งหมด');
    setGroupStatusFilter('ทั้งหมด');
    setGroupSearchQuery('');
    setGroupSearchTrigger('');
    setGroupsCurrentPage(1);
  };

  // AI Prompt Helper
  const triggerAiQuery = (promptText) => {
    const userMsg = { sender: 'user', text: promptText };
    const answer = queryAI(promptText);
    const aiMsg = { sender: 'assistant', text: answer };
    setAiChat(prev => [...prev, userMsg, aiMsg]);
    setAiInput('');
  };

  // Handle AI send text
  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    triggerAiQuery(aiInput);
  };

  const handleResetSystem = async () => {
    if (confirm('ยืนยันที่จะรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าตั้งต้น?')) {
      localStorage.removeItem('ecc_districts_db');
      localStorage.removeItem('ecc_projects_db');
      localStorage.removeItem('ecc_groups_db');
      localStorage.removeItem('ecc_budget_monthly_db');
      localStorage.removeItem('ecc_reports_db');
      localStorage.removeItem('ecc_women_stats_db');
      localStorage.removeItem('ecc_women_projects_db');
      localStorage.removeItem('ecc_tpmap_stats_db');
      localStorage.removeItem('ecc_custom_special_menus_db');
      localStorage.removeItem('ecc_ai_questions_db');
      localStorage.removeItem('ecc_otop_products_db');
      localStorage.removeItem('ecc_documents_db');
      await reloadData();
      alert('ระบบถูกรีเซ็ตเรียบร้อยแล้ว');
    }
  };

  // Calculate high level stats with empty array safeties
  const totalVillages = districts.reduce((sum, d) => sum + (d?.villages || 0), 0);
  const totalHouseholds = districts.reduce((sum, d) => sum + (d?.households || 0), 0);
  const totalPop = districts.reduce((sum, d) => sum + (d?.population?.male || 0) + (d?.population?.female || 0), 0);
  const totalOtopProducers = districts.reduce((sum, d) => sum + (d?.economy?.otopProducers || 0), 0);
  
  const strategyBudgets = monthlyBudgets.filter(b => b.budgetType === 'โครงการยุทธศาสตร์' || !b.budgetType);
  const totalStrategyReceived = strategyBudgets.reduce((sum, b) => sum + (parseFloat(b.target) || 0), 0);
  const totalStrategyDisbursed = strategyBudgets.reduce((sum, b) => sum + (parseFloat(b.actual) || 0), 0);
  const totalStrategyRemaining = totalStrategyReceived - totalStrategyDisbursed;
  const strategyRateOverall = totalStrategyReceived > 0 ? ((totalStrategyDisbursed / totalStrategyReceived) * 100).toFixed(2) : '0';

  const womenBudgets = monthlyBudgets.filter(b => b.budgetType === 'กองทุนพัฒนาบทบาทสตรี');
  const totalWomenReceived = womenBudgets.reduce((sum, b) => sum + (parseFloat(b.target) || 0), 0);
  const totalWomenDisbursed = womenBudgets.reduce((sum, b) => sum + (parseFloat(b.actual) || 0), 0);
  const totalWomenRemaining = totalWomenReceived - totalWomenDisbursed;
  const womenRateOverall = totalWomenReceived > 0 ? ((totalWomenDisbursed / totalWomenReceived) * 100).toFixed(2) : '0';

  const totalBudgetReceived = totalStrategyReceived + totalWomenReceived;
  const totalBudgetDisbursed = totalStrategyDisbursed + totalWomenDisbursed;
  const totalBudgetRemaining = totalBudgetReceived - totalBudgetDisbursed;
  const budgetRateOverall = totalBudgetReceived > 0 ? ((totalBudgetDisbursed / totalBudgetReceived) * 100).toFixed(2) : '0';

  const totalKpis = districts.reduce((sum, d) => sum + (d?.kpi?.total || 0), 0);
  const totalKpisSuccess = districts.reduce((sum, d) => sum + (d?.kpi?.success || 0), 0);
  const totalKpisInProgress = districts.reduce((sum, d) => sum + (d?.kpi?.inProgress || 0), 0);
  const totalKpisRisk = districts.reduce((sum, d) => sum + (d?.kpi?.atRisk || 0), 0);
  const kpiRateOverall = totalKpis > 0 ? ((totalKpisSuccess / totalKpis) * 100).toFixed(2) : '0';

  // Group filtering and pagination
  const filteredGroups = groups.filter(g => {
    const matchDistrict = groupDistrictFilter === 'ทั้งหมด' || g.district === groupDistrictFilter;
    const matchStatus = groupStatusFilter === 'ทั้งหมด' || g.status === groupStatusFilter;
    
    let matchType = true;
    if (activeMenu !== 'ภาพรวมบริหาร' && activeMenu !== 'AdminPanel' && groupTypes.includes(activeMenu)) {
      matchType = g.type === activeMenu;
    } else if (groupTypeFilter !== 'ทั้งหมด') {
      matchType = g.type === groupTypeFilter;
    }

    let matchSearch = true;
    if (groupSearchTrigger) {
      const q = groupSearchTrigger.toLowerCase();
      matchSearch = g.name.toLowerCase().includes(q) || g.president.toLowerCase().includes(q) || g.phone.toLowerCase().includes(q);
    }
    return matchDistrict && matchStatus && matchType && matchSearch;
  });

  const groupsLastIdx = groupsCurrentPage * groupsItemsPerPage;
  const groupsFirstIdx = groupsLastIdx - groupsItemsPerPage;
  const paginatedGroups = filteredGroups.slice(groupsFirstIdx, groupsLastIdx);
  const totalGroupPages = Math.ceil(filteredGroups.length / groupsItemsPerPage) || 1;

  useEffect(() => {
    if (groupsCurrentPage > totalGroupPages) {
      setGroupsCurrentPage(1);
    }
  }, [groupDistrictFilter, groupStatusFilter, groupTypeFilter, groupSearchTrigger, totalGroupPages, groupsCurrentPage]);

  // Project filtering for Admin Panel
  const filteredProjectsAdmin = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(projSearchQuery.toLowerCase()) || p.manager.toLowerCase().includes(projSearchQuery.toLowerCase());
    const matchStatus = projStatusFilter === 'ทั้งหมด' || p.status === projStatusFilter;
    return matchSearch && matchStatus;
  });

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'กองทุนแม่':
      case 'กองทุนแม่ของแผ่นดิน':
        return 'purple';
      case 'กลุ่มออมทรัพย์':
        return 'blue';
      case 'กข.คจ.':
        return 'orange';
      case 'ศูนย์เรียนรู้':
        return 'cyan';
      case 'กองทุนสตรี':
      case 'กองทุนพัฒนาบทบาทสตรี':
        return 'teal';
      case 'คณะกรรมการสตรี':
        return 'pink';
      default:
        return 'grey';
    }
  };

  const mapPaths = [
    { name: 'ตำบลกมลา', d: 'M 80,40 L 180,30 L 170,120 L 70,130 Z' },
    { name: 'ตำบลกะทู้', d: 'M 180,30 L 320,40 L 310,220 L 160,200 L 170,120 Z' },
    { name: 'ตำบลป่าตอง', d: 'M 70,130 L 170,120 L 160,200 L 220,280 L 80,280 Z' }
  ];

  // Selected GIS District data object with safety fallbacks to prevent rendering crashes
  const gisDistrictData = districts.find(d => d.name === selectedGisDistrict) || districts[0] || {
    name: 'กำลังโหลด...',
    villages: 0,
    households: 0,
    population: { male: 0, female: 0, elderly: 0, kids: 0, disabled: 0 },
    economy: { avgIncome: 0, jobGroups: 0, otopProducers: 0 },
    budget: { received: 1, allocated: 1, committed: 0, disbursed: 0 },
    kpi: { total: 20, success: 0, inProgress: 0, atRisk: 0 },
    otopSales: 0,
    otopStars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };

  const sortedOtopProducers = [...districts].sort((a, b) => (b?.otopSales || 0) - (a?.otopSales || 0));

  if (!currentUser) {
    return (
      <div className="login-screen-wrapper">
        <div className="login-card">
          <div className="login-logo-container">
            <img src="/logo.png" alt="พช. Logo" />
          </div>
          <div className="login-title-group">
            <h2 className="login-title">ระบบสารสนเทศ (ECC Command Center)</h2>
            <p className="login-subtitle">สำนักงานพัฒนาชุมชนอำเภอกะทู้ จังหวัดภูเก็ต</p>
          </div>
          
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="login-input-group">
              <label className="login-label">ชื่อผู้ใช้งาน (Username)</label>
              <input 
                type="text" 
                className="login-input-field"
                placeholder="ป้อนชื่อผู้ใช้งาน..."
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="login-input-group">
              <label className="login-label">รหัสผ่าน (Password)</label>
              <input 
                type="password" 
                className="login-input-field"
                placeholder="ป้อนรหัสผ่าน..."
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
              />
            </div>

            {loginError && (
              <div className="login-error-message">
                ⚠️ {loginError}
              </div>
            )}

            <button type="submit" className="login-submit-btn">
              <LogIn size={16} /> เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      
      {/* 1. Sidebar Menu */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container" style={{ backgroundColor: 'white', overflow: 'hidden', padding: '2px' }}>
            <img src="/logo.png" alt="พช. Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="logo-text">
            <span className="title-th">พช.อำเภอกะทู้</span>
            <span className="subtitle-th">ระบบสารสนเทศเพื่อการพัฒนา</span>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className="menu-item-container">
            <div 
              className={`menu-item ${activeMenu === 'ภาพรวมบริหาร' && !isAdminMode ? 'active' : ''}`}
              onClick={async () => { setActiveMenu('ภาพรวมบริหาร'); setIsAdminMode(false); }}
            >
              <Home size={18} />
              <span className="menu-item-text">หน้าแรกภาพรวมผู้บริหาร</span>
            </div>
          </li>

          <li className="menu-item-container">
            <div 
              className={`menu-item ${activeMenu === 'ตัวชี้วัด' && !isAdminMode ? 'active' : ''}`}
              onClick={async () => { setActiveMenu('ตัวชี้วัด'); setIsAdminMode(false); }}
            >
              <CheckCircle2 size={18} />
              <span className="menu-item-text">ตัวชี้วัด (KPI)</span>
            </div>
          </li>

          <li className="menu-item-container">
            <div 
              className={`menu-item ${activeMenu === 'งบประมาณ' && !isAdminMode ? 'active' : ''}`}
              onClick={async () => { setActiveMenu('งบประมาณ'); setIsAdminMode(false); }}
            >
              <DollarSign size={18} />
              <span className="menu-item-text">งบประมาณและเบิกจ่าย</span>
            </div>
          </li>

          <li className="menu-item-container">
            <div 
              className={`menu-item ${activeMenu === 'ข้อมูลพื้นฐาน' && !isAdminMode ? 'active' : ''}`}
              onClick={async () => { setActiveMenu('ข้อมูลพื้นฐาน'); setIsAdminMode(false); }}
            >
              <Users size={18} />
              <span className="menu-item-text">ข้อมูลพื้นฐานประชากร</span>
            </div>
          </li>

          <li className="menu-item-container">
            <div 
              className={`menu-item ${activeMenu === 'OTOP' && !isAdminMode ? 'active' : ''}`}
              onClick={async () => { setActiveMenu('OTOP'); setIsAdminMode(false); }}
            >
              <ShoppingBag size={18} />
              <span className="menu-item-text">แดชบอร์ด OTOP</span>
            </div>
          </li>

          <li className="menu-item-container">
            <div 
              className={`menu-item ${activeMenu === 'GIS' && !isAdminMode ? 'active' : ''}`}
              onClick={async () => { setActiveMenu('GIS'); setIsAdminMode(false); }}
            >
              <Map size={18} />
              <span className="menu-item-text">แผนที่สารสนเทศ GIS</span>
            </div>
          </li>

          <li className="menu-item-container">
            <div 
              className={`menu-item ${activeMenu === 'ติดตามรายงาน' && !isAdminMode ? 'active' : ''}`}
              onClick={async () => { setActiveMenu('ติดตามรายงาน'); setIsAdminMode(false); }}
            >
              <FileText size={18} />
              <span className="menu-item-text">📝 ติดตามส่งรายงาน</span>
            </div>
          </li>

          <li className="menu-item-container">
            <div 
              className={`menu-item ${groupMenuExpanded ? 'expanded' : ''}`}
              onClick={async () => setGroupMenuExpanded(!groupMenuExpanded)}
            >
              <Users size={18} />
              <span className="menu-item-text">ข้อมูลกลุ่ม/องค์กร</span>
              <ChevronRight className="arrow" size={14} />
            </div>
            {groupMenuExpanded && !sidebarCollapsed && (
              <ul className="submenu">
                {groupTypes.map((type) => (
                  <li 
                    key={type}
                    className={`submenu-item ${activeMenu === type && !isAdminMode ? 'active' : ''}`}
                    onClick={async () => handleSubmenuGroupClick(type)}
                  >
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="menu-item-container">
            <div 
              className={`menu-item ${activeMenu === 'AI' && !isAdminMode ? 'active' : ''}`}
              onClick={async () => { setActiveMenu('AI'); setIsAdminMode(false); }}
            >
              <Database size={18} />
              <span className="menu-item-text">ผู้ช่วยวิเคราะห์ AI</span>
            </div>
          </li>

          <li className="menu-item-container">
            <div 
              className={`menu-item ${specialPortalsOpen ? 'expanded' : ''}`}
              onClick={async () => setSpecialPortalsOpen(!specialPortalsOpen)}
            >
              <FileText size={18} />
              <span className="menu-item-text">เมนูพิเศษ พช.</span>
              <ChevronRight className="arrow" size={14} />
            </div>
            {specialPortalsOpen && !sidebarCollapsed && (
              <ul className="submenu">
                <li className={`submenu-item ${activeMenu === 'กองทุนสตรี' && !isAdminMode ? 'active' : ''}`} onClick={async () => { setActiveMenu('กองทุนสตรี'); setSpecialTab('women'); setIsAdminMode(false); }}>กองทุนพัฒนาสตรี</li>
                <li className={`submenu-item ${activeMenu === 'TPMAP' && !isAdminMode ? 'active' : ''}`} onClick={async () => { setActiveMenu('TPMAP'); setSpecialTab('tpmap'); setIsAdminMode(false); }}>ระบบชี้เป้า TPMAP</li>
                <li className={`submenu-item ${activeMenu === 'OnePage' && !isAdminMode ? 'active' : ''}`} onClick={async () => { setActiveMenu('OnePage'); setIsAdminMode(false); }}>รายงาน One Page</li>
                {customSpecialMenus.map(m => (
                  <li 
                    key={m.id} 
                    className={`submenu-item ${activeMenu === m.name && !isAdminMode ? 'active' : ''}`} 
                    onClick={async () => { setActiveMenu(m.name); setIsAdminMode(false); }}
                  >
                    ✨ {m.name}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="menu-item-container">
            <div 
              className={`menu-item ${activeMenu === 'ดาวน์โหลดเอกสาร' && !isAdminMode ? 'active' : ''}`}
              onClick={async () => { setActiveMenu('ดาวน์โหลดเอกสาร'); setIsAdminMode(false); }}
            >
              <Download size={18} />
              <span className="menu-item-text">ดาวน์โหลดแบบฟอร์ม/เอกสาร</span>
            </div>
          </li>

          {/* Dedicated Admin Page Menu item */}
          {currentUser?.role === 'admin' && (
            <li className="menu-item-container" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
              <div 
                className={`menu-item ${isAdminMode ? 'active' : ''}`}
                style={{ backgroundColor: isAdminMode ? 'var(--warning)' : 'transparent', color: '#fff' }}
                onClick={async () => { setIsAdminMode(true); setActiveMenu('AdminPanel'); }}
              >
                <Settings size={18} />
                <span className="menu-item-text" style={{ fontWeight: '700' }}>⚙️ ระบบจัดการข้อมูล (Admin)</span>
              </div>
            </li>
          )}
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button 
              className="toggle-sidebar-btn" 
              onClick={async () => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu size={20} />
            </button>
            <div className="header-title-container">
              <h1 className="header-title">
                {isAdminMode ? '⚙️ Admin Portal: ระบบหลังบ้านแอดมิน' : 'ระบบสารสนเทศสำนักงานพัฒนาชุมชนอำเภอกะทู้'}
              </h1>
              <span className="header-subtitle">
                {isAdminMode ? 'เพิ่ม ลบ แก้ไข ข้อมูลดิบของกลุ่ม/องค์กร, โครงการพัฒนา, และตัวเลขสถิติรายตำบล' : 'ระบบสนับสนุนการตัดสินใจ (ECC Command Center)'}
              </span>
            </div>
          </div>
          
          <div className="header-right">
            {/* Quick role toggle */}
            {currentUser?.role === 'admin' && (
              <button 
                onClick={async () => {
                  setIsAdminMode(!isAdminMode);
                  setActiveMenu(isAdminMode ? 'ภาพรวมบริหาร' : 'AdminPanel');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isAdminMode ? 'var(--warning-bg)' : '#f1f5f9',
                  color: isAdminMode ? '#b45309' : 'var(--text-main)',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {isAdminMode ? <Lock size={14} /> : <Unlock size={14} />}
                {isAdminMode ? 'แอดมิน: แก้ไขข้อมูลได้' : 'ผู้บริหาร: ดูรายงาน'}
              </button>
            )}

            <button onClick={handleLogout} className="btn-logout-header" title="ออกจากระบบ">
              <LogOut size={14} /> ออกจากระบบ
            </button>

            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-badge">5</span>
            </div>
            
            <div className="user-profile">
              <div className="user-avatar" style={{ 
                backgroundColor: 'white', 
                overflow: 'hidden', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: isAdminMode ? '2px solid var(--warning)' : '1px solid var(--border-color)'
              }}>
                <img src="/logo.png" alt="พช. Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="user-info">
                <span className="user-name">{currentUser?.name}</span>
                <span className="user-role">{currentUser?.role === 'admin' ? 'สิทธิ์ผู้แก้ไขเขียนอ่าน' : 'สิทธิ์ผู้อ่านข้อมูล'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="content-body">
          
          {/* ========================================================
              ⚙️ DEDICATED ADMIN PORTAL PANEL (ระบบจัดการข้อมูล)
             ======================================================== */}
          {isAdminMode && activeMenu === 'AdminPanel' && (
            <div className="dashboard-card">
              <div className="page-tabs-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button className={`tab-btn ${adminTab === 'groups' ? 'active' : ''}`} onClick={async () => setAdminTab('groups')}>
                  👥 จัดการกลุ่ม/องค์กร ({groups.length})
                </button>
                <button className={`tab-btn ${adminTab === 'projects' ? 'active' : ''}`} onClick={async () => setAdminTab('projects')}>
                  📂 จัดการโครงการติดตาม ({projects.length})
                </button>
                <button className={`tab-btn ${adminTab === 'kpis' ? 'active' : ''}`} onClick={async () => setAdminTab('kpis')}>
                  🎯 จัดการตัวชี้วัด ({kpis.length})
                </button>
                <button className={`tab-btn ${adminTab === 'group_types' ? 'active' : ''}`} onClick={async () => setAdminTab('group_types')}>
                  🏷️ จัดการประเภทกลุ่ม ({groupTypes.length})
                </button>
                <button className={`tab-btn ${adminTab === 'districts' ? 'active' : ''}`} onClick={async () => setAdminTab('districts')}>
                  📍 ปรับปรุงสถิติรายตำบล (3)
                </button>
                <button className={`tab-btn ${adminTab === 'reports' ? 'active' : ''}`} onClick={async () => setAdminTab('reports')}>
                  📝 ติดตามส่งรายงาน ({reports.length})
                </button>
                <button className={`tab-btn ${adminTab === 'special_portals' ? 'active' : ''}`} onClick={async () => { setAdminTab('special_portals'); setWomenStatsForm(getWomenStats()); setTpmapStatsForm(getTpmapStats()); }}>
                  ⚙️ จัดการเมนูพิเศษ พช.
                </button>
                <button className={`tab-btn ${adminTab === 'ai_questions' ? 'active' : ''}`} onClick={async () => setAdminTab('ai_questions')}>
                  🤖 จัดการคำถามวิเคราะห์ AI ({aiQuestions.length})
                </button>
                <button className={`tab-btn ${adminTab === 'otop_products' ? 'active' : ''}`} onClick={async () => setAdminTab('otop_products')}>
                  🛍️ จัดการสินค้า OTOP ({otopProducts.length})
                </button>
                <button className={`tab-btn ${adminTab === 'documents' ? 'active' : ''}`} onClick={async () => setAdminTab('documents')}>
                  📄 จัดการแบบฟอร์ม/เอกสาร ({documents.length})
                </button>
                <button className={`tab-btn ${adminTab === 'budgets' ? 'active' : ''}`} onClick={async () => setAdminTab('budgets')}>
                  💰 จัดการงบประมาณและเบิกจ่าย ({monthlyBudgets.length})
                </button>
              </div>

              {/* ADMIN TAB 1: GROUPS MANAGEMENT (เพิ่ม ลบ แก้ไข กลุ่มพัฒนารายอำเภอ) */}
              {adminTab === 'groups' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                  <div className="filter-bar">
                    <div className="filter-group">
                      <label>กรองรายตำบล</label>
                      <select 
                        className="filter-select"
                        value={groupDistrictFilter}
                        onChange={(e) => { setGroupDistrictFilter(e.target.value); setGroupsCurrentPage(1); }}
                      >
                        <option value="ทั้งหมด">ทั้งหมด</option>
                        {DISTRICTS_LIST.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>กรองสถานะติดตาม</label>
                      <select 
                        className="filter-select"
                        value={groupStatusFilter}
                        onChange={(e) => { setGroupStatusFilter(e.target.value); setGroupsCurrentPage(1); }}
                      >
                        <option value="ทั้งหมด">ทั้งหมด</option>
                        <option value="ปกติ">ปกติ</option>
                        <option value="ติดตาม">ติดตาม</option>
                        <option value="แก้ไข">แก้ไข</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>ประเภทกลุ่ม</label>
                      <select 
                        className="filter-select"
                        value={groupTypeFilter}
                        onChange={(e) => { setGroupTypeFilter(e.target.value); setGroupsCurrentPage(1); }}
                      >
                        <option value="ทั้งหมด">ทั้งหมด</option>
                        {groupTypes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="search-input-wrapper">
                      <Search className="search-icon-inside" size={16} />
                      <input 
                        type="text" 
                        className="search-input-field" 
                        placeholder="พิมพ์ชื่อกลุ่ม, ชื่อประธาน หรือ เบอร์โทร เพื่อค้นหา"
                        value={groupSearchQuery}
                        onChange={(e) => setGroupSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setGroupSearchTrigger(groupSearchQuery); }}
                      />
                    </div>
                    
                    <button className="btn-search" onClick={async () => setGroupSearchTrigger(groupSearchQuery)}>ค้นหา</button>
                    <button className="btn-add-new" onClick={handleOpenAddGroup}>
                      <Plus size={16} /> เพิ่มกลุ่ม/องค์กรใหม่
                    </button>
                  </div>

                  <div className="data-table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ลำดับ</th>
                          <th>ชื่อกลุ่ม/องค์กร</th>
                          <th>ประเภทกลุ่ม</th>
                          <th>อำเภอ</th>
                          <th>หน่วยงานรับผิดชอบ</th>
                          <th>ประธานกลุ่ม</th>
                          <th>เบอร์โทร</th>
                          <th>จำนวนสมาชิก</th>
                          <th>สถานะ</th>
                          <th style={{ width: '120px', textAlign: 'center' }}>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedGroups.length > 0 ? (
                          paginatedGroups.map((g, idx) => (
                            <tr key={g.id}>
                              <td>{groupsFirstIdx + idx + 1}</td>
                              <td style={{ fontWeight: '700' }}>{g.name}</td>
                              <td>
                                <span className={`type-badge ${getTypeBadgeClass(g.type)}`}>{g.type}</span>
                              </td>
                              <td>{g.district}</td>
                              <td>{g.agency}</td>
                              <td>{g.president}</td>
                              <td>{g.phone}</td>
                              <td>{g.members} คน</td>
                              <td>
                                <span className={`row-status-badge ${g.status === 'ปกติ' ? 'normal' : g.status === 'ติดตาม' ? 'tracking' : 'danger'}`}>{g.status}</span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button className="btn-action view" onClick={async () => handleOpenViewGroup(g)}><Eye size={12} /></button>
                                  <button className="btn-action edit" onClick={async () => handleOpenEditGroup(g)}><Edit2 size={12} /></button>
                                  <button className="btn-action delete" onClick={async () => handleOpenDeleteGroup(g)}><Trash2 size={12} /></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="11" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>ไม่พบข้อมูลกลุ่ม/องค์กร</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="pagination-footer">
                    <span className="pagination-info">
                      แสดง {filteredGroups.length === 0 ? 0 : groupsFirstIdx + 1} ถึง {Math.min(groupsLastIdx, filteredGroups.length)} จาก {filteredGroups.length} รายการ
                    </span>
                    <div className="pagination-buttons">
                      <button className={`btn-page ${groupsCurrentPage === 1 ? 'disabled' : ''}`} disabled={groupsCurrentPage === 1} onClick={async () => setGroupsCurrentPage(groupsCurrentPage - 1)}>ก่อนหน้า</button>
                      <button className="btn-page active">{groupsCurrentPage}</button>
                      <span style={{ fontSize: '13px', margin: '0 8px', color: 'var(--text-muted)' }}>/ ทั้งหมด {totalGroupPages} หน้า</span>
                      <button className={`btn-page ${groupsCurrentPage === totalGroupPages ? 'disabled' : ''}`} disabled={groupsCurrentPage === totalGroupPages} onClick={async () => setGroupsCurrentPage(groupsCurrentPage + 1)}>ถัดไป</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 2: PROJECTS MANAGEMENT */}
              {adminTab === 'projects' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                  <div className="filter-bar">
                    <div className="search-input-wrapper">
                      <Search className="search-icon-inside" size={16} />
                      <input 
                        type="text" 
                        className="search-input-field" 
                        placeholder="พิมพ์ค้นหาโครงการ หรือ ผู้จัดการ"
                        value={projSearchQuery}
                        onChange={(e) => setProjSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="filter-group">
                      <label>สถานะ</label>
                      <select 
                        className="filter-select"
                        value={projStatusFilter}
                        onChange={(e) => setProjStatusFilter(e.target.value)}
                      >
                        <option value="ทั้งหมด">ทั้งหมด</option>
                        <option value="เสร็จแล้ว">เสร็จแล้ว</option>
                        <option value="ดำเนินการ">ดำเนินการ</option>
                        <option value="ล่าช้า">ล่าช้า</option>
                      </select>
                    </div>
                    <button className="btn-add-new" onClick={handleOpenAddProject}>
                      <Plus size={16} /> เพิ่มโครงการติดตามใหม่
                    </button>
                  </div>

                  <div className="data-table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ลำดับ</th>
                          <th>ชื่อโครงการ</th>
                          <th>พื้นที่อำเภอ</th>
                          <th>งบประมาณโครงการ</th>
                          <th>เบิกจ่ายจริงแล้ว</th>
                          <th>ผู้รับผิดชอบ</th>
                          <th>ความคืบหน้า (%)</th>
                          <th>ขั้นตอนดำเนินงาน</th>
                          <th>สถานะ</th>
                          <th style={{ width: '100px', textAlign: 'center' }}>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjectsAdmin.map((p, idx) => (
                          <tr key={p.id}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: '700' }}>{p.name}</td>
                            <td>{p.district}</td>
                            <td>{formatCurrency(p.budget)} บาท</td>
                            <td>{formatCurrency(p.spent)} บาท</td>
                            <td>{p.manager}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div className="bar-track" style={{ height: '6px', width: '60px', marginBottom: 0 }}><div className="bar-fill" style={{ width: `${p.progress || 0}%`, backgroundColor: '#10b981' }}></div></div>
                                <span>{p.progress || 0}%</span>
                              </div>
                            </td>
                            <td>{p.stage || 'เตรียมการ'}</td>
                            <td>
                              <span className={`status-badge ${
                                p.status === 'เสร็จแล้ว' ? 'very-good' : 
                                p.status === 'ดำเนินการ' ? 'moderate' : 'needs-improvement'
                              }`}>{p.status}</span>
                            </td>
                            <td>
                              <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                <button className="btn-action edit" onClick={async () => handleOpenEditProject(p)}><Edit2 size={12} /></button>
                                <button className="btn-action delete" onClick={async () => handleOpenDeleteProject(p)}><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 3: DISTRICTS BASE STATISTICS */}
              {adminTab === 'districts' && (
                <div style={{ marginTop: '10px' }}>
                  <table className="summary-table">
                    <thead>
                      <tr>
                        <th>ชื่ออำเภอ</th>
                        <th>หมู่บ้าน</th>
                        <th>ครัวเรือน</th>
                        <th>ประชากรรวม</th>
                        <th>รายได้เฉลี่ยต่อปี</th>
                        <th>งบประมาณที่ได้รับ</th>
                        <th>งบเบิกจ่ายสะสม</th>
                        <th>สำเร็จ KPI (จาก 20)</th>
                        <th style={{ width: '80px', textAlign: 'center' }}>แก้ไขข้อมูล</th>
                      </tr>
                    </thead>
                    <tbody>
                      {districts.map((d, idx) => {
                        const popTotal = (d?.population?.male || 0) + (d?.population?.female || 0);
                        return (
                          <tr key={idx}>
                            <td style={{ fontWeight: '700' }}>{d?.name}</td>
                            <td>{d?.villages} หมู่บ้าน</td>
                            <td>{formatCurrency(d?.households || 0)} ค.เรือน</td>
                            <td>{formatCurrency(popTotal)} คน</td>
                            <td>{formatCurrency(d?.economy?.avgIncome || 0)} บาท/ปี</td>
                            <td>{formatCurrency(d?.budget?.received || 0)} บาท</td>
                            <td>{formatCurrency(d?.budget?.disbursed || 0)} บาท</td>
                            <td style={{ fontWeight: '700', color: 'var(--success)' }}>
                              {d?.kpi?.success} ตัวชี้วัด
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                className="btn-action edit" 
                                title="ปรับสถิติอำเภอ"
                                onClick={async () => handleOpenEditDistrict(d)}
                              >
                                <Edit2 size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ADMIN TAB 4: KPIS MANAGEMENT */}
              {adminTab === 'kpis' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                  <div className="filter-bar">
                    <button className="btn-add-new" onClick={handleOpenAddKPI}>
                      <Plus size={16} /> เพิ่มตัวชี้วัดใหม่
                    </button>
                  </div>
                  <div className="data-table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ลำดับ</th>
                          <th>ชื่อตัวชี้วัด</th>
                          <th>เป้าหมาย</th>
                          <th>ผลสัมฤทธิ์</th>
                          <th>หน่วยวัด</th>
                          <th>อำเภอ</th>
                          <th>หน่วยงานรับผิดชอบ</th>
                          <th>สถานะ</th>
                          <th style={{ width: '100px', textAlign: 'center' }}>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kpis.map((k, idx) => (
                          <tr key={k.id}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: '700' }}>{k.name}</td>
                            <td>{k.target}</td>
                            <td>{k.actual}</td>
                            <td>{k.unit}</td>
                            <td>{k.district}</td>
                            <td>{k.agency}</td>
                            <td>
                              <span className={`status-badge ${
                                k.status === 'สำเร็จ' ? 'very-good' : 
                                k.status === 'ดำเนินการ' ? 'moderate' : 'needs-improvement'
                              }`}>{k.status}</span>
                            </td>
                            <td>
                              <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                <button className="btn-action edit" onClick={async () => handleOpenEditKPI(k)}><Edit2 size={12} /></button>
                                <button className="btn-action delete" onClick={async () => { setSelectedKPI(k); setModalType('kpi_delete'); }}><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 5: GROUP TYPES MANAGEMENT */}
              {adminTab === 'group_types' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                  <div className="dashboard-card" style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>🏷️ เพิ่มประเภทกลุ่ม/องค์กรใหม่</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        id="newGroupTypeInput"
                        placeholder="พิมพ์ชื่อประเภทกลุ่ม เช่น กลุ่มเกษตรอินทรีย์"
                        className="form-input"
                        style={{ flex: 1 }}
                      />
                      <button 
                        className="btn-add-new" 
                        onClick={async () => {
                          const input = document.getElementById('newGroupTypeInput');
                          const val = input.value.trim();
                          if (val) {
                            addGroupType(val);
                            alert('เพิ่มประเภทกลุ่มสำเร็จเรียบร้อยแล้ว!');
                            input.value = '';
                            await reloadData();
                          } else {
                            alert('กรุณากรอกชื่อประเภทกลุ่ม');
                          }
                        }}
                      >
                        เพิ่มประเภท
                      </button>
                    </div>
                  </div>
                  <div className="data-table-wrapper" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ลำดับ</th>
                          <th>ชื่อประเภทกลุ่ม</th>
                          <th style={{ width: '80px', textAlign: 'center' }}>ลบ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupTypes.map((type, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: '700' }}>{type}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                className="btn-action delete"
                                onClick={async () => {
                                  if (confirm(`ยืนยันการลบประเภทกลุ่ม "${type}"? ข้อมูลกลุ่มที่เป็นประเภทนี้จะไม่แสดงผล`)) {
                                    deleteGroupType(type);
                                    alert('ลบประเภทกลุ่มสำเร็จเรียบร้อยแล้ว!');
                                    await reloadData();
                                  }
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 6: REPORT TRACKING MANAGEMENT */}
              {adminTab === 'reports' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                  <div className="filter-bar">
                    <button className="btn-add-new" onClick={handleOpenAddReport}>
                      <Plus size={16} /> เพิ่มรายการติดตามรายงานใหม่
                    </button>
                  </div>
                  <div className="data-table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ลำดับ</th>
                          <th>โครงการที่ติดตาม</th>
                          <th>รอบเดือน</th>
                          <th>กำหนดส่ง</th>
                          <th style={{ textAlign: 'center' }}>สถานะรายงาน</th>
                          <th>อัปเดตล่าสุด</th>
                          <th style={{ width: '100px', textAlign: 'center' }}>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((r, idx) => {
                          let statusClass = 'not-reported';
                          if (r.status === 'รายงานแล้ว') statusClass = 'reported';
                          else if (r.status === 'กำลังดำเนินการ') statusClass = 'in-progress';

                          return (
                            <tr key={r.id}>
                              <td>{idx + 1}</td>
                              <td style={{ fontWeight: '700' }}>{r.projectName}</td>
                              <td>{r.month}</td>
                              <td>{r.deadlineDate || 'วันที่ 20 ของเดือน'}</td>
                              <td style={{ textAlign: 'center' }}>
                                <span className={`report-status-badge ${statusClass}`}>{r.status}</span>
                              </td>
                              <td>{r.updatedAt || '-'}</td>
                              <td>
                                <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                  <button className="btn-action edit" onClick={async () => handleOpenEditReport(r)}><Edit2 size={12} /></button>
                                  <button className="btn-action delete" onClick={async () => handleOpenDeleteReport(r)}><Trash2 size={12} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 7: SPECIAL PORTALS MANAGEMENT */}
              {adminTab === 'special_portals' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                  {/* Panel 1: Women's Fund */}
                  <div className="dashboard-card" style={{ padding: '20px', margin: 0 }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      👩 กองทุนพัฒนาบทบาทสตรี
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '12px' }}>สตรีจดทะเบียนสมาชิก (ราย)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={womenStatsForm.registeredMembers} 
                          onChange={e => setWomenStatsForm({...womenStatsForm, registeredMembers: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '12px' }}>ทุนหมุนเวียนกู้ยืม (บาท)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={womenStatsForm.revolvingFund} 
                          onChange={e => setWomenStatsForm({...womenStatsForm, revolvingFund: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <button className="btn-add-new" style={{ width: '100%', marginBottom: '20px', padding: '8px 12px', display: 'flex', justifyContent: 'center' }} onClick={async () => { await saveWomenStats(womenStatsForm); await reloadData(); alert('บันทึกสถิติกองทุนพัฒนาบทบาทสตรีสำเร็จ!'); }}>
                      💾 บันทึกสถิติกองทุนสตรี
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>📋 โครงการสตรี</h4>
                      <button className="btn-add-new" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={async () => { setWomenProjForm({ name: '', groupsCount: '', paybackRate: '' }); setModalType('women_proj_add'); }}>
                        <Plus size={12} /> เพิ่มโครงการสตรี
                      </button>
                    </div>
                    <div className="data-table-wrapper" style={{ overflowY: 'auto', maxHeight: '250px' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ชื่อโครงการ</th>
                            <th>กู้ยืม</th>
                            <th>ชำระตรงเวลา</th>
                            <th style={{ width: '80px', textAlign: 'center' }}>จัดการ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {womenProjects.map(wp => (
                            <tr key={wp.id}>
                              <td style={{ fontWeight: '700', fontSize: '12px' }}>{wp.name}</td>
                              <td style={{ fontSize: '12px' }}>{wp.groupsCount}</td>
                              <td style={{ color: 'var(--success)', fontWeight: '700', fontSize: '12px' }}>{wp.paybackRate}</td>
                              <td>
                                <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                  <button className="btn-action edit" onClick={async () => { setSelectedWomenProject(wp); setWomenProjForm({ name: wp.name, groupsCount: wp.groupsCount, paybackRate: wp.paybackRate }); setModalType('women_proj_edit'); }}><Edit2 size={12} /></button>
                                  <button className="btn-action delete" onClick={async () => { setSelectedWomenProject(wp); setModalType('women_proj_delete'); }}><Trash2 size={12} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Panel 2: TPMAP Stats */}
                  <div className="dashboard-card" style={{ padding: '20px', margin: 0 }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      📍 ระบบคนจนชี้เป้า TPMAP
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '12px' }}>🩺 มิติด้านสุขภาพ (ครัวเรือน)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={tpmapStatsForm.health} 
                          onChange={e => setTpmapStatsForm({...tpmapStatsForm, health: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '12px' }}>🏠 มิติด้านความเป็นอยู่ (ครัวเรือน)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={tpmapStatsForm.living} 
                          onChange={e => setTpmapStatsForm({...tpmapStatsForm, living: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '12px' }}>💵 มิติด้านรายได้ (ยากจนตกเกณฑ์) (ครัวเรือน)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={tpmapStatsForm.income} 
                          onChange={e => setTpmapStatsForm({...tpmapStatsForm, income: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px dashed var(--border-color)', marginTop: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          🧮 <strong>จำนวนครัวเรือนเป้าหมายรวม:</strong> {formatCurrency((tpmapStatsForm.health || 0) + (tpmapStatsForm.living || 0) + (tpmapStatsForm.income || 0))} ครัวเรือน (คำนวณอัตโนมัติ)
                        </span>
                      </div>
                    </div>
                    <button className="btn-add-new" style={{ width: '100%', padding: '8px 12px', display: 'flex', justifyContent: 'center' }} onClick={async () => { await saveTpmapStats(tpmapStatsForm); await reloadData(); alert('บันทึกสถิติครัวเรือน TPMAP สำเร็จ!'); }}>
                      💾 บันทึกสถิติ TPMAP
                    </button>
                  </div>
                </div>

              {/* Custom Special Menus Section (Full Width) */}
              <div className="dashboard-card" style={{ padding: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✨ จัดการรายการเมนูพิเศษเพิ่มเติม (Custom Special Menus)
                  </h3>
                  <button className="btn-add-new" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={async () => { setCustomSpecialMenuForm({ name: '', content: '' }); setModalType('custom_menu_add'); }}>
                    <Plus size={12} /> เพิ่มรายการเมนูพิเศษใหม่
                  </button>
                </div>

                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>ลำดับ</th>
                        <th style={{ width: '250px' }}>ชื่อรายการเมนู</th>
                        <th>เนื้อหาข้อมูล</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customSpecialMenus.length > 0 ? (
                        customSpecialMenus.map((cm, idx) => (
                          <tr key={cm.id}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: '700' }}>{cm.name}</td>
                            <td style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                              {cm.content}
                            </td>
                            <td>
                              <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                <button className="btn-action edit" title="แก้ไข" onClick={async () => { setSelectedCustomSpecialMenu(cm); setCustomSpecialMenuForm({ name: cm.name, content: cm.content }); setModalType('custom_menu_edit'); }}><Edit2 size={12} /></button>
                                <button className="btn-action delete" title="ลบ" onClick={async () => { setSelectedCustomSpecialMenu(cm); setModalType('custom_menu_delete'); }}><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>ยังไม่มีการเพิ่มรายการเมนูพิเศษแบบกำหนดเอง</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ADMIN TAB 8: AI QUESTIONS MANAGEMENT */}
          {adminTab === 'ai_questions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
              <div className="dashboard-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🤖 จัดการคำถามวิเคราะห์ข้อมูลด่วนของ AI
                  </h3>
                  <button className="btn-add-new" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={async () => { setAiQuestionForm({ label: '', query: '', answer: '' }); setModalType('ai_question_add'); }}>
                    <Plus size={12} /> เพิ่มคำถามวิเคราะห์ด่วนใหม่
                  </button>
                </div>

                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>ลำดับ</th>
                        <th style={{ width: '250px' }}>ป้ายชื่อปุ่ม (เช่น 📊 สรุปภาพรวม)</th>
                        <th style={{ width: '250px' }}>คำสั่งที่ส่งหา AI (เช่น สรุปผล...)</th>
                        <th>คำตอบแบบกำหนดเอง (ถ้ามี)</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiQuestions.length > 0 ? (
                        aiQuestions.map((q, idx) => (
                          <tr key={q.id}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: '700' }}>{q.label}</td>
                            <td><code>{q.query}</code></td>
                            <td style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                              {q.answer ? q.answer : <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>(ใช้การคำนวณตามจริงของระบบ)</span>}
                            </td>
                            <td>
                              <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                <button className="btn-action edit" title="แก้ไข" onClick={async () => { setSelectedAiQuestion(q); setAiQuestionForm({ label: q.label, query: q.query, answer: q.answer || '' }); setModalType('ai_question_edit'); }}><Edit2 size={12} /></button>
                                <button className="btn-action delete" title="ลบ" onClick={async () => { setSelectedAiQuestion(q); setModalType('ai_question_delete'); }}><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>ยังไม่มีคำถามวิเคราะห์ด่วนในฐานข้อมูล</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN TAB 9: OTOP PRODUCTS MANAGEMENT */}
          {adminTab === 'otop_products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
              <div className="dashboard-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🛍️ จัดการรายการสินค้า OTOP ยอดนิยม
                  </h3>
                  <button className="btn-add-new" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={async () => { setOtopProductForm({ name: '', type: 'อาหาร', district: 'ตำบลกะทู้', sale: '', star: 5 }); setModalType('otop_product_add'); }}>
                    <Plus size={12} /> เพิ่มสินค้า OTOP ใหม่
                  </button>
                </div>

                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '200px', position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="ค้นหาชื่อสินค้า OTOP..." 
                      value={otopAdminSearchQuery} 
                      onChange={e => setOtopAdminSearchQuery(e.target.value)} 
                      style={{ paddingLeft: '32px', height: '36px', margin: 0 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>ประเภท:</label>
                    <select 
                      className="filter-select" 
                      value={otopAdminCategoryFilter} 
                      onChange={e => setOtopAdminCategoryFilter(e.target.value)}
                      style={{ height: '36px', padding: '0 12px' }}
                    >
                      <option value="ทั้งหมด">ทั้งหมด</option>
                      {OTOP_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>ตำบลที่ตั้ง:</label>
                    <select 
                      className="filter-select" 
                      value={otopAdminDistrictFilter} 
                      onChange={e => setOtopAdminDistrictFilter(e.target.value)}
                      style={{ height: '36px', padding: '0 12px' }}
                    >
                      <option value="ทั้งหมด">ทั้งหมด</option>
                      {DISTRICTS_LIST.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>ลำดับ</th>
                        <th>ชื่อสินค้า OTOP</th>
                        <th style={{ width: '180px' }}>ประเภทสินค้า</th>
                        <th style={{ width: '150px' }}>ตำบลที่ตั้ง</th>
                        <th style={{ width: '180px' }}>ยอดจำหน่ายสะสม (บาท)</th>
                        <th style={{ width: '120px' }}>ความนิยม (Rating)</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const filtered = otopProducts.filter(p => {
                          const matchesSearch = p.name.toLowerCase().includes(otopAdminSearchQuery.toLowerCase());
                          const matchesCategory = otopAdminCategoryFilter === 'ทั้งหมด' || p.type === otopAdminCategoryFilter;
                          const matchesDistrict = otopAdminDistrictFilter === 'ทั้งหมด' || p.district === otopAdminDistrictFilter;
                          return matchesSearch && matchesCategory && matchesDistrict;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>ไม่พบข้อมูลสินค้า OTOP ที่ตรงกับเงื่อนไขการค้นหา</td>
                            </tr>
                          );
                        }

                        return filtered.map((p, idx) => (
                          <tr key={p.id || idx}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: '700' }}>{p.name}</td>
                            <td>
                              <span className="status-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '11px', padding: '2px 8px' }}>
                                {p.type || 'อาหาร'}
                              </span>
                            </td>
                            <td>
                              <span className="status-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '11px', padding: '2px 8px' }}>
                                {p.district || 'ตำบลกะทู้'}
                              </span>
                            </td>
                            <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{formatCurrency(p.sale)} บาท</td>
                            <td style={{ color: 'var(--warning)', letterSpacing: '2px' }}>{'★'.repeat(p.star || 5)}</td>
                            <td>
                              <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                <button className="btn-action edit" title="แก้ไข" onClick={async () => { setSelectedOtopProduct(p); setOtopProductForm({ name: p.name, type: p.type || 'อาหาร', district: p.district || 'ตำบลกะทู้', sale: p.sale, star: p.star || 5 }); setModalType('otop_product_edit'); }}><Edit2 size={12} /></button>
                                <button className="btn-action delete" title="ลบ" onClick={async () => { setSelectedOtopProduct(p); setModalType('otop_product_delete'); }}><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN TAB 10: DOCUMENTS MANAGEMENT */}
          {adminTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
              <div className="dashboard-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📄 จัดการแบบฟอร์ม / เอกสารดาวน์โหลด
                  </h3>
                  <button className="btn-add-new" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={async () => { setDocumentForm({ name: '', category: 'OTOP', type: 'PDF', size: '100 KB', link: '' }); setModalType('document_add'); }}>
                    <Plus size={12} /> เพิ่มแบบฟอร์ม/เอกสารใหม่
                  </button>
                </div>

                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>ลำดับ</th>
                        <th>ชื่อแบบฟอร์ม / เอกสาร</th>
                        <th style={{ width: '150px' }}>หมวดหมู่</th>
                        <th style={{ width: '120px' }}>ประเภทไฟล์</th>
                        <th style={{ width: '120px' }}>ขนาดไฟล์</th>
                        <th>ลิงก์ดาวน์โหลด</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.length > 0 ? (
                        documents.map((d, idx) => (
                          <tr key={d.id || idx}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: '700' }}>{d.name}</td>
                            <td>
                              <span className="status-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '11px', padding: '2px 8px' }}>
                                {d.category === 'OTOP' ? 'OTOP / วิสาหกิจ' : d.category === 'กองทุนสตรี' ? 'กองทุนพัฒนาสตรี' : d.category === 'องค์กรชุมชน' ? 'กลุ่ม/องค์กรชุมชน' : d.category}
                              </span>
                            </td>
                            <td>{d.type || 'PDF'}</td>
                            <td>{d.size || '100 KB'}</td>
                            <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px', color: 'var(--text-muted)' }}>
                              <a href={d.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{d.link}</a>
                            </td>
                            <td>
                              <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                <button className="btn-action edit" title="แก้ไข" onClick={async () => { setSelectedDocument(d); setDocumentForm({ name: d.name, category: d.category || 'OTOP', type: d.type || 'PDF', size: d.size || '100 KB', link: d.link || '' }); setModalType('document_edit'); }}><Edit2 size={12} /></button>
                                <button className="btn-action delete" title="ลบ" onClick={async () => { setSelectedDocument(d); setModalType('document_delete'); }}><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>ยังไม่มีแบบฟอร์มหรือเอกสารในระบบ</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN TAB 11: BUDGETS MANAGEMENT */}
          {adminTab === 'budgets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              <div className="filter-bar">
                <button className="btn-add-new" onClick={handleOpenAddBudget}>
                  <Plus size={16} /> เพิ่มงบประมาณใหม่
                </button>
              </div>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ลำดับ</th>
                      <th>เดือน/ปีงบประมาณ</th>
                      <th>ประเภทงบประมาณ</th>
                      <th>ชื่อแผนงาน/โครงการ</th>
                      <th>จำนวนงบประมาณ (บาท)</th>
                      <th>สถานะการเบิกจ่าย</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyBudgets.map((b, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: '700' }}>{b.month} {b.year || ''}</td>
                        <td>{b.budgetType || 'โครงการยุทธศาสตร์'}</td>
                        <td>{b.planName || '-'}</td>
                        <td>{parseFloat(b.target).toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${
                            b.status === 'เบิกจ่ายแล้ว' ? 'very-good' : 
                            b.status === 'ระหว่างเบิกจ่าย' ? 'moderate' : 'needs-improvement'
                          }`}>{b.status || 'ยังไม่เบิกจ่าย'}</span>
                        </td>
                        <td>
                          <div className="action-buttons" style={{ justifyContent: 'center' }}>
                            <button className="btn-action edit" onClick={async () => handleOpenEditBudget(b)}><Edit2 size={12} /></button>
                            <button className="btn-action delete" onClick={async () => { setSelectedBudget(b); setModalType('budget_delete'); }}><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reset system button at the bottom of the Admin Panel */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
            <button 
              onClick={handleResetSystem}
              className="btn-action delete"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 20px', 
                fontSize: '14px', 
                fontWeight: 'bold',
                width: 'auto',
                borderRadius: '8px',
                backgroundColor: 'var(--danger)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={16} /> 🔄 รีเซ็ตข้อมูลดิบระบบกลับเป็นค่าเริ่มต้น
            </button>
          </div>
            </div>
          )}

          {/* ========================================================
              👤 READ-ONLY EXECUTIVE PORTAL PAGES (1-10)
             ======================================================== */}
          {!isAdminMode && (
            <>
              {/* PAGE 1: EXECUTIVE OVERVIEW */}
              {activeMenu === 'ภาพรวมบริหาร' && (
                <>
                  <section className="summary-cards-grid">
                    <div className="summary-card">
                      <div className="card-icon-container purple"><MapPin size={22} /></div>
                      <div className="card-details">
                        <span className="card-label">จำนวนตำบลทั้งหมด</span>
                        <span className="card-value">{districts.length} ตำบล</span>
                        <span className="card-desc">{totalVillages} หมู่บ้าน/ชุมชน</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="card-icon-container blue"><Home size={22} /></div>
                      <div className="card-details">
                        <span className="card-label">จำนวนครัวเรือน</span>
                        <span className="card-value">{formatCurrency(totalHouseholds)} ครัวเรือน</span>
                        <span className="card-desc">ประชากร: {formatCurrency(totalPop)} คน</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="card-icon-container green"><Users size={22} /></div>
                      <div className="card-details">
                        <span className="card-label">ผู้ประกอบการ OTOP</span>
                        <span className="card-value">{totalOtopProducers} ราย</span>
                        <span className="card-desc">ยอดจำหน่ายสะสม: {formatCurrency(districts.reduce((sum, d) => sum + (d?.otopSales || 0), 0))} บาท</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="card-icon-container orange"><CheckCircle2 size={22} /></div>
                      <div className="card-details">
                        <span className="card-label">KPI ผ่านสำเร็จสะสม</span>
                        <span className="card-value">{kpiRateOverall}%</span>
                        <span className="card-desc">สำเร็จ {totalKpisSuccess} จาก {totalKpis}</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="card-icon-container cyan"><DollarSign size={22} /></div>
                      <div className="card-details">
                        <span className="card-label">เบิกจ่ายงบประมาณแผ่นดิน</span>
                        <span className="card-value">{budgetRateOverall}%</span>
                        <span className="card-desc">เบิกจ่าย: {formatCurrency(totalBudgetDisbursed)} บาท</span>
                      </div>
                    </div>
                  </section>

                  <section className="middle-grid">
                    <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
                      <h2 className="dashboard-card-title">สรุปภาพรวมระดับอำเภอ</h2>
                      <div className="summary-table-wrapper">
                        <table className="summary-table">
                          <thead>
                            <tr>
                              <th>ตำบล</th>
                              <th>กลุ่มทั้งหมด</th>
                              <th>ต้องแก้ไขสะสม (รวม)</th>
                              <th>ออมทรัพย์</th>
                              <th>กองทุนแม่</th>
                              <th>กองทุนพัฒนาบทบาทสตรี</th>
                              <th>กข.คจ.</th>
                              <th>สถานะ แก้ไข</th>
                            </tr>
                          </thead>
                          <tbody>
                            {districts.map((d, idx) => {
                              const totalGroups = groups.filter(g => g.district === d.name).length;
                              const totalEdit = groups.filter(g => g.district === d.name && g.status === 'แก้ไข').length;
                              const savingEdit = groups.filter(g => g.district === d.name && g.type === 'กลุ่มออมทรัพย์' && g.status === 'แก้ไข').length;
                              const motherEdit = groups.filter(g => g.district === d.name && g.type === 'กองทุนแม่' && g.status === 'แก้ไข').length;
                              const womenEdit = groups.filter(g => g.district === d.name && g.type === 'กองทุนสตรี' && g.status === 'แก้ไข').length;
                              const povertyEdit = groups.filter(g => g.district === d.name && g.type === 'กข.คจ.' && g.status === 'แก้ไข').length;
                              
                              let evalStatus = 'ปกติ';
                              let evalClass = 'very-good';
                              if (totalEdit >= 10) { evalStatus = 'วิกฤต'; evalClass = 'needs-improvement'; }
                              else if (totalEdit >= 5) { evalStatus = 'เฝ้าระวัง'; evalClass = 'moderate'; }
                              
                              return (
                                <tr key={idx}>
                                  <td style={{ fontWeight: '600' }}>{d?.name}</td>
                                  <td>{totalGroups}</td>
                                  <td style={{ fontWeight: '700', color: totalEdit > 0 ? 'var(--danger)' : 'inherit' }}>
                                    {totalEdit > 0 ? `${totalEdit} กลุ่ม` : '0'}
                                  </td>
                                  <td style={{ fontWeight: savingEdit > 0 ? '700' : 'normal', color: savingEdit > 0 ? 'var(--danger)' : 'var(--text-muted)', opacity: savingEdit > 0 ? 1 : 0.5 }}>
                                    {savingEdit}
                                  </td>
                                  <td style={{ fontWeight: motherEdit > 0 ? '700' : 'normal', color: motherEdit > 0 ? 'var(--danger)' : 'var(--text-muted)', opacity: motherEdit > 0 ? 1 : 0.5 }}>
                                    {motherEdit}
                                  </td>
                                  <td style={{ fontWeight: womenEdit > 0 ? '700' : 'normal', color: womenEdit > 0 ? 'var(--danger)' : 'var(--text-muted)', opacity: womenEdit > 0 ? 1 : 0.5 }}>
                                    {womenEdit}
                                  </td>
                                  <td style={{ fontWeight: povertyEdit > 0 ? '700' : 'normal', color: povertyEdit > 0 ? 'var(--danger)' : 'var(--text-muted)', opacity: povertyEdit > 0 ? 1 : 0.5 }}>
                                    {povertyEdit}
                                  </td>
                                  <td>
                                    <span className={`status-badge ${evalClass}`}>{evalStatus}</span>
                                  </td>
                                </tr>
                              );
                            })}
                            {/* Grand Total Row */}
                            {(() => {
                              const grandTotalGroups = groups.length;
                              const grandTotalEdit = groups.filter(g => g.status === 'แก้ไข').length;
                              const grandSavingEdit = groups.filter(g => g.type === 'กลุ่มออมทรัพย์' && g.status === 'แก้ไข').length;
                              const grandMotherEdit = groups.filter(g => g.type === 'กองทุนแม่' && g.status === 'แก้ไข').length;
                              const grandWomenEdit = groups.filter(g => g.type === 'กองทุนสตรี' && g.status === 'แก้ไข').length;
                              const grandPovertyEdit = groups.filter(g => g.type === 'กข.คจ.' && g.status === 'แก้ไข').length;
                              
                              let grandEvalStatus = 'ปกติ';
                              let grandEvalClass = 'very-good';
                              if (grandTotalEdit >= 10) { grandEvalStatus = 'วิกฤต'; grandEvalClass = 'needs-improvement'; }
                              else if (grandTotalEdit >= 5) { grandEvalStatus = 'เฝ้าระวัง'; grandEvalClass = 'moderate'; }
                              
                              return (
                                <tr style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', fontWeight: '700', borderTop: '2px double var(--border-color)' }}>
                                  <td style={{ fontWeight: '700' }}>รวมอำเภอกะทู้</td>
                                  <td>{grandTotalGroups}</td>
                                  <td style={{ color: grandTotalEdit > 0 ? 'var(--danger)' : 'inherit' }}>
                                    {grandTotalEdit} กลุ่ม
                                  </td>
                                  <td style={{ color: grandSavingEdit > 0 ? 'var(--danger)' : 'inherit' }}>{grandSavingEdit}</td>
                                  <td style={{ color: grandMotherEdit > 0 ? 'var(--danger)' : 'inherit' }}>{grandMotherEdit}</td>
                                  <td style={{ color: grandWomenEdit > 0 ? 'var(--danger)' : 'inherit' }}>{grandWomenEdit}</td>
                                  <td style={{ color: grandPovertyEdit > 0 ? 'var(--danger)' : 'inherit' }}>{grandPovertyEdit}</td>
                                  <td>
                                    <span className={`status-badge ${grandEvalClass}`}>{grandEvalStatus}</span>
                                  </td>
                                </tr>
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="dashboard-card">
                      <h2 className="dashboard-card-title">ความคืบหน้ารวมอำเภอกะทู้</h2>
                      <div className="chart-container">
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <DonutChart 
                            segments={[
                              { value: totalKpisSuccess, total: totalKpis, color: '#10b981' },
                              { value: totalKpisInProgress, total: totalKpis, color: '#f59e0b' },
                              { value: totalKpisRisk, total: totalKpis, color: '#ef4444' }
                            ]}
                            centerValue={`${kpiRateOverall}%`}
                            centerLabel="KPI ผ่าน"
                          />
                          <DonutChart 
                            segments={[
                              { value: totalStrategyDisbursed, total: totalStrategyReceived, color: '#2563eb' },
                              { value: totalStrategyRemaining, total: totalStrategyReceived, color: '#e5e7eb' }
                            ]}
                            centerValue={`${strategyRateOverall}%`}
                            centerLabel="เบิกจ่ายงบยุทธศาสตร์"
                          />
                          <DonutChart 
                            segments={[
                              { value: totalWomenDisbursed, total: totalWomenReceived, color: '#ec4899' },
                              { value: totalWomenRemaining, total: totalWomenReceived, color: '#e5e7eb' }
                            ]}
                            centerValue={`${womenRateOverall}%`}
                            centerLabel="เบิกจ่ายงบกองทุนพัฒนาบทบาทสตรี"
                          />
                        </div>
                        <div className="chart-legend" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                          <div className="legend-item">
                            <div className="legend-item-left">
                              <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                              <span className="legend-label">สำเร็จ</span>
                            </div>
                            <span className="legend-value">{totalKpisSuccess}</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-item-left">
                              <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                              <span className="legend-label">เสี่ยงวิกฤต</span>
                            </div>
                            <span className="legend-value" style={{ color: 'var(--danger)' }}>{totalKpisRisk}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {/* PAGE 2: KPI DASHBOARD */}
              {activeMenu === 'ตัวชี้วัด' && (
                <div className="dashboard-card">
                  <div className="page-tabs-bar">
                    <button className={`tab-btn ${kpiTab === 'overall' ? 'active' : ''}`} onClick={async () => setKpiTab('overall')}>ตัวชี้วัดรวมอำเภอกะทู้</button>
                    <button className={`tab-btn ${kpiTab === 'ranking' ? 'active' : ''}`} onClick={async () => setKpiTab('ranking')}>จัดลำดับผลสัมฤทธิ์ตำบล</button>
                  </div>
                  {kpiTab === 'overall' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginTop: '10px' }}>
                      <div className="report-stat-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: '13px' }}>เป้าหมายอำเภอ</h3>
                        <div style={{ margin: '14px 0' }}>
                          <DonutChart 
                            segments={[
                              { value: totalKpisSuccess, total: totalKpis, color: '#10b981' },
                              { value: totalKpisInProgress, total: totalKpis, color: '#f59e0b' },
                              { value: totalKpisRisk, total: totalKpis, color: '#ef4444' }
                            ]}
                            centerValue={`${kpiRateOverall}%`}
                            centerLabel="KPI บรรลุแล้ว"
                          />
                        </div>
                      </div>
                      <div className="bar-chart-container">
                        <div className="bar-row">
                          <div className="bar-row-label-row">
                            <span>🟢 บรรลุเป้าหมายตัวชี้วัด (สำเร็จ)</span>
                            <span>{totalKpisSuccess} ตัวชี้วัด ({kpiRateOverall}%)</span>
                          </div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${kpiRateOverall}%`, backgroundColor: '#10b981' }}></div></div>
                        </div>
                        <div className="bar-row">
                          <div className="bar-row-label-row">
                            <span>🟡 อยู่ระหว่างเร่งดำเนินงาน (เฝ้าระวัง)</span>
                            <span>{totalKpisInProgress} ตัวชี้วัด ({((totalKpisInProgress/totalKpis)*100).toFixed(1)}%)</span>
                          </div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${(totalKpisInProgress/totalKpis)*100}%`, backgroundColor: '#f59e0b' }}></div></div>
                        </div>
                        <div className="bar-row">
                          <div className="bar-row-label-row">
                            <span>🔴 เสี่ยงไม่ผ่านตัวชี้วัด (วิกฤตล่าช้า)</span>
                            <span style={{ color: 'var(--danger)', fontWeight: '700' }}>{totalKpisRisk} ตัวชี้วัด ({((totalKpisRisk/totalKpis)*100).toFixed(1)}%)</span>
                          </div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${(totalKpisRisk/totalKpis)*100}%`, backgroundColor: '#ef4444' }}></div></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {kpiTab === 'ranking' && (
                    <table className="summary-table" style={{ marginTop: '10px' }}>
                      <thead>
                        <tr>
                          <th>อันดับ</th>
                          <th>ตำบล</th>
                          <th>ผ่านเป้าตัวชี้วัด</th>
                          <th>มีความเสี่ยงล่าช้า</th>
                          <th>อัตราผลสำเร็จตัวชี้วัด</th>
                          <th>ความก้าวหน้า</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...districts].sort((a,b) => ((b?.kpi?.success || 0)/(b?.kpi?.total || 1)) - ((a?.kpi?.success || 0)/(a?.kpi?.total || 1))).map((d, idx) => {
                          const rate = d?.kpi?.total > 0 ? (d.kpi.success/d.kpi.total)*100 : 0;
                          return (
                            <tr key={idx}>
                              <td>{idx+1}</td>
                              <td style={{ fontWeight: '700' }}>{d?.name}</td>
                              <td>{d?.kpi?.success} KPI</td>
                              <td style={{ color: d?.kpi?.atRisk > 0 ? 'var(--danger)' : 'inherit' }}>{d?.kpi?.atRisk} KPI</td>
                              <td>{rate.toFixed(1)}%</td>
                              <td style={{ width: '150px' }}>
                                <div className="bar-track" style={{ height: '6px' }}><div className="bar-fill" style={{ width: `${rate}%`, backgroundColor: '#10b981' }}></div></div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* PAGE 3: BUDGET */}
              {activeMenu === 'งบประมาณ' && (
                <div className="dashboard-card">
                  <div className="page-tabs-bar">
                    <button className={`tab-btn ${budgetTab === 'financial' ? 'active' : ''}`} onClick={async () => setBudgetTab('financial')}>สรุปการเงินอำเภอกะทู้</button>
                    <button className={`tab-btn ${budgetTab === 'monthly' ? 'active' : ''}`} onClick={async () => setBudgetTab('monthly')}>เบิกจ่ายเทียบเป้าสะสม</button>
                  </div>
                  {budgetTab === 'financial' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                      <div className="summary-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        <div className="summary-card">
                          <div className="card-details">
                            <span className="card-label">💰 งบประมาณทั้งหมด</span>
                            <span className="card-value">{formatCurrency(totalBudgetReceived)} บาท</span>
                          </div>
                        </div>
                        <div className="summary-card">
                          <div className="card-details">
                            <span className="card-label">✅ งบกองทุนพัฒนาบทบาทสตรี</span>
                            <span className="card-value">{formatCurrency(monthlyBudgets.filter(b => b.budgetType === 'กองทุนพัฒนาบทบาทสตรี').reduce((sum, b) => sum + (parseFloat(b.target) || 0), 0))} บาท</span>
                          </div>
                        </div>
                        <div className="summary-card">
                          <div className="card-details">
                            <span className="card-label">💸 เบิกจ่ายจริงสะสม</span>
                            <span className="card-value" style={{ color: 'var(--primary)' }}>{formatCurrency(totalBudgetDisbursed)} บาท</span>
                          </div>
                        </div>
                        <div className="summary-card">
                          <div className="card-details">
                            <span className="card-label">🍀 งบประมาณคงเหลือ</span>
                            <span className="card-value" style={{ color: 'var(--success)' }}>{formatCurrency(totalBudgetRemaining)} บาท</span>
                          </div>
                        </div>
                      </div>
                      
                      <table className="summary-table">
                        <thead>
                          <tr>
                            <th>เดือน/ปีงบประมาณ</th>
                            <th>ประเภทงบประมาณ</th>
                            <th>ชื่อแผนงาน/โครงการ</th>
                            <th>จำนวนงบประมาณ (บาท)</th>
                            <th>สถานะการเบิกจ่าย</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyBudgets.map((b, idx) => {
                            const isFuture = b.actual === 0 && b.status === 'ยังไม่เบิกจ่าย';
                            const target = parseFloat(b.target) || 0;
                            
                            return (
                              <tr key={idx} style={{ opacity: isFuture ? 0.6 : 1 }}>
                                <td>{b.month} {b.year || ''}</td>
                                <td>{b.budgetType || 'โครงการยุทธศาสตร์'}</td>
                                <td>{b.planName || '-'}</td>
                                <td>{formatCurrency(target)} บาท</td>
                                <td>
                                  <span className={`status-badge ${
                                    b.status === 'เบิกจ่ายแล้ว' ? 'very-good' : 
                                    b.status === 'ระหว่างเบิกจ่าย' ? 'moderate' : 'needs-improvement'
                                  }`}>{b.status || 'ยังไม่เบิกจ่าย'}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {budgetTab === 'monthly' && (
                    <div className="bar-chart-container" style={{ marginTop: '10px' }}>
                      {monthlyBudgets.filter(b => b.actual > 0).map((b, idx) => (
                        <div className="bar-row" key={idx}>
                          <div className="bar-row-label-row">
                            <span className="bar-row-title">{b.month} (เบิกสะสม)</span>
                            <span className="bar-row-value">{((b.actual/b.target)*100).toFixed(1)}% (จริง {formatCurrency(b.actual)} / เป้า {formatCurrency(b.target)})</span>
                          </div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${(b.actual/b.target)*100}%` }}></div></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PAGE 4: BASIC INFO */}
              {activeMenu === 'ข้อมูลพื้นฐาน' && (
                <div className="dashboard-card">
                  <div className="page-tabs-bar">
                    <button className={`tab-btn ${basicInfoTab === 'demographics' ? 'active' : ''}`} onClick={async () => setBasicInfoTab('demographics')}>กลุ่มประชากรเปราะบาง</button>
                    <button className={`tab-btn ${basicInfoTab === 'economy' ? 'active' : ''}`} onClick={async () => setBasicInfoTab('economy')}>เศรษฐกิจและรายได้เฉลี่ย</button>
                  </div>
                  {basicInfoTab === 'demographics' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                      <div className="bar-chart-container">
                        <div className="bar-row">
                          <div className="bar-row-label-row"><span>👨‍💼 ประชากรชาย</span><span>{formatCurrency(districts.reduce((sum,d)=>sum+(d?.population?.male || 0),0))} คน</span></div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: '48%', backgroundColor: '#3b82f6' }}></div></div>
                        </div>
                        <div className="bar-row">
                          <div className="bar-row-label-row"><span>👩‍💼 ประชากรหญิง</span><span>{formatCurrency(districts.reduce((sum,d)=>sum+(d?.population?.female || 0),0))} คน</span></div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: '52%', backgroundColor: '#ec4899' }}></div></div>
                        </div>
                        <div className="bar-row">
                          <div className="bar-row-label-row"><span>🧓 ผู้สูงอายุ (60 ปีขึ้นไป)</span><span>{formatCurrency(districts.reduce((sum,d)=>sum+(d?.population?.elderly || 0),0))} คน</span></div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: '22%', backgroundColor: '#8b5cf6' }}></div></div>
                        </div>
                        <div className="bar-row">
                          <div className="bar-row-label-row"><span>♿ ผู้พิการช่วยเหลือตนเองไม่ได้</span><span style={{ color: 'var(--danger)', fontWeight: '700' }}>{formatCurrency(districts.reduce((sum,d)=>sum+(d?.population?.disabled || 0),0))} คน</span></div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: '3%', backgroundColor: '#ef4444' }}></div></div>
                        </div>
                      </div>
                      <table className="summary-table">
                        <thead>
                          <tr>
                            <th>อำเภอ</th>
                            <th>สูงอายุ</th>
                            <th>ผู้พิการ</th>
                            <th>เด็กเล็ก</th>
                          </tr>
                        </thead>
                        <tbody>
                          {districts.map((d, idx) => (
                            <tr key={idx}>
                              <td>{d?.name}</td>
                              <td>{formatCurrency(d?.population?.elderly || 0)} คน</td>
                              <td style={{ color: 'var(--danger)', fontWeight: '700' }}>{formatCurrency(d?.population?.disabled || 0)} คน</td>
                              <td>{formatCurrency(d?.population?.kids || 0)} คน</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {basicInfoTab === 'economy' && (
                    <div className="bar-chart-container" style={{ marginTop: '10px' }}>
                      {districts.map((d, idx) => (
                        <div className="bar-row" key={idx}>
                          <div className="bar-row-label-row">
                            <span className="bar-row-title">{d?.name}</span>
                            <span className="bar-row-value">{formatCurrency(d?.economy?.avgIncome || 0)} บาท/ปี</span>
                          </div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${((d?.economy?.avgIncome || 0)/150000)*100}%`, backgroundColor: (d?.economy?.avgIncome || 0) < 100000 ? '#ea580c' : '#2563eb' }}></div></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PAGE 5: OTOP */}
              {activeMenu === 'OTOP' && (() => {
                const otopCategorySales = OTOP_CATEGORIES.map(cat => {
                  const sales = otopProducts.filter(p => p.type === cat).reduce((sum, p) => sum + (p.sale || 0), 0);
                  return { category: cat, sales };
                });
                const overallOtopSales = otopCategorySales.reduce((sum, item) => sum + item.sales, 0);
                const maxCategorySales = Math.max(...otopCategorySales.map(c => c.sales), 1);
                
                const filteredOtopProductsDashboard = otopProducts.filter(p => {
                  return otopCategoryFilter === 'ทั้งหมด' || p.type === otopCategoryFilter;
                });

                // วิเคราะห์จำนวนผลิตภัณฑ์ OTOP ตามประเภทและตัวกรองตำบล
                const productsForCount = otopCountFilterDistrict === 'ทั้งหมด' 
                  ? otopProducts 
                  : otopProducts.filter(p => p.district === otopCountFilterDistrict);

                const otopCategoryCounts = OTOP_CATEGORIES.map(cat => {
                  const count = productsForCount.filter(p => p.type === cat).length;
                  return { category: cat, count };
                });
                const totalProductCount = otopCategoryCounts.reduce((sum, item) => sum + item.count, 0);
                const maxProductCount = Math.max(...otopCategoryCounts.map(c => c.count), 1);

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Column 1: District OTOP sales + Category sales bar chart */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="dashboard-card">
                        <h2 className="dashboard-card-title">ยอดจำหน่ายผลิตภัณฑ์ OTOP สะสมรายตำบล</h2>
                        <table className="summary-table">
                          <thead>
                            <tr>
                              <th>อันดับ</th>
                              <th>ตำบล</th>
                              <th>ผู้ผลิตขึ้นทะเบียน</th>
                              <th>ยอดขายสะสม</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedOtopProducers.map((d, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td style={{ fontWeight: '700' }}>{d?.name}</td>
                                <td>{d?.economy?.otopProducers || 0} ราย</td>
                                <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{formatCurrency(d?.otopSales || 0)} บาท</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="dashboard-card">
                        <h2 className="dashboard-card-title">วิเคราะห์ยอดจำหน่ายสะสมแยกตามประเภทผลิตภัณฑ์</h2>
                        <div className="bar-chart-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                          {otopCategorySales.map((item, idx) => {
                            const percentage = overallOtopSales > 0 ? ((item.sales / overallOtopSales) * 100).toFixed(1) : '0';
                            const scalePercent = ((item.sales / maxCategorySales) * 100).toFixed(1);
                            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
                            const barColor = colors[idx % colors.length];
                            return (
                              <div className="bar-row" key={idx}>
                                <div className="bar-row-label-row">
                                  <span className="bar-row-title" style={{ fontWeight: '600', fontSize: '13px' }}>{item.category}</span>
                                  <span className="bar-row-value" style={{ fontSize: '12px' }}>{formatCurrency(item.sales)} บาท ({percentage}%)</span>
                                </div>
                                <div className="bar-track">
                                  <div className="bar-fill" style={{ width: `${scalePercent}%`, backgroundColor: barColor }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Filtered OTOP popular products list */}
                    <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
                        <h2 className="dashboard-card-title" style={{ margin: 0 }}>สินค้า OTOP ยอดนิยมของอำเภอ</h2>
                        <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                          <label style={{ fontSize: '12px', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>ประเภท:</label>
                          <select 
                            className="filter-select"
                            value={otopCategoryFilter}
                            onChange={(e) => setOtopCategoryFilter(e.target.value)}
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            <option value="ทั้งหมด">ทั้งหมด ({otopProducts.length})</option>
                            {OTOP_CATEGORIES.map(cat => {
                              const count = otopProducts.filter(p => p.type === cat).length;
                              return (
                                <option key={cat} value={cat}>{cat} ({count})</option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, maxHeight: '480px' }}>
                        {filteredOtopProductsDashboard.length > 0 ? (
                          filteredOtopProductsDashboard.map((p, idx) => (
                            <div key={p.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontWeight: '700' }}>{idx + 1}. {p.name}</span>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>ประเภท: {p.type}</span>
                              </div>
                              <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                                {formatCurrency(p.sale)} บาท <span style={{ color: 'var(--warning)' }}>{'★'.repeat(p.star || 5)}</span>
                              </span>
                            </div>
                          ))
                        ) : (
                          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                            ไม่พบสินค้า OTOP ในประเภทที่เลือก
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* แดชบอร์ดสรุปวิเคราะห์จำนวนรายผลิตภัณฑ์ OTOP */}
                  <div className="dashboard-card" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
                      <h2 className="dashboard-card-title" style={{ margin: 0 }}>📊 สรุปจำนวนผลิตภัณฑ์ OTOP แยกตามประเภทผลิตภัณฑ์</h2>
                      <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>เลือกตัวกรองรายตำบล:</label>
                        <select 
                          className="filter-select"
                          value={otopCountFilterDistrict}
                          onChange={(e) => setOtopCountFilterDistrict(e.target.value)}
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          <option value="ทั้งหมด">ภาพรวมอำเภอกะทู้</option>
                          {DISTRICTS_LIST.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.1)', marginBottom: '20px', lineHeight: '1.6', fontSize: '14px' }}>
                      📢 <strong>สรุปยอดจำแนก:</strong> พื้นที่{' '}
                      <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                        {otopCountFilterDistrict === 'ทั้งหมด' ? 'ภาพรวมอำเภอกะทู้' : otopCountFilterDistrict}
                      </span>{' '}
                      มีรายการสินค้า OTOP ทั้งหมด{' '}
                      <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{totalProductCount}</strong> ราย แบ่งเป็น:
                      <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                        {otopCategoryCounts.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            ประเภท <strong>{item.category}</strong>: <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{item.count}</span> ราย
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bar-chart-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {otopCategoryCounts.map((item, idx) => {
                        const scalePercent = totalProductCount > 0 ? ((item.count / maxProductCount) * 100).toFixed(1) : '0';
                        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
                        const barColor = colors[idx % colors.length];
                        return (
                          <div className="bar-row" key={idx}>
                            <div className="bar-row-label-row">
                              <span className="bar-row-title" style={{ fontWeight: '600', fontSize: '13px' }}>{item.category}</span>
                              <span className="bar-row-value" style={{ fontSize: '12px', fontWeight: '700' }}>{item.count} ราย</span>
                            </div>
                            <div className="bar-track">
                              <div className="bar-fill" style={{ width: `${scalePercent}%`, backgroundColor: barColor }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* ตารางวิเคราะห์ยอดจำหน่าย OTOP แยกตามประเภทผลิตภัณฑ์และตำบล */}
                  <div className="dashboard-card" style={{ width: '100%' }}>
                    <h2 className="dashboard-card-title">ตารางวิเคราะห์ยอดจำหน่ายสะสมแยกตามประเภทผลิตภัณฑ์และรายตำบล (บาท)</h2>
                    <div className="summary-table-wrapper" style={{ overflowX: 'auto', marginTop: '10px' }}>
                      <table className="summary-table">
                        <thead>
                          <tr>
                            <th>ประเภทผลิตภัณฑ์ OTOP</th>
                            <th style={{ textAlign: 'right' }}>ภาพรวมอำเภอ</th>
                            <th style={{ textAlign: 'right' }}>ตำบลกะทู้</th>
                            <th style={{ textAlign: 'right' }}>ตำบลป่าตอง</th>
                            <th style={{ textAlign: 'right' }}>ตำบลกมลา</th>
                          </tr>
                        </thead>
                        <tbody>
                          {OTOP_CATEGORIES.map((cat, idx) => {
                            const overall = otopProducts.filter(p => p.type === cat).reduce((sum, p) => sum + (p.sale || 0), 0);
                            const kathu = otopProducts.filter(p => p.type === cat && p.district === 'ตำบลกะทู้').reduce((sum, p) => sum + (p.sale || 0), 0);
                            const patong = otopProducts.filter(p => p.type === cat && p.district === 'ตำบลป่าตอง').reduce((sum, p) => sum + (p.sale || 0), 0);
                            const kamala = otopProducts.filter(p => p.type === cat && p.district === 'ตำบลกมลา').reduce((sum, p) => sum + (p.sale || 0), 0);
                            return (
                              <tr key={idx}>
                                <td style={{ fontWeight: '600' }}>{cat}</td>
                                <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--primary)' }}>{formatCurrency(overall)} บาท</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(kathu)} บาท</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(patong)} บาท</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(kamala)} บาท</td>
                              </tr>
                            );
                          })}
                          {/* Grand Total Row */}
                          {(() => {
                            const totalOverall = otopProducts.reduce((sum, p) => sum + (p.sale || 0), 0);
                            const totalKathu = otopProducts.filter(p => p.district === 'ตำบลกะทู้').reduce((sum, p) => sum + (p.sale || 0), 0);
                            const totalPatong = otopProducts.filter(p => p.district === 'ตำบลป่าตอง').reduce((sum, p) => sum + (p.sale || 0), 0);
                            const totalKamala = otopProducts.filter(p => p.district === 'ตำบลกมลา').reduce((sum, p) => sum + (p.sale || 0), 0);
                            return (
                              <tr style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', fontWeight: '700', borderTop: '2px double var(--border-color)' }}>
                                <td style={{ fontWeight: '700' }}>ยอดรวมทั้งหมด (Grand Total)</td>
                                <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--primary)' }}>{formatCurrency(totalOverall)} บาท</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(totalKathu)} บาท</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(totalPatong)} บาท</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(totalKamala)} บาท</td>
                              </tr>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

              {/* PAGE 6: GIS */}
              {activeMenu === 'GIS' && (
                <div className="gis-layout">
                  <div className="map-card">
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
                      <svg className="svg-map" viewBox="0 0 350 400">
                        {mapPaths.map((p, idx) => (
                          <path
                            key={idx}
                            d={p.d}
                            className={`map-district-path ${selectedGisDistrict === p.name ? 'selected' : ''}`}
                            onClick={async () => setSelectedGisDistrict(p.name)}
                          />
                        ))}
                      </svg>
                      <span style={{ fontSize: '12px', marginTop: '10px', color: 'var(--text-muted)' }}>คลิกพื้นที่ในแผนที่จำลองเพื่อเลือกอำเภอ</span>
                    </div>
                  </div>
                  <div className="dashboard-card gis-details-card">
                    <h2 className="dashboard-card-title">📍 ข้อมูลอำเภอที่เลือก: {gisDistrictData.name}</h2>
                    <div className="gis-info-grid">
                      <div className="gis-info-item"><span className="gis-info-label">🏠 หมู่บ้าน</span><div className="gis-info-value">{gisDistrictData.villages}</div></div>
                      <div className="gis-info-item"><span className="gis-info-label">👥 ครัวเรือน</span><div className="gis-info-value">{formatCurrency(gisDistrictData.households)}</div></div>
                      <div className="gis-info-item"><span className="gis-info-label">💰 งบประมาณที่ได้รับ</span><div className="gis-info-value">{formatCurrency(gisDistrictData.budget.received)}</div></div>
                      <div className="gis-info-item"><span className="gis-info-label">💸 อัตราเบิกจ่าย</span><div className="gis-info-value">{((gisDistrictData.budget.disbursed/gisDistrictData.budget.received)*100).toFixed(1)}%</div></div>
                      <div className="gis-info-item"><span className="gis-info-label">✅ KPI ผ่านเป้า</span><div className="gis-info-value">{gisDistrictData.kpi.success} / {gisDistrictData.kpi.total}</div></div>
                      <div className="gis-info-item"><span className="gis-info-label">🛍️ ยอดจำหน่าย OTOP</span><div className="gis-info-value">{formatCurrency(gisDistrictData.otopSales)}</div></div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 7: DISTRICT GROUPS LIST (Sidebar filters) */}
              {groupTypes.includes(activeMenu) && (
                <div className="dashboard-card">
                  <h2 className="dashboard-card-title">รายชื่อข้อมูลกลุ่มพัฒนาชุมชน: {activeMenu}</h2>
                  <div className="filter-bar">
                    <div className="filter-group">
                      <label>กรองรายอำเภอ</label>
                      <select className="filter-select" value={groupDistrictFilter} onChange={e => { setGroupDistrictFilter(e.target.value); setGroupsCurrentPage(1); }}>
                        <option value="ทั้งหมด">ทั้งหมด</option>
                        {DISTRICTS_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>กรองสถานะติดตาม</label>
                      <select className="filter-select" value={groupStatusFilter} onChange={e => { setGroupStatusFilter(e.target.value); setGroupsCurrentPage(1); }}>
                        <option value="ทั้งหมด">ทั้งหมด</option>
                        <option value="ปกติ">ปกติ</option>
                        <option value="ติดตาม">ติดตาม</option>
                        <option value="แก้ไข">แก้ไข</option>
                      </select>
                    </div>
                    <div className="search-input-wrapper">
                      <Search className="search-icon-inside" size={16} />
                      <input 
                        type="text" 
                        className="search-input-field" 
                        placeholder="ค้นหาชื่อกลุ่ม หรือประธานกลุ่ม" 
                        value={groupSearchQuery}
                        onChange={e => setGroupSearchQuery(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') setGroupSearchTrigger(groupSearchQuery); }}
                      />
                    </div>
                    <button className="btn-search" onClick={async () => setGroupSearchTrigger(groupSearchQuery)}>ค้นหา</button>
                  </div>

                  <div className="data-table-wrapper" style={{ marginTop: '12px' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ลำดับ</th>
                          <th>ชื่อกลุ่ม/องค์กร</th>
                          <th>ประเภทกลุ่ม</th>
                          <th>อำเภอ</th>
                          <th>หน่วยงานรับผิดชอบ</th>
                          <th>ประธานกลุ่ม</th>
                          <th>เบอร์โทร</th>
                          <th>จำนวนสมาชิก</th>
                          <th>สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedGroups.map((g, idx) => (
                          <tr key={g.id}>
                            <td>{groupsFirstIdx + idx + 1}</td>
                            <td style={{ fontWeight: '700' }}>{g.name}</td>
                            <td><span className={`type-badge ${getTypeBadgeClass(g.type)}`}>{g.type}</span></td>
                            <td>{g.district}</td>
                            <td>{g.agency}</td>
                            <td>{g.president}</td>
                            <td>{g.phone}</td>
                            <td>{g.members} คน</td>
                            <td><span className={`row-status-badge ${g.status === 'ปกติ' ? 'normal' : g.status === 'ติดตาม' ? 'tracking' : 'danger'}`}>{g.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pagination-footer">
                    <span>แสดง {groupsFirstIdx + 1} ถึง {Math.min(groupsLastIdx, filteredGroups.length)} จาก {filteredGroups.length} รายการ</span>
                    <div className="pagination-buttons">
                      <button className="btn-page" onClick={async () => setGroupsCurrentPage(prev => Math.max(1, prev-1))}>ก่อนหน้า</button>
                      <button className="btn-page active">{groupsCurrentPage}</button>
                      <button className="btn-page" onClick={async () => setGroupsCurrentPage(prev => Math.min(totalGroupPages, prev+1))}>ถัดไป</button>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 8: AI CHAT */}
              {activeMenu === 'AI' && (
                <div className="ai-layout">
                  <div className="ai-sidebar" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                    <span className="ai-sidebar-title">🤖 คำถามวิเคราะห์ข้อมูลด่วน</span>
                    {aiQuestions.length > 0 ? (
                      aiQuestions.map(q => (
                        <button key={q.id} className="ai-quick-btn" onClick={async () => triggerAiQuery(q.query)}>
                          {q.label}
                        </button>
                      ))
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '10px' }}>ไม่มีคำถามด่วน</span>
                    )}
                  </div>
                  <div className="dashboard-card ai-chat-card" style={{ padding: 0 }}>
                    <div className="modal-header"><h3 className="modal-title"><Database size={16} /> ECC AI Executive Assistant</h3></div>
                    <div className="ai-chat-messages">
                      {aiChat.map((msg, idx) => (
                        <div className={`ai-bubble ${msg.sender}`} key={idx}>
                          <div style={{ whiteSpace: 'pre-wrap' }}>
                            {msg.text.split('\n').map((line, lIdx) => {
                              if (line.startsWith('###')) return <h3 key={lIdx}>{line.replace('###', '')}</h3>;
                              if (line.startsWith('-')) return <li key={lIdx} style={{ marginLeft: '12px' }}>{line.replace('-', '')}</li>;
                              const parts = line.split('**');
                              return <p key={lIdx}>{parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx}>{p}</strong> : p)}</p>;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <form className="ai-input-bar" onSubmit={handleAiSend}>
                      <input type="text" className="ai-input-field" placeholder="ถามคำถาม เช่น อำเภอใดเบิกจ่ายต่ำสุด..." value={aiInput} onChange={e => setAiInput(e.target.value)} />
                      <button type="submit" className="ai-send-btn"><Send size={16} /></button>
                    </form>
                  </div>
                </div>
              )}

              {/* PAGE 9: SPECIAL PORTALS */}
              {(activeMenu === 'กองทุนสตรี' || activeMenu === 'TPMAP') && (
                <div className="dashboard-card">
                  <div className="page-tabs-bar">
                    <button className={`tab-btn ${specialTab === 'women' ? 'active' : ''}`} onClick={async () => setSpecialTab('women')}>กองทุนพัฒนาบทบาทสตรี</button>
                    <button className={`tab-btn ${specialTab === 'tpmap' ? 'active' : ''}`} onClick={async () => setSpecialTab('tpmap')}>ระบบคนจนชี้เป้า TPMAP</button>
                  </div>
                  {specialTab === 'women' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                      <div className="bar-chart-container">
                        <div className="bar-row">
                          <div className="bar-row-label-row"><span>👩 สตรีจดทะเบียนสมาชิก</span><span>{formatCurrency(womenStats.registeredMembers)} ราย</span></div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, (womenStats.registeredMembers / 150000) * 100)}%`, backgroundColor: '#ec4899' }}></div></div>
                        </div>
                        <div className="bar-row">
                          <div className="bar-row-label-row"><span>💰 ทุนหมุนเวียนกู้ยืม</span><span>{formatCurrency(womenStats.revolvingFund)} บาท</span></div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, (womenStats.revolvingFund / 50000000) * 100)}%`, backgroundColor: '#8b5cf6' }}></div></div>
                        </div>
                      </div>
                      <table className="summary-table">
                        <thead><tr><th>โครงการสตรี</th><th>กู้ยืม</th><th>ชำระตรงเวลา</th></tr></thead>
                        <tbody>
                          {womenProjects.length > 0 ? (
                            womenProjects.map((wp) => (
                              <tr key={wp.id}>
                                <td>{wp.name}</td>
                                <td>{wp.groupsCount}</td>
                                <td style={{ color: 'var(--success)' }}>{wp.paybackRate}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>ไม่มีข้อมูลโครงการ</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {specialTab === 'tpmap' && (() => {
                    const tpmapTotal = (tpmapStats.health || 0) + (tpmapStats.living || 0) + (tpmapStats.income || 0);
                    return (
                      <div className="bar-chart-container" style={{ marginTop: '10px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>พบครัวเรือน TPMAP ตกเกณฑ์อำเภอกะทู้รวม **{formatCurrency(tpmapTotal)} ครัวเรือน** มิติดังนี้:</p>
                        <div className="bar-row" style={{ marginTop: '8px' }}>
                          <div className="bar-row-label-row"><span>🩺 มิติด้านสุขภาพ</span><span>{tpmapStats.health} ครัวเรือน</span></div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${tpmapTotal > 0 ? (tpmapStats.health / tpmapTotal * 100) : 0}%`, backgroundColor: '#06b6d4' }}></div></div>
                        </div>
                        <div className="bar-row">
                          <div className="bar-row-label-row"><span>🏠 มิติด้านความเป็นอยู่</span><span>{tpmapStats.living} ครัวเรือน</span></div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${tpmapTotal > 0 ? (tpmapStats.living / tpmapTotal * 100) : 0}%`, backgroundColor: '#f97316' }}></div></div>
                        </div>
                        <div className="bar-row">
                          <div className="bar-row-label-row"><span>💵 มิติด้านรายได้ (ยากจนตกเกณฑ์)</span><span style={{ color: 'var(--danger)', fontWeight: '700' }}>{tpmapStats.income} ครัวเรือน</span></div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${tpmapTotal > 0 ? (tpmapStats.income / tpmapTotal * 100) : 0}%`, backgroundColor: '#ef4444' }}></div></div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* PAGE 10: ONE PAGE */}
              {activeMenu === 'OnePage' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <button className="btn-print-report" onClick={async () => window.print()}><Printer size={16} /> สั่งพิมพ์รายงาน One Page PDF</button>
                  <div className="one-page-report-container">
                    <div className="report-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <img src="/logo.png" alt="พช. Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '8px' }} />
                      <h1 className="report-header-title">รายงานสรุปผู้บริหารอำเภอกะทู้ (ECC Report)</h1>
                      <span className="report-header-meta">ประจำปีงบประมาณ 2567 | พิมพ์รายงาน: {new Date().toLocaleDateString('th-TH')}</span>
                    </div>
                    <div style={{ marginTop: '14px' }}>
                      <h3 className="report-section-title">1. Status งบการคลังระดับสูง</h3>
                      <div className="report-grid-3">
                        <div className="report-stat-box"><span className="report-stat-num">{formatCurrency(totalBudgetReceived)}</span><br /><span className="report-stat-label">งบจัดสรร (บาท)</span></div>
                        <div className="report-stat-box"><span className="report-stat-num" style={{ color: 'var(--primary)' }}>{formatCurrency(totalBudgetDisbursed)} ({budgetRateOverall}%)</span><br /><span className="report-stat-label">เบิกจ่ายแล้ว (บาท)</span></div>
                        <div className="report-stat-box"><span className="report-stat-num" style={{ color: 'var(--success)' }}>{formatCurrency(totalBudgetRemaining)}</span><br /><span className="report-stat-label">งบคงเหลือ (บาท)</span></div>
                      </div>
                    </div>
                    <div style={{ marginTop: '14px' }}>
                      <h3 className="report-section-title">2. ดัชนีตัวชี้วัดเป้าหมายอำเภอ (KPIs)</h3>
                      <div className="report-grid-3">
                        <div className="report-stat-box"><span className="report-stat-num">{totalKpis}</span><br /><span className="report-stat-label">ตัวชี้วัดรวม (รายการ)</span></div>
                        <div className="report-stat-box"><span className="report-stat-num" style={{ color: 'var(--success)' }}>{totalKpisSuccess} ({kpiRateOverall}%)</span><br /><span className="report-stat-label">ผ่านเกณฑ์สำเร็จ (รายการ)</span></div>
                        <div className="report-stat-box"><span className="report-stat-num" style={{ color: 'var(--danger)' }}>{totalKpisRisk}</span><br /><span className="report-stat-label">เสี่ยงไม่ผ่านเกณฑ์สีแดง (รายการ)</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* PAGE: DYNAMIC CUSTOM SPECIAL PORTAL */}
              {customSpecialMenus.some(m => m.name === activeMenu) && (() => {
                const menuObj = customSpecialMenus.find(m => m.name === activeMenu);
                return (
                  <div className="dashboard-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
                      <h2 className="dashboard-card-title" style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ✨ {menuObj?.name}
                      </h2>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-light)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        สร้างโดยแอดมิน
                      </span>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '14px', color: 'var(--text-color)', padding: '10px 0' }}>
                      {menuObj?.content || 'ไม่มีเนื้อหาข้อมูลสำหรับเมนูนี้'}
                    </div>
                  </div>
                );
              })()}

              {/* PAGE: REPORT TRACKING */}
              {activeMenu === 'ติดตามรายงาน' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="report-stats-grid">
                    <div className="report-stats-card">
                      <div className="card-icon-container green" style={{ width: '40px', height: '40px' }}><CheckCircle2 size={18} /></div>
                      <div className="card-details">
                        <span className="card-label">รายงานแล้วเสร็จ (🟢)</span>
                        <span className="card-value" style={{ fontSize: '20px' }}>
                          {reports.filter(r => r.status === 'รายงานแล้ว').length} รายการ
                        </span>
                      </div>
                    </div>
                    <div className="report-stats-card">
                      <div className="card-icon-container orange" style={{ width: '40px', height: '40px' }}><RefreshCw size={18} /></div>
                      <div className="card-details">
                        <span className="card-label">กำลังดำเนินการ (🟡)</span>
                        <span className="card-value" style={{ fontSize: '20px' }}>
                          {reports.filter(r => r.status === 'กำลังดำเนินการ').length} รายการ
                        </span>
                      </div>
                    </div>
                    <div className="report-stats-card">
                      <div className="card-icon-container red" style={{ width: '40px', height: '40px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}><AlertTriangle size={18} /></div>
                      <div className="card-details">
                        <span className="card-label">ยังไม่รายงาน (🔴)</span>
                        <span className="card-value" style={{ fontSize: '20px', color: 'var(--danger)' }}>
                          {reports.filter(r => r.status === 'ยังไม่รายงาน').length} รายการ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <h2 className="dashboard-card-title" style={{ marginBottom: 0 }}>📋 สถานะการส่งรายงานโครงการรายเดือน (กำหนดส่งทุกวันที่ 20)</h2>
                      
                      {/* Filter Bar */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <select 
                          className="filter-select"
                          value={reportProjectFilter}
                          onChange={(e) => setReportProjectFilter(e.target.value)}
                        >
                          <option value="ทั้งหมด">โครงการทั้งหมด</option>
                          {Array.from(new Set(reports.map(r => r.projectName))).map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <select 
                          className="filter-select"
                          value={reportMonthFilter}
                          onChange={(e) => setReportMonthFilter(e.target.value)}
                        >
                          <option value="ทั้งหมด">รอบเดือนทั้งหมด</option>
                          {['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <select 
                          className="filter-select"
                          value={reportStatusFilter}
                          onChange={(e) => setReportStatusFilter(e.target.value)}
                        >
                          <option value="ทั้งหมด">สถานะทั้งหมด</option>
                          <option value="รายงานแล้ว">รายงานแล้ว (🟢)</option>
                          <option value="กำลังดำเนินการ">กำลังดำเนินการ (🟡)</option>
                          <option value="ยังไม่รายงาน">ยังไม่รายงาน (🔴)</option>
                        </select>
                      </div>
                    </div>

                    <div className="data-table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ลำดับ</th>
                            <th>โครงการที่ติดตาม</th>
                            <th>รอบเดือน</th>
                            <th>กำหนดส่ง</th>
                            <th style={{ textAlign: 'center' }}>สถานะรายงาน</th>
                            <th>อัปเดตล่าสุด</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const filtered = reports.filter(r => {
                              const matchProject = reportProjectFilter === 'ทั้งหมด' || r.projectName === reportProjectFilter;
                              const matchMonth = reportMonthFilter === 'ทั้งหมด' || r.month === reportMonthFilter;
                              const matchStatus = reportStatusFilter === 'ทั้งหมด' || r.status === reportStatusFilter;
                              return matchProject && matchMonth && matchStatus;
                            });

                            if (filtered.length === 0) {
                              return (
                                <tr>
                                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>ไม่พบข้อมูลการติดตามส่งรายงาน</td>
                                </tr>
                              );
                            }

                            return filtered.map((r, idx) => {
                              let statusClass = 'not-reported';
                              if (r.status === 'รายงานแล้ว') statusClass = 'reported';
                              else if (r.status === 'กำลังดำเนินการ') statusClass = 'in-progress';

                              return (
                                <tr key={r.id}>
                                  <td>{idx + 1}</td>
                                  <td style={{ fontWeight: '700' }}>{r.projectName}</td>
                                  <td>{r.month}</td>
                                  <td style={{ color: 'var(--text-muted)' }}>{r.deadlineDate || `วันที่ 20 ของเดือน`}</td>
                                  <td style={{ textAlign: 'center' }}>
                                    <span className={`report-status-badge ${statusClass}`}>{r.status}</span>
                                  </td>
                                  <td>{r.updatedAt || '-'}</td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE: DOWNLOAD DOCUMENTS */}
              {activeMenu === 'ดาวน์โหลดเอกสาร' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="dashboard-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                      <Download size={22} style={{ color: 'var(--primary)' }} />
                      <h2 className="dashboard-card-title" style={{ margin: 0, fontSize: '18px' }}>
                        คลังดาวน์โหลดแบบฟอร์ม / เอกสาร พช.
                      </h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 24px 0', lineHeight: '1.5' }}>
                      ศูนย์บริการรวบรวมไฟล์ดาวน์โหลดแบบฟอร์ม เอกสารคำขอ คู่มือแนวทางการดำเนินโครงการต่าง ๆ ของกรมการพัฒนาชุมชน เพื่อสนับสนุนการทำงานของเจ้าหน้าที่และประชาชนในพื้นที่อำเภอกะทู้
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                      {(() => {
                        const docsByCategory = {};
                        documents.forEach(doc => {
                          const cat = doc.category || 'อื่นๆ';
                          if (!docsByCategory[cat]) {
                            docsByCategory[cat] = [];
                          }
                          docsByCategory[cat].push(doc);
                        });

                        if (documents.length === 0) {
                          return (
                            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                              ยังไม่มีไฟล์เอกสารในระบบดาวน์โหลด
                            </div>
                          );
                        }

                        return Object.keys(docsByCategory).map((catName) => {
                          let headerColor = '#60a5fa'; // default
                          let headerEmoji = '📄';
                          if (catName === 'OTOP') {
                            headerColor = '#60a5fa';
                            headerEmoji = '🛍️';
                          } else if (catName === 'กองทุนสตรี') {
                            headerColor = '#34d399';
                            headerEmoji = '👥';
                          } else if (catName === 'องค์กรชุมชน') {
                            headerColor = '#fbbf24';
                            headerEmoji = '🏢';
                          }
                          
                          const groupTitle = catName === 'OTOP' ? 'แบบฟอร์มงาน OTOP และวิสาหกิจชุมชน' :
                                             catName === 'กองทุนสตรี' ? 'แบบฟอร์มกองทุนพัฒนาบทบาทสตรี' :
                                             catName === 'องค์กรชุมชน' ? 'แบบฟอร์มกลุ่มและองค์กรชุมชน' :
                                             catName;

                          return (
                            <div key={catName} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '18px', backgroundColor: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <div>
                                <h3 style={{ fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '14px', color: headerColor, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                                  {headerEmoji} {groupTitle}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  {docsByCategory[catName].map((item, i) => (
                                    <div key={item.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', fontSize: '13px', borderBottom: i < docsByCategory[catName].length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingBottom: i < docsByCategory[catName].length - 1 ? '8px' : '0' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span style={{ fontWeight: '500' }}>{i + 1}. {item.name}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ประเภท: {item.type || 'PDF'} | ขนาด: {item.size || '100 KB'}</span>
                                      </div>
                                      <a 
                                        href={item.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="btn-add-new" 
                                        style={{ padding: '4px 10px', fontSize: '11px', whiteSpace: 'nowrap', textDecoration: 'none', backgroundColor: headerColor, border: 'none', textAlign: 'center' }}
                                      >
                                        ดาวน์โหลด
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* ========================================================
          ADMIN CRUD MODALS (GROUPS, PROJECTS, DISTRICT STATS)
         ======================================================== */}

      {/* 1. View Group modal */}
      {modalType === 'group_view' && selectedGroup && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title"><Info size={16} /> รายละเอียดกลุ่มพัฒนารายอำเภอ</h3>
              <button className="btn-close-modal" onClick={async () => setModalType(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="details-list">
                <div className="details-row"><span className="details-label">ชื่อกลุ่ม/องค์กร:</span><span className="details-val" style={{ fontWeight: 'bold' }}>{selectedGroup.name}</span></div>
                <div className="details-row"><span className="details-label">ประเภทกลุ่ม:</span><span className="details-val"><span className={`type-badge ${getTypeBadgeClass(selectedGroup.type)}`}>{selectedGroup.type}</span></span></div>
                <div className="details-row"><span className="details-label">อำเภอที่ตั้ง:</span><span className="details-val">{selectedGroup.district}</span></div>
                <div className="details-row"><span className="details-label">หน่วยงานรับผิดชอบ:</span><span className="details-val">{selectedGroup.agency}</span></div>
                <div className="details-row"><span className="details-label">ประธานกลุ่ม:</span><span className="details-val">{selectedGroup.president}</span></div>
                <div className="details-row"><span className="details-label">เบอร์โทรศัพท์:</span><span className="details-val">{selectedGroup.phone}</span></div>
                <div className="details-row"><span className="details-label">จำนวนสมาชิก:</span><span className="details-val">{selectedGroup.members} คน</span></div>
                <div className="details-row"><span className="details-label">สถานะติดตาม:</span><span className="details-val"><span className={`row-status-badge ${selectedGroup.status==='ปกติ'?'normal':selectedGroup.status==='ติดตาม'?'tracking':'danger'}`}>{selectedGroup.status}</span></span></div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn-cancel" onClick={async () => setModalType(null)}>ปิด</button></div>
          </div>
        </div>
      )}

      {/* 2. Add / Edit Group modal */}
      {(modalType === 'group_add' || modalType === 'group_edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalType === 'group_add' ? <Plus size={16} /> : <Edit2 size={12} />}
                {modalType === 'group_add' ? 'เพิ่มกลุ่ม/องค์กรใหม่' : 'แก้ไขข้อมูลกลุ่ม/องค์กร'}
              </h3>
              <button className="btn-close-modal" onClick={async () => setModalType(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmitGroup}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>ชื่อกลุ่ม/องค์กร <span className="required">*</span></label>
                    <input type="text" className="form-input" required value={groupFormData.name} onChange={e => setGroupFormData({...groupFormData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ประเภทกลุ่ม</label>
                    <select 
                      className="form-input" 
                      value={groupFormData.type} 
                      onChange={async e => {
                        const val = e.target.value;
                        if (val === '__ADD_NEW__') {
                          const newType = prompt('กรุณากรอกชื่อประเภทกลุ่มใหม่:');
                          const trimmed = newType ? newType.trim() : '';
                          if (trimmed) {
                            await addGroupType(trimmed);
                            await reloadData();
                            setGroupFormData({...groupFormData, type: trimmed});
                          }
                        } else {
                          setGroupFormData({...groupFormData, type: val});
                        }
                      }}
                    >
                      {groupTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      <option value="__ADD_NEW__" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>➕ เพิ่มประเภทกลุ่มใหม่...</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>อำเภอ</label>
                    <select className="form-input" value={groupFormData.district} onChange={e => setGroupFormData({...groupFormData, district: e.target.value})}>
                      {DISTRICTS_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>หน่วยงานรับผิดชอบ</label>
                    <select className="form-input" value={groupFormData.agency} onChange={e => setGroupFormData({...groupFormData, agency: e.target.value})}>
                      {AGENCIES_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>จำนวนสมาชิก (คน) <span className="required">*</span></label>
                    <input type="number" className="form-input" required value={groupFormData.members} onChange={e => setGroupFormData({...groupFormData, members: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ประธานกลุ่ม <span className="required">*</span></label>
                    <input type="text" className="form-input" required value={groupFormData.president} onChange={e => setGroupFormData({...groupFormData, president: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>เบอร์โทรศัพท์ <span className="required">*</span></label>
                    <input type="text" className="form-input" required value={groupFormData.phone} onChange={e => setGroupFormData({...groupFormData, phone: e.target.value})} />
                  </div>
                  <div className="form-group full-width">
                    <label>สถานะ</label>
                    <select className="form-input" value={groupFormData.status} onChange={e => setGroupFormData({...groupFormData, status: e.target.value})}>
                      <option value="ปกติ">ปกติ</option>
                      <option value="ติดตาม">ติดตาม</option>
                      <option value="แก้ไข">แก้ไข</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                <button type="submit" className="btn-submit-blue">บันทึกกลุ่มข้อมูล</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Confirm Delete Group modal */}
      {modalType === 'group_delete' && selectedGroup && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-width">
            <div className="confirm-body">
              <div className="confirm-icon-danger"><AlertTriangle size={32} /></div>
              <span className="confirm-text-title">ยืนยันการลบกลุ่มพัฒนารายอำเภอ</span>
              <span className="confirm-text-desc">คุณต้องการลบข้อมูลกลุ่ม **{selectedGroup.name}** ใช่หรือไม่?</span>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
              <button className="btn-submit-blue" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteGroupConfirm}>ลบกลุ่ม</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. View Project modal */}
      {modalType === 'project_view' && selectedProject && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title"><Info size={16} /> รายละเอียดโครงการ</h3>
              <button className="btn-close-modal" onClick={async () => setModalType(null)}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <img src={selectedProject.image} alt={selectedProject.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }} />
              <div className="details-list">
                <div className="details-row"><span className="details-label">ชื่อโครงการ:</span><span className="details-val" style={{ fontWeight: 'bold' }}>{selectedProject.name}</span></div>
                <div className="details-row"><span className="details-label">พื้นที่อำเภอ:</span><span className="details-val">{selectedProject.district}</span></div>
                <div className="details-row"><span className="details-label">งบโครงการ:</span><span className="details-val">{formatCurrency(selectedProject.budget)} บาท</span></div>
                <div className="details-row"><span className="details-label">เบิกจ่ายแล้ว:</span><span className="details-val">{formatCurrency(selectedProject.spent)} บาท</span></div>
                <div className="details-row"><span className="details-label">ความคืบหน้า:</span><span className="details-val">{selectedProject.progress || 0}% ({selectedProject.stage || 'เตรียมการ'})</span></div>
                <div className="details-row"><span className="details-label">ผู้รับผิดชอบ:</span><span className="details-val">{selectedProject.manager}</span></div>
                <div className="details-row"><span className="details-label">พิกัดภูมิศาสตร์:</span><span className="details-val">Lat {selectedProject.lat}, Lng {selectedProject.lng}</span></div>
                <div className="details-row"><span className="details-label">สถานะ:</span><span className="details-val">{selectedProject.status}</span></div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn-cancel" onClick={async () => setModalType(null)}>ปิด</button></div>
          </div>
        </div>
      )}

      {/* 5. Add / Edit Budget modal */}
      {(modalType === 'budget_add' || modalType === 'budget_edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalType === 'budget_add' ? <Plus size={16} /> : <Edit2 size={12} />}
                {modalType === 'budget_add' ? 'เพิ่มข้อมูลงบประมาณ' : 'แก้ไขข้อมูลงบประมาณ'}
              </h3>
              <button className="btn-close-modal" onClick={async () => setModalType(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveBudget} className="admin-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>เดือน <span className="required">*</span></label>
                    <select className="form-input" required value={budgetFormData.month} onChange={e => setBudgetFormData({...budgetFormData, month: e.target.value})}>
                      <option value="ต.ค.">ต.ค.</option>
                      <option value="พ.ย.">พ.ย.</option>
                      <option value="ธ.ค.">ธ.ค.</option>
                      <option value="ม.ค.">ม.ค.</option>
                      <option value="ก.พ.">ก.พ.</option>
                      <option value="มี.ค.">มี.ค.</option>
                      <option value="เม.ย.">เม.ย.</option>
                      <option value="พ.ค.">พ.ค.</option>
                      <option value="มิ.ย.">มิ.ย.</option>
                      <option value="ก.ค.">ก.ค.</option>
                      <option value="ส.ค.">ส.ค.</option>
                      <option value="ก.ย.">ก.ย.</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ปีงบประมาณ <span className="required">*</span></label>
                    <select className="form-input" required value={budgetFormData.year} onChange={e => setBudgetFormData({...budgetFormData, year: e.target.value})}>
                      <option value="2566">2566</option>
                      <option value="2567">2567</option>
                      <option value="2568">2568</option>
                      <option value="2569">2569</option>
                      <option value="2570">2570</option>
                      <option value="2571">2571</option>
                      <option value="2572">2572</option>
                      <option value="2573">2573</option>
                      <option value="2574">2574</option>
                      <option value="2575">2575</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>ประเภทงบประมาณ <span className="required">*</span></label>
                    <select className="form-input" required value={budgetFormData.budgetType} onChange={e => setBudgetFormData({...budgetFormData, budgetType: e.target.value})}>
                      <option value="โครงการยุทธศาสตร์">โครงการยุทธศาสตร์</option>
                      <option value="กองทุนพัฒนาบทบาทสตรี">กองทุนพัฒนาบทบาทสตรี</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ชื่อแผนงาน/โครงการ <span className="required">*</span></label>
                    <input type="text" className="form-input" required value={budgetFormData.planName} onChange={e => setBudgetFormData({...budgetFormData, planName: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>จำนวนงบประมาณ (บาท) <span className="required">*</span></label>
                  <input type="number" className="form-input" required value={budgetFormData.target} onChange={e => setBudgetFormData({...budgetFormData, target: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>สถานะการเบิกจ่าย <span className="required">*</span></label>
                  <select className="form-input" required value={budgetFormData.status} onChange={e => setBudgetFormData({...budgetFormData, status: e.target.value})}>
                    <option value="ยังไม่เบิกจ่าย">ยังไม่เบิกจ่าย</option>
                    <option value="ระหว่างเบิกจ่าย">ระหว่างเบิกจ่าย</option>
                    <option value="เบิกจ่ายแล้ว">เบิกจ่ายแล้ว</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                  <button type="submit" className="btn-save">บันทึกข้อมูล</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Budget Modal */}
      {modalType === 'budget_delete' && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: 'var(--danger)' }}><AlertTriangle size={18} /> ยืนยันการลบ</h3>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <p>คุณต้องการลบข้อมูลงบประมาณเดือน <strong>{selectedBudget?.month}</strong> ใช่หรือไม่?</p>
              <p style={{ color: '#64748b', fontSize: '13px', marginTop: '10px' }}>การกระทำนี้ไม่สามารถกู้คืนได้</p>
            </div>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
              <button className="btn-save" style={{ backgroundColor: 'var(--danger)' }} onClick={handleDeleteBudget}>ลบข้อมูล</button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Add / Edit Project modal */}
      {(modalType === 'project_add' || modalType === 'project_edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalType === 'project_add' ? <Plus size={16} /> : <Edit2 size={12} />}
                {modalType === 'project_add' ? 'เพิ่มโครงการติดตามใหม่' : 'แก้ไขข้อมูลโครงการ'}
              </h3>
              <button className="btn-close-modal" onClick={async () => setModalType(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmitProject}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>ชื่อโครงการ <span className="required">*</span></label>
                    <input type="text" className="form-input" required value={projFormData.name} onChange={e => setProjFormData({...projFormData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>พื้นที่ระดับอำเภอ</label>
                    <select className="form-input" value={projFormData.district} onChange={e => setProjFormData({...projFormData, district: e.target.value})}>
                      {DISTRICTS_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>สถานะโครงการ</label>
                    <select className="form-input" value={projFormData.status} onChange={e => setProjFormData({...projFormData, status: e.target.value})}>
                      <option value="เสร็จแล้ว">เสร็จแล้ว</option>
                      <option value="ดำเนินการ">ดำเนินการ</option>
                      <option value="ล่าช้า">ล่าช้า</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>งบประมาณโครงการ (บาท) <span className="required">*</span></label>
                    <input type="number" className="form-input" required value={projFormData.budget} onChange={e => setProjFormData({...projFormData, budget: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>เบิกจ่ายสะสมแล้ว (บาท) <span className="required">*</span></label>
                    <input type="number" className="form-input" required value={projFormData.spent} onChange={e => setProjFormData({...projFormData, spent: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ความคืบหน้าโครงการ (%) <span className="required">*</span></label>
                    <input type="number" className="form-input" min="0" max="100" required value={projFormData.progress} onChange={e => setProjFormData({...projFormData, progress: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ขั้นตอนดำเนินงานปัจจุบัน</label>
                    <input type="text" className="form-input" required value={projFormData.stage} onChange={e => setProjFormData({...projFormData, stage: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ผู้รับผิดชอบโครงการ <span className="required">*</span></label>
                    <input type="text" className="form-input" required value={projFormData.manager} onChange={e => setProjFormData({...projFormData, manager: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>รูปโครงการ (URL)</label>
                    <input type="text" className="form-input" value={projFormData.image} onChange={e => setProjFormData({...projFormData, image: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>พิกัด Lat</label>
                    <input type="text" className="form-input" value={projFormData.lat} onChange={e => setProjFormData({...projFormData, lat: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>พิกัด Lng</label>
                    <input type="text" className="form-input" value={projFormData.lng} onChange={e => setProjFormData({...projFormData, lng: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                <button type="submit" className="btn-submit-blue">บันทึกข้อมูลโครงการ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Confirm Delete Project modal */}
      {modalType === 'project_delete' && selectedProject && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-width">
            <div className="confirm-body">
              <div className="confirm-icon-danger"><AlertTriangle size={32} /></div>
              <span className="confirm-text-title">ยืนยันการลบโครงการ</span>
              <span className="confirm-text-desc">คุณแน่ใจว่าต้องการลบโครงการ **{selectedProject.name}** หรือไม่?</span>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
              <button className="btn-submit-blue" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteProjConfirm}>ลบโครงการ</button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Edit District stats modal */}
      {modalType === 'district_edit' && selectedDistrict && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Settings size={16} /> ปรับสถิติข้อมูลพื้นฐาน: {selectedDistrict.name}
              </h3>
              <button className="btn-close-modal" onClick={async () => setModalType(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmitDistrictEdit}>
              <div className="modal-body">
                <div className="form-grid">
                  
                  {/* General Stats */}
                  <div className="form-group">
                    <label>จำนวนหมู่บ้าน</label>
                    <input type="number" className="form-input" value={districtFormData.villages} onChange={e => setDistrictFormData({...districtFormData, villages: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ครัวเรือนจดทะเบียน</label>
                    <input type="number" className="form-input" value={districtFormData.households} onChange={e => setDistrictFormData({...districtFormData, households: e.target.value})} />
                  </div>

                  {/* Population Breakdown */}
                  <div className="form-group">
                    <label>ประชากรชาย (คน)</label>
                    <input type="number" className="form-input" value={districtFormData.male} onChange={e => setDistrictFormData({...districtFormData, male: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ประชากรหญิง (คน)</label>
                    <input type="number" className="form-input" value={districtFormData.female} onChange={e => setDistrictFormData({...districtFormData, female: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ผู้สูงอายุ (คน)</label>
                    <input type="number" className="form-input" value={districtFormData.elderly} onChange={e => setDistrictFormData({...districtFormData, elderly: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>เด็กและเยาวชน (คน)</label>
                    <input type="number" className="form-input" value={districtFormData.kids} onChange={e => setDistrictFormData({...districtFormData, kids: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ผู้พิการในพื้นที่ (คน)</label>
                    <input type="number" className="form-input" value={districtFormData.disabled} onChange={e => setDistrictFormData({...districtFormData, disabled: e.target.value})} />
                  </div>

                  {/* Economy & OTOP */}
                  <div className="form-group">
                    <label>รายได้ประชากรเฉลี่ย (บาท/ปี)</label>
                    <input type="number" className="form-input" value={districtFormData.avgIncome} onChange={e => setDistrictFormData({...districtFormData, avgIncome: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ยอดจำหน่าย OTOP สะสม (บาท)</label>
                    <input type="number" className="form-input" value={districtFormData.otopSales} onChange={e => setDistrictFormData({...districtFormData, otopSales: e.target.value})} />
                  </div>

                  {/* Budgets */}
                  <div className="form-group">
                    <label>งบประมาณได้รับ (บาท)</label>
                    <input type="number" className="form-input" value={districtFormData.budgetReceived} onChange={e => setDistrictFormData({...districtFormData, budgetReceived: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label>งบเบิกจ่ายแล้วสะสม (บาท)</label>
                    <input type="number" className="form-input" value={districtFormData.budgetDisbursed} onChange={e => setDistrictFormData({...districtFormData, budgetDisbursed: e.target.value})} />
                  </div>

                  {/* KPI counts */}
                  <div className="form-group">
                    <label>ตัวชี้วัดทั้งหมด (เป้าหมาย 20)</label>
                    <input type="number" className="form-input" readOnly value={20} />
                  </div>
                  <div className="form-group">
                    <label>ตัวชี้วัดที่ผ่านเกณฑ์ (สำเร็จ)</label>
                    <input type="number" className="form-input" value={districtFormData.kpiSuccess} onChange={e => setDistrictFormData({...districtFormData, kpiSuccess: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>อยู่ระหว่างดำเนินงาน</label>
                    <input type="number" className="form-input" value={districtFormData.kpiInProgress} onChange={e => setDistrictFormData({...districtFormData, kpiInProgress: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ตัวชี้วัดที่มีความเสี่ยง</label>
                    <input type="number" className="form-input" value={districtFormData.kpiAtRisk} onChange={e => setDistrictFormData({...districtFormData, kpiAtRisk: e.target.value})} />
                  </div>

                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                <button type="submit" className="btn-submit-blue">บันทึกปรับสถิติ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Add / Edit KPI modal */}
      {(modalType === 'kpi_add' || modalType === 'kpi_edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalType === 'kpi_add' ? <Plus size={16} /> : <Edit2 size={12} />}
                {modalType === 'kpi_add' ? 'เพิ่มตัวชี้วัดใหม่' : 'แก้ไขข้อมูลตัวชี้วัด'}
              </h3>
              <button className="btn-close-modal" onClick={async () => setModalType(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmitKPI}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>ชื่อตัวชี้วัด <span className="required">*</span></label>
                    <input type="text" className="form-input" required value={kpiFormData.name} onChange={e => setKpiFormData({...kpiFormData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ค่าเป้าหมาย <span className="required">*</span></label>
                    <input type="number" className="form-input" required value={kpiFormData.target} onChange={e => setKpiFormData({...kpiFormData, target: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>ผลการดำเนินงานจริง <span className="required">*</span></label>
                    <input type="number" className="form-input" required value={kpiFormData.actual} onChange={e => setKpiFormData({...kpiFormData, actual: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>หน่วยวัด (เช่น %, แห่ง, ราย)</label>
                    <input type="text" className="form-input" required value={kpiFormData.unit} onChange={e => setKpiFormData({...kpiFormData, unit: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>สถานะตัวชี้วัด</label>
                    <select className="form-input" value={kpiFormData.status} onChange={e => setKpiFormData({...kpiFormData, status: e.target.value})}>
                      <option value="สำเร็จ">สำเร็จ</option>
                      <option value="ดำเนินการ">อยู่ระหว่างดำเนินการ</option>
                      <option value="มีความเสี่ยง">มีความเสี่ยงไม่ผ่านเกณฑ์</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>อำเภอพื้นที่</label>
                    <select className="form-input" value={kpiFormData.district} onChange={e => setKpiFormData({...kpiFormData, district: e.target.value})}>
                      {DISTRICTS_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>หน่วยงานรับผิดชอบ</label>
                    <select className="form-input" value={kpiFormData.agency} onChange={e => setKpiFormData({...kpiFormData, agency: e.target.value})}>
                      {AGENCIES_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                <button type="submit" className="btn-submit-blue">บันทึกตัวชี้วัด</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Confirm Delete KPI modal */}
      {modalType === 'kpi_delete' && selectedKPI && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-width">
            <div className="confirm-body">
              <div className="confirm-icon-danger"><AlertTriangle size={32} /></div>
              <span className="confirm-text-title">ยืนยันการลบตัวชี้วัด</span>
              <span className="confirm-text-desc">คุณต้องการลบตัวชี้วัด **{selectedKPI.name}** ใช่หรือไม่?</span>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
              <button className="btn-submit-blue" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteKPIConfirm}>ลบตัวชี้วัด</button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Add / Edit Report modal */}
      {(modalType === 'report_add' || modalType === 'report_edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalType === 'report_add' ? <Plus size={16} /> : <Edit2 size={12} />}
                {modalType === 'report_add' ? 'เพิ่มรายการติดตามรายงานใหม่' : 'แก้ไขข้อมูลติดตามรายงาน'}
              </h3>
              <button className="btn-close-modal" onClick={async () => setModalType(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmitReport}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>ชื่อโครงการที่ต้องส่งรายงาน <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={reportFormData.projectName} 
                      onChange={e => setReportFormData({...reportFormData, projectName: e.target.value})} 
                      placeholder="เช่น โครงการวัดประชารัฐสร้างสุข"
                    />
                  </div>
                  <div className="form-group">
                    <label>รอบเดือนที่ติดตาม <span className="required">*</span></label>
                    <select 
                      className="form-input" 
                      value={reportFormData.month} 
                      onChange={e => setReportFormData({...reportFormData, month: e.target.value})}
                    >
                      {['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>กำหนดส่ง</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={reportFormData.deadlineDate} 
                      onChange={e => setReportFormData({...reportFormData, deadlineDate: e.target.value})}
                      placeholder="เช่น 20 ต.ค. 2567"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>สถานะการส่งรายงาน</label>
                    <select 
                      className="form-input" 
                      value={reportFormData.status} 
                      onChange={e => setReportFormData({...reportFormData, status: e.target.value})}
                    >
                      <option value="รายงานแล้ว">รายงานแล้ว (🟢 สีเขียว)</option>
                      <option value="กำลังดำเนินการ">กำลังดำเนินการ (🟡 สีเหลือง)</option>
                      <option value="ยังไม่รายงาน">ยังไม่รายงาน (🔴 สีแดง)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                <button type="submit" className="btn-submit-blue">บันทึกข้อมูลรายงาน</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. Confirm Delete Report modal */}
      {modalType === 'report_delete' && selectedReport && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-width">
            <div className="confirm-body">
              <div className="confirm-icon-danger"><AlertTriangle size={32} /></div>
              <span className="confirm-text-title">ยืนยันการลบรายการติดตามรายงาน</span>
              <span className="confirm-text-desc">คุณต้องการลบข้อมูลโครงการ **{selectedReport.projectName}** (เดือน {selectedReport.month}) ใช่หรือไม่?</span>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
              <button className="btn-submit-blue" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteReportConfirm}>ลบรายการ</button>
            </div>
          </div>
        </div>
      )}

      {/* 12. Add/Edit Women Project modal */}
      {(modalType === 'women_proj_add' || modalType === 'women_proj_edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalType === 'women_proj_add' ? <Plus size={16} /> : <Edit2 size={12} />}
                {modalType === 'women_proj_add' ? 'เพิ่มโครงการสตรีใหม่' : 'แก้ไขข้อมูลโครงการสตรี'}
              </h3>
              <button className="modal-close-btn" onClick={async () => setModalType(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmitWomenProject}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>ชื่อโครงการสตรี</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={womenProjForm.name} 
                      onChange={e => setWomenProjForm({...womenProjForm, name: e.target.value})}
                      placeholder="เช่น กลุ่มสตรีทอผ้าพื้นเมือง"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>กู้ยืม / จำนวนกลุ่ม</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={womenProjForm.groupsCount} 
                      onChange={e => setWomenProjForm({...womenProjForm, groupsCount: e.target.value})}
                      placeholder="เช่น 15 กลุ่ม หรือ 1,200,000 บาท"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>อัตราการชำระตรงเวลา / คืนเงินกู้ (%)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={womenProjForm.paybackRate} 
                      onChange={e => setWomenProjForm({...womenProjForm, paybackRate: e.target.value})}
                      placeholder="เช่น 95.8%"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                <button type="submit" className="btn-submit-blue">บันทึกข้อมูลโครงการ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. Confirm Delete Women Project modal */}
      {modalType === 'women_proj_delete' && selectedWomenProject && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-width">
            <div className="confirm-body">
              <div className="confirm-icon-danger"><AlertTriangle size={32} /></div>
              <span className="confirm-text-title">ยืนยันการลบโครงการสตรี</span>
              <span className="confirm-text-desc">คุณต้องการลบข้อมูลโครงการ **{selectedWomenProject.name}** ใช่หรือไม่?</span>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
              <button className="btn-submit-blue" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteWomenProjectConfirm}>ลบโครงการ</button>
            </div>
          </div>
        </div>
      )}

      {/* 14. Add/Edit Custom Special Menu modal */}
      {(modalType === 'custom_menu_add' || modalType === 'custom_menu_edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalType === 'custom_menu_add' ? <Plus size={16} /> : <Edit2 size={12} />}
                {modalType === 'custom_menu_add' ? 'เพิ่มรายการเมนูพิเศษใหม่' : 'แก้ไขข้อมูลรายการเมนูพิเศษ'}
              </h3>
              <button className="modal-close-btn" onClick={async () => setModalType(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmitCustomSpecialMenu}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>ชื่อเมนูพิเศษ (จะแสดงในแถบซ้ายมือ)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={customSpecialMenuForm.name} 
                      onChange={e => setCustomSpecialMenuForm({...customSpecialMenuForm, name: e.target.value})}
                      placeholder="เช่น โครงการส่งเสริมท่องเที่ยวชุมชน"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>เนื้อหาข้อมูล / รายละเอียดหลัก</label>
                    <textarea 
                      className="form-input" 
                      rows={6}
                      value={customSpecialMenuForm.content} 
                      onChange={e => setCustomSpecialMenuForm({...customSpecialMenuForm, content: e.target.value})}
                      placeholder="ป้อนรายละเอียดเนื้อหาที่ท่านต้องการให้แสดงเมื่อผู้บริหารคลิกเมนูนี้..."
                      style={{ resize: 'vertical' }}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                <button type="submit" className="btn-submit-blue">บันทึกข้อมูลเมนูพิเศษ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 15. Confirm Delete Custom Special Menu modal */}
      {modalType === 'custom_menu_delete' && selectedCustomSpecialMenu && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-width">
            <div className="confirm-body">
              <div className="confirm-icon-danger"><AlertTriangle size={32} /></div>
              <span className="confirm-text-title">ยืนยันการลบรายการเมนูพิเศษ</span>
              <span className="confirm-text-desc">คุณต้องการลบรายการเมนูพิเศษ **{selectedCustomSpecialMenu.name}** ใช่หรือไม่? (เมนูนี้จะถูกนำออกจากแถบซ้ายมือ)</span>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
              <button className="btn-submit-blue" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteCustomSpecialMenuConfirm}>ลบรายการ</button>
            </div>
          </div>
        </div>
      )}

      {/* 16. Add/Edit AI Question modal */}
      {(modalType === 'ai_question_add' || modalType === 'ai_question_edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalType === 'ai_question_add' ? <Plus size={16} /> : <Edit2 size={12} />}
                {modalType === 'ai_question_add' ? 'เพิ่มคำถามวิเคราะห์ด่วนใหม่' : 'แก้ไขข้อมูลคำถามวิเคราะห์ด่วน'}
              </h3>
              <button className="modal-close-btn" onClick={async () => setModalType(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmitAiQuestion}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>ป้ายชื่อปุ่มคำถามด่วน (แสดงในแถบซ้ายหน้าผู้ช่วย AI)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={aiQuestionForm.label} 
                      onChange={e => setAiQuestionForm({...aiQuestionForm, label: e.target.value})}
                      placeholder="เช่น 📊 สรุปความก้าวหน้า"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ข้อความคำสั่งที่จะส่งให้ AI วิเคราะห์</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={aiQuestionForm.query} 
                      onChange={e => setAiQuestionForm({...aiQuestionForm, query: e.target.value})}
                      placeholder="เช่น สรุปผลการดำเนินงานภาพรวม หรือ ตำบลใดเบิกจ่ายต่ำสุด"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>คำตอบของ AI แบบกำหนดเอง (ปล่อยว่างไว้หากต้องการให้ AI คำนวณวิเคราะห์จากระบบอัตโนมัติ)</label>
                    <textarea 
                      className="form-input" 
                      rows={5}
                      value={aiQuestionForm.answer} 
                      onChange={e => setAiQuestionForm({...aiQuestionForm, answer: e.target.value})}
                      placeholder="ป้อนคำตอบที่ท่านต้องการให้ AI ตอบผู้บริหารเมื่อคลิกปุ่มนี้... (ถ้าไม่ใส่ ระบบจะใช้อัลกอริทึมจำลองของศูนย์วิเคราะห์ตามจริง)"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                <button type="submit" className="btn-submit-blue">บันทึกข้อมูลคำถามด่วน</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 17. Confirm Delete AI Question modal */}
      {modalType === 'ai_question_delete' && selectedAiQuestion && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-width">
            <div className="confirm-body">
              <div className="confirm-icon-danger"><AlertTriangle size={32} /></div>
              <span className="confirm-text-title">ยืนยันการลบคำถามวิเคราะห์ด่วน</span>
              <span className="confirm-text-desc">คุณต้องการลบคำถามด่วน **{selectedAiQuestion.label}** ใช่หรือไม่?</span>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
              <button className="btn-submit-blue" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteAiQuestionConfirm}>ลบรายการ</button>
            </div>
          </div>
        </div>
      )}

      {/* 18. Add/Edit OTOP Product modal */}
      {(modalType === 'otop_product_add' || modalType === 'otop_product_edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {modalType === 'otop_product_add' ? <Plus size={16} /> : <Edit2 size={12} />}
                <span className="modal-title">
                  {modalType === 'otop_product_add' ? 'เพิ่มรายการสินค้า OTOP ใหม่' : 'แก้ไขข้อมูลสินค้า OTOP'}
                </span>
              </div>
              <button className="btn-close" onClick={async () => setModalType(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmitOtopProduct}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>ชื่อสินค้า OTOP</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={otopProductForm.name} 
                      onChange={e => setOtopProductForm({...otopProductForm, name: e.target.value})}
                      placeholder="เช่น น้ำพริกกุ้งเสียบป่าตอง, ไข่มุกกมลา"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ประเภทสินค้า OTOP</label>
                    <select 
                      className="form-input"
                      value={otopProductForm.type} 
                      onChange={e => setOtopProductForm({...otopProductForm, type: e.target.value})}
                    >
                      {OTOP_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ตำบลที่ตั้ง</label>
                    <select 
                      className="form-input"
                      value={otopProductForm.district} 
                      onChange={e => setOtopProductForm({...otopProductForm, district: e.target.value})}
                    >
                      {DISTRICTS_LIST.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ยอดจำหน่ายสะสม (บาท)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={otopProductForm.sale} 
                      onChange={e => setOtopProductForm({...otopProductForm, sale: e.target.value})}
                      placeholder="เช่น 3500000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ระดับความนิยม / คะแนนดาว (Rating)</label>
                    <select 
                      className="form-input"
                      value={otopProductForm.star} 
                      onChange={e => setOtopProductForm({...otopProductForm, star: parseInt(e.target.value, 10)})}
                    >
                      <option value={5}>★★★★★ (5 ดาว)</option>
                      <option value={4}>★★★★ (4 ดาว)</option>
                      <option value={3}>★★★ (3 ดาว)</option>
                      <option value={2}>★★ (2 ดาว)</option>
                      <option value={1}>★ (1 ดาว)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                <button type="submit" className="btn-submit-blue">บันทึกข้อมูลสินค้า</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 19. Confirm Delete OTOP Product modal */}
      {modalType === 'otop_product_delete' && selectedOtopProduct && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-width">
            <div className="confirm-body">
              <div className="confirm-icon-danger"><AlertTriangle size={32} /></div>
              <span className="confirm-text-title">ยืนยันการลบสินค้า OTOP</span>
              <span className="confirm-text-desc">คุณต้องการลบสินค้า OTOP **{selectedOtopProduct.name}** ใช่หรือไม่?</span>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
              <button className="btn-submit-blue" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteOtopProductConfirm}>ลบรายการ</button>
            </div>
          </div>
        </div>
      )}

      {/* 20. Add/Edit Document modal */}
      {(modalType === 'document_add' || modalType === 'document_edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {modalType === 'document_add' ? <Plus size={16} /> : <Edit2 size={12} />}
                <span className="modal-title">
                  {modalType === 'document_add' ? 'เพิ่มรายการแบบฟอร์ม/เอกสารใหม่' : 'แก้ไขข้อมูลแบบฟอร์ม/เอกสาร'}
                </span>
              </div>
              <button className="btn-close" onClick={async () => setModalType(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmitDocument}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>ชื่อแบบฟอร์ม / เอกสาร <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={documentForm.name} 
                      onChange={e => setDocumentForm({...documentForm, name: e.target.value})}
                      placeholder="เช่น ใบสมัครลงทะเบียนผู้ประกอบการ OTOP"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>หมวดหมู่เอกสาร</label>
                    <select 
                      className="form-input"
                      value={documentForm.category} 
                      onChange={e => setDocumentForm({...documentForm, category: e.target.value})}
                    >
                      <option value="OTOP">OTOP / วิสาหกิจชุมชน</option>
                      <option value="กองทุนสตรี">กองทุนพัฒนาบทบาทสตรี</option>
                      <option value="องค์กรชุมชน">กลุ่มและองค์กรชุมชน</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label>ประเภทไฟล์</label>
                      <select 
                        className="form-input"
                        value={documentForm.type} 
                        onChange={e => setDocumentForm({...documentForm, type: e.target.value})}
                      >
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="XLSX">XLSX</option>
                        <option value="ZIP">ZIP</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>ขนาดไฟล์</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={documentForm.size} 
                        onChange={e => setDocumentForm({...documentForm, size: e.target.value})}
                        placeholder="เช่น 245 KB หรือ 1.5 MB"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>ลิงก์ URL สำหรับดาวน์โหลด <span className="required">*</span></label>
                    <input 
                      type="url" 
                      className="form-input" 
                      value={documentForm.link} 
                      onChange={e => setDocumentForm({...documentForm, link: e.target.value})}
                      placeholder="เช่น https://cdd.go.th/files/form.pdf"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
                <button type="submit" className="btn-submit-blue">บันทึกข้อมูลเอกสาร</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 21. Confirm Delete Document modal */}
      {modalType === 'document_delete' && selectedDocument && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-width">
            <div className="confirm-body">
              <div className="confirm-icon-danger"><AlertTriangle size={32} /></div>
              <span className="confirm-text-title">ยืนยันการลบแบบฟอร์ม/เอกสาร</span>
              <span className="confirm-text-desc">คุณต้องการลบเอกสาร **{selectedDocument.name}** ใช่หรือไม่?</span>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={async () => setModalType(null)}>ยกเลิก</button>
              <button className="btn-submit-blue" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteDocumentConfirm}>ลบรายการ</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
