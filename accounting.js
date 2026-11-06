(() => {
  const accountingPage = document.getElementById('accountingPage');
  const accountingDate = document.getElementById('accountingDate');
  const totalBalanceEl = document.getElementById('totalBalance');
  const monthIncomeEl = document.getElementById('monthIncome');
  const monthExpenseEl = document.getElementById('monthExpense');
  const todayIncomeEl = document.getElementById('todayIncome');
  const todayExpenseEl = document.getElementById('todayExpense');
  const budgetRemainingEl = document.getElementById('budgetRemaining');
  const budgetSpentEl = document.getElementById('budgetSpent');
  const budgetTotalEl = document.getElementById('budgetTotal');
  const budgetPercentEl = document.getElementById('budgetPercent');
  const budgetProgressEl = document.getElementById('budgetProgress');
  const billsListContainer = document.getElementById('billsListContainer');
  
  const balanceStatsWrapper = document.getElementById('balanceStatsWrapper');
  const balanceSliderIndicators = document.getElementById('balanceSliderIndicators');
  
  const navAddBill = document.getElementById('navAddBill');
  const addBillModal = document.getElementById('addBillModal');
  const addBillForm = document.getElementById('addBillForm');
  const addBillCancel = document.getElementById('addBillCancel');
  const billTypeTabs = addBillModal
    ? addBillModal.querySelectorAll('.bill-type-tab')
    : [];
  const billCategorySelect = document.getElementById('billCategory');
  const billTimeInput = document.getElementById('billTime');
  const billAmountInput = document.getElementById('billAmount');
  const amountInputWrap = document.getElementById('amountInputWrap');
  const amountKeypad = document.getElementById('amountKeypad');
  
  // Mine view elements
  const accountingMineView = document.getElementById('accountingMineView');
  const totalAccountingDaysEl = document.getElementById('totalAccountingDays');
  const totalAccountingTimesEl = document.getElementById('totalAccountingTimes');
  const mineAssetsBtn = document.getElementById('mineAssetsBtn');
  const assetsSettingsPage = document.getElementById('assetsSettingsPage');
  const assetsSettingsForm = document.getElementById('assetsSettingsForm');
  const assetsSettingsBack = document.getElementById('assetsSettingsBack');
  const initialAssetsInput = document.getElementById('initialAssetsInput');
  
  const mineCategoryBtn = document.getElementById('mineCategoryBtn');
  const minePlanBtn = document.getElementById('minePlanBtn');
  const mineImportExportBtn = document.getElementById('mineImportExportBtn');
  const importExportModal = document.getElementById('importExportModal');
  const importExportCancel = document.getElementById('importExportCancel');
  const exportAccountingBtn = document.getElementById('exportAccountingBtn');
  const importAccountingBtn = document.getElementById('importAccountingBtn');
  const importAccountingInput = document.getElementById('importAccountingInput');
  const planSettingsPage = document.getElementById('planSettingsPage');
  const planSettingsBack = document.getElementById('planSettingsBack');
  const achievementsPage = document.getElementById('achievementsPage');
  const achievementsOpenBtn = document.getElementById('achievementsOpenBtn');
  const achievementsBack = document.getElementById('achievementsBack');
  const achievementsList = document.getElementById('achievementsList');
  const emptyAchievements = document.getElementById('emptyAchievements');
  const planEditPage = document.getElementById('planEditPage');
  const planEditBack = document.getElementById('planEditBack');
  const planEditTitle = document.getElementById('planEditTitle');
  const planEditHint = document.getElementById('planEditHint');
  const planSettingsForm = document.getElementById('planSettingsForm');
  const planNameLabel = document.getElementById('planNameLabel');
  const planAmountLabel = document.getElementById('planAmountLabel');
  const planAmountField = document.getElementById('planAmountField');
  const planFixedAmountField = document.getElementById('planFixedAmountField');
  const planFixedAmountLabel = document.getElementById('planFixedAmountLabel');
  const planFixedAmountInput = document.getElementById('planFixedAmountInput');
  const planFrequencyField = document.getElementById('planFrequencyField');
  const planFrequencySelect = document.getElementById('planFrequencySelect');
  const planInstallmentField = document.getElementById('planInstallmentField');
  const planInstallmentInput = document.getElementById('planInstallmentInput');
  const planEndDateField = document.getElementById('planEndDateField');
  const planEndDateLabel = document.getElementById('planEndDateLabel');
  const planSuggestHint = document.getElementById('planSuggestHint');
  const planTypeCards = planSettingsPage
    ? planSettingsPage.querySelectorAll('.plan-type-card')
    : [];

  const PLAN_MODE_META = {
    short_goal: {
      kind: 'savings',
      title: '短期目标',
      tag: '短期',
      hint: '适合几个月内完成的目标。请填写目标金额和截止日期。',
      amountLabel: '目标金额 (¥)',
      endRequired: true,
      endLabel: '截止日期',
      defaultColor: '#F59E0B'
    },
    long_goal: {
      kind: 'savings',
      title: '长期目标',
      tag: '长期',
      hint: '适合买房、教育等大额长期目标。截止日期可选。',
      amountLabel: '目标金额 (¥)',
      endRequired: false,
      endLabel: '预计完成日期（可选）',
      defaultColor: '#D97706'
    },
    fixed_plan: {
      kind: 'savings',
      title: '固定金额计划',
      tag: '定额存',
      hint: '按固定频率存钱。目标金额与每期金额都可选，不填也可先建计划、再按习惯记账。',
      amountLabel: '目标金额（可选）',
      endRequired: false,
      endLabel: '结束日期（可选）',
      defaultColor: '#CA8A04',
      needsFixed: true,
      needsFrequency: true,
      amountOptional: true,
      fixedOptional: true
    },
    flexible: {
      kind: 'savings',
      title: '自由储蓄',
      tag: '自由存',
      hint: '不设固定目标，随存随记，适合长期不定额储蓄。',
      amountLabel: '目标金额',
      endRequired: false,
      endLabel: '结束日期（可选）',
      defaultColor: '#4CAF50',
      noAmount: true,
      endOptionalHide: false
    },
    fixed_repay: {
      kind: 'debt',
      title: '定额还款',
      tag: '定额还',
      hint: '设定债务总额与每期固定还款额，按频率稳定还清。',
      amountLabel: '债务总额 (¥)',
      endRequired: false,
      endLabel: '预计还清日期（可选）',
      defaultColor: '#6366F1',
      needsFixed: true,
      needsFrequency: true
    },
    deadline: {
      kind: 'debt',
      title: '限期还清',
      tag: '限期',
      hint: '设定债务总额和还清截止日期，系统会估算建议每期还款额。',
      amountLabel: '债务总额 (¥)',
      endRequired: true,
      endLabel: '还清截止日期',
      defaultColor: '#4F46E5'
    },
    installment: {
      kind: 'debt',
      title: '分期还款',
      tag: '分期',
      hint: '按总期数拆分债务，自动计算每期应还金额。',
      amountLabel: '债务总额 (¥)',
      endRequired: false,
      endLabel: '结束日期（可选）',
      defaultColor: '#4338CA',
      needsInstallment: true,
      needsFrequency: true
    },
    flexible_debt: {
      kind: 'debt',
      title: '自由还款',
      tag: '自由还',
      hint: '只记录债务总额，不限期数和金额，随缘还款。',
      amountLabel: '债务总额 (¥)',
      endRequired: false,
      endLabel: '结束日期（可选）',
      defaultColor: '#7C3AED'
    }
  };

  const PLAN_FREQUENCY_LABEL = {
    weekly: '每周',
    biweekly: '每两周',
    monthly: '每月'
  };

  let draftingPlanMode = null;
  let draftingPlanKind = null;
  let editingPlanId = null;
  let financialPlanTab = 'savings';
  const planSubmitBtn = document.getElementById('planSubmitBtn');
  const financialTabSavings = document.getElementById('financialTabSavings');
  const financialTabDebt = document.getElementById('financialTabDebt');
  const savingsOverviewEl = document.getElementById('savingsOverview');
  const debtOverviewEl = document.getElementById('debtOverview');
  const categorySettingsModal = document.getElementById('categorySettingsModal');
  const categorySettingsCancel = document.getElementById('categorySettingsCancel');
  const categoryExpenseTab = document.getElementById('categoryExpenseTab');
  const categoryIncomeTab = document.getElementById('categoryIncomeTab');
  const categoryListContainer = document.getElementById('categoryListContainer');
  const addCategoryForm = document.getElementById('addCategoryForm');
  const newCategoryName = document.getElementById('newCategoryName');
  
  // Default Categories
  const DEFAULT_CATEGORIES = [
    { id: 'food', name: '餐饮', type: 'expense', isBudgeted: true },
    { id: 'transport', name: '交通', type: 'expense', isBudgeted: true },
    { id: 'shopping', name: '购物', type: 'expense', isBudgeted: true },
    { id: 'entertainment', name: '娱乐', type: 'expense', isBudgeted: true },
    { id: 'housing', name: '住房', type: 'expense', isBudgeted: false },
    { id: 'salary', name: '工资', type: 'income', isBudgeted: false },
    { id: 'bonus', name: '奖金', type: 'income', isBudgeted: false },
    { id: 'other-income', name: '其他收入', type: 'income', isBudgeted: false },
    { id: 'other-expense', name: '其他支出', type: 'expense', isBudgeted: true }
  ];

  let accountingData = {
    bills: [],
    settings: {
      dailyBudget: 50.00,
      monthlyBudget: 1500.00,
      totalBudget: 50.00,
      budgetPeriod: 'daily',
      resetHour: 7,
      budgetCategories: [],
      categoryBudgets: {},
      budgetGroups: [],
      hybridDailyEnabled: false,
      hybridMonthlyEnabled: false,
      hybridDailyCategories: [],
      hybridMonthlyCategories: [],
      initialAssets: 0.00,
      categories: [] // Store custom categories here, or copy default categories if empty
    },
    savings: [],
    debts: []
  };

  let editingBillId = null;

  const nowInit = new Date();
  let homeViewMonth = {
    year: nowInit.getFullYear(),
    month: nowInit.getMonth()
  };
  let homeMonthPickerYear = homeViewMonth.year;

  const BUDGET_PERIOD_META = {
    daily: {
      title: '每日预算',
      amountLabel: '每日总预算 (¥)',
      remaining: '剩余今日预算',
      over: '今日超支',
      include: '计入今日预算'
    },
    weekly: {
      title: '每周预算',
      amountLabel: '每周总预算 (¥)',
      remaining: '剩余本周预算',
      over: '本周超支',
      include: '计入本周预算'
    },
    monthly: {
      title: '每月预算',
      amountLabel: '每月总预算 (¥)',
      remaining: '剩余本月预算',
      over: '本月超支',
      include: '计入本月预算'
    },
    hybrid: {
      title: '混合预算',
      amountLabel: '今日预算 (¥)',
      remaining: '剩余本月预算',
      over: '本月超支',
      include: '计入今日预算',
      dailyRemaining: '今日还能花',
      dailyOver: '今日已多花',
      dailyUsedUp: '今日参考已用完',
      categoryHint: '本月用预算分组管理；未分组分类不计入本月。'
    }
  };

  const hasCategoryBudgets = (categoryBudgets = accountingData.settings.categoryBudgets) => {
    if (!categoryBudgets || typeof categoryBudgets !== 'object') return false;
    return Object.keys(categoryBudgets).some(id => parseFloat(categoryBudgets[id]) > 0);
  };

  const normalizeBudgetGroup = (group, index = 0) => {
    if (!group || typeof group !== 'object') return null;
    const amount = parseFloat(group.amount);
    const categoryIds = Array.isArray(group.categoryIds)
      ? [...new Set(group.categoryIds.filter(id => typeof id === 'string' && id))]
      : [];
    const name = typeof group.name === 'string' ? group.name.trim() : '';
    const rawAmounts = group.categoryAmounts && typeof group.categoryAmounts === 'object' && !Array.isArray(group.categoryAmounts)
      ? group.categoryAmounts
      : {};
    const categoryAmounts = {};
    categoryIds.forEach(id => {
      const val = parseFloat(rawAmounts[id]);
      if (!isNaN(val) && val > 0) categoryAmounts[id] = val;
    });
    return {
      id: typeof group.id === 'string' && group.id ? group.id : `bg_${Date.now()}_${index}`,
      name: name || `分组${index + 1}`,
      amount: !isNaN(amount) && amount > 0 ? amount : 0,
      categoryIds,
      categoryAmounts
    };
  };

  const sumBudgetGroupsAmount = (groups) => {
    return (groups || []).reduce((sum, group) => {
      const amount = parseFloat(group.amount);
      return sum + (!isNaN(amount) && amount > 0 ? amount : 0);
    }, 0);
  };

  const findBudgetGroupForCategory = (categoryId, groups = accountingData.settings.budgetGroups) => {
    return (groups || []).find(group => (group.categoryIds || []).includes(categoryId)) || null;
  };

  const isHybridDailyEnabled = () => !!accountingData.settings.hybridDailyEnabled;
  const isHybridMonthlyEnabled = () => !!accountingData.settings.hybridMonthlyEnabled;
  const hasBudgetGroups = () => (accountingData.settings.budgetGroups || []).length > 0;

  const categoryInListOrAll = (categoryId, list) => {
    if (!Array.isArray(list) || list.length === 0) return true;
    return list.includes(categoryId);
  };

  const normalizeBudgetSettings = () => {
    const s = accountingData.settings;
    if (!s.budgetPeriod || !BUDGET_PERIOD_META[s.budgetPeriod]) {
      s.budgetPeriod = 'daily';
    }

    const parsedTotal = parseFloat(s.totalBudget);
    const parsedDaily = parseFloat(s.dailyBudget);
    const parsedMonthly = parseFloat(s.monthlyBudget);

    if (s.budgetPeriod === 'hybrid') {
      s.dailyBudget = !isNaN(parsedDaily) && parsedDaily > 0
        ? parsedDaily
        : (!isNaN(parsedTotal) && parsedTotal > 0 ? parsedTotal : 50);
      s.monthlyBudget = !isNaN(parsedMonthly) && parsedMonthly > 0
        ? parsedMonthly
        : Math.round(s.dailyBudget * 30 * 100) / 100;
      s.totalBudget = s.monthlyBudget;
    } else {
      if (s.totalBudget == null || isNaN(parsedTotal)) {
        s.totalBudget = !isNaN(parsedDaily) && parsedDaily > 0 ? parsedDaily : 50;
      } else {
        s.totalBudget = parsedTotal;
      }
      s.dailyBudget = s.totalBudget;
      if (isNaN(parsedMonthly) || parsedMonthly <= 0) {
        s.monthlyBudget = s.budgetPeriod === 'monthly'
          ? s.totalBudget
          : Math.round(s.totalBudget * 30 * 100) / 100;
      } else {
        s.monthlyBudget = parsedMonthly;
      }
    }

    if (!s.categoryBudgets || typeof s.categoryBudgets !== 'object' || Array.isArray(s.categoryBudgets)) {
      s.categoryBudgets = {};
    }
    if (!Array.isArray(s.budgetCategories)) {
      s.budgetCategories = [];
    }
    if (!Array.isArray(s.budgetGroups)) {
      s.budgetGroups = [];
    } else {
      const seenCategories = new Set();
      s.budgetGroups = s.budgetGroups
        .map((group, index) => normalizeBudgetGroup(group, index))
        .filter(Boolean)
        .map(group => {
          group.categoryIds = group.categoryIds.filter(id => {
            if (seenCategories.has(id)) return false;
            seenCategories.add(id);
            return true;
          });
          const nextAmounts = {};
          group.categoryIds.forEach(id => {
            const val = parseFloat(group.categoryAmounts && group.categoryAmounts[id]);
            if (!isNaN(val) && val > 0) nextAmounts[id] = val;
          });
          group.categoryAmounts = nextAmounts;
          return group;
        });
    }
    // 无分类预算时不依赖旧白名单：空列表 = 全部计入
    if (!hasCategoryBudgets(s.categoryBudgets)) {
      s.budgetCategories = [];
    }
    if (!Array.isArray(s.hybridDailyCategories)) s.hybridDailyCategories = [];
    if (!Array.isArray(s.hybridMonthlyCategories)) s.hybridMonthlyCategories = [];
    // 旧混合数据：未声明开关时默认双开，保持原行为
    if (s.budgetPeriod === 'hybrid') {
      if (typeof s.hybridDailyEnabled !== 'boolean') s.hybridDailyEnabled = true;
      if (typeof s.hybridMonthlyEnabled !== 'boolean') s.hybridMonthlyEnabled = true;
    } else {
      if (typeof s.hybridDailyEnabled !== 'boolean') s.hybridDailyEnabled = false;
      if (typeof s.hybridMonthlyEnabled !== 'boolean') s.hybridMonthlyEnabled = false;
    }
  };

  const getPlanNamePrefix = (kind) => (kind === 'debt' ? '还钱计划-' : '小狗钱钱-');

  const resolvePlanKind = (catOrId) => {
    const id = typeof catOrId === 'string' ? catOrId : catOrId?.id;
    const cat = typeof catOrId === 'string'
      ? (accountingData.settings.categories || []).find(c => c.id === id)
      : catOrId;
    if (id && (accountingData.savings || []).some(s => s.id === id)) return 'savings';
    if (id && (accountingData.debts || []).some(d => d.id === id)) return 'debt';
    if (cat?.planType === 'savings' || cat?.planType === 'debt') return cat.planType;
    if (cat?.name && /^小狗钱钱-/.test(cat.name)) return 'savings';
    if (cat?.name && /^还钱计划-/.test(cat.name)) return 'debt';
    return null;
  };

  const formatPlanCategoryLabel = (cat) => {
    const kind = resolvePlanKind(cat);
    const rawName = String(cat?.name || '')
      .replace(/^小狗钱钱-/, '')
      .replace(/^还钱计划-/, '');
    if (kind === 'debt') return `还钱 · ${rawName}`;
    if (kind === 'savings') return `存钱 · ${rawName}`;
    return cat?.name || '未知计划';
  };

  const getSavingsPlanName = (planId) => {
    const plan = (accountingData.savings || []).find(s => s.id === planId);
    if (plan) return plan.name;
    const cat = (accountingData.settings.categories || []).find(c => c.id === planId);
    if (!cat) return '存钱账户';
    return String(cat.name || '')
      .replace(/^小狗钱钱-/, '')
      .replace(/^还钱计划-/, '') || '存钱账户';
  };

  /** 存钱账户余额 = 转入 − 从该账户支付的支出 */
  const getSavingsBalance = (planId, excludeBillId = null) => {
    let balance = 0;
    (accountingData.bills || []).forEach(bill => {
      if (excludeBillId && bill.id === excludeBillId) return;
      const amount = parseFloat(bill.amount) || 0;
      if (bill.type === 'transfer' && bill.categoryId === planId) {
        balance += amount;
      } else if (bill.type === 'expense' && bill.paidFromPlanId === planId) {
        balance -= amount;
      }
    });
    return Math.round(balance * 100) / 100;
  };

  const getTotalSaved = () => {
    return (accountingData.savings || []).reduce(
      (sum, plan) => sum + getSavingsBalance(plan.id),
      0
    );
  };

  /** 可花余额：从存款支付的支出不再扣减（存入时已扣过） */
  const getAvailableBalance = () => {
    let available = parseFloat(accountingData.settings.initialAssets) || 0;
    (accountingData.bills || []).forEach(bill => {
      const amount = parseFloat(bill.amount) || 0;
      if (bill.type === 'income') {
        available += amount;
      } else if (bill.type === 'expense') {
        if (!bill.paidFromPlanId) available -= amount;
      } else if (bill.type === 'transfer') {
        available -= amount;
      }
    });
    return Math.round(available * 100) / 100;
  };

  const normalizePlanCategories = () => {
    if (!Array.isArray(accountingData.savings)) accountingData.savings = [];
    if (!Array.isArray(accountingData.debts)) accountingData.debts = [];
    if (!Array.isArray(accountingData.settings.categories)) {
      accountingData.settings.categories = [...DEFAULT_CATEGORIES];
    }

    let changed = false;
    const ensurePlanCategory = (plan, kind) => {
      const prefix = getPlanNamePrefix(kind);
      const expectedName = prefix + plan.name;
      let cat = accountingData.settings.categories.find(c => c.id === plan.id);
      if (!cat) {
        accountingData.settings.categories.push({
          id: plan.id,
          name: expectedName,
          type: 'transfer',
          isBudgeted: false,
          isPlan: true,
          planType: kind,
          planMode: plan.mode || null
        });
        changed = true;
        return;
      }
      if (cat.planType !== kind) {
        cat.planType = kind;
        changed = true;
      }
      if (cat.type !== 'transfer') {
        cat.type = 'transfer';
        changed = true;
      }
      if (!cat.isPlan) {
        cat.isPlan = true;
        changed = true;
      }
      // 纠正误写成「还钱计划-」的存钱分类（或反过来）
      if (cat.name !== expectedName && (
        /^小狗钱钱-/.test(cat.name) || /^还钱计划-/.test(cat.name) || !cat.name
      )) {
        const raw = String(cat.name || '')
          .replace(/^小狗钱钱-/, '')
          .replace(/^还钱计划-/, '');
        cat.name = prefix + (raw || plan.name);
        changed = true;
      }
    };

    accountingData.savings.forEach(plan => ensurePlanCategory(plan, 'savings'));
    accountingData.debts.forEach(plan => ensurePlanCategory(plan, 'debt'));
    return changed;
  };

  const loadData = () => {
    const saved = localStorage.getItem('accounting_data');
    if (saved) {
      accountingData = JSON.parse(saved);
      // Initialize categories if they don't exist
      if (!accountingData.settings.categories || accountingData.settings.categories.length === 0) {
        accountingData.settings.categories = [...DEFAULT_CATEGORIES];
      }
    } else {
      accountingData.settings.categories = [...DEFAULT_CATEGORIES];
    }
    normalizeBudgetSettings();
    if (normalizePlanCategories()) {
      localStorage.setItem('accounting_data', JSON.stringify(accountingData));
    }
    updateUI();
  };

  const saveData = () => {
    localStorage.setItem('accounting_data', JSON.stringify(accountingData));
    updateUI();
  };

  const formatCurrency = (amount) => {
    return '¥' + parseFloat(amount).toFixed(2);
  };

  const getCalendarDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const getBudgetDay = (date = new Date()) => {
    const d = new Date(date);
    const hour = d.getHours();
    if (hour < accountingData.settings.resetHour) {
      d.setDate(d.getDate() - 1);
    }
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const getBudgetPeriodStart = (date = new Date(), periodOverride) => {
    let period = periodOverride || accountingData.settings.budgetPeriod || 'daily';
    if (period === 'hybrid') period = 'monthly';
    const d = new Date(getBudgetDay(date));
    if (period === 'weekly') {
      const day = d.getDay();
      const diff = day === 0 ? 6 : day - 1;
      d.setDate(d.getDate() - diff);
    } else if (period === 'monthly') {
      d.setDate(1);
    }
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const isInCurrentBudgetDay = (timestamp) => {
    return getBudgetDay(new Date(timestamp)) === getBudgetDay();
  };

  const isInCurrentBudgetMonth = (timestamp) => {
    const billDate = new Date(getBudgetDay(new Date(timestamp)));
    const startDate = new Date(getBudgetPeriodStart(new Date(), 'monthly'));
    return billDate.getFullYear() === startDate.getFullYear() &&
      billDate.getMonth() === startDate.getMonth();
  };

  const isInCurrentBudgetPeriod = (timestamp) => {
    const period = accountingData.settings.budgetPeriod || 'daily';
    if (period === 'hybrid') return isInCurrentBudgetMonth(timestamp);

    const billBudgetDay = getBudgetDay(new Date(timestamp));
    const periodStart = getBudgetPeriodStart();

    if (period === 'daily') return billBudgetDay === periodStart;
    if (period === 'weekly') {
      return billBudgetDay >= periodStart && billBudgetDay < periodStart + 7 * 86400000;
    }
    return isInCurrentBudgetMonth(timestamp);
  };

  const shouldIncludeBillInBudget = (bill) => {
    if (bill.type !== 'expense') return false;
    if (bill.includeInBudget !== undefined) return !!bill.includeInBudget;
    // 未添加分类预算 → 全部计入；有分类预算 → 仅勾选的分类计入
    if (!hasCategoryBudgets()) return true;
    return (accountingData.settings.budgetCategories || []).includes(bill.categoryId);
  };

  const countsTowardDailyBudget = (bill) => {
    if (bill.type !== 'expense') return false;
    const period = accountingData.settings.budgetPeriod || 'daily';
    if (period === 'hybrid') {
      if (!isHybridDailyEnabled()) return false;
      // 混合：由设置页勾选分类决定，不按单笔记账开关
      return categoryInListOrAll(bill.categoryId, accountingData.settings.hybridDailyCategories);
    }
    if (bill.includeInBudget !== undefined) return !!bill.includeInBudget;
    return true;
  };

  // 本月总额（与分组独立）
  const countsTowardMonthlyBudget = (bill) => {
    if (bill.type !== 'expense') return false;
    const period = accountingData.settings.budgetPeriod || 'daily';
    if (period === 'hybrid') {
      if (!isHybridMonthlyEnabled()) return false;
      // 混合：由设置页勾选分类决定，不按单笔记账开关
      return categoryInListOrAll(bill.categoryId, accountingData.settings.hybridMonthlyCategories);
    }
    if (bill.includeInMonthlyBudget !== undefined) return !!bill.includeInMonthlyBudget;
    return true;
  };

  // 分组口袋（可与本月总额独立）
  const countsTowardGroupBudget = (bill) => {
    if (bill.type !== 'expense') return false;
    if (!hasBudgetGroups()) return false;
    if (!findBudgetGroupForCategory(bill.categoryId)) return false;
    const period = accountingData.settings.budgetPeriod || 'daily';
    // 混合：分入组的分类自动计入，不按单笔记账开关
    if (period === 'hybrid') return true;
    if (bill.includeInMonthlyBudget !== undefined) return !!bill.includeInMonthlyBudget;
    return true;
  };

  const applyBudgetBlockUI = ({
    remainingEl,
    labelEl,
    spentEl,
    totalEl,
    percentEl,
    progressEl,
    spent,
    total,
    remainingLabel,
    overLabel,
    usedUpLabel,
    softOver
  }) => {
    const isOver = spent > total && total > 0;
    const isUsedUp = !isOver && total > 0 && spent >= total;
    const diff = isOver ? spent - total : Math.max(0, total - spent);
    const percent = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;

    if (labelEl) {
      if (isOver) labelEl.textContent = overLabel;
      else if (isUsedUp && usedUpLabel) labelEl.textContent = usedUpLabel;
      else labelEl.textContent = remainingLabel;
    }

    if (remainingEl) {
      if (isOver) {
        remainingEl.textContent = softOver ? formatCurrency(diff) : ('-¥' + diff.toFixed(2));
        remainingEl.style.color = 'var(--expense)';
      } else {
        remainingEl.textContent = formatCurrency(diff);
        remainingEl.style.color = '';
      }
    }

    if (progressEl) {
      progressEl.style.width = `${percent}%`;
      progressEl.style.backgroundColor = isOver ? 'var(--expense)' : '';
    }
    if (spentEl) spentEl.textContent = formatCurrency(spent);
    if (totalEl) totalEl.textContent = formatCurrency(total);
    if (percentEl) percentEl.textContent = `${percent}%`;

    return { isOver, percent, diff };
  };

  const BILL_SWIPE_WIDTH = 72;
  const BILL_SWIPE_OPEN_THRESHOLD = 36;
  let openBillSwipeItem = null;

  const closeBillSwipe = (item) => {
    if (!item) return;
    item.classList.remove('is-open', 'is-swiping');
    item.style.transform = '';
    if (openBillSwipeItem === item) openBillSwipeItem = null;
  };

  const openBillSwipe = (item) => {
    if (openBillSwipeItem && openBillSwipeItem !== item) {
      closeBillSwipe(openBillSwipeItem);
    }
    item.classList.add('is-open');
    item.classList.remove('is-swiping');
    item.style.transform = `translateX(-${BILL_SWIPE_WIDTH}px)`;
    openBillSwipeItem = item;
  };

  const bindBillItemSwipe = (wrap, item, bill) => {
    let startX = 0;
    let startY = 0;
    let baseOffset = 0;
    let currentOffset = 0;
    let tracking = false;
    let axis = null;
    let moved = false;

    const getOpenOffset = () => (item.classList.contains('is-open') ? -BILL_SWIPE_WIDTH : 0);

    const setOffset = (offset, withTransition) => {
      const clamped = Math.max(-BILL_SWIPE_WIDTH, Math.min(0, offset));
      currentOffset = clamped;
      item.classList.toggle('is-swiping', !withTransition);
      item.style.transform = `translateX(${clamped}px)`;
    };

    const finishGesture = () => {
      tracking = false;
      axis = null;
      item.classList.remove('is-swiping');

      if (currentOffset <= -BILL_SWIPE_OPEN_THRESHOLD) {
        openBillSwipe(item);
      } else {
        closeBillSwipe(item);
      }
    };

    item.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      tracking = true;
      moved = false;
      axis = null;
      startX = e.clientX;
      startY = e.clientY;
      baseOffset = getOpenOffset();
      currentOffset = baseOffset;
      item.setPointerCapture(e.pointerId);
    });

    item.addEventListener('pointermove', (e) => {
      if (!tracking) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!axis) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (axis === 'y') {
          tracking = false;
          return;
        }
        if (openBillSwipeItem && openBillSwipeItem !== item) {
          closeBillSwipe(openBillSwipeItem);
        }
      }

      if (axis !== 'x') return;
      moved = true;
      e.preventDefault();
      setOffset(baseOffset + dx, false);
    }, { passive: false });

    item.addEventListener('pointerup', () => {
      if (!tracking) return;
      if (axis === 'x') {
        finishGesture();
      } else {
        tracking = false;
        axis = null;
      }
    });

    item.addEventListener('pointercancel', () => {
      if (!tracking) return;
      if (axis === 'x') {
        finishGesture();
      } else {
        tracking = false;
        axis = null;
      }
    });

    item.addEventListener('click', (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
        return;
      }
      if (item.classList.contains('is-open')) {
        closeBillSwipe(item);
        return;
      }
      openEditBillModal(bill);
    });
  };

  const isHomeViewCurrentMonth = () => {
    const now = new Date();
    return homeViewMonth.year === now.getFullYear() && homeViewMonth.month === now.getMonth();
  };

  const getMonthsWithBills = (year) => {
    const months = new Set();
    accountingData.bills.forEach(bill => {
      const d = new Date(bill.timestamp);
      if (d.getFullYear() === year) months.add(d.getMonth());
    });
    return months;
  };

  const updateUI = () => {
    const now = new Date();
    if (accountingDate) {
      if (isHomeViewCurrentMonth()) {
        accountingDate.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
      } else {
        accountingDate.textContent = `${homeViewMonth.year}年${homeViewMonth.month + 1}月`;
      }
    }

    // Calculate Totals
    const totalBalance = getAvailableBalance();
    let monthIncome = 0;
    let monthExpense = 0;
    let todayIncome = 0;
    let todayExpense = 0;
    
    const viewMonth = homeViewMonth.month;
    const viewYear = homeViewMonth.year;
    const todayStart = getCalendarDay();

    const uniqueDays = new Set();

    accountingData.bills.forEach(bill => {
      const billDate = new Date(bill.timestamp);
      const amount = parseFloat(bill.amount);
      const billCalendarDay = getCalendarDay(billDate);
      
      uniqueDays.add(billCalendarDay);

      if (bill.type === 'income') {
        if (billDate.getMonth() === viewMonth && billDate.getFullYear() === viewYear) {
          monthIncome += amount;
        }
        if (billCalendarDay === todayStart) {
          todayIncome += amount;
        }
      } else if (bill.type === 'expense') {
        // 含从存款支付：仍计入支出统计，但不重复扣可花（见 getAvailableBalance）
        if (billDate.getMonth() === viewMonth && billDate.getFullYear() === viewYear) {
          monthExpense += amount;
        }
        if (billCalendarDay === todayStart) {
          todayExpense += amount;
        }
      }
    });

    if (totalBalanceEl) totalBalanceEl.textContent = formatCurrency(totalBalance);
    const totalSavedAmountEl = document.getElementById('totalSavedAmount');
    if (totalSavedAmountEl) {
      totalSavedAmountEl.textContent = formatCurrency(getTotalSaved());
    }
    monthIncomeEl.textContent = formatCurrency(monthIncome);
    monthExpenseEl.textContent = formatCurrency(monthExpense);
    const monthIncomeLabel = document.getElementById('monthIncomeLabel');
    const monthExpenseLabel = document.getElementById('monthExpenseLabel');
    if (isHomeViewCurrentMonth()) {
      if (monthIncomeLabel) monthIncomeLabel.textContent = '本月收入';
      if (monthExpenseLabel) monthExpenseLabel.textContent = '本月支出';
    } else {
      if (monthIncomeLabel) monthIncomeLabel.textContent = `${viewMonth + 1}月收入`;
      if (monthExpenseLabel) monthExpenseLabel.textContent = `${viewMonth + 1}月支出`;
    }
    if (todayIncomeEl) todayIncomeEl.textContent = formatCurrency(todayIncome);
    if (todayExpenseEl) todayExpenseEl.textContent = formatCurrency(todayExpense);

    // Update Mine view stats
    if (totalAccountingDaysEl) {
      totalAccountingDaysEl.textContent = uniqueDays.size;
    }
    if (totalAccountingTimesEl) {
      totalAccountingTimesEl.textContent = accountingData.bills.length;
    }

    // Calculate Period Budget
    normalizeBudgetSettings();
    const budgetPeriod = accountingData.settings.budgetPeriod || 'daily';
    const periodMeta = BUDGET_PERIOD_META[budgetPeriod] || BUDGET_PERIOD_META.daily;
    const isHybrid = budgetPeriod === 'hybrid';
    const hybridDailyOn = isHybrid && isHybridDailyEnabled();
    const hybridMonthlyOn = isHybrid && isHybridMonthlyEnabled();
    const hybridGroupsOn = isHybrid && hasBudgetGroups();
    let periodSpent = 0;
    let dailySpent = 0;
    const spentByCategory = {};
    const groupSpentByCategory = {};

    accountingData.bills.forEach(bill => {
      if (bill.type !== 'expense') return;
      const amount = parseFloat(bill.amount) || 0;

      if (isHybrid) {
        if (isInCurrentBudgetMonth(bill.timestamp) && countsTowardMonthlyBudget(bill)) {
          periodSpent += amount;
          spentByCategory[bill.categoryId] = (spentByCategory[bill.categoryId] || 0) + amount;
        }
        if (isInCurrentBudgetMonth(bill.timestamp) && countsTowardGroupBudget(bill)) {
          groupSpentByCategory[bill.categoryId] = (groupSpentByCategory[bill.categoryId] || 0) + amount;
        }
        if (isInCurrentBudgetDay(bill.timestamp) && countsTowardDailyBudget(bill)) {
          dailySpent += amount;
        }
        return;
      }

      if (!isInCurrentBudgetPeriod(bill.timestamp) || !shouldIncludeBillInBudget(bill)) return;
      periodSpent += amount;
      spentByCategory[bill.categoryId] = (spentByCategory[bill.categoryId] || 0) + amount;
    });

    const budgetCardEl = document.getElementById('budgetCard');
    if (budgetCardEl) {
      budgetCardEl.classList.toggle('is-hybrid', isHybrid);
      budgetCardEl.classList.toggle('hybrid-daily-on', hybridDailyOn);
      budgetCardEl.classList.toggle('hybrid-monthly-on', hybridMonthlyOn);
      budgetCardEl.classList.toggle('hybrid-groups-on', hybridGroupsOn);
    }

    const budgetTotal = isHybrid
      ? (parseFloat(accountingData.settings.monthlyBudget) || 0)
      : (parseFloat(accountingData.settings.totalBudget) || 0);

    const budgetDailyBlockEl = document.getElementById('budgetDailyBlock');
    if (budgetDailyBlockEl) {
      if (hybridDailyOn) {
        budgetDailyBlockEl.hidden = false;
        const dailyTotal = parseFloat(accountingData.settings.dailyBudget) || 0;
        applyBudgetBlockUI({
          remainingEl: document.getElementById('budgetDailyRemaining'),
          labelEl: document.getElementById('budgetDailyLabel'),
          spentEl: document.getElementById('budgetDailySpent'),
          totalEl: document.getElementById('budgetDailyTotal'),
          percentEl: document.getElementById('budgetDailyPercent'),
          progressEl: document.getElementById('budgetDailyProgress'),
          spent: dailySpent,
          total: dailyTotal,
          remainingLabel: periodMeta.dailyRemaining,
          overLabel: periodMeta.dailyOver,
          usedUpLabel: periodMeta.dailyUsedUp,
          softOver: true
        });
      } else {
        budgetDailyBlockEl.hidden = true;
      }
    }

    const budgetCategoryListEl = document.getElementById('budgetCategoryList');
    if (budgetCategoryListEl) {
      let rows = [];
      if (hybridGroupsOn) {
        const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
        const catNameById = Object.fromEntries(categoryList.map(cat => [cat.id, cat.name]));
        const groups = accountingData.settings.budgetGroups;
        groups.forEach(group => {
          const limit = parseFloat(group.amount) || 0;
          const spent = (group.categoryIds || []).reduce(
            (sum, catId) => sum + (groupSpentByCategory[catId] || 0),
            0
          );
          const over = spent > limit;
          const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
          rows.push(`
            <div class="budget-category-item">
              <div class="budget-category-item-head">
                <span class="budget-category-item-name">${group.name}</span>
                <span class="budget-category-item-meta">${formatCurrency(spent)} / ${formatCurrency(limit)}</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill${over ? ' is-over' : ''}" style="width:${percent}%;${over ? 'background:var(--expense)' : ''}"></div>
              </div>
            </div>
          `);

          const amounts = group.categoryAmounts || {};
          (group.categoryIds || []).forEach(catId => {
            const catLimit = parseFloat(amounts[catId]);
            if (isNaN(catLimit) || catLimit <= 0) return;
            const catSpent = groupSpentByCategory[catId] || 0;
            const catOver = catSpent > catLimit;
            const catPercent = Math.min(100, Math.round((catSpent / catLimit) * 100));
            rows.push(`
              <div class="budget-category-item budget-category-item-nested">
                <div class="budget-category-item-head">
                  <span class="budget-category-item-name">${catNameById[catId] || catId}</span>
                  <span class="budget-category-item-meta">${formatCurrency(catSpent)} / ${formatCurrency(catLimit)}</span>
                </div>
                <div class="progress-bar-wrap">
                  <div class="progress-bar-fill${catOver ? ' is-over' : ''}" style="width:${catPercent}%;${catOver ? 'background:var(--expense)' : ''}"></div>
                </div>
              </div>
            `);
          });
        });
      } else if (!isHybrid) {
        const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
        const categoryBudgets = accountingData.settings.categoryBudgets || {};
        rows = categoryList
          .filter(cat => cat.type === 'expense' && parseFloat(categoryBudgets[cat.id]) > 0)
          .map(cat => {
            const limit = parseFloat(categoryBudgets[cat.id]) || 0;
            const spent = spentByCategory[cat.id] || 0;
            const over = spent > limit;
            const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
            return `
              <div class="budget-category-item">
                <div class="budget-category-item-head">
                  <span class="budget-category-item-name">${cat.name}</span>
                  <span class="budget-category-item-meta">${formatCurrency(spent)} / ${formatCurrency(limit)}</span>
                </div>
                <div class="progress-bar-wrap">
                  <div class="progress-bar-fill${over ? ' is-over' : ''}" style="width:${percent}%;${over ? 'background:var(--expense)' : ''}"></div>
                </div>
              </div>
            `;
          });
      }
      budgetCategoryListEl.innerHTML = rows.join('');
      budgetCategoryListEl.classList.toggle('has-items', rows.length > 0);
    }

    const budgetPrimaryBlockEl = document.getElementById('budgetPrimaryBlock');
    if (budgetPrimaryBlockEl) {
      budgetPrimaryBlockEl.hidden = isHybrid && !hybridMonthlyOn;
    }

    if (!isHybrid || hybridMonthlyOn) {
      applyBudgetBlockUI({
        remainingEl: budgetRemainingEl,
        labelEl: document.getElementById('budgetRemainingLabel'),
        spentEl: budgetSpentEl,
        totalEl: budgetTotalEl,
        percentEl: budgetPercentEl,
        progressEl: budgetProgressEl,
        spent: periodSpent,
        total: budgetTotal,
        remainingLabel: periodMeta.remaining,
        overLabel: periodMeta.over
      });
    }

    syncBillBudgetSwitchUI(periodMeta);

    // Render Bills Grouped by Day (selected month only)
    if (billsListContainer) {
      billsListContainer.innerHTML = '';
      openBillSwipeItem = null;

      const monthBills = accountingData.bills.filter(bill => {
        const d = new Date(bill.timestamp);
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
      });
      
      if (monthBills.length === 0) {
        const emptySection = document.createElement('section');
        emptySection.className = 'accounting-card recent-bills-card';
        emptySection.innerHTML = `
          <div class="empty-bills">
            <p>${accountingData.bills.length === 0 ? '还没有账单' : '这个月还没有账单'}</p>
            <button class="start-accounting-btn" id="startAccountingBtn">开始记账</button>
          </div>
        `;
        billsListContainer.appendChild(emptySection);
        
        const startBtn = emptySection.querySelector('#startAccountingBtn');
        if (startBtn && navAddBill) {
          startBtn.addEventListener('click', () => navAddBill.click());
        }
      } else {
        // Group by day
        const groupedBills = {};
        monthBills.forEach(bill => {
          const dayTime = getCalendarDay(new Date(bill.timestamp));
          if (!groupedBills[dayTime]) {
            groupedBills[dayTime] = [];
          }
          groupedBills[dayTime].push(bill);
        });
        
        // Sort days descending
        const sortedDays = Object.keys(groupedBills).sort((a, b) => b - a);
        
        sortedDays.forEach(dayTimeStr => {
          const dayTime = parseInt(dayTimeStr, 10);
          const billsOfDay = groupedBills[dayTimeStr].sort((a, b) => b.timestamp - a.timestamp);
          
          let title = '';
          const todayStart = getCalendarDay();
          
          if (dayTime === todayStart) {
            title = '今日账单';
          } else {
            const d = new Date(dayTime);
            title = `${d.getMonth() + 1}月${d.getDate()}日账单`;
          }
          
          // Calculate day total
          let dayIncome = 0;
          let dayExpense = 0;
          let dayTransfer = 0;
          billsOfDay.forEach(b => {
            const amt = parseFloat(b.amount);
            if (b.type === 'income') dayIncome += amt;
            else if (b.type === 'transfer') dayTransfer += amt;
            else if (b.type === 'expense') dayExpense += amt;
          });
          
          let summaryParts = [];
          if (dayExpense > 0) {
            summaryParts.push(`<span class="day-summary expense"><span class="day-tag">支</span>￥${dayExpense.toFixed(2)}</span>`);
          }
          if (dayIncome > 0) {
            summaryParts.push(`<span class="day-summary income"><span class="day-tag">收</span>￥${dayIncome.toFixed(2)}</span>`);
          }
          if (dayTransfer > 0) {
            summaryParts.push(`<span class="day-summary transfer"><span class="day-tag">转</span>￥${dayTransfer.toFixed(2)}</span>`);
          }

          const group = document.createElement('div');
          group.className = 'bills-day-group';
          group.innerHTML = `
            <div class="card-header bills-day-header">
              <h3 class="card-title">${title}</h3>
              <span class="day-summary-wrap">${summaryParts.join('')}</span>
            </div>
            <section class="accounting-card recent-bills-card">
              <div class="bills-list"></div>
            </section>
          `;
          
          const listContainer = group.querySelector('.bills-list');
          
          billsOfDay.forEach(bill => {
            const wrap = document.createElement('div');
            wrap.className = 'bill-item-swipe';

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'bill-item-delete-action';
            deleteBtn.setAttribute('aria-label', '删除账单');
            deleteBtn.textContent = '删除';

            const item = document.createElement('div');
            item.className = 'bill-item';
            
            const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
            const categoryObj = categoryList.find(c => c.id === bill.categoryId);
            const category = categoryObj?.isPlan
              ? formatPlanCategoryLabel(categoryObj)
              : (categoryObj?.name || '未知');
            const date = new Date(bill.timestamp);
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            const payFromHint = bill.type === 'expense' && bill.paidFromPlanId
              ? `存·${escapeHtml(getSavingsPlanName(bill.paidFromPlanId))} · `
              : '';
            
            item.innerHTML = `
              <div class="bill-item-left">
                <span class="bill-category">${escapeHtml(category)}</span>
                <span class="bill-note-time">${payFromHint}${bill.note ? escapeHtml(bill.note) + ' · ' : ''}${timeStr}</span>
              </div>
              <span class="bill-amount ${bill.type}">${bill.type === 'income' ? '+' : bill.type === 'transfer' ? '转' : '-'}￥${parseFloat(bill.amount).toFixed(2)}</span>
            `;

            bindBillItemSwipe(wrap, item, bill);
            
            deleteBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              if (confirm('确定删除这笔账单吗？')) {
                accountingData.bills = accountingData.bills.filter(b => b.id !== bill.id);
                saveData();
                if (accountingBillsView && accountingBillsView.classList.contains('active')) {
                  if (typeof renderBillsView === 'function') renderBillsView();
                }
              }
            });

            wrap.appendChild(deleteBtn);
            wrap.appendChild(item);
            listContainer.appendChild(wrap);
          });
          
          billsListContainer.appendChild(group);
        });
      }
    }

    // Update Savings & Debt Overview (Simple placeholders for now)
    updateSavingsOverview();
    updateDebtOverview();
  };

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const getPlanModeMeta = (mode) => PLAN_MODE_META[mode] || null;

  /** 有明确目标总额的计划（非自由/无总额循环）才可进入成就 */
  const getPlanGoalAmount = (plan, kind) => {
    if (!plan) return 0;
    if (kind === 'debt') return parseFloat(plan.totalAmount) || 0;
    return parseFloat(plan.targetAmount) || 0;
  };

  const getPlanCumulativeAmount = (plan, kind) => {
    if (!plan) return 0;
    if (kind === 'debt') {
      return Math.round(
        (accountingData.bills || [])
          .filter(b => b.categoryId === plan.id)
          .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0) * 100
      ) / 100;
    }
    return getSavingsBalance(plan.id);
  };

  const isGoalBoundedPlan = (plan, kind) => getPlanGoalAmount(plan, kind) > 0;

  const isPlanAchieved = (plan, kind) => {
    if (!isGoalBoundedPlan(plan, kind)) return false;
    return getPlanCumulativeAmount(plan, kind) >= getPlanGoalAmount(plan, kind);
  };

  const syncPlanCompletionFlags = () => {
    let changed = false;
    const today = new Date().toISOString().slice(0, 10);

    (accountingData.savings || []).forEach(plan => {
      if (isPlanAchieved(plan, 'savings')) {
        if (!plan.completedAt) {
          plan.completedAt = today;
          changed = true;
        }
      } else if (plan.completedAt) {
        delete plan.completedAt;
        changed = true;
      }
    });

    (accountingData.debts || []).forEach(plan => {
      if (isPlanAchieved(plan, 'debt')) {
        if (!plan.completedAt) {
          plan.completedAt = today;
          changed = true;
        }
      } else if (plan.completedAt) {
        delete plan.completedAt;
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem('accounting_data', JSON.stringify(accountingData));
    }
    return changed;
  };

  const getActiveSavings = () =>
    (accountingData.savings || []).filter(plan => !isPlanAchieved(plan, 'savings'));

  const getActiveDebts = () =>
    (accountingData.debts || []).filter(plan => !isPlanAchieved(plan, 'debt'));

  const getAchievedPlans = () => {
    const items = [];
    (accountingData.savings || []).forEach(plan => {
      if (isPlanAchieved(plan, 'savings')) items.push({ plan, kind: 'savings' });
    });
    (accountingData.debts || []).forEach(plan => {
      if (isPlanAchieved(plan, 'debt')) items.push({ plan, kind: 'debt' });
    });
    items.sort((a, b) => String(b.plan.completedAt || '').localeCompare(String(a.plan.completedAt || '')));
    return items;
  };

  const renderAchievementsPage = () => {
    if (!achievementsList || !emptyAchievements) return;
    syncPlanCompletionFlags();
    achievementsList.innerHTML = '';
    const items = getAchievedPlans();

    if (!items.length) {
      emptyAchievements.hidden = false;
      return;
    }

    emptyAchievements.hidden = true;
    items.forEach(({ plan, kind }) => {
      const goal = getPlanGoalAmount(plan, kind);
      const cumulative = getPlanCumulativeAmount(plan, kind);
      const modeMeta = getPlanModeMeta(plan.mode || (kind === 'debt' ? 'flexible_debt' : 'long_goal'));
      const tag = modeMeta ? modeMeta.tag : (kind === 'debt' ? '还钱' : '存钱');
      const metaLine = buildPlanMetaLine(plan, kind);
      const amountLine = kind === 'debt'
        ? `已还 ${formatCurrency(cumulative)} / 总额 ${formatCurrency(goal)}`
        : `已存 ${formatCurrency(cumulative)} / 目标 ${formatCurrency(goal)}`;
      const doneDate = plan.completedAt ? `完成于 ${plan.completedAt}` : '已达成';

      const el = document.createElement('article');
      el.className = `achievement-item is-${kind}`;
      el.setAttribute('role', 'button');
      el.tabIndex = 0;
      el.dataset.planId = plan.id;
      el.dataset.planKind = kind;
      el.setAttribute('aria-label', `编辑计划 ${plan.name}`);
      el.innerHTML = `
        <div class="achievement-item-top">
          <p class="goal-name">${escapeHtml(plan.name)}<span class="plan-mode-tag">${escapeHtml(tag)}</span></p>
          <span class="achievement-done-badge">已达成</span>
        </div>
        ${metaLine ? `<p class="plan-meta-line">${escapeHtml(metaLine)}</p>` : ''}
        <div class="achievement-item-foot">
          <span>${escapeHtml(amountLine)}</span>
          <span>${escapeHtml(doneDate)}</span>
        </div>
      `;
      const openEdit = () => openExistingPlanEdit(plan.id, kind);
      el.addEventListener('click', openEdit);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEdit();
        }
      });
      achievementsList.appendChild(el);
    });
  };

  const openAchievementsPage = () => {
    if (!achievementsPage) return;
    renderAchievementsPage();
    achievementsPage.classList.add('active');
    achievementsPage.setAttribute('aria-hidden', 'false');
  };

  const closeAchievementsPage = () => {
    if (!achievementsPage) return;
    achievementsPage.classList.remove('active');
    achievementsPage.setAttribute('aria-hidden', 'true');
  };

  const buildPlanMetaLine = (plan, kind) => {
    const meta = getPlanModeMeta(plan.mode);
    const parts = [];
    if (plan.fixedAmount > 0) {
      const freq = PLAN_FREQUENCY_LABEL[plan.frequency] || '每期';
      parts.push(`${freq}${formatCurrency(plan.fixedAmount)}`);
    }
    if (plan.installments > 0) {
      parts.push(`共 ${plan.installments} 期`);
      if (plan.fixedAmount > 0) {
        // already covered
      } else if (kind === 'debt' && plan.totalAmount > 0) {
        parts.push(`约每期 ${formatCurrency(plan.totalAmount / plan.installments)}`);
      }
    }
    if (plan.endDate) {
      parts.push(kind === 'debt' ? `目标还清 ${plan.endDate}` : `目标完成 ${plan.endDate}`);
    }
    if (plan.note) parts.push(plan.note);
    if (!parts.length && meta) return meta.hint.split('。')[0];
    return parts.join(' · ');
  };

  /** 按计划频率取当前周期 [start, end) */
  const getPlanPeriodBounds = (frequency, planStartISO, refDate = new Date()) => {
    const now = new Date(refDate);
    now.setHours(0, 0, 0, 0);
    const msDay = 86400000;

    if (frequency === 'weekly') {
      const d = new Date(now);
      const day = d.getDay();
      const diff = day === 0 ? 6 : day - 1;
      d.setDate(d.getDate() - diff);
      const start = d.getTime();
      return { start, end: start + 7 * msDay };
    }

    if (frequency === 'biweekly') {
      let anchor = planStartISO ? new Date(`${planStartISO}T00:00:00`) : new Date(now);
      if (Number.isNaN(anchor.getTime())) anchor = new Date(now);
      anchor.setHours(0, 0, 0, 0);
      const days = Math.floor((now.getTime() - anchor.getTime()) / msDay);
      const periodIndex = days >= 0 ? Math.floor(days / 14) : Math.ceil(days / 14) - 1;
      const start = anchor.getTime() + periodIndex * 14 * msDay;
      return { start, end: start + 14 * msDay };
    }

    const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
    return { start, end };
  };

  const getSavingsPeriodNet = (planId, frequency, planStartISO) => {
    const { start, end } = getPlanPeriodBounds(frequency || 'monthly', planStartISO);
    let net = 0;
    (accountingData.bills || []).forEach(bill => {
      const t = bill.timestamp;
      if (t < start || t >= end) return;
      const amount = parseFloat(bill.amount) || 0;
      if (bill.type === 'transfer' && bill.categoryId === planId) net += amount;
      else if (bill.type === 'expense' && bill.paidFromPlanId === planId) net -= amount;
    });
    return Math.round(net * 100) / 100;
  };

  const getDebtPeriodPaid = (debtId, frequency, planStartISO) => {
    const { start, end } = getPlanPeriodBounds(frequency || 'monthly', planStartISO);
    let paid = 0;
    (accountingData.bills || []).forEach(bill => {
      const t = bill.timestamp;
      if (t < start || t >= end) return;
      if (bill.categoryId === debtId) paid += parseFloat(bill.amount) || 0;
    });
    return Math.round(paid * 100) / 100;
  };

  /** 进度跟实际填写：总额优先，否则跟每期定额；都没有则不假装拉满 */
  const resolvePlanProgress = ({ kind, totalAmount, fixedAmount, frequency, startDate, cumulative, planId }) => {
    const hasTotal = totalAmount > 0;
    const hasFixed = fixedAmount > 0;
    const freqLabel = PLAN_FREQUENCY_LABEL[frequency] || '每期';

    if (hasTotal) {
      const raw = Math.round((cumulative / totalAmount) * 100) || 0;
      const percent = Math.min(100, Math.max(0, raw));
      return {
        percent,
        barWidth: percent,
        rightLabel: `${raw}%`,
        progressLabel: kind === 'debt'
          ? `已还 ${formatCurrency(cumulative)} / 总额 ${formatCurrency(totalAmount)}`
          : `已存 ${formatCurrency(cumulative)} / 目标 ${formatCurrency(totalAmount)}`
      };
    }

    if (hasFixed) {
      const periodAmount = kind === 'debt'
        ? Math.max(0, getDebtPeriodPaid(planId, frequency, startDate))
        : Math.max(0, getSavingsPeriodNet(planId, frequency, startDate));
      const raw = Math.round((periodAmount / fixedAmount) * 100) || 0;
      const percent = Math.min(100, Math.max(0, raw));
      const periodVerb = kind === 'debt' ? '本期已还' : '本期已存';
      return {
        percent,
        barWidth: percent,
        rightLabel: `${raw}%`,
        progressLabel: `${periodVerb} ${formatCurrency(periodAmount)} / ${freqLabel}${formatCurrency(fixedAmount)} · 累计 ${formatCurrency(cumulative)}`
      };
    }

    return {
      percent: null,
      barWidth: 0,
      rightLabel: '持续中',
      progressLabel: kind === 'debt'
        ? `已还 ${formatCurrency(cumulative)}`
        : `已存 ${formatCurrency(cumulative)}`
    };
  };

  const setFinancialPlanTab = (tab) => {
    financialPlanTab = tab === 'debt' ? 'debt' : 'savings';
    const isSavings = financialPlanTab === 'savings';
    if (financialTabSavings) {
      financialTabSavings.classList.toggle('active', isSavings);
      financialTabSavings.setAttribute('aria-selected', isSavings ? 'true' : 'false');
    }
    if (financialTabDebt) {
      financialTabDebt.classList.toggle('active', !isSavings);
      financialTabDebt.setAttribute('aria-selected', isSavings ? 'false' : 'true');
    }
    if (savingsOverviewEl) savingsOverviewEl.hidden = !isSavings;
    if (debtOverviewEl) debtOverviewEl.hidden = isSavings;
  };

  const bindPlanCardOpen = (el, planId, kind) => {
    const openEdit = () => openExistingPlanEdit(planId, kind);
    el.addEventListener('click', openEdit);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEdit();
      }
    });
  };

  const updateSavingsOverview = () => {
    const savingsList = document.getElementById('savingsList');
    const emptySavings = document.getElementById('emptySavings');
    if (!savingsList || !emptySavings) return;
    syncPlanCompletionFlags();

    savingsList.innerHTML = '';
    const activeSavings = getActiveSavings();

    if (activeSavings.length > 0) {
      emptySavings.hidden = true;

      activeSavings.forEach(goal => {
        const savedAmount = getSavingsBalance(goal.id);
        goal.savedAmount = savedAmount;

        const progress = resolvePlanProgress({
          kind: 'savings',
          totalAmount: goal.targetAmount,
          fixedAmount: goal.fixedAmount,
          frequency: goal.frequency,
          startDate: goal.startDate,
          cumulative: savedAmount,
          planId: goal.id
        });
        const color = goal.color || '#4CAF50';
        const modeMeta = getPlanModeMeta(goal.mode || 'long_goal');
        const tag = modeMeta ? modeMeta.tag : '存钱';
        const metaLine = buildPlanMetaLine(goal, 'savings');

        const goalEl = document.createElement('article');
        goalEl.className = 'accounting-card plan-overview-card is-savings';
        goalEl.setAttribute('role', 'button');
        goalEl.tabIndex = 0;
        goalEl.dataset.planId = goal.id;
        goalEl.dataset.planKind = 'savings';
        goalEl.setAttribute('aria-label', `编辑存钱计划 ${goal.name}`);
        goalEl.innerHTML = `
          <p class="goal-name">${escapeHtml(goal.name)}<span class="plan-mode-tag">${escapeHtml(tag)}</span><span class="plan-card-chevron" aria-hidden="true">›</span></p>
          ${metaLine ? `<p class="plan-meta-line">${escapeHtml(metaLine)}</p>` : ''}
          <div class="savings-progress-text">
            <span>${progress.progressLabel}</span>
            <span>${progress.rightLabel}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: ${progress.barWidth}%; background: ${color};"></div>
          </div>
        `;
        bindPlanCardOpen(goalEl, goal.id, 'savings');
        savingsList.appendChild(goalEl);
      });
    } else {
      emptySavings.hidden = false;
    }
  };

  const updateDebtOverview = () => {
    const debtList = document.getElementById('debtList');
    const emptyDebt = document.getElementById('emptyDebt');
    if (!debtList || !emptyDebt) return;
    syncPlanCompletionFlags();

    debtList.innerHTML = '';
    const activeDebts = getActiveDebts();

    if (activeDebts.length > 0) {
      emptyDebt.hidden = true;

      activeDebts.forEach(debt => {
        const paidAmount = accountingData.bills
          .filter(b => b.categoryId === debt.id)
          .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
        debt.paidAmount = paidAmount;

        const progress = resolvePlanProgress({
          kind: 'debt',
          totalAmount: debt.totalAmount,
          fixedAmount: debt.fixedAmount,
          frequency: debt.frequency,
          startDate: debt.startDate,
          cumulative: paidAmount,
          planId: debt.id
        });
        const color = debt.color || '#6366F1';
        const modeMeta = getPlanModeMeta(debt.mode || 'flexible_debt');
        const tag = modeMeta ? modeMeta.tag : '还钱';
        const metaLine = buildPlanMetaLine(debt, 'debt');

        const debtEl = document.createElement('article');
        debtEl.className = 'accounting-card plan-overview-card is-debt';
        debtEl.setAttribute('role', 'button');
        debtEl.tabIndex = 0;
        debtEl.dataset.planId = debt.id;
        debtEl.dataset.planKind = 'debt';
        debtEl.setAttribute('aria-label', `编辑还钱计划 ${debt.name}`);
        debtEl.innerHTML = `
          <p class="goal-name">${escapeHtml(debt.name)}<span class="plan-mode-tag">${escapeHtml(tag)}</span><span class="plan-card-chevron" aria-hidden="true">›</span></p>
          ${metaLine ? `<p class="plan-meta-line">${escapeHtml(metaLine)}</p>` : ''}
          <div class="debt-progress-text">
            <span>${progress.progressLabel}</span>
            <span>${progress.rightLabel}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: ${progress.barWidth}%; background: ${color};"></div>
          </div>
        `;
        bindPlanCardOpen(debtEl, debt.id, 'debt');
        debtList.appendChild(debtEl);
      });
    } else {
      emptyDebt.hidden = false;
    }
  };

  const openEditBillModal = (bill) => {
    editingBillId = bill.id;
    addBillModal.classList.add('active');
    addBillModal.setAttribute('aria-hidden', 'false');
    
    const titleEl = addBillModal.querySelector('.accounting-sheet-title');
    if (titleEl) titleEl.textContent = '编辑账单';
    
    billTypeTabs.forEach(t => t.classList.remove('active'));
    const targetTab = addBillModal
      ? addBillModal.querySelector(`.bill-type-tab[data-type="${bill.type}"]`)
      : null;
    if (targetTab) targetTab.classList.add('active');
    
    updateCategorySelect(bill.type);
    if (bill.categoryId && !Array.from(billCategorySelect.options).some(o => o.value === bill.categoryId)) {
      const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
      const missing = categoryList.find(c => c.id === bill.categoryId);
      if (missing) {
        const opt = document.createElement('option');
        opt.value = missing.id;
        opt.textContent = missing.name;
        billCategorySelect.appendChild(opt);
      }
    }
    billCategorySelect.value = bill.categoryId;
    
    billAmountInput.value = String(bill.amount);
    if (amountInputWrap) amountInputWrap.classList.add('is-active');
    
    const date = new Date(bill.timestamp);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    billTimeInput.value = date.toISOString().slice(0, 16);
    
    document.getElementById('billNote').value = bill.note || '';
    
    syncBillTypeUI(bill.type);
    if (bill.type === 'expense') {
      const includeCheckbox = document.getElementById('billIncludeBudget');
      if (includeCheckbox) includeCheckbox.checked = bill.includeInBudget !== false;
      const includeMonthlyCheckbox = document.getElementById('billIncludeMonthlyBudget');
      if (includeMonthlyCheckbox) {
        includeMonthlyCheckbox.checked = bill.includeInMonthlyBudget !== false;
      }
      syncBillPayFromSelect(bill.paidFromPlanId || '', bill.id);
    }

    // Handle delete button
    let deleteBtn = document.getElementById('deleteBillBtn');
    if (!deleteBtn) {
      deleteBtn = document.createElement('button');
      deleteBtn.id = 'deleteBillBtn';
      deleteBtn.type = 'button';
      deleteBtn.textContent = '删除';
      deleteBtn.style.backgroundColor = 'transparent';
      deleteBtn.style.color = 'var(--expense)';
      deleteBtn.style.border = '1px solid var(--expense)';
      deleteBtn.style.padding = '12px';
      deleteBtn.style.borderRadius = '12px';
      deleteBtn.style.fontSize = '16px';
      deleteBtn.style.fontWeight = '500';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.style.marginTop = '12px';
      
      deleteBtn.addEventListener('click', () => {
        if (confirm('确定删除这笔账单吗？')) {
          accountingData.bills = accountingData.bills.filter(b => b.id !== editingBillId);
          saveData();
          addBillModal.classList.remove('active');
          addBillModal.setAttribute('aria-hidden', 'true');
          
          if (accountingBillsView && accountingBillsView.classList.contains('active')) {
            if (typeof renderBillsView === 'function') renderBillsView();
          }
        }
      });
      
      const actionsDiv = document.querySelector('.accounting-sheet-actions');
      if (actionsDiv) {
        actionsDiv.style.display = 'flex';
        actionsDiv.style.flexDirection = 'column';
        actionsDiv.appendChild(deleteBtn);
      }
    }
    deleteBtn.style.display = 'block';
  };

  // Event Listeners
  if (balanceStatsWrapper && balanceSliderIndicators) {
    const indicators = balanceSliderIndicators.querySelectorAll('.indicator');
    balanceStatsWrapper.addEventListener('scroll', () => {
      const scrollLeft = balanceStatsWrapper.scrollLeft;
      const width = balanceStatsWrapper.clientWidth;
      const index = Math.round(scrollLeft / width);
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });
    });
  }

  navAddBill.addEventListener('click', () => {
    editingBillId = null;
    const titleEl = addBillModal.querySelector('.accounting-sheet-title');
    if (titleEl) titleEl.textContent = '记一笔';

    addBillModal.classList.add('active');
    addBillModal.setAttribute('aria-hidden', 'false');
    
    // Hide delete button if it exists
    const deleteBtn = document.getElementById('deleteBillBtn');
    if (deleteBtn) deleteBtn.style.display = 'none';

    // Set default time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    billTimeInput.value = now.toISOString().slice(0, 16);
    
    // Reset to expense and show the include budget row
    billTypeTabs.forEach(t => t.classList.remove('active'));
    const expenseTab = addBillModal
      ? addBillModal.querySelector('.bill-type-tab[data-type="expense"]')
      : null;
    if (expenseTab) expenseTab.classList.add('active');
    updateCategorySelect('expense');
    syncBillTypeUI('expense');
    syncBillPayFromSelect('');
    
    billAmountInput.value = '';
    document.getElementById('billNote').value = '';
    if (amountInputWrap) amountInputWrap.classList.add('is-active');
  });

  addBillCancel.addEventListener('click', () => {
    addBillModal.classList.remove('active');
    addBillModal.setAttribute('aria-hidden', 'true');
  });

  addBillModal.addEventListener('click', (e) => {
    if (e.target === addBillModal) {
      addBillModal.classList.remove('active');
      addBillModal.setAttribute('aria-hidden', 'true');
    }
  });
  
  // Budget Settings Page
  const budgetCard = document.getElementById('budgetCard');
  const budgetSettingsPage = document.getElementById('budgetSettingsPage');
  const budgetPeriodEditPage = document.getElementById('budgetPeriodEditPage');
  const budgetSettingsForm = document.getElementById('budgetSettingsForm');
  const budgetSettingsBack = document.getElementById('budgetSettingsBack');
  const budgetPeriodEditBack = document.getElementById('budgetPeriodEditBack');
  const budgetPeriodEditTitle = document.getElementById('budgetPeriodEditTitle');
  const budgetTypeList = document.getElementById('budgetTypeList');
  const budgetAmountInput = document.getElementById('budgetAmountInput');
  const budgetAmountLabel = document.getElementById('budgetAmountLabel');
  const budgetDailyAmountInput = document.getElementById('budgetDailyAmountInput');
  const budgetMonthlyAmountInput = document.getElementById('budgetMonthlyAmountInput');
  const budgetSingleAmountField = document.getElementById('budgetSingleAmountField');
  const budgetHybridAmountsField = document.getElementById('budgetHybridAmountsField');
  const budgetPeriodHint = document.getElementById('budgetPeriodHint');
  const categoryBudgetHint = document.getElementById('categoryBudgetHint');
  const categoryBudgetField = document.getElementById('categoryBudgetField');
  const budgetGroupsField = document.getElementById('budgetGroupsField');
  const budgetGroupsList = document.getElementById('budgetGroupsList');
  const addBudgetGroupBtn = document.getElementById('addBudgetGroupBtn');
  const hybridDailyEnabledSwitch = document.getElementById('hybridDailyEnabledSwitch');
  const hybridMonthlyEnabledSwitch = document.getElementById('hybridMonthlyEnabledSwitch');
  const hybridDailySettings = document.getElementById('hybridDailySettings');
  const hybridMonthlySettings = document.getElementById('hybridMonthlySettings');
  const hybridDailyCategoryList = document.getElementById('hybridDailyCategoryList');
  const hybridMonthlyCategoryList = document.getElementById('hybridMonthlyCategoryList');
  const budgetGroupEditModal = document.getElementById('budgetGroupEditModal');
  const budgetGroupEditTitle = document.getElementById('budgetGroupEditTitle');
  const budgetGroupEditCancel = document.getElementById('budgetGroupEditCancel');
  const budgetGroupNameInput = document.getElementById('budgetGroupNameInput');
  const budgetGroupAmountInput = document.getElementById('budgetGroupAmountInput');
  const budgetGroupCategoryList = document.getElementById('budgetGroupCategoryList');
  const budgetGroupSaveBtn = document.getElementById('budgetGroupSaveBtn');
  const budgetGroupDeleteBtn = document.getElementById('budgetGroupDeleteBtn');
  const budgetResetTimeField = document.getElementById('budgetResetTimeField');
  const budgetResetTimeInput = document.getElementById('budgetResetTimeInput');
  const categoryBudgetList = document.getElementById('categoryBudgetList');
  const addCategoryBudgetBtn = document.getElementById('addCategoryBudgetBtn');
  const categoryBudgetPickerModal = document.getElementById('categoryBudgetPickerModal');
  const categoryBudgetPickerCancel = document.getElementById('categoryBudgetPickerCancel');
  const categoryBudgetPickerList = document.getElementById('categoryBudgetPickerList');
  const categoryBudgetPickerEmpty = document.getElementById('categoryBudgetPickerEmpty');
  let draftBudgetPeriod = 'daily';
  let draftCategoryBudgetIds = [];
  let draftCategoryBudgetValues = {};
  let draftCategoryBudgetIncluded = {};
  let draftBudgetGroups = [];
  let draftHybridDailyEnabled = false;
  let draftHybridMonthlyEnabled = false;
  let draftHybridDailyCategories = [];
  let draftHybridMonthlyCategories = [];
  let editingBudgetGroupId = null;
  const CATEGORY_BUDGET_DIAL_CIRCUMFERENCE = 2 * Math.PI * 16;
  const categoryBudgetSelectAll = document.getElementById('categoryBudgetSelectAll');

  const formatCategoryBudgetDialValue = (raw) => {
    const parsed = parseFloat(raw);
    if (raw == null || raw === '' || isNaN(parsed) || parsed <= 0) return '设置';
    if (parsed >= 1000) {
      const inK = parsed / 1000;
      return inK >= 10 ? `${Math.round(inK)}k` : `${inK.toFixed(1).replace(/\.0$/, '')}k`;
    }
    if (parsed >= 100) return String(Math.round(parsed));
    return parsed % 1 === 0 ? String(parsed) : parsed.toFixed(1);
  };

  const formatBudgetAmountShort = (amount) => {
    const parsed = parseFloat(amount) || 0;
    return parsed % 1 === 0 ? parsed.toFixed(0) : parsed.toFixed(2);
  };

  const formatCategoryBudgetSummary = () => {
    if ((accountingData.settings.budgetPeriod || 'daily') === 'hybrid') {
      const parts = [];
      if (isHybridDailyEnabled()) {
        parts.push(`今日 ¥${formatBudgetAmountShort(accountingData.settings.dailyBudget)}`);
      }
      if (isHybridMonthlyEnabled()) {
        parts.push(`本月 ¥${formatBudgetAmountShort(accountingData.settings.monthlyBudget)}`);
      }
      const groups = accountingData.settings.budgetGroups || [];
      if (groups.length > 0) {
        const groupParts = groups.slice(0, 2).map(group =>
          `${group.name} ¥${formatBudgetAmountShort(group.amount)}`
        );
        if (groups.length > 2) groupParts.push(`等${groups.length}组`);
        parts.push(groupParts.join(' · '));
      }
      return parts.length ? parts.join(' · ') : '未启用任何模块';
    }
    const categoryBudgets = accountingData.settings.categoryBudgets || {};
    const cats = getExpenseCategories().filter(cat => parseFloat(categoryBudgets[cat.id]) > 0);
    if (!cats.length) return '未设置分类预算';
    const parts = cats.slice(0, 3).map(cat => {
      const amount = parseFloat(categoryBudgets[cat.id]) || 0;
      return `${cat.name} ¥${formatBudgetAmountShort(amount)}`;
    });
    if (cats.length > 3) parts.push(`等${cats.length}项`);
    return parts.join(' · ');
  };

  const collectHybridCategoryDraft = (listEl) => {
    if (!listEl) return [];
    return Array.from(listEl.querySelectorAll('input[data-hybrid-category-id]:checked'))
      .map(input => input.dataset.hybridCategoryId);
  };

  const renderHybridCategoryChecklist = (listEl, selectedIds) => {
    if (!listEl) return;
    const selected = new Set(selectedIds || []);
    listEl.innerHTML = '';
    getExpenseCategories().forEach(cat => {
      const label = document.createElement('label');
      label.className = 'budget-group-category-item';
      label.innerHTML = `
        <input type="checkbox" class="category-budget-check-input"
          data-hybrid-category-id="${cat.id}"
          ${selected.has(cat.id) ? 'checked' : ''}
          aria-label="${cat.name}">
        <span class="category-budget-check" aria-hidden="true"></span>
        <span class="budget-group-category-name">${cat.name}</span>
      `;
      listEl.appendChild(label);
    });
  };

  const syncHybridModuleUI = () => {
    if (hybridDailyEnabledSwitch) hybridDailyEnabledSwitch.checked = draftHybridDailyEnabled;
    if (hybridMonthlyEnabledSwitch) hybridMonthlyEnabledSwitch.checked = draftHybridMonthlyEnabled;
    if (hybridDailySettings) hybridDailySettings.hidden = !draftHybridDailyEnabled;
    if (hybridMonthlySettings) hybridMonthlySettings.hidden = !draftHybridMonthlyEnabled;
    const showReset = draftBudgetPeriod === 'daily' || (draftBudgetPeriod === 'hybrid' && draftHybridDailyEnabled);
    if (budgetResetTimeField) budgetResetTimeField.hidden = !showReset;
  };

  const renderBudgetGroupsList = () => {
    if (!budgetGroupsList) return;
    const expenseById = Object.fromEntries(getExpenseCategories().map(cat => [cat.id, cat]));
    budgetGroupsList.innerHTML = '';

    draftBudgetGroups.forEach(group => {
      const catNames = (group.categoryIds || [])
        .map(id => expenseById[id]?.name)
        .filter(Boolean);
      const splitCount = Object.keys(group.categoryAmounts || {}).length;
      let meta = catNames.length
        ? (catNames.length <= 3 ? catNames.join('、') : `${catNames.slice(0, 2).join('、')}等${catNames.length}项`)
        : '未选分类';
      if (splitCount > 0) meta += ` · ${splitCount}项单独限额`;
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'budget-group-row';
      row.dataset.groupId = group.id;
      row.innerHTML = `
        <div class="budget-group-row-main">
          <span class="budget-group-row-name">${group.name}</span>
          <span class="budget-group-row-amount">${formatCurrency(group.amount || 0)}</span>
        </div>
        <span class="budget-group-row-meta">${meta}</span>
      `;
      budgetGroupsList.appendChild(row);
    });
  };

  const activateBudgetPeriod = (period) => {
    if (!BUDGET_PERIOD_META[period]) return false;
    const current = accountingData.settings.budgetPeriod || 'daily';
    if (current === period) {
      renderBudgetTypeCards();
      return false;
    }

    accountingData.settings.budgetPeriod = period;
    if (period === 'hybrid') {
      const hasAny = !!accountingData.settings.hybridDailyEnabled
        || !!accountingData.settings.hybridMonthlyEnabled
        || (accountingData.settings.budgetGroups || []).length > 0;
      if (!hasAny) {
        accountingData.settings.hybridDailyEnabled = true;
        accountingData.settings.hybridMonthlyEnabled = true;
      }
    }

    normalizeBudgetSettings();
    saveData();
    renderBudgetTypeCards();
    return true;
  };

  const renderBudgetTypeCards = () => {
    if (!budgetTypeList) return;
    normalizeBudgetSettings();
    const activePeriod = accountingData.settings.budgetPeriod || 'daily';
    const categorySummary = formatCategoryBudgetSummary();
    const total = parseFloat(accountingData.settings.totalBudget) || 0;

    budgetTypeList.querySelectorAll('.budget-type-card').forEach(card => {
      const period = card.dataset.period;
      const isActive = period === activePeriod;
      const amountEl = card.querySelector('[data-amount]');
      const metaEl = card.querySelector('[data-meta]');
      const badgeEl = card.querySelector('[data-badge]');
      const selectInput = card.querySelector('[data-period-select]');

      card.classList.toggle('is-active', isActive);
      if (badgeEl) badgeEl.hidden = !isActive;
      if (selectInput) selectInput.checked = isActive;

      if (!isActive) {
        if (amountEl) amountEl.textContent = '未启用';
        if (metaEl) metaEl.textContent = '点击进入设置';
        return;
      }

      if (period === 'hybrid') {
        if (amountEl) amountEl.textContent = categorySummary || '未启用任何模块';
        if (metaEl) metaEl.textContent = '点击进入设置';
      } else {
        if (amountEl) amountEl.textContent = formatCurrency(total);
        if (metaEl) metaEl.textContent = categorySummary || '点击进入设置';
      }
    });
  };

  const syncBudgetPeriodUI = (period) => {
    draftBudgetPeriod = period;
    const isHybrid = period === 'hybrid';
    const meta = BUDGET_PERIOD_META[period] || BUDGET_PERIOD_META.daily;
    if (budgetPeriodEditTitle) budgetPeriodEditTitle.textContent = meta.title || '预算设置';
    if (budgetAmountLabel) budgetAmountLabel.textContent = meta.amountLabel;
    if (budgetSingleAmountField) budgetSingleAmountField.hidden = isHybrid;
    if (budgetHybridAmountsField) budgetHybridAmountsField.hidden = !isHybrid;
    if (budgetPeriodHint) budgetPeriodHint.hidden = !isHybrid;
    if (categoryBudgetField) categoryBudgetField.hidden = isHybrid;
    if (budgetGroupsField) budgetGroupsField.hidden = !isHybrid;
    if (categoryBudgetHint) {
      categoryBudgetHint.textContent = '未添加时全部支出计入总预算；添加后勾选的分类才计入，并可单独设限。';
    }
    if (isHybrid) {
      if (budgetPeriodHint) {
        budgetPeriodHint.textContent = '混合：今日、本月、分组可独立开关；只开你需要的模块。';
      }
      syncHybridModuleUI();
    } else {
      if (budgetResetTimeField) budgetResetTimeField.hidden = period !== 'daily';
    }
  };

  const getExpenseCategories = () => {
    const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
    return categoryList.filter(cat => cat.type === 'expense' && !cat.isPlan);
  };

  const collectCategoryBudgetDraftValues = () => {
    if (!categoryBudgetList) return;
    categoryBudgetList.querySelectorAll('input.category-budget-dial-input[data-category-id]').forEach(input => {
      draftCategoryBudgetValues[input.dataset.categoryId] = input.value;
    });
    categoryBudgetList.querySelectorAll('input[data-include-category-id]').forEach(input => {
      draftCategoryBudgetIncluded[input.dataset.includeCategoryId] = input.checked;
    });
  };

  const syncCategoryBudgetSelectAll = () => {
    if (!categoryBudgetSelectAll) return;
    const total = draftCategoryBudgetIds.length;
    const includedCount = draftCategoryBudgetIds.filter(id => draftCategoryBudgetIncluded[id]).length;
    categoryBudgetSelectAll.checked = total > 0 && includedCount === total;
    categoryBudgetSelectAll.indeterminate = includedCount > 0 && includedCount < total;
    categoryBudgetSelectAll.disabled = total === 0;
  };

  const setCategoryBudgetDialProgress = (dial, raw) => {
    if (!dial) return;
    const fill = dial.querySelector('.category-budget-dial-fill');
    const parsed = parseFloat(raw);
    const hasValue = raw != null && raw !== '' && !isNaN(parsed) && parsed > 0;
    dial.classList.toggle('is-empty', !hasValue);
    if (fill) {
      const offset = hasValue ? 0 : CATEGORY_BUDGET_DIAL_CIRCUMFERENCE;
      fill.style.strokeDasharray = `${CATEGORY_BUDGET_DIAL_CIRCUMFERENCE}`;
      fill.style.strokeDashoffset = `${offset}`;
    }
  };

  const exitCategoryBudgetDialEdit = (dial) => {
    if (!dial) return;
    const input = dial.querySelector('.category-budget-dial-input');
    const valueBtn = dial.querySelector('.category-budget-dial-value');
    if (!input || !valueBtn) return;
    draftCategoryBudgetValues[input.dataset.categoryId] = input.value;
    valueBtn.textContent = formatCategoryBudgetDialValue(input.value);
    setCategoryBudgetDialProgress(dial, input.value);
    dial.classList.remove('is-editing');
  };

  const enterCategoryBudgetDialEdit = (dial) => {
    if (!dial || !categoryBudgetList) return;
    categoryBudgetList.querySelectorAll('.category-budget-dial.is-editing').forEach(other => {
      if (other !== dial) exitCategoryBudgetDialEdit(other);
    });
    const input = dial.querySelector('.category-budget-dial-input');
    if (!input) return;
    dial.dataset.editOrigin = input.value;
    dial.classList.add('is-editing');
    input.focus();
    input.select();
  };

  const renderCategoryBudgetInputs = () => {
    if (!categoryBudgetList) return;
    collectCategoryBudgetDraftValues();
    const expenseCategories = getExpenseCategories();
    const byId = Object.fromEntries(expenseCategories.map(cat => [cat.id, cat]));
    categoryBudgetList.innerHTML = '';

    draftCategoryBudgetIds = draftCategoryBudgetIds.filter(id => byId[id]);

    draftCategoryBudgetIds.forEach(catId => {
      const cat = byId[catId];
      if (!cat) return;
      const raw = draftCategoryBudgetValues[cat.id];
      const parsed = parseFloat(raw);
      const displayValue = raw != null && raw !== '' && !isNaN(parsed) && parsed > 0 ? parsed : '';
      const included = draftCategoryBudgetIncluded[cat.id] !== false;
      draftCategoryBudgetIncluded[cat.id] = included;
      const row = document.createElement('div');
      row.className = 'category-budget-row';
      row.innerHTML = `
        <label class="category-budget-include" title="计入总预算">
          <input type="checkbox" class="category-budget-check-input"
            data-include-category-id="${cat.id}"
            ${included ? 'checked' : ''}
            aria-label="计入${cat.name}到总预算">
          <span class="category-budget-check" aria-hidden="true"></span>
        </label>
        <span class="category-budget-name">${cat.name}</span>
        <div class="category-budget-dial${displayValue === '' ? ' is-empty' : ''}" data-dial-category-id="${cat.id}">
          <svg class="category-budget-dial-ring" viewBox="0 0 40 40" aria-hidden="true">
            <circle class="category-budget-dial-track" cx="20" cy="20" r="16"></circle>
            <circle class="category-budget-dial-fill" cx="20" cy="20" r="16"
              stroke-dasharray="${CATEGORY_BUDGET_DIAL_CIRCUMFERENCE}"
              stroke-dashoffset="${displayValue === '' ? CATEGORY_BUDGET_DIAL_CIRCUMFERENCE : 0}"></circle>
          </svg>
          <button type="button" class="category-budget-dial-value" aria-label="修改${cat.name}预算金额">
            ${formatCategoryBudgetDialValue(displayValue)}
          </button>
          <input type="number" class="category-budget-dial-input" step="0.01" min="0" placeholder="0"
            data-category-id="${cat.id}"
            value="${displayValue}"
            aria-label="${cat.name}预算金额">
        </div>
        <button type="button" class="category-budget-remove-btn" data-remove-category-id="${cat.id}" aria-label="移除${cat.name}">&times;</button>
      `;
      categoryBudgetList.appendChild(row);
    });

    syncCategoryBudgetSelectAll();
  };

  const closeCategoryBudgetPicker = () => {
    if (!categoryBudgetPickerModal) return;
    categoryBudgetPickerModal.classList.remove('active');
    categoryBudgetPickerModal.setAttribute('aria-hidden', 'true');
  };

  const renderCategoryBudgetPicker = () => {
    if (!categoryBudgetPickerList) return;
    const available = getExpenseCategories().filter(cat => !draftCategoryBudgetIds.includes(cat.id));
    categoryBudgetPickerList.innerHTML = '';

    if (categoryBudgetPickerEmpty) {
      categoryBudgetPickerEmpty.hidden = available.length > 0;
    }

    available.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'category-budget-picker-item';
      btn.dataset.categoryId = cat.id;
      btn.innerHTML = `
        <span>${cat.name}</span>
        <span class="category-budget-picker-item-hint">添加</span>
      `;
      categoryBudgetPickerList.appendChild(btn);
    });
  };

  const openCategoryBudgetPicker = () => {
    if (!categoryBudgetPickerModal) return;
    collectCategoryBudgetDraftValues();
    renderCategoryBudgetPicker();
    categoryBudgetPickerModal.classList.add('active');
    categoryBudgetPickerModal.setAttribute('aria-hidden', 'false');
  };

  const closeBudgetGroupEditModal = () => {
    editingBudgetGroupId = null;
    if (!budgetGroupEditModal) return;
    budgetGroupEditModal.classList.remove('active');
    budgetGroupEditModal.setAttribute('aria-hidden', 'true');
  };

  const renderBudgetGroupCategoryPicker = (currentGroupId) => {
    if (!budgetGroupCategoryList) return;
    const takenByOther = new Set();
    draftBudgetGroups.forEach(group => {
      if (group.id === currentGroupId) return;
      (group.categoryIds || []).forEach(id => takenByOther.add(id));
    });
    const current = draftBudgetGroups.find(group => group.id === currentGroupId);
    const selected = new Set(current ? current.categoryIds || [] : []);
    const amounts = current && current.categoryAmounts ? current.categoryAmounts : {};

    budgetGroupCategoryList.innerHTML = '';
    getExpenseCategories().forEach(cat => {
      const taken = takenByOther.has(cat.id);
      const isSelected = selected.has(cat.id);
      const amountVal = parseFloat(amounts[cat.id]);
      const amountDisplay = !isNaN(amountVal) && amountVal > 0 ? amountVal : '';
      const row = document.createElement('div');
      row.className = `budget-group-category-item${taken ? ' is-taken' : ''}`;
      row.innerHTML = `
        <label class="budget-group-category-check">
          <input type="checkbox" class="category-budget-check-input"
            data-group-category-id="${cat.id}"
            ${isSelected ? 'checked' : ''}
            ${taken ? 'disabled' : ''}
            aria-label="${cat.name}">
          <span class="category-budget-check" aria-hidden="true"></span>
          <span class="budget-group-category-name">${cat.name}</span>
        </label>
        ${taken
          ? '<span class="budget-group-category-taken">已在其他组</span>'
          : `<input type="number" class="budget-group-category-amount" step="0.01" min="0"
              data-group-category-amount-id="${cat.id}"
              placeholder="限额"
              value="${amountDisplay}"
              ${isSelected ? '' : 'disabled'}
              aria-label="${cat.name}单独限额">`}
      `;
      budgetGroupCategoryList.appendChild(row);
    });
  };

  if (budgetGroupCategoryList) {
    budgetGroupCategoryList.addEventListener('change', (e) => {
      const check = e.target.closest('input[data-group-category-id]');
      if (!check) return;
      const amountInput = budgetGroupCategoryList.querySelector(
        `input[data-group-category-amount-id="${check.dataset.groupCategoryId}"]`
      );
      if (amountInput) {
        amountInput.disabled = !check.checked;
        if (!check.checked) amountInput.value = '';
      }
    });
  }

  const openBudgetGroupEditModal = (groupId = null) => {
    if (!budgetGroupEditModal) return;
    editingBudgetGroupId = groupId;
    const existing = groupId
      ? draftBudgetGroups.find(group => group.id === groupId)
      : null;
    if (budgetGroupEditTitle) {
      budgetGroupEditTitle.textContent = existing ? '编辑分组' : '添加分组';
    }
    if (budgetGroupNameInput) budgetGroupNameInput.value = existing ? existing.name : '';
    if (budgetGroupAmountInput) {
      budgetGroupAmountInput.value = existing && existing.amount > 0 ? existing.amount : '';
    }
    if (budgetGroupDeleteBtn) budgetGroupDeleteBtn.hidden = !existing;
    renderBudgetGroupCategoryPicker(groupId);
    budgetGroupEditModal.classList.add('active');
    budgetGroupEditModal.setAttribute('aria-hidden', 'false');
    if (budgetGroupNameInput) budgetGroupNameInput.focus();
  };

  const saveBudgetGroupFromModal = () => {
    const name = budgetGroupNameInput ? budgetGroupNameInput.value.trim() : '';
    const amount = parseFloat(budgetGroupAmountInput && budgetGroupAmountInput.value);
    if (!name) {
      alert('请填写分组名称');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert('请填写有效的分组预算金额');
      return;
    }

    const categoryIds = [];
    const categoryAmounts = {};
    if (budgetGroupCategoryList) {
      budgetGroupCategoryList.querySelectorAll('input[data-group-category-id]:checked:not(:disabled)').forEach(input => {
        const catId = input.dataset.groupCategoryId;
        categoryIds.push(catId);
        const amountInput = budgetGroupCategoryList.querySelector(
          `input[data-group-category-amount-id="${catId}"]`
        );
        const catAmount = parseFloat(amountInput && amountInput.value);
        if (!isNaN(catAmount) && catAmount > 0) categoryAmounts[catId] = catAmount;
      });
    }

    const nextGroup = { name, amount, categoryIds, categoryAmounts };
    if (editingBudgetGroupId) {
      const index = draftBudgetGroups.findIndex(group => group.id === editingBudgetGroupId);
      if (index >= 0) {
        draftBudgetGroups[index] = {
          ...draftBudgetGroups[index],
          ...nextGroup
        };
      }
    } else {
      draftBudgetGroups.push({
        id: `bg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        ...nextGroup
      });
    }

    renderBudgetGroupsList();
    closeBudgetGroupEditModal();
  };

  const deleteBudgetGroupFromModal = () => {
    if (!editingBudgetGroupId) return;
    if (!confirm('确定删除该预算分组？')) return;
    draftBudgetGroups = draftBudgetGroups.filter(group => group.id !== editingBudgetGroupId);
    renderBudgetGroupsList();
    closeBudgetGroupEditModal();
  };

  const openBudgetPeriodEditPage = (period) => {
    normalizeBudgetSettings();
    const nextPeriod = BUDGET_PERIOD_META[period] ? period : 'daily';

    draftBudgetGroups = (accountingData.settings.budgetGroups || []).map((group, index) =>
      normalizeBudgetGroup(group, index)
    ).filter(Boolean);
    draftHybridDailyEnabled = !!accountingData.settings.hybridDailyEnabled;
    draftHybridMonthlyEnabled = !!accountingData.settings.hybridMonthlyEnabled;
    draftHybridDailyCategories = [...(accountingData.settings.hybridDailyCategories || [])];
    draftHybridMonthlyCategories = [...(accountingData.settings.hybridMonthlyCategories || [])];

    syncBudgetPeriodUI(nextPeriod);
    if (budgetAmountInput) budgetAmountInput.value = accountingData.settings.totalBudget;
    if (budgetDailyAmountInput) budgetDailyAmountInput.value = accountingData.settings.dailyBudget;
    if (budgetMonthlyAmountInput) budgetMonthlyAmountInput.value = accountingData.settings.monthlyBudget;
    if (budgetResetTimeInput) budgetResetTimeInput.value = accountingData.settings.resetHour;

    const categoryBudgets = accountingData.settings.categoryBudgets || {};
    const budgetCategories = accountingData.settings.budgetCategories || [];
    draftCategoryBudgetValues = { ...categoryBudgets };
    draftCategoryBudgetIds = getExpenseCategories()
      .filter(cat => parseFloat(categoryBudgets[cat.id]) > 0)
      .map(cat => cat.id);
    draftCategoryBudgetIncluded = {};
    draftCategoryBudgetIds.forEach(id => {
      draftCategoryBudgetIncluded[id] = budgetCategories.includes(id);
    });

    renderCategoryBudgetInputs();
    renderBudgetGroupsList();
    renderHybridCategoryChecklist(hybridDailyCategoryList, draftHybridDailyCategories);
    renderHybridCategoryChecklist(hybridMonthlyCategoryList, draftHybridMonthlyCategories);
    syncHybridModuleUI();
    if (budgetPeriodEditPage) {
      budgetPeriodEditPage.classList.add('active');
      budgetPeriodEditPage.setAttribute('aria-hidden', 'false');
    }
  };

  const closeBudgetPeriodEditPage = () => {
    closeCategoryBudgetPicker();
    closeBudgetGroupEditModal();
    if (budgetPeriodEditPage) {
      budgetPeriodEditPage.classList.remove('active');
      budgetPeriodEditPage.setAttribute('aria-hidden', 'true');
    }
  };

  const openBudgetSettingsPage = () => {
    normalizeBudgetSettings();
    renderBudgetTypeCards();
    closeBudgetPeriodEditPage();
    budgetSettingsPage.classList.add('active');
    budgetSettingsPage.setAttribute('aria-hidden', 'false');
  };

  const closeBudgetSettingsPage = () => {
    closeBudgetPeriodEditPage();
    budgetSettingsPage.classList.remove('active');
    budgetSettingsPage.setAttribute('aria-hidden', 'true');
  };

  budgetCard.addEventListener('click', openBudgetSettingsPage);
  budgetSettingsBack.addEventListener('click', closeBudgetSettingsPage);
  if (budgetPeriodEditBack) {
    budgetPeriodEditBack.addEventListener('click', () => {
      closeBudgetPeriodEditPage();
      renderBudgetTypeCards();
    });
  }
  if (budgetTypeList) {
    budgetTypeList.addEventListener('change', (e) => {
      const input = e.target.closest('[data-period-select]');
      if (!input || !budgetTypeList.contains(input)) return;
      activateBudgetPeriod(input.value || input.dataset.periodSelect);
    });

    budgetTypeList.addEventListener('click', (e) => {
      if (e.target.closest('.budget-type-card-select')) return;
      const body = e.target.closest('.budget-type-card-body');
      if (!body) return;
      const card = body.closest('.budget-type-card');
      if (!card || !budgetTypeList.contains(card)) return;
      openBudgetPeriodEditPage(card.dataset.period);
    });
  }

  if (addCategoryBudgetBtn) {
    addCategoryBudgetBtn.addEventListener('click', openCategoryBudgetPicker);
  }

  if (categoryBudgetPickerCancel) {
    categoryBudgetPickerCancel.addEventListener('click', closeCategoryBudgetPicker);
  }

  if (categoryBudgetPickerModal) {
    categoryBudgetPickerModal.addEventListener('click', (e) => {
      if (e.target === categoryBudgetPickerModal) closeCategoryBudgetPicker();
    });
  }

  if (categoryBudgetPickerList) {
    categoryBudgetPickerList.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-category-id]');
      if (!btn) return;
      const catId = btn.dataset.categoryId;
      if (!catId || draftCategoryBudgetIds.includes(catId)) return;
      draftCategoryBudgetIds.push(catId);
      if (draftCategoryBudgetValues[catId] == null) {
        draftCategoryBudgetValues[catId] = '';
      }
      draftCategoryBudgetIncluded[catId] = true;
      renderCategoryBudgetInputs();
      closeCategoryBudgetPicker();
      const dial = categoryBudgetList && categoryBudgetList.querySelector(`[data-dial-category-id="${catId}"]`);
      if (dial) enterCategoryBudgetDialEdit(dial);
    });
  }

  if (categoryBudgetSelectAll) {
    categoryBudgetSelectAll.addEventListener('change', () => {
      const checked = categoryBudgetSelectAll.checked;
      draftCategoryBudgetIds.forEach(id => {
        draftCategoryBudgetIncluded[id] = checked;
      });
      if (categoryBudgetList) {
        categoryBudgetList.querySelectorAll('input[data-include-category-id]').forEach(input => {
          input.checked = checked;
        });
      }
      categoryBudgetSelectAll.indeterminate = false;
    });
  }

  if (categoryBudgetList) {
    categoryBudgetList.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-category-id]');
      if (removeBtn) {
        const catId = removeBtn.dataset.removeCategoryId;
        collectCategoryBudgetDraftValues();
        draftCategoryBudgetIds = draftCategoryBudgetIds.filter(id => id !== catId);
        delete draftCategoryBudgetValues[catId];
        delete draftCategoryBudgetIncluded[catId];
        renderCategoryBudgetInputs();
        return;
      }

      const valueBtn = e.target.closest('.category-budget-dial-value');
      if (valueBtn) {
        const dial = valueBtn.closest('.category-budget-dial');
        if (dial) enterCategoryBudgetDialEdit(dial);
      }
    });

    categoryBudgetList.addEventListener('change', (e) => {
      const includeInput = e.target.closest('input[data-include-category-id]');
      if (!includeInput) return;
      draftCategoryBudgetIncluded[includeInput.dataset.includeCategoryId] = includeInput.checked;
      syncCategoryBudgetSelectAll();
    });

    categoryBudgetList.addEventListener('input', (e) => {
      const dialInput = e.target.closest('input.category-budget-dial-input');
      if (!dialInput) return;
      const dial = dialInput.closest('.category-budget-dial');
      draftCategoryBudgetValues[dialInput.dataset.categoryId] = dialInput.value;
      setCategoryBudgetDialProgress(dial, dialInput.value);
    });

    categoryBudgetList.addEventListener('focusout', (e) => {
      const dial = e.target.closest('.category-budget-dial');
      if (!dial || !dial.classList.contains('is-editing')) return;
      if (dial.contains(e.relatedTarget)) return;
      exitCategoryBudgetDialEdit(dial);
    });

    categoryBudgetList.addEventListener('keydown', (e) => {
      const dialInput = e.target.closest('input.category-budget-dial-input');
      if (!dialInput) return;
      const dial = dialInput.closest('.category-budget-dial');
      if (e.key === 'Enter') {
        e.preventDefault();
        exitCategoryBudgetDialEdit(dial);
        dialInput.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        dialInput.value = dial && dial.dataset.editOrigin != null ? dial.dataset.editOrigin : '';
        exitCategoryBudgetDialEdit(dial);
        dialInput.blur();
      }
    });
  }

  if (addBudgetGroupBtn) {
    addBudgetGroupBtn.addEventListener('click', () => openBudgetGroupEditModal(null));
  }

  if (hybridDailyEnabledSwitch) {
    hybridDailyEnabledSwitch.addEventListener('change', () => {
      draftHybridDailyEnabled = hybridDailyEnabledSwitch.checked;
      syncHybridModuleUI();
    });
  }

  if (hybridMonthlyEnabledSwitch) {
    hybridMonthlyEnabledSwitch.addEventListener('change', () => {
      draftHybridMonthlyEnabled = hybridMonthlyEnabledSwitch.checked;
      syncHybridModuleUI();
    });
  }

  if (budgetGroupsList) {
    budgetGroupsList.addEventListener('click', (e) => {
      const row = e.target.closest('[data-group-id]');
      if (!row || !budgetGroupsList.contains(row)) return;
      openBudgetGroupEditModal(row.dataset.groupId);
    });
  }

  if (budgetGroupEditCancel) {
    budgetGroupEditCancel.addEventListener('click', closeBudgetGroupEditModal);
  }

  if (budgetGroupEditModal) {
    budgetGroupEditModal.addEventListener('click', (e) => {
      if (e.target === budgetGroupEditModal) closeBudgetGroupEditModal();
    });
  }

  if (budgetGroupSaveBtn) {
    budgetGroupSaveBtn.addEventListener('click', saveBudgetGroupFromModal);
  }

  if (budgetGroupDeleteBtn) {
    budgetGroupDeleteBtn.addEventListener('click', deleteBudgetGroupFromModal);
  }

  // App Settings Page + PWA icon
  const PWA_ICON_STORAGE_KEY = 'jizhang-pwa-icon';
  const DEFAULT_PWA_ICON_192 = 'icons/icon-192.png';
  const DEFAULT_PWA_ICON_512 = 'icons/icon-512.png';
  const accountingSettingsBtn = document.getElementById('accountingSettingsBtn');
  const appSettingsPage = document.getElementById('appSettingsPage');
  const appSettingsBack = document.getElementById('appSettingsBack');
  const pwaIconPreview = document.getElementById('pwaIconPreview');
  const pwaIconPickBtn = document.getElementById('pwaIconPickBtn');
  const pwaIconResetBtn = document.getElementById('pwaIconResetBtn');
  const pwaIconInput = document.getElementById('pwaIconInput');
  const pwaIconStatus = document.getElementById('pwaIconStatus');
  const pwaCheckUpdateBtn = document.getElementById('pwaCheckUpdateBtn');
  const pwaUpdateStatus = document.getElementById('pwaUpdateStatus');
  const appIconLink = document.getElementById('appIconLink');
  const appleTouchIconLink = document.getElementById('appleTouchIconLink');
  const PWA_ICON_CACHE_NAME = 'jizhang-icons-v1';

  const setPwaIconStatus = (text) => {
    if (pwaIconStatus) pwaIconStatus.textContent = text || '';
  };

  const setPwaUpdateStatus = (text) => {
    if (pwaUpdateStatus) pwaUpdateStatus.textContent = text || '';
  };

  const postToServiceWorker = (payload) => new Promise((resolve) => {
    if (!('serviceWorker' in navigator)) {
      resolve(false);
      return;
    }
    const send = (reg) => {
      const worker = reg.active || reg.waiting || reg.installing;
      if (!worker) {
        resolve(false);
        return;
      }
      const channel = new MessageChannel();
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        resolve(ok);
      };
      channel.port1.onmessage = () => done(true);
      worker.postMessage(payload, [channel.port2]);
      setTimeout(() => done(true), 800);
    };
    navigator.serviceWorker.ready.then(send).catch(() => resolve(false));
  });

  const clearShellCachesLocally = async () => {
    if (!('caches' in window)) return;
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== PWA_ICON_CACHE_NAME)
        .map((key) => caches.delete(key))
    );
  };

  const activateWaitingWorker = (reg) => new Promise((resolve) => {
    if (!reg) {
      resolve(false);
      return;
    }
    const waiting = reg.waiting;
    if (!waiting) {
      resolve(false);
      return;
    }
    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      navigator.serviceWorker.removeEventListener('controllerchange', onChange);
      resolve(ok);
    };
    const onChange = () => finish(true);
    navigator.serviceWorker.addEventListener('controllerchange', onChange);
    waiting.postMessage({ type: 'SKIP_WAITING' });
    setTimeout(() => finish(true), 1200);
  });

  const checkPwaUpdate = async () => {
    if (!('serviceWorker' in navigator)) {
      setPwaUpdateStatus('当前环境不支持 Service Worker');
      return;
    }
    if (pwaCheckUpdateBtn) pwaCheckUpdateBtn.disabled = true;
    setPwaUpdateStatus('正在检查更新…');
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        setPwaUpdateStatus('未找到 Service Worker，正在刷新…');
        await clearShellCachesLocally();
        location.reload();
        return;
      }

      try {
        await reg.update();
      } catch {
        // 网络失败时仍继续清缓存并刷新
      }

      await postToServiceWorker({ type: 'CLEAR_SHELL_CACHE' });
      await clearShellCachesLocally();
      await activateWaitingWorker(reg);

      setPwaUpdateStatus('已拉取最新资源，正在刷新…');
      setTimeout(() => location.reload(), 300);
    } catch {
      setPwaUpdateStatus('检查失败，请稍后重试');
      if (pwaCheckUpdateBtn) pwaCheckUpdateBtn.disabled = false;
    }
  };

  const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = src;
  });

  const canvasToDataUrl = (source, size) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f7f7f5';
    ctx.fillRect(0, 0, size, size);

    const sw = source.naturalWidth || source.width;
    const sh = source.naturalHeight || source.height;
    const scale = Math.max(size / sw, size / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    ctx.drawImage(source, (size - dw) / 2, (size - dh) / 2, dw, dh);
    return canvas.toDataURL('image/png');
  };

  const postIconsToServiceWorker = (payload) => postToServiceWorker(payload);

  const applyPwaIconLinks = (icon192, icon512) => {
    if (appIconLink) appIconLink.href = icon192;
    if (appleTouchIconLink) appleTouchIconLink.href = icon512;
    if (pwaIconPreview) pwaIconPreview.src = icon512;
  };

  const persistAndApplyCustomIcon = async (sourceDataUrl) => {
    const img = await loadImage(sourceDataUrl);
    const icon192 = canvasToDataUrl(img, 192);
    const icon512 = canvasToDataUrl(img, 512);
    localStorage.setItem(PWA_ICON_STORAGE_KEY, JSON.stringify({ icon192, icon512, updatedAt: Date.now() }));
    applyPwaIconLinks(icon192, icon512);
    await postIconsToServiceWorker({ type: 'SET_PWA_ICONS', icon192, icon512 });
    return { icon192, icon512 };
  };

  const resetPwaIcon = async () => {
    localStorage.removeItem(PWA_ICON_STORAGE_KEY);
    applyPwaIconLinks(DEFAULT_PWA_ICON_192, DEFAULT_PWA_ICON_512);
    await postIconsToServiceWorker({ type: 'SET_PWA_ICONS', reset: true });
  };

  const initPwaIcon = async () => {
    try {
      const raw = localStorage.getItem(PWA_ICON_STORAGE_KEY);
      if (!raw) {
        applyPwaIconLinks(DEFAULT_PWA_ICON_192, DEFAULT_PWA_ICON_512);
        return;
      }
      const saved = JSON.parse(raw);
      if (!saved || !saved.icon192 || !saved.icon512) {
        applyPwaIconLinks(DEFAULT_PWA_ICON_192, DEFAULT_PWA_ICON_512);
        return;
      }
      applyPwaIconLinks(saved.icon192, saved.icon512);
      await postIconsToServiceWorker({
        type: 'SET_PWA_ICONS',
        icon192: saved.icon192,
        icon512: saved.icon512
      });
    } catch {
      applyPwaIconLinks(DEFAULT_PWA_ICON_192, DEFAULT_PWA_ICON_512);
    }
  };

  const openAppSettingsPage = () => {
    setPwaIconStatus('');
    setPwaUpdateStatus('');
    if (pwaCheckUpdateBtn) pwaCheckUpdateBtn.disabled = false;
    if (appSettingsPage) {
      appSettingsPage.classList.add('active');
      appSettingsPage.setAttribute('aria-hidden', 'false');
    }
  };

  const closeAppSettingsPage = () => {
    if (appSettingsPage) {
      appSettingsPage.classList.remove('active');
      appSettingsPage.setAttribute('aria-hidden', 'true');
    }
  };

  if (accountingSettingsBtn) {
    accountingSettingsBtn.addEventListener('click', openAppSettingsPage);
  }
  if (appSettingsBack) {
    appSettingsBack.addEventListener('click', closeAppSettingsPage);
  }
  if (pwaIconPickBtn && pwaIconInput) {
    pwaIconPickBtn.addEventListener('click', () => pwaIconInput.click());
    pwaIconInput.addEventListener('change', async (event) => {
      const file = event.target.files && event.target.files[0];
      event.target.value = '';
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setPwaIconStatus('请选择图片文件');
        return;
      }
      try {
        setPwaIconStatus('正在处理…');
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('读取失败'));
          reader.readAsDataURL(file);
        });
        await persistAndApplyCustomIcon(dataUrl);
        setPwaIconStatus('已保存。请删除桌面旧图标后重新添加，即可看到新图标。');
      } catch {
        setPwaIconStatus('更换失败，请换一张图片再试');
      }
    });
  }
  if (pwaIconResetBtn) {
    pwaIconResetBtn.addEventListener('click', async () => {
      try {
        setPwaIconStatus('正在恢复…');
        await resetPwaIcon();
        setPwaIconStatus('已恢复默认图标。重新添加到桌面后生效。');
      } catch {
        setPwaIconStatus('恢复失败，请稍后重试');
      }
    });
  }
  if (pwaCheckUpdateBtn) {
    pwaCheckUpdateBtn.addEventListener('click', () => {
      checkPwaUpdate();
    });
  }

  budgetSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const resetHour = parseInt(budgetResetTimeInput.value, 10);
    accountingData.settings.budgetPeriod = draftBudgetPeriod;

    if (draftBudgetPeriod === 'hybrid') {
      draftHybridDailyEnabled = !!(hybridDailyEnabledSwitch && hybridDailyEnabledSwitch.checked);
      draftHybridMonthlyEnabled = !!(hybridMonthlyEnabledSwitch && hybridMonthlyEnabledSwitch.checked);
      draftHybridDailyCategories = collectHybridCategoryDraft(hybridDailyCategoryList);
      draftHybridMonthlyCategories = collectHybridCategoryDraft(hybridMonthlyCategoryList);

      const nextGroups = draftBudgetGroups
        .map((group, index) => normalizeBudgetGroup(group, index))
        .filter(group => group && group.amount > 0);

      if (!draftHybridDailyEnabled && !draftHybridMonthlyEnabled && nextGroups.length === 0) {
        alert('请至少启用今日预算、本月预算或添加一个预算分组');
        return;
      }

      if (draftHybridDailyEnabled) {
        const dailyAmount = parseFloat(budgetDailyAmountInput && budgetDailyAmountInput.value);
        if (isNaN(dailyAmount) || dailyAmount <= 0) {
          alert('请填写有效的今日预算');
          return;
        }
        accountingData.settings.dailyBudget = dailyAmount;
      }

      if (draftHybridMonthlyEnabled) {
        const monthlyAmount = parseFloat(budgetMonthlyAmountInput && budgetMonthlyAmountInput.value);
        if (isNaN(monthlyAmount) || monthlyAmount <= 0) {
          alert('请填写有效的本月预算');
          return;
        }
        accountingData.settings.monthlyBudget = monthlyAmount;
      }

      accountingData.settings.hybridDailyEnabled = draftHybridDailyEnabled;
      accountingData.settings.hybridMonthlyEnabled = draftHybridMonthlyEnabled;
      accountingData.settings.hybridDailyCategories = draftHybridDailyEnabled
        ? draftHybridDailyCategories
        : [];
      accountingData.settings.hybridMonthlyCategories = draftHybridMonthlyEnabled
        ? draftHybridMonthlyCategories
        : [];
      accountingData.settings.budgetGroups = nextGroups;
      accountingData.settings.categoryBudgets = {};
      accountingData.settings.budgetCategories = [];

      // totalBudget：优先本月，否则今日，否则分组合计（仅作兼容字段）
      if (draftHybridMonthlyEnabled) {
        accountingData.settings.totalBudget = accountingData.settings.monthlyBudget;
      } else if (draftHybridDailyEnabled) {
        accountingData.settings.totalBudget = accountingData.settings.dailyBudget;
      } else {
        accountingData.settings.totalBudget = Math.round(sumBudgetGroupsAmount(nextGroups) * 100) / 100;
      }
    } else {
      const amount = parseFloat(budgetAmountInput && budgetAmountInput.value);
      if (isNaN(amount) || amount <= 0) {
        alert('请填写有效的预算金额');
        return;
      }
      accountingData.settings.totalBudget = amount;
      accountingData.settings.dailyBudget = amount;
      if (draftBudgetPeriod === 'monthly') {
        accountingData.settings.monthlyBudget = amount;
      }
      accountingData.settings.budgetGroups = [];
      accountingData.settings.hybridDailyEnabled = false;
      accountingData.settings.hybridMonthlyEnabled = false;
      accountingData.settings.hybridDailyCategories = [];
      accountingData.settings.hybridMonthlyCategories = [];

      collectCategoryBudgetDraftValues();
      categoryBudgetList && categoryBudgetList.querySelectorAll('.category-budget-dial.is-editing').forEach(exitCategoryBudgetDialEdit);

      const nextCategoryBudgets = {};
      draftCategoryBudgetIds.forEach(catId => {
        const val = parseFloat(draftCategoryBudgetValues[catId]);
        if (!isNaN(val) && val > 0) {
          nextCategoryBudgets[catId] = val;
        }
      });
      accountingData.settings.categoryBudgets = nextCategoryBudgets;

      if (!hasCategoryBudgets(nextCategoryBudgets)) {
        accountingData.settings.budgetCategories = [];
      } else {
        accountingData.settings.budgetCategories = Object.keys(nextCategoryBudgets)
          .filter(id => draftCategoryBudgetIncluded[id]);
      }
    }

    if (!isNaN(resetHour) && resetHour >= 0 && resetHour <= 23) {
      accountingData.settings.resetHour = resetHour;
    }

    saveData();
    closeBudgetPeriodEditPage();
    renderBudgetTypeCards();
  });

  const billIncludeBudgetRow = document.getElementById('billIncludeBudgetRow');
  const billIncludeMonthlyRow = document.getElementById('billIncludeMonthlyRow');
  const billIncludeDailyLabel = document.getElementById('billIncludeDailyLabel');
  const billIncludeMonthlyLabel = document.getElementById('billIncludeMonthlyLabel');
  const billIncludeDailyRow = document.getElementById('billIncludeDailyRow');

  const syncBillBudgetSwitchUI = (periodMeta) => {
    const period = accountingData.settings.budgetPeriod || 'daily';
    const isHybrid = period === 'hybrid';
    const meta = periodMeta || BUDGET_PERIOD_META[period] || BUDGET_PERIOD_META.daily;

    // 混合模式：今日/本月由设置里勾选的分类决定，记账页不再显示计入开关
    if (billIncludeDailyLabel) {
      billIncludeDailyLabel.textContent = meta.include;
    }
    if (billIncludeDailyRow) billIncludeDailyRow.hidden = false;
    if (billIncludeMonthlyRow) billIncludeMonthlyRow.hidden = true;
    if (billIncludeBudgetRow) {
      billIncludeBudgetRow.classList.remove('is-hybrid');
      billIncludeBudgetRow.hidden = isHybrid;
    }
  };

  const syncBillIncludeBudgetDefault = () => {
    const includeCheckbox = document.getElementById('billIncludeBudget');
    const includeMonthlyCheckbox = document.getElementById('billIncludeMonthlyBudget');
    if (includeCheckbox) includeCheckbox.checked = true;
    if (includeMonthlyCheckbox) includeMonthlyCheckbox.checked = true;
  };

  const billPayFromRow = document.getElementById('billPayFromRow');
  const billPayFromSelect = document.getElementById('billPayFrom');

  const syncBillPayFromSelect = (selectedPlanId = '', excludeBillId = null) => {
    if (!billPayFromSelect || !billPayFromRow) return;

    billPayFromSelect.innerHTML = '';
    const availableOpt = document.createElement('option');
    availableOpt.value = '';
    availableOpt.textContent = '可花余额';
    billPayFromSelect.appendChild(availableOpt);

    let hasSavingsOption = false;
    (accountingData.savings || []).forEach(plan => {
      const keepSelected = selectedPlanId && selectedPlanId === plan.id;
      if (isPlanAchieved(plan, 'savings') && !keepSelected) return;
      const balance = getSavingsBalance(plan.id, excludeBillId);
      if (balance <= 0 && !keepSelected) return;
      hasSavingsOption = true;
      const opt = document.createElement('option');
      opt.value = plan.id;
      const balLabel = balance > 0 ? formatCurrency(balance) : '余额不足';
      opt.textContent = `${plan.name}（剩 ${balLabel}）`;
      billPayFromSelect.appendChild(opt);
    });

    billPayFromRow.hidden = !hasSavingsOption && !selectedPlanId;
    if (selectedPlanId && Array.from(billPayFromSelect.options).some(o => o.value === selectedPlanId)) {
      billPayFromSelect.value = selectedPlanId;
    } else {
      billPayFromSelect.value = '';
    }
  };

  const syncBillTypeUI = (type) => {
    const categoryLabel = document.getElementById('billCategoryLabel');
    if (categoryLabel) {
      categoryLabel.textContent = type === 'transfer' ? '转入计划' : '分类';
    }
    if (type === 'income' || type === 'transfer') {
      if (billIncludeBudgetRow) billIncludeBudgetRow.style.display = 'none';
      if (billPayFromRow) billPayFromRow.hidden = true;
    } else {
      if (billIncludeBudgetRow) billIncludeBudgetRow.style.display = 'flex';
      syncBillBudgetSwitchUI();
      syncBillIncludeBudgetDefault();
      syncBillPayFromSelect('', editingBillId);
    }
  };

  billTypeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      billTypeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateCategorySelect(tab.dataset.type);
      syncBillTypeUI(tab.dataset.type);
    });
  });

  const getPlanCategories = () => {
    const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
    return categoryList.filter(c => {
      if (!c.isPlan) return false;
      const savings = (accountingData.savings || []).find(s => s.id === c.id);
      if (savings) return !isPlanAchieved(savings, 'savings');
      const debt = (accountingData.debts || []).find(d => d.id === c.id);
      if (debt) return !isPlanAchieved(debt, 'debt');
      return true;
    });
  };

  const updateCategorySelect = (type) => {
    billCategorySelect.innerHTML = '';
    const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
    let list;
    if (type === 'transfer') {
      list = getPlanCategories();
    } else if (type === 'expense') {
      list = categoryList.filter(c => c.type === 'expense' && !c.isPlan);
    } else {
      list = categoryList.filter(c => c.type === type && !c.isPlan);
    }

    if (type === 'transfer' && list.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '暂无计划，请先在「我的-计划」创建';
      opt.disabled = true;
      opt.selected = true;
      billCategorySelect.appendChild(opt);
      return;
    }

    list.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = formatPlanCategoryLabel(cat);
      billCategorySelect.appendChild(opt);
    });
  };

  const applyAmountKey = (key) => {
    if (!billAmountInput) return;
    let value = billAmountInput.value || '';

    if (key === 'backspace') {
      billAmountInput.value = value.slice(0, -1);
      return;
    }

    if (key === '.') {
      if (!value) {
        billAmountInput.value = '0.';
        return;
      }
      if (value.includes('.')) return;
      billAmountInput.value = `${value}.`;
      return;
    }

    if (!/^\d+$/.test(key)) return;

    if (value.includes('.')) {
      const decimals = value.split('.')[1] || '';
      if (decimals.length + key.length > 2) {
        const allowed = 2 - decimals.length;
        if (allowed <= 0) return;
        key = key.slice(0, allowed);
      }
    } else {
      const intPart = value === '' ? '' : value;
      if (intPart === '0') {
        billAmountInput.value = key.replace(/^0+/, '') || '0';
        return;
      }
      if (intPart.length >= 8) return;
    }

    billAmountInput.value = `${value}${key}`;
  };

  if (amountKeypad) {
    amountKeypad.addEventListener('click', (e) => {
      const keyBtn = e.target.closest('[data-key]');
      if (!keyBtn || !amountKeypad.contains(keyBtn)) return;
      applyAmountKey(keyBtn.dataset.key);
      if (amountInputWrap) amountInputWrap.classList.add('is-active');
    });
  }

  if (amountInputWrap) {
    const activateAmount = () => amountInputWrap.classList.add('is-active');
    amountInputWrap.addEventListener('click', activateAmount);
    amountInputWrap.addEventListener('focusin', activateAmount);
  }

  addBillModal.addEventListener('keydown', (e) => {
    if (!addBillModal.classList.contains('active')) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
      if (e.target === billAmountInput) {
        // allow keypad-like typing on amount field
      } else {
        return;
      }
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      applyAmountKey('backspace');
      return;
    }
    if (e.key === '.' || e.key === ',') {
      e.preventDefault();
      applyAmountKey('.');
      return;
    }
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      applyAmountKey(e.key);
    }
  });

  addBillForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = addBillModal.querySelector('.bill-type-tab.active').dataset.type;
    const amount = parseFloat(billAmountInput.value);
    const categoryId = billCategorySelect.value;
    const timestamp = new Date(billTimeInput.value).getTime();
    const note = document.getElementById('billNote').value;
    const isHybrid = (accountingData.settings.budgetPeriod || 'daily') === 'hybrid';
    // 混合：不写单笔计入标记，按设置页分类勾选计入
    const includeInBudget = isHybrid
      ? undefined
      : document.getElementById('billIncludeBudget').checked;

    if (isNaN(amount) || amount <= 0) return;
    if (!categoryId) {
      if (type === 'transfer') alert('请先创建存钱或还钱计划，再转入。');
      return;
    }
    if (type === 'transfer') {
      const planCat = getPlanCategories().find(c => c.id === categoryId);
      if (!planCat) {
        alert('请选择要转入的存钱或还钱计划');
        return;
      }
    }

    const paidFromPlanId = type === 'expense'
      ? ((billPayFromSelect && billPayFromSelect.value) || '')
      : '';
    if (type === 'expense' && paidFromPlanId) {
      const savingsPlan = (accountingData.savings || []).find(s => s.id === paidFromPlanId);
      if (!savingsPlan) {
        alert('请选择有效的存钱账户');
        return;
      }
      const balance = getSavingsBalance(paidFromPlanId, editingBillId);
      if (amount > balance + 1e-9) {
        alert(`「${savingsPlan.name}」余额不足（剩 ${formatCurrency(balance)}）`);
        return;
      }
    }

    if (editingBillId) {
      const billIndex = accountingData.bills.findIndex(b => b.id === editingBillId);
      if (billIndex !== -1) {
        const nextBill = {
          ...accountingData.bills[billIndex],
          type,
          amount: amount.toFixed(2),
          categoryId,
          timestamp,
          note
        };
        if (type !== 'expense' || isHybrid) {
          delete nextBill.includeInBudget;
          delete nextBill.includeInMonthlyBudget;
        } else {
          nextBill.includeInBudget = includeInBudget;
          delete nextBill.includeInMonthlyBudget;
        }
        if (type === 'expense' && paidFromPlanId) {
          nextBill.paidFromPlanId = paidFromPlanId;
        } else {
          delete nextBill.paidFromPlanId;
        }
        accountingData.bills[billIndex] = nextBill;
      }
    } else {
      const newBill = {
        id: crypto.randomUUID(),
        type,
        amount: amount.toFixed(2),
        categoryId,
        timestamp,
        note
      };
      if (type === 'expense' && !isHybrid) newBill.includeInBudget = includeInBudget;
      if (type === 'expense' && paidFromPlanId) newBill.paidFromPlanId = paidFromPlanId;
      accountingData.bills.push(newBill);
    }

    saveData();
    
    addBillForm.reset();
    addBillModal.classList.remove('active');
    addBillModal.setAttribute('aria-hidden', 'true');

    // Refresh bills view if it's active
    if (accountingBillsView && accountingBillsView.classList.contains('active')) {
      if (typeof renderBillsView === 'function') renderBillsView();
    }
  });

  // Global functions
  window.initializeAccountingApp = () => {
    loadData();
    initPwaIcon();
  };

  window.openAccountingPage = () => {
    accountingPage.classList.add('active');
    document.body.classList.add('show-accounting');
    loadData();
  };

  const closeAccounting = () => {
    accountingPage.classList.remove('active');
    document.body.classList.remove('show-accounting');
  };

  const backBtn = document.getElementById('accountingBackBtn');
  if (backBtn) backBtn.addEventListener('click', closeAccounting);
  
  // For backward compatibility with the existing back button logic if any
  const oldBack = document.getElementById('accountingBack');
  if (oldBack) oldBack.addEventListener('click', closeAccounting);
  
  const accountingTitle = document.getElementById('accountingTitle');
  const accountingHomeView = document.getElementById('accountingHomeView');
  const accountingBillsView = document.getElementById('accountingBillsView');
  const accountingFinancialView = document.getElementById('accountingFinancialView');
  
  // Bills view elements
  const billsFilterTabs = document.querySelectorAll('.bill-filter-tab');
  const prevDateBtn = document.getElementById('prevDateBtn');
  const nextDateBtn = document.getElementById('nextDateBtn');
  const currentDateDisplay = document.getElementById('currentDateDisplay');
  const billsExpenseTotal = document.getElementById('billsExpenseTotal');
  const billsIncomeTotal = document.getElementById('billsIncomeTotal');
  const billsSavingsTotal = document.getElementById('billsSavingsTotal');
  const billsDebtTotal = document.getElementById('billsDebtTotal');
  const billsDetailContainer = document.getElementById('billsDetailContainer');
  const billsChartContainer = document.getElementById('billsChartContainer');
  const billsCalendarCard = document.getElementById('billsCalendarCard');
  const billsCalendarGrid = document.getElementById('billsCalendarGrid');
  const billsDayDetail = document.getElementById('billsDayDetail');
  const billsDayDetailDate = document.getElementById('billsDayDetailDate');
  const billsDayExpense = document.getElementById('billsDayExpense');
  const billsDayIncome = document.getElementById('billsDayIncome');
  const billsDayBudgetWrap = document.getElementById('billsDayBudgetWrap');
  const billsDayBudget = document.getElementById('billsDayBudget');
  const chartTabs = document.querySelectorAll('.chart-tab');

  let billsViewState = {
    mode: 'monthly',
    date: new Date(),
    chartType: 'expense',
    selectedDay: null
  };

  const formatCellAmount = (amount) => {
    if (!amount || amount <= 0) return '';
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(1).replace(/\.0$/, '')}万`;
    }
    if (amount >= 100) return String(Math.round(amount));
    return amount % 1 === 0 ? String(amount) : amount.toFixed(1);
  };

  const getMonthDayStats = (year, month) => {
    const byCalendarDay = {};
    const budgetSpendByDay = {};

    accountingData.bills.forEach(bill => {
      const billDate = new Date(bill.timestamp);
      const amount = parseFloat(bill.amount) || 0;
      const calendarDay = getCalendarDay(billDate);

      if (billDate.getFullYear() === year && billDate.getMonth() === month) {
        if (!byCalendarDay[calendarDay]) {
          byCalendarDay[calendarDay] = { expense: 0, income: 0, transfer: 0 };
        }
        if (bill.type === 'expense') byCalendarDay[calendarDay].expense += amount;
        else if (bill.type === 'income') byCalendarDay[calendarDay].income += amount;
        else if (bill.type === 'transfer') byCalendarDay[calendarDay].transfer += amount;
      }

      const countsForDayBudget = (accountingData.settings.budgetPeriod || 'daily') === 'hybrid'
        ? countsTowardDailyBudget(bill)
        : shouldIncludeBillInBudget(bill);
      if (countsForDayBudget) {
        const budgetDay = getBudgetDay(billDate);
        budgetSpendByDay[budgetDay] = (budgetSpendByDay[budgetDay] || 0) + amount;
      }
    });

    return { byCalendarDay, budgetSpendByDay };
  };

  const updateBillsDayDetail = (dayStats, budgetSpendByDay) => {
    if (!billsDayDetail) return;

    const selectedDay = billsViewState.selectedDay;
    if (selectedDay == null) {
      billsDayDetail.hidden = true;
      return;
    }

    const stats = dayStats[selectedDay] || { expense: 0, income: 0 };
    const d = new Date(selectedDay);
    const budgetPeriod = accountingData.settings.budgetPeriod || 'daily';
    const usesDailyBudget = budgetPeriod === 'daily'
      || (budgetPeriod === 'hybrid' && isHybridDailyEnabled());
    const budgetTotal = budgetPeriod === 'hybrid'
      ? (parseFloat(accountingData.settings.dailyBudget) || 0)
      : (parseFloat(accountingData.settings.totalBudget) || 0);
    const budgetSpent = budgetSpendByDay[selectedDay] || 0;

    if (billsDayDetailDate) {
      billsDayDetailDate.textContent = `${d.getMonth() + 1}月${d.getDate()}日`;
    }
    if (billsDayExpense) billsDayExpense.textContent = formatCurrency(stats.expense);
    if (billsDayIncome) billsDayIncome.textContent = formatCurrency(stats.income);

    if (billsDayBudgetWrap && billsDayBudget) {
      if (usesDailyBudget && budgetTotal > 0) {
        billsDayBudgetWrap.hidden = false;
        const over = budgetSpent > budgetTotal;
        const diff = Math.abs(budgetSpent - budgetTotal);
        billsDayBudget.textContent = over
          ? (budgetPeriod === 'hybrid' ? `今日已多花 ${formatCurrency(diff)}` : `超支 ${formatCurrency(diff)}`)
          : `预算剩余 ${formatCurrency(diff)}`;
        billsDayBudget.classList.toggle('is-over', over);
      } else {
        billsDayBudgetWrap.hidden = true;
        billsDayBudget.classList.remove('is-over');
      }
    }

    billsDayDetail.hidden = false;
  };

  const renderBillsCalendar = (year, month) => {
    if (!billsCalendarCard || !billsCalendarGrid) return;

    if (billsViewState.mode !== 'monthly') {
      billsCalendarCard.hidden = true;
      if (billsDayDetail) billsDayDetail.hidden = true;
      return;
    }

    billsCalendarCard.hidden = false;
    normalizeBudgetSettings();

    const { byCalendarDay, budgetSpendByDay } = getMonthDayStats(year, month);
    const budgetPeriod = accountingData.settings.budgetPeriod || 'daily';
    const isDailyBudget = budgetPeriod === 'daily'
      || (budgetPeriod === 'hybrid' && isHybridDailyEnabled());
    const budgetTotal = budgetPeriod === 'hybrid'
      ? (parseFloat(accountingData.settings.dailyBudget) || 0)
      : (parseFloat(accountingData.settings.totalBudget) || 0);
    const todayStart = getCalendarDay();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Monday-first: Sun=0 → 6, Mon=1 → 0, ...
    const startWeekday = (firstDay.getDay() + 6) % 7;

    if (billsViewState.selectedDay != null) {
      const selected = new Date(billsViewState.selectedDay);
      if (selected.getFullYear() !== year || selected.getMonth() !== month) {
        billsViewState.selectedDay = null;
      }
    }

    const cells = [];
    for (let i = 0; i < startWeekday; i++) {
      cells.push('<button type="button" class="bills-calendar-cell is-outside" disabled aria-hidden="true"></button>');
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayTime = getCalendarDay(new Date(year, month, day));
      const stats = byCalendarDay[dayTime] || { expense: 0, income: 0 };
      const budgetSpent = budgetSpendByDay[dayTime] || 0;
      const isOver = isDailyBudget && budgetTotal > 0 && budgetSpent > budgetTotal;
      const isToday = dayTime === todayStart;
      const isSelected = billsViewState.selectedDay === dayTime;
      const expenseText = formatCellAmount(stats.expense);
      const incomeText = formatCellAmount(stats.income);

      const classes = [
        'bills-calendar-cell',
        isToday ? 'is-today' : '',
        isSelected ? 'is-selected' : '',
        isOver ? 'is-over' : ''
      ].filter(Boolean).join(' ');

      cells.push(`
        <button type="button" class="${classes}" data-day="${dayTime}" aria-label="${month + 1}月${day}日${isOver ? '，已超支' : ''}" ${isSelected ? 'aria-pressed="true"' : 'aria-pressed="false"'}>
          ${isOver ? '<span class="bills-calendar-overdot" aria-hidden="true"></span>' : ''}
          <span class="bills-calendar-daynum">${day}</span>
          ${expenseText ? `<span class="bills-calendar-expense">-￥${expenseText}</span>` : ''}
          ${incomeText ? `<span class="bills-calendar-income">+￥${incomeText}</span>` : ''}
        </button>
      `);
    }

    billsCalendarGrid.innerHTML = cells.join('');
    updateBillsDayDetail(byCalendarDay, budgetSpendByDay);
  };

  // Color palette for charts
  const CHART_COLORS = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', 
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', 
    '#FF5722', '#795548', '#607D8B'
  ];

  const buildDonutCallouts = (chartData) => {
    const width = 340;
    const height = 260;
    const cx = width / 2;
    const cy = height / 2;
    const lineStart = 84;
    const elbowRadius = 108;
    const labelGap = 16;
    const minLabelGap = 16;

    // Prefer visible slices; keep at least one label if everything is tiny
    const visible = chartData.filter((d) => d.sweep >= 8 || Number(d.percent) >= 2.5);
    const items = (visible.length ? visible : chartData.slice(0, 1)).map((data) => {
      const rad = ((data.midAngle - 90) * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const side = cos >= 0 ? 1 : -1;
      const x1 = cx + cos * lineStart;
      const y1 = cy + sin * lineStart;
      const x2 = cx + cos * elbowRadius;
      const y2 = cy + sin * elbowRadius;
      return {
        ...data,
        side,
        x1,
        y1,
        x2,
        y2,
        labelY: y2
      };
    });

    ['left', 'right'].forEach((sideName) => {
      const side = sideName === 'right' ? 1 : -1;
      const sideItems = items.filter((item) => item.side === side).sort((a, b) => a.labelY - b.labelY);
      for (let i = 1; i < sideItems.length; i += 1) {
        const prev = sideItems[i - 1];
        const curr = sideItems[i];
        if (curr.labelY - prev.labelY < minLabelGap) {
          curr.labelY = prev.labelY + minLabelGap;
        }
      }
      // Pull overflowing labels back into the viewBox
      if (sideItems.length) {
        const maxY = height - 14;
        const minY = 14;
        if (sideItems[sideItems.length - 1].labelY > maxY) {
          let shift = sideItems[sideItems.length - 1].labelY - maxY;
          for (let i = sideItems.length - 1; i >= 0 && shift > 0; i -= 1) {
            sideItems[i].labelY -= shift;
            if (i > 0) {
              const overlap = sideItems[i - 1].labelY + minLabelGap - sideItems[i].labelY;
              shift = overlap > 0 ? overlap : 0;
            } else {
              shift = 0;
            }
          }
        }
        if (sideItems[0].labelY < minY) {
          let shift = minY - sideItems[0].labelY;
          for (let i = 0; i < sideItems.length && shift > 0; i += 1) {
            sideItems[i].labelY += shift;
            if (i < sideItems.length - 1) {
              const overlap = sideItems[i].labelY + minLabelGap - sideItems[i + 1].labelY;
              shift = overlap > 0 ? overlap : 0;
            } else {
              shift = 0;
            }
          }
        }
      }
    });

    return items.map((item) => {
      const x3 = item.x2 + item.side * labelGap;
      const y3 = item.labelY;
      const elbowX = item.x2;
      const textX = x3 + item.side * 5;
      const anchor = item.side > 0 ? 'start' : 'end';
      const name = escapeHtml(item.name);
      return `
        <g class="donut-callout">
          <polyline class="donut-callout-line" stroke="${item.color}" points="${item.x1.toFixed(1)},${item.y1.toFixed(1)} ${elbowX.toFixed(1)},${y3.toFixed(1)} ${x3.toFixed(1)},${y3.toFixed(1)}" />
          <circle class="donut-callout-dot" cx="${item.x1.toFixed(1)}" cy="${item.y1.toFixed(1)}" r="2.4" fill="${item.color}" />
          <text x="${textX.toFixed(1)}" y="${(y3 - 5).toFixed(1)}" text-anchor="${anchor}" class="donut-callout-name">${name}</text>
          <text x="${textX.toFixed(1)}" y="${(y3 + 8).toFixed(1)}" text-anchor="${anchor}" class="donut-callout-pct">${item.percent}%</text>
        </g>
      `;
    }).join('');
  };

  const renderBillsView = () => {
    if (!accountingBillsView || !accountingBillsView.classList.contains('active')) return;

    const year = billsViewState.date.getFullYear();
    const month = billsViewState.date.getMonth();

    if (billsViewState.mode === 'monthly') {
      currentDateDisplay.textContent = `${year}年${month + 1}月`;
    } else {
      currentDateDisplay.textContent = `${year}年`;
      billsViewState.selectedDay = null;
    }

    let expenseTotal = 0;
    let incomeTotal = 0;
    let savingsTotal = 0;
    let debtTotal = 0;

    let filteredBills = accountingData.bills.filter(bill => {
      const d = new Date(bill.timestamp);
      if (billsViewState.mode === 'monthly') {
        return d.getFullYear() === year && d.getMonth() === month;
      } else {
        return d.getFullYear() === year;
      }
    });

    filteredBills.forEach(bill => {
      const amount = parseFloat(bill.amount) || 0;
      if (bill.type === 'expense') {
        expenseTotal += amount;
      } else if (bill.type === 'income') {
        incomeTotal += amount;
      } else if (bill.type === 'transfer') {
        const kind = resolvePlanKind(bill.categoryId);
        if (kind === 'savings') savingsTotal += amount;
        else if (kind === 'debt') debtTotal += amount;
      }
    });

    if (billsExpenseTotal) billsExpenseTotal.textContent = formatCurrency(expenseTotal);
    if (billsIncomeTotal) billsIncomeTotal.textContent = formatCurrency(incomeTotal);
    if (billsSavingsTotal) billsSavingsTotal.textContent = formatCurrency(savingsTotal);
    if (billsDebtTotal) billsDebtTotal.textContent = formatCurrency(debtTotal);

    renderBillsCalendar(year, month);
    renderChart(filteredBills, billsViewState.chartType);
  };

  const renderCategorySummary = (chartData) => {
    if (!billsDetailContainer) return;

    let categoryListHtml = '';
    if (chartData && chartData.length > 0) {
      categoryListHtml = chartData.map(data => `
        <div class="category-summary-item">
          <div class="category-summary-header">
            <div class="category-summary-left">
              <span class="category-color-dot" style="background: ${data.color}"></span>
              <span class="category-name">${data.name}</span>
              <span class="category-percent">${data.percent}%</span>
            </div>
            <span class="category-amount">¥${data.amount.toFixed(2)}</span>
          </div>
          <div class="progress-bar-wrap category-progress-wrap">
            <div class="progress-bar-fill category-progress-fill" style="width: ${data.percent}%; background: ${data.color}"></div>
          </div>
        </div>
      `).join('');
    } else {
      categoryListHtml = `<div class="chart-empty">暂无分类数据</div>`;
    }

    billsDetailContainer.innerHTML = `
      <section class="accounting-card category-summary-card">
        <div class="card-header">
          <h3 class="card-title">分类排行榜</h3>
        </div>
        <div class="category-summary-list">
          ${categoryListHtml}
        </div>
      </section>
    `;
  };

  const renderChart = (bills, type) => {
    if (!billsChartContainer) return;

    const filteredBills = bills.filter(b => b.type === type);
    if (filteredBills.length === 0) {
      billsChartContainer.innerHTML = `<div class="chart-empty">暂无${type === 'expense' ? '支出' : '收入'}数据</div>`;
      renderCategorySummary([]);
      return;
    }

    let categoryTotals = {};
    let totalAmount = 0;

    filteredBills.forEach(bill => {
      const amount = parseFloat(bill.amount);
      if (!categoryTotals[bill.categoryId]) {
        categoryTotals[bill.categoryId] = 0;
      }
      categoryTotals[bill.categoryId] += amount;
      totalAmount += amount;
    });

    const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
    
    // Convert to array and sort
    const chartData = Object.keys(categoryTotals)
      .map(categoryId => {
        const category = categoryList.find(c => c.id === categoryId);
        return {
          id: categoryId,
          name: category ? category.name : '未知',
          amount: categoryTotals[categoryId],
          percent: ((categoryTotals[categoryId] / totalAmount) * 100).toFixed(1)
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Generate conic-gradient for donut chart
    let gradientStops = [];
    let currentAngle = 0;

    chartData.forEach((data, index) => {
      data.color = CHART_COLORS[index % CHART_COLORS.length];
      const angle = (data.amount / totalAmount) * 360;
      data.startAngle = currentAngle;
      data.sweep = angle;
      data.midAngle = currentAngle + angle / 2;
      gradientStops.push(`${data.color} ${currentAngle}deg ${currentAngle + angle}deg`);
      currentAngle += angle;
    });

    const gradient = `conic-gradient(${gradientStops.join(', ')})`;
    const calloutsSvg = buildDonutCallouts(chartData);

    billsChartContainer.innerHTML = `
      <div class="donut-chart-wrap">
        <svg class="donut-callouts" viewBox="0 0 340 260" aria-hidden="true">${calloutsSvg}</svg>
        <div class="donut-chart" style="background: ${gradient}">
          <div class="donut-hole">
            <span class="donut-hole-label">总${type === 'expense' ? '支出' : '收入'}</span>
            <span class="donut-hole-value">¥${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;

    renderCategorySummary(chartData);
  };

  if (chartTabs) {
    chartTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        chartTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        billsViewState.chartType = tab.dataset.type;
        renderBillsView();
      });
    });
  }

  if (billsFilterTabs) {
    billsFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        billsFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        billsViewState.mode = tab.dataset.view;
        billsViewState.selectedDay = null;
        renderBillsView();
      });
    });
  }

  if (prevDateBtn) {
    prevDateBtn.addEventListener('click', () => {
      if (billsViewState.mode === 'monthly') {
        billsViewState.date.setMonth(billsViewState.date.getMonth() - 1);
      } else {
        billsViewState.date.setFullYear(billsViewState.date.getFullYear() - 1);
      }
      billsViewState.selectedDay = null;
      renderBillsView();
    });
  }

  if (nextDateBtn) {
    nextDateBtn.addEventListener('click', () => {
      if (billsViewState.mode === 'monthly') {
        billsViewState.date.setMonth(billsViewState.date.getMonth() + 1);
      } else {
        billsViewState.date.setFullYear(billsViewState.date.getFullYear() + 1);
      }
      billsViewState.selectedDay = null;
      renderBillsView();
    });
  }

  if (billsCalendarGrid) {
    billsCalendarGrid.addEventListener('click', (e) => {
      const cell = e.target.closest('.bills-calendar-cell[data-day]');
      if (!cell || cell.disabled) return;
      const dayTime = parseInt(cell.dataset.day, 10);
      if (Number.isNaN(dayTime)) return;
      billsViewState.selectedDay = billsViewState.selectedDay === dayTime ? null : dayTime;
      renderBillsView();
    });
  }
  
  // Navigation
  document.querySelectorAll('.accounting-nav .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.accounting-nav .nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Tab switching logic
      const targetId = btn.id;
      
      // Hide all views first
      document.querySelectorAll('.accounting-view').forEach(view => view.classList.remove('active'));
      
      switch (targetId) {
        case 'navHome':
          accountingTitle.textContent = '我的小账本';
          if (accountingHomeView) accountingHomeView.classList.add('active');
          break;
        case 'navBills':
          accountingTitle.textContent = '账单';
          if (accountingBillsView) {
            accountingBillsView.classList.add('active');
            if (typeof renderBillsView === 'function') renderBillsView();
          }
          break;
        case 'navFinancial':
          accountingTitle.textContent = '财务';
          if (accountingFinancialView) accountingFinancialView.classList.add('active');
          break;
        case 'navMine':
          accountingTitle.textContent = '我的';
          if (accountingMineView) accountingMineView.classList.add('active');
          break;
      }
    });
  });

  // Assets full page
  const openAssetsSettingsPage = () => {
    if (!assetsSettingsPage) return;
    if (initialAssetsInput) {
      initialAssetsInput.value = accountingData.settings.initialAssets || 0;
    }
    assetsSettingsPage.classList.add('active');
    assetsSettingsPage.setAttribute('aria-hidden', 'false');
  };

  const closeAssetsSettingsPage = () => {
    if (!assetsSettingsPage) return;
    assetsSettingsPage.classList.remove('active');
    assetsSettingsPage.setAttribute('aria-hidden', 'true');
  };

  if (mineAssetsBtn) {
    mineAssetsBtn.addEventListener('click', openAssetsSettingsPage);
  }

  if (assetsSettingsBack) {
    assetsSettingsBack.addEventListener('click', closeAssetsSettingsPage);
  }

  if (assetsSettingsForm) {
    assetsSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newAssets = parseFloat(initialAssetsInput.value);
      if (!isNaN(newAssets)) {
        accountingData.settings.initialAssets = newAssets;
        saveData();
      }
      closeAssetsSettingsPage();
    });
  }

  // Category Settings Modal
  let currentCategoryType = 'expense';

  const renderCategoryList = () => {
    categoryListContainer.innerHTML = '';
    const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
    const filteredCategories = categoryList.filter(c => c.type === currentCategoryType);
    
    filteredCategories.forEach(cat => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.justifyContent = 'space-between';
      item.style.padding = '8px';
      item.style.background = 'var(--surface)';
      item.style.borderRadius = '8px';
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = cat.name;
      
      const actionsDiv = document.createElement('div');
      
      const editBtn = document.createElement('button');
      editBtn.textContent = '编辑';
      editBtn.style.marginRight = '12px';
      editBtn.style.color = 'var(--primary)';
      editBtn.style.background = 'none';
      editBtn.style.border = 'none';
      editBtn.style.cursor = 'pointer';
      editBtn.style.fontSize = '14px';
      editBtn.onclick = () => {
        const newName = prompt('修改分类名称:', cat.name);
        if (newName && newName.trim()) {
          cat.name = newName.trim();
          saveData();
          renderCategoryList();
        }
      };
      
      const delBtn = document.createElement('button');
      delBtn.textContent = '删除';
      delBtn.style.color = 'var(--expense)';
      delBtn.style.background = 'none';
      delBtn.style.border = 'none';
      delBtn.style.cursor = 'pointer';
      delBtn.style.fontSize = '14px';
      delBtn.onclick = () => {
        if (confirm(`确定删除分类 "${cat.name}" 吗？`)) {
          accountingData.settings.categories = categoryList.filter(c => c.id !== cat.id);
          saveData();
          renderCategoryList();
        }
      };
      
      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(delBtn);
      
      item.appendChild(nameSpan);
      item.appendChild(actionsDiv);
      categoryListContainer.appendChild(item);
    });
  };

  if (mineCategoryBtn) {
    mineCategoryBtn.addEventListener('click', () => {
      renderCategoryList();
      categorySettingsModal.classList.add('active');
      categorySettingsModal.setAttribute('aria-hidden', 'false');
    });
  }

  const todayISODate = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const periodsBetween = (startISO, endISO, frequency) => {
    if (!startISO || !endISO) return 0;
    const start = new Date(startISO + 'T00:00:00');
    const end = new Date(endISO + 'T00:00:00');
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0;
    const days = (end - start) / (24 * 60 * 60 * 1000);
    if (frequency === 'weekly') return Math.max(1, Math.ceil(days / 7));
    if (frequency === 'biweekly') return Math.max(1, Math.ceil(days / 14));
    return Math.max(1, Math.ceil(days / 30.4375));
  };

  const resetPlanEditForm = (mode) => {
    const meta = getPlanModeMeta(mode);
    if (!meta) return;

    draftingPlanMode = mode;
    if (planEditTitle) planEditTitle.textContent = meta.title;
    if (planEditHint) planEditHint.textContent = meta.hint;
    if (planNameLabel) planNameLabel.textContent = meta.kind === 'savings' ? '目标名称' : '计划名称';
    if (planAmountLabel) planAmountLabel.textContent = meta.amountLabel;
    if (planEndDateLabel) planEndDateLabel.textContent = meta.endLabel;

    const nameInput = document.getElementById('planNameInput');
    const amountInput = document.getElementById('planAmountInput');
    const startInput = document.getElementById('planStartDateInput');
    const endInput = document.getElementById('planEndDateInput');
    const colorInput = document.getElementById('planColorInput');
    const noteInput = document.getElementById('planNoteInput');

    if (nameInput) nameInput.value = '';
    if (amountInput) {
      amountInput.value = '';
      amountInput.required = !meta.noAmount && !meta.amountOptional;
    }
    if (planAmountField) planAmountField.hidden = !!meta.noAmount;
    if (startInput) startInput.value = todayISODate();
    if (endInput) {
      endInput.value = '';
      endInput.required = !!meta.endRequired;
    }
    if (planEndDateField) planEndDateField.hidden = false;
    if (colorInput) colorInput.value = meta.defaultColor || '#4CAF50';
    if (noteInput) noteInput.value = '';

    if (planFixedAmountField) planFixedAmountField.hidden = !meta.needsFixed;
    if (planFixedAmountInput) {
      planFixedAmountInput.value = '';
      planFixedAmountInput.required = !!meta.needsFixed;
    }
    if (planFixedAmountLabel) {
      planFixedAmountLabel.textContent = meta.kind === 'debt' ? '每期还款金额 (¥)' : '每期存入金额 (¥)';
    }

    if (planFrequencyField) planFrequencyField.hidden = !(meta.needsFrequency || meta.needsFixed || meta.needsInstallment);
    if (planFrequencySelect) planFrequencySelect.value = 'monthly';

    if (planInstallmentField) planInstallmentField.hidden = !meta.needsInstallment;
    if (planInstallmentInput) {
      planInstallmentInput.value = '';
      planInstallmentInput.required = !!meta.needsInstallment;
    }

    if (planSubmitBtn) planSubmitBtn.textContent = editingPlanId ? '保存修改' : '创建计划';
    updatePlanSuggestHint();
  };

  const fillPlanEditForm = (plan, kind) => {
    const mode = plan.mode || (kind === 'debt' ? 'flexible_debt' : 'long_goal');
    const meta = getPlanModeMeta(mode);
    if (!meta) return;

    resetPlanEditForm(mode);

    const nameInput = document.getElementById('planNameInput');
    const amountInput = document.getElementById('planAmountInput');
    const startInput = document.getElementById('planStartDateInput');
    const endInput = document.getElementById('planEndDateInput');
    const colorInput = document.getElementById('planColorInput');
    const noteInput = document.getElementById('planNoteInput');
    const amount = kind === 'debt' ? plan.totalAmount : plan.targetAmount;

    if (nameInput) nameInput.value = plan.name || '';
    if (amountInput && !meta.noAmount) {
      amountInput.value = amount > 0 ? amount : '';
    }
    if (startInput) startInput.value = plan.startDate || todayISODate();
    if (endInput) endInput.value = plan.endDate || '';
    if (colorInput) colorInput.value = plan.color || meta.defaultColor || '#4CAF50';
    if (noteInput) noteInput.value = plan.note || '';
    if (planFixedAmountInput && plan.fixedAmount > 0) {
      planFixedAmountInput.value = plan.fixedAmount;
    }
    if (planFrequencySelect && plan.frequency) {
      planFrequencySelect.value = plan.frequency;
    }
    if (planInstallmentInput && plan.installments >= 2) {
      planInstallmentInput.value = plan.installments;
    }

    if (planEditTitle) {
      planEditTitle.textContent = `编辑 · ${meta.title}`;
    }
    if (planSubmitBtn) planSubmitBtn.textContent = '保存修改';
    updatePlanSuggestHint();
  };

  const updatePlanSuggestHint = () => {
    if (!planSuggestHint || !draftingPlanMode) return;
    const meta = getPlanModeMeta(draftingPlanMode);
    if (!meta) {
      planSuggestHint.hidden = true;
      return;
    }

    const amount = parseFloat(document.getElementById('planAmountInput')?.value);
    const fixed = parseFloat(planFixedAmountInput?.value);
    const startDate = document.getElementById('planStartDateInput')?.value;
    const endDate = document.getElementById('planEndDateInput')?.value;
    const frequency = planFrequencySelect?.value || 'monthly';
    const installments = parseInt(planInstallmentInput?.value, 10);
    const freqLabel = PLAN_FREQUENCY_LABEL[frequency] || '每期';
    let text = '';

    if (draftingPlanMode === 'short_goal' || draftingPlanMode === 'long_goal' || draftingPlanMode === 'deadline') {
      if (amount > 0 && startDate && endDate) {
        const periods = periodsBetween(startDate, endDate, 'monthly');
        if (periods > 0) {
          const per = amount / periods;
          text = draftingPlanMode === 'deadline'
            ? `按约 ${periods} 个月估算，建议每月还 ${formatCurrency(per)} 才能按期还清。`
            : `按约 ${periods} 个月估算，建议每月存 ${formatCurrency(per)}。`;
        }
      }
    } else if (draftingPlanMode === 'fixed_plan' && fixed > 0) {
      if (amount > 0) {
        const periods = Math.ceil(amount / fixed);
        text = `按${freqLabel}${formatCurrency(fixed)}存，大约 ${periods} 期可达成目标。`;
      } else {
        text = `将按${freqLabel}固定存入 ${formatCurrency(fixed)}，不设总目标也可长期坚持。`;
      }
    } else if (draftingPlanMode === 'fixed_repay' && amount > 0 && fixed > 0) {
      const periods = Math.ceil(amount / fixed);
      text = `按${freqLabel}还 ${formatCurrency(fixed)}，大约 ${periods} 期可还清。`;
    } else if (draftingPlanMode === 'installment' && amount > 0 && installments >= 2) {
      const per = amount / installments;
      text = `分 ${installments} 期，约${freqLabel}应还 ${formatCurrency(per)}。`;
    } else if (draftingPlanMode === 'flexible') {
      text = '自由储蓄不设目标进度百分比，记一笔到对应分类即可累加。';
    } else if (draftingPlanMode === 'flexible_debt' && amount > 0) {
      text = `债务总额 ${formatCurrency(amount)}，可随时还款、不限期数。`;
    }

    if (text) {
      planSuggestHint.textContent = text;
      planSuggestHint.hidden = false;
    } else {
      planSuggestHint.hidden = true;
      planSuggestHint.textContent = '';
    }
  };

  const openPlanSettingsPage = () => {
    closePlanEditPage();
    if (!planSettingsPage) return;
    planSettingsPage.classList.add('active');
    planSettingsPage.setAttribute('aria-hidden', 'false');
  };

  const closePlanSettingsPage = () => {
    closePlanEditPage();
    closeAchievementsPage();
    if (!planSettingsPage) return;
    planSettingsPage.classList.remove('active');
    planSettingsPage.setAttribute('aria-hidden', 'true');
  };

  const openPlanEditPage = (mode, kindFromCard) => {
    const meta = PLAN_MODE_META[mode];
    if (!meta || !planEditPage) return;
    editingPlanId = null;
    draftingPlanKind = kindFromCard === 'savings' || kindFromCard === 'debt'
      ? kindFromCard
      : meta.kind;
    resetPlanEditForm(mode);
    planEditPage.classList.add('active');
    planEditPage.setAttribute('aria-hidden', 'false');
  };

  const openExistingPlanEdit = (planId, kind) => {
    if (!planEditPage || !planId) return;
    const list = kind === 'debt' ? accountingData.debts : accountingData.savings;
    const plan = (list || []).find(p => p.id === planId);
    if (!plan) return;

    editingPlanId = planId;
    draftingPlanKind = kind === 'debt' ? 'debt' : 'savings';
    fillPlanEditForm(plan, draftingPlanKind);
    planEditPage.classList.add('active');
    planEditPage.setAttribute('aria-hidden', 'false');
  };

  const closePlanEditPage = () => {
    draftingPlanMode = null;
    draftingPlanKind = null;
    editingPlanId = null;
    if (planSubmitBtn) planSubmitBtn.textContent = '创建计划';
    if (!planEditPage) return;
    planEditPage.classList.remove('active');
    planEditPage.setAttribute('aria-hidden', 'true');
  };

  if (financialTabSavings) {
    financialTabSavings.addEventListener('click', () => setFinancialPlanTab('savings'));
  }
  if (financialTabDebt) {
    financialTabDebt.addEventListener('click', () => setFinancialPlanTab('debt'));
  }
  setFinancialPlanTab(financialPlanTab);

  if (minePlanBtn) {
    minePlanBtn.addEventListener('click', openPlanSettingsPage);
  }

  if (planSettingsBack) {
    planSettingsBack.addEventListener('click', closePlanSettingsPage);
  }

  if (achievementsOpenBtn) {
    achievementsOpenBtn.addEventListener('click', openAchievementsPage);
  }

  if (achievementsBack) {
    achievementsBack.addEventListener('click', closeAchievementsPage);
  }

  if (planEditBack) {
    planEditBack.addEventListener('click', closePlanEditPage);
  }

  planTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      openPlanEditPage(card.dataset.mode, card.dataset.kind);
    });
  });

  ['planAmountInput', 'planStartDateInput', 'planEndDateInput', 'planFixedAmountInput', 'planInstallmentInput']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updatePlanSuggestHint);
    });
  if (planFrequencySelect) {
    planFrequencySelect.addEventListener('change', updatePlanSuggestHint);
  }

  if (mineImportExportBtn && importExportModal) {
    mineImportExportBtn.addEventListener('click', () => {
      importExportModal.classList.add('active');
      importExportModal.setAttribute('aria-hidden', 'false');
    });
  }

  if (importExportCancel && importExportModal) {
    importExportCancel.addEventListener('click', () => {
      importExportModal.classList.remove('active');
      importExportModal.setAttribute('aria-hidden', 'true');
    });
  }

  if (exportAccountingBtn) {
    exportAccountingBtn.addEventListener('click', () => {
      try {
        const payload = {
          version: 1,
          type: 'accounting_data',
          exportedAt: new Date().toISOString(),
          data: accountingData
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `accounting_backup_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export accounting data failed:', error);
        alert('导出数据失败，请重试。');
      }
    });
  }

  if (importAccountingBtn && importAccountingInput) {
    importAccountingBtn.addEventListener('click', () => {
      importAccountingInput.click();
    });

    importAccountingInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const imported = parsed && parsed.type === 'accounting_data' && parsed.data
            ? parsed.data
            : parsed;

          if (!imported || typeof imported !== 'object' || !Array.isArray(imported.bills) || !imported.settings) {
            throw new Error('Invalid accounting data format');
          }

          if (!confirm('导入数据将覆盖当前所有记账数据（账单、资产、分类、计划等）。确定要继续吗？')) {
            importAccountingInput.value = '';
            return;
          }

          accountingData = {
            bills: Array.isArray(imported.bills) ? imported.bills : [],
            settings: {
              dailyBudget: imported.settings.dailyBudget ?? imported.settings.totalBudget ?? 50.00,
              monthlyBudget: imported.settings.monthlyBudget ?? null,
              totalBudget: imported.settings.totalBudget ?? imported.settings.dailyBudget ?? 50.00,
              budgetPeriod: imported.settings.budgetPeriod || 'daily',
              resetHour: imported.settings.resetHour ?? 7,
              budgetCategories: Array.isArray(imported.settings.budgetCategories)
                ? imported.settings.budgetCategories
                : [],
              categoryBudgets: imported.settings.categoryBudgets && typeof imported.settings.categoryBudgets === 'object'
                ? imported.settings.categoryBudgets
                : {},
              budgetGroups: Array.isArray(imported.settings.budgetGroups)
                ? imported.settings.budgetGroups
                : [],
              hybridDailyEnabled: imported.settings.hybridDailyEnabled,
              hybridMonthlyEnabled: imported.settings.hybridMonthlyEnabled,
              hybridDailyCategories: Array.isArray(imported.settings.hybridDailyCategories)
                ? imported.settings.hybridDailyCategories
                : [],
              hybridMonthlyCategories: Array.isArray(imported.settings.hybridMonthlyCategories)
                ? imported.settings.hybridMonthlyCategories
                : [],
              initialAssets: imported.settings.initialAssets ?? 0.00,
              categories: Array.isArray(imported.settings.categories) && imported.settings.categories.length > 0
                ? imported.settings.categories
                : [...DEFAULT_CATEGORIES]
            },
            savings: Array.isArray(imported.savings) ? imported.savings : [],
            debts: Array.isArray(imported.debts) ? imported.debts : []
          };

          normalizeBudgetSettings();
          saveData();
          if (importExportModal) {
            importExportModal.classList.remove('active');
            importExportModal.setAttribute('aria-hidden', 'true');
          }
          alert('记账数据导入成功！');
        } catch (error) {
          console.error('Import accounting data failed:', error);
          alert('导入失败，文件格式错误或已损坏。');
        }
        importAccountingInput.value = '';
      };
      reader.readAsText(file);
    });
  }

  if (planSettingsForm) {
    planSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const mode = draftingPlanMode;
      const meta = getPlanModeMeta(mode);
      if (!meta) return;

      // 以卡片 data-kind 为准，避免存钱被误标成还钱
      const type = (draftingPlanKind === 'savings' || draftingPlanKind === 'debt')
        ? draftingPlanKind
        : meta.kind;
      const name = document.getElementById('planNameInput').value.trim();
      const amountRaw = parseFloat(document.getElementById('planAmountInput').value);
      const startDate = document.getElementById('planStartDateInput').value;
      const endDate = document.getElementById('planEndDateInput').value;
      const color = document.getElementById('planColorInput').value;
      const note = (document.getElementById('planNoteInput')?.value || '').trim();
      const frequency = planFrequencySelect?.value || 'monthly';
      const fixedAmountRaw = parseFloat(planFixedAmountInput?.value);
      const installmentsRaw = parseInt(planInstallmentInput?.value, 10);

      if (!name || !startDate) return;

      const amount = meta.noAmount ? 0 : amountRaw;
      if (!meta.noAmount && !meta.amountOptional && (!(amount > 0))) return;
      if (meta.amountOptional && amountRaw && !(amountRaw > 0)) return;
      if (meta.endRequired && !endDate) {
        alert('请填写截止日期');
        return;
      }
      if (endDate && endDate < startDate) {
        alert('结束日期不能早于开始日期');
        return;
      }
      if (meta.needsFixed && !(fixedAmountRaw > 0)) {
        alert('请填写每期固定金额');
        return;
      }
      if (meta.needsInstallment && (!(installmentsRaw >= 2))) {
        alert('分期期数至少为 2');
        return;
      }

      const targetOrTotal = meta.noAmount ? 0 : (amountRaw > 0 ? amountRaw : 0);
      let fixedAmount = meta.needsFixed ? fixedAmountRaw : null;
      let installments = meta.needsInstallment ? installmentsRaw : null;

      if (mode === 'installment' && targetOrTotal > 0 && installments >= 2) {
        fixedAmount = Math.round((targetOrTotal / installments) * 100) / 100;
      }

      const sharedFields = {
        name,
        mode,
        startDate,
        endDate: endDate || null,
        color,
        note: note || '',
        frequency: (meta.needsFrequency || meta.needsFixed || meta.needsInstallment) ? frequency : null,
        fixedAmount: fixedAmount > 0 ? fixedAmount : null,
        installments: installments >= 2 ? installments : null
      };

      const categoryName = getPlanNamePrefix(type) + name;

      if (editingPlanId) {
        const list = type === 'debt' ? accountingData.debts : accountingData.savings;
        const plan = (list || []).find(p => p.id === editingPlanId);
        if (!plan) {
          alert('找不到要编辑的计划');
          return;
        }

        Object.assign(plan, sharedFields);
        if (type === 'savings') {
          plan.targetAmount = targetOrTotal;
        } else {
          plan.totalAmount = targetOrTotal;
        }
        // 目标变更后重新计算达成状态
        delete plan.completedAt;
        delete plan.achieved;

        const cat = (accountingData.settings.categories || []).find(c => c.id === editingPlanId);
        if (cat) {
          cat.name = categoryName;
          cat.planType = type;
          cat.planMode = mode;
          cat.isPlan = true;
          cat.type = 'transfer';
        } else {
          accountingData.settings.categories.push({
            id: editingPlanId,
            name: categoryName,
            type: 'transfer',
            isBudgeted: false,
            isPlan: true,
            planType: type,
            planMode: mode
          });
        }

        saveData();
        closePlanEditPage();
        if (achievementsPage?.classList.contains('active')) {
          renderAchievementsPage();
        }
        setFinancialPlanTab(type === 'debt' ? 'debt' : 'savings');
        return;
      }

      const planId = 'plan_' + Date.now();

      accountingData.settings.categories.push({
        id: planId,
        name: categoryName,
        type: 'transfer',
        isBudgeted: false,
        isPlan: true,
        planType: type,
        planMode: mode
      });

      const shared = {
        id: planId,
        ...sharedFields
      };

      if (type === 'savings') {
        accountingData.savings.push({
          ...shared,
          targetAmount: targetOrTotal,
          savedAmount: 0
        });
      } else {
        accountingData.debts.push({
          ...shared,
          totalAmount: targetOrTotal,
          paidAmount: 0
        });
      }

      saveData();
      closePlanSettingsPage();
      setFinancialPlanTab(type === 'debt' ? 'debt' : 'savings');
      const financialNav = document.getElementById('navFinancial');
      if (financialNav) financialNav.click();
    });
  }

  if (categorySettingsCancel) {
    categorySettingsCancel.addEventListener('click', () => {
      categorySettingsModal.classList.remove('active');
      categorySettingsModal.setAttribute('aria-hidden', 'true');
    });
  }

  if (categoryExpenseTab && categoryIncomeTab) {
    categoryExpenseTab.addEventListener('click', () => {
      categoryExpenseTab.classList.add('active');
      categoryIncomeTab.classList.remove('active');
      currentCategoryType = 'expense';
      renderCategoryList();
    });
    
    categoryIncomeTab.addEventListener('click', () => {
      categoryIncomeTab.classList.add('active');
      categoryExpenseTab.classList.remove('active');
      currentCategoryType = 'income';
      renderCategoryList();
    });
  }

  if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = newCategoryName.value.trim();
      if (name) {
        const id = 'custom-' + Date.now();
        accountingData.settings.categories.push({
          id,
          name,
          type: currentCategoryType,
          isBudgeted: currentCategoryType === 'expense'
        });
        saveData();
        newCategoryName.value = '';
        renderCategoryList();
      }
    });
  }

  // Home month picker
  const homeMonthPickerModal = document.getElementById('homeMonthPickerModal');
  const homeMonthPickerCancel = document.getElementById('homeMonthPickerCancel');
  const homeMonthPickerYearEl = document.getElementById('homeMonthPickerYear');
  const homeMonthGrid = document.getElementById('homeMonthGrid');
  const homeMonthPrevYear = document.getElementById('homeMonthPrevYear');
  const homeMonthNextYear = document.getElementById('homeMonthNextYear');

  const renderHomeMonthPicker = () => {
    if (!homeMonthGrid || !homeMonthPickerYearEl) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthsWithBills = getMonthsWithBills(homeMonthPickerYear);

    homeMonthPickerYearEl.textContent = `${homeMonthPickerYear}年`;
    homeMonthGrid.innerHTML = '';

    for (let m = 0; m < 12; m++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'home-month-cell';
      btn.setAttribute('role', 'option');
      btn.dataset.month = String(m);

      const isSelected = homeMonthPickerYear === homeViewMonth.year && m === homeViewMonth.month;
      const isFuture = homeMonthPickerYear > currentYear ||
        (homeMonthPickerYear === currentYear && m > currentMonth);
      const hasBills = monthsWithBills.has(m);

      if (isSelected) btn.classList.add('is-selected');
      if (isFuture) btn.classList.add('is-future');
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      btn.setAttribute('aria-label', `${homeMonthPickerYear}年${m + 1}月${hasBills ? '，有记账' : ''}`);

      btn.innerHTML = `
        <span>${m + 1}月</span>
        <span class="home-month-dot${hasBills ? '' : ' is-empty'}"></span>
      `;

      if (!isFuture) {
        btn.addEventListener('click', () => {
          homeViewMonth = { year: homeMonthPickerYear, month: m };
          closeHomeMonthPicker();
          updateUI();
        });
      }

      homeMonthGrid.appendChild(btn);
    }
  };

  const openHomeMonthPicker = () => {
    if (!homeMonthPickerModal) return;
    homeMonthPickerYear = homeViewMonth.year;
    renderHomeMonthPicker();
    homeMonthPickerModal.classList.add('active');
    homeMonthPickerModal.setAttribute('aria-hidden', 'false');
  };

  const closeHomeMonthPicker = () => {
    if (!homeMonthPickerModal) return;
    homeMonthPickerModal.classList.remove('active');
    homeMonthPickerModal.setAttribute('aria-hidden', 'true');
  };

  if (accountingDate) {
    accountingDate.addEventListener('click', openHomeMonthPicker);
  }

  if (homeMonthPickerCancel) {
    homeMonthPickerCancel.addEventListener('click', closeHomeMonthPicker);
  }

  if (homeMonthPickerModal) {
    homeMonthPickerModal.addEventListener('click', (e) => {
      if (e.target === homeMonthPickerModal) closeHomeMonthPicker();
    });
  }

  if (homeMonthPrevYear) {
    homeMonthPrevYear.addEventListener('click', () => {
      homeMonthPickerYear -= 1;
      renderHomeMonthPicker();
    });
  }

  if (homeMonthNextYear) {
    homeMonthNextYear.addEventListener('click', () => {
      homeMonthPickerYear += 1;
      renderHomeMonthPicker();
    });
  }

  // Initialize
  const accountingAppBtn = document.getElementById('accountingApp');
  if (accountingAppBtn) {
    accountingAppBtn.addEventListener('click', window.openAccountingPage);
  }
  
  window.initializeAccountingApp();
})();
