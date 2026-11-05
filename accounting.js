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
  const assetsSettingsModal = document.getElementById('assetsSettingsModal');
  const assetsSettingsForm = document.getElementById('assetsSettingsForm');
  const assetsSettingsCancel = document.getElementById('assetsSettingsCancel');
  const initialAssetsInput = document.getElementById('initialAssetsInput');
  
  const mineCategoryBtn = document.getElementById('mineCategoryBtn');
  const minePlanBtn = document.getElementById('minePlanBtn');
  const mineImportExportBtn = document.getElementById('mineImportExportBtn');
  const importExportModal = document.getElementById('importExportModal');
  const importExportCancel = document.getElementById('importExportCancel');
  const exportAccountingBtn = document.getElementById('exportAccountingBtn');
  const importAccountingBtn = document.getElementById('importAccountingBtn');
  const importAccountingInput = document.getElementById('importAccountingInput');
  const planSettingsModal = document.getElementById('planSettingsModal');
  const planSettingsForm = document.getElementById('planSettingsForm');
  const planSettingsCancel = document.getElementById('planSettingsCancel');
  const planTabs = planSettingsForm ? planSettingsForm.querySelectorAll('.bill-type-tab') : [];
  const planNameLabel = document.getElementById('planNameLabel');
  const planAmountLabel = document.getElementById('planAmountLabel');
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
      budgetCategories: ['food', 'transport', 'shopping', 'entertainment', 'other-expense'],
      categoryBudgets: {},
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
    daily: { amountLabel: '每日总预算 (¥)', remaining: '剩余今日预算', over: '今日超支', include: '计入今日预算' },
    weekly: { amountLabel: '每周总预算 (¥)', remaining: '剩余本周预算', over: '本周超支', include: '计入本周预算' },
    monthly: { amountLabel: '每月总预算 (¥)', remaining: '剩余本月预算', over: '本月超支', include: '计入本月预算' },
    hybrid: {
      amountLabel: '今日预算 (¥)',
      remaining: '剩余本月预算',
      over: '本月超支',
      include: '计入今日预算',
      dailyRemaining: '今日还能花',
      dailyOver: '今日已多花',
      dailyUsedUp: '今日参考已用完',
      categoryHint: '分类限额按自然月计算，与今日预算独立。'
    }
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
      s.budgetCategories = ['food', 'transport', 'shopping', 'entertainment', 'other-expense'];
    }
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
    return accountingData.settings.budgetCategories.includes(bill.categoryId);
  };

  const countsTowardDailyBudget = (bill) => {
    if (bill.type !== 'expense') return false;
    if (bill.includeInBudget !== undefined) return !!bill.includeInBudget;
    return true;
  };

  const countsTowardMonthlyBudget = (bill) => {
    if (bill.type !== 'expense') return false;
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
    let totalBalance = parseFloat(accountingData.settings.initialAssets) || 0;
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
        totalBalance += amount;
        if (billDate.getMonth() === viewMonth && billDate.getFullYear() === viewYear) {
          monthIncome += amount;
        }
        if (billCalendarDay === todayStart) {
          todayIncome += amount;
        }
      } else {
        totalBalance -= amount;
        if (billDate.getMonth() === viewMonth && billDate.getFullYear() === viewYear) {
          monthExpense += amount;
        }
        if (billCalendarDay === todayStart) {
          todayExpense += amount;
        }
      }
    });

    totalBalanceEl.textContent = formatCurrency(totalBalance);
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
    let periodSpent = 0;
    let dailySpent = 0;
    const spentByCategory = {};

    accountingData.bills.forEach(bill => {
      if (bill.type !== 'expense') return;
      const amount = parseFloat(bill.amount) || 0;

      if (isHybrid) {
        if (isInCurrentBudgetMonth(bill.timestamp) && countsTowardMonthlyBudget(bill)) {
          periodSpent += amount;
          spentByCategory[bill.categoryId] = (spentByCategory[bill.categoryId] || 0) + amount;
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
    if (budgetCardEl) budgetCardEl.classList.toggle('is-hybrid', isHybrid);

    const budgetTotal = isHybrid
      ? (parseFloat(accountingData.settings.monthlyBudget) || 0)
      : (parseFloat(accountingData.settings.totalBudget) || 0);

    const budgetDailyBlockEl = document.getElementById('budgetDailyBlock');
    if (budgetDailyBlockEl) {
      if (isHybrid) {
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
      const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
      const categoryBudgets = accountingData.settings.categoryBudgets || {};
      const categoryPeriodTag = isHybrid ? ' · 本月' : '';
      const rows = categoryList
        .filter(cat => cat.type === 'expense' && parseFloat(categoryBudgets[cat.id]) > 0)
        .map(cat => {
          const limit = parseFloat(categoryBudgets[cat.id]) || 0;
          const spent = spentByCategory[cat.id] || 0;
          const over = spent > limit;
          const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
          return `
            <div class="budget-category-item">
              <div class="budget-category-item-head">
                <span class="budget-category-item-name">${cat.name}${categoryPeriodTag}</span>
                <span class="budget-category-item-meta">${formatCurrency(spent)} / ${formatCurrency(limit)}</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill${over ? ' is-over' : ''}" style="width:${percent}%;${over ? 'background:var(--expense)' : ''}"></div>
              </div>
            </div>
          `;
        });
      budgetCategoryListEl.innerHTML = rows.join('');
      budgetCategoryListEl.classList.toggle('has-items', rows.length > 0);
    }

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
          billsOfDay.forEach(b => {
            if (b.type === 'income') dayIncome += parseFloat(b.amount);
            else dayExpense += parseFloat(b.amount);
          });
          
          let summaryParts = [];
          if (dayExpense > 0) {
            summaryParts.push(`<span class="day-summary expense"><span class="day-tag">支</span>￥${dayExpense.toFixed(2)}</span>`);
          }
          if (dayIncome > 0) {
            summaryParts.push(`<span class="day-summary income"><span class="day-tag">收</span>￥${dayIncome.toFixed(2)}</span>`);
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
            const category = categoryList.find(c => c.id === bill.categoryId)?.name || '未知';
            const date = new Date(bill.timestamp);
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            item.innerHTML = `
              <div class="bill-item-left">
                <span class="bill-category">${category}</span>
                <span class="bill-note-time">${bill.note ? bill.note + ' · ' : ''}${timeStr}</span>
              </div>
              <span class="bill-amount ${bill.type}">${bill.type === 'income' ? '+' : '-'}￥${parseFloat(bill.amount).toFixed(2)}</span>
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

  const updateSavingsOverview = () => {
    const savingsList = document.getElementById('savingsList');
    const emptySavings = document.getElementById('emptySavings');
    
    savingsList.innerHTML = '';

    if (accountingData.savings.length > 0) {
      emptySavings.hidden = true;
      
      accountingData.savings.forEach(goal => {
        // Calculate total saved from bills linked to this goal's category
        const savedAmount = accountingData.bills
          .filter(b => b.categoryId === goal.id)
          .reduce((sum, b) => sum + b.amount, 0);
        goal.savedAmount = savedAmount;

        const percent = Math.min(100, Math.round((savedAmount / goal.targetAmount) * 100)) || 0;
        const color = goal.color || '#4CAF50';
        
        const goalEl = document.createElement('div');
        goalEl.className = 'savings-info';
        goalEl.style.marginBottom = '16px';
        goalEl.innerHTML = `
          <p class="goal-name" style="font-weight: bold; margin-bottom: 8px;">${goal.name}</p>
          <div class="savings-progress-text" style="display: flex; justify-content: space-between; font-size: 12px; color: #666; margin-bottom: 4px;">
            <span>已存 <span>${formatCurrency(savedAmount)}</span> / 目标 <span>${formatCurrency(goal.targetAmount)}</span></span>
            <span>${percent}%</span>
          </div>
          <div class="progress-bar-wrap" style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
            <div class="progress-bar-fill" style="width: ${percent}%; height: 100%; background: ${color}; border-radius: 4px;"></div>
          </div>
        `;
        savingsList.appendChild(goalEl);
      });
    } else {
      emptySavings.hidden = false;
    }
  };

  const updateDebtOverview = () => {
    const debtList = document.getElementById('debtList');
    const emptyDebt = document.getElementById('emptyDebt');
    
    debtList.innerHTML = '';

    if (accountingData.debts.length > 0) {
      emptyDebt.hidden = true;

      accountingData.debts.forEach(debt => {
        // Calculate total paid from bills linked to this debt's category
        const paidAmount = accountingData.bills
          .filter(b => b.categoryId === debt.id)
          .reduce((sum, b) => sum + b.amount, 0);
        debt.paidAmount = paidAmount;

        const percent = Math.min(100, Math.round((paidAmount / debt.totalAmount) * 100)) || 0;
        const color = debt.color || '#F44336';
        
        const debtEl = document.createElement('div');
        debtEl.className = 'debt-info';
        debtEl.style.marginBottom = '16px';
        debtEl.innerHTML = `
          <p class="goal-name" style="font-weight: bold; margin-bottom: 8px;">${debt.name}</p>
          <div class="debt-progress-text" style="display: flex; justify-content: space-between; font-size: 12px; color: #666; margin-bottom: 4px;">
            <span>已还 <span>${formatCurrency(paidAmount)}</span> / 总额 <span>${formatCurrency(debt.totalAmount)}</span></span>
            <span>${percent}%</span>
          </div>
          <div class="progress-bar-wrap" style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
            <div class="progress-bar-fill" style="width: ${percent}%; height: 100%; background: ${color}; border-radius: 4px;"></div>
          </div>
        `;
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
    billCategorySelect.value = bill.categoryId;
    
    billAmountInput.value = String(bill.amount);
    if (amountInputWrap) amountInputWrap.classList.add('is-active');
    
    const date = new Date(bill.timestamp);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    billTimeInput.value = date.toISOString().slice(0, 16);
    
    document.getElementById('billNote').value = bill.note || '';
    
    const includeRow = document.getElementById('billIncludeBudgetRow');
    if (bill.type === 'income') {
      if (includeRow) includeRow.style.display = 'none';
    } else {
      if (includeRow) includeRow.style.display = 'flex';
      syncBillBudgetSwitchUI();
      const includeCheckbox = document.getElementById('billIncludeBudget');
      if (includeCheckbox) includeCheckbox.checked = bill.includeInBudget !== false;
      const includeMonthlyCheckbox = document.getElementById('billIncludeMonthlyBudget');
      if (includeMonthlyCheckbox) {
        includeMonthlyCheckbox.checked = bill.includeInMonthlyBudget !== false;
      }
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
    const includeRow = document.getElementById('billIncludeBudgetRow');
    if (includeRow) includeRow.style.display = 'flex';
    syncBillBudgetSwitchUI();
    syncBillIncludeBudgetDefault();
    
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
  const budgetSettingsForm = document.getElementById('budgetSettingsForm');
  const budgetSettingsBack = document.getElementById('budgetSettingsBack');
  const budgetAmountInput = document.getElementById('budgetAmountInput');
  const budgetAmountLabel = document.getElementById('budgetAmountLabel');
  const budgetDailyAmountInput = document.getElementById('budgetDailyAmountInput');
  const budgetMonthlyAmountInput = document.getElementById('budgetMonthlyAmountInput');
  const budgetSingleAmountField = document.getElementById('budgetSingleAmountField');
  const budgetHybridAmountsField = document.getElementById('budgetHybridAmountsField');
  const budgetPeriodHint = document.getElementById('budgetPeriodHint');
  const categoryBudgetHint = document.getElementById('categoryBudgetHint');
  const budgetResetTimeInput = document.getElementById('budgetResetTimeInput');
  const budgetPeriodTabs = document.querySelectorAll('#budgetPeriodTabs .bill-type-tab');
  const categoryBudgetList = document.getElementById('categoryBudgetList');
  const addCategoryBudgetBtn = document.getElementById('addCategoryBudgetBtn');
  const categoryBudgetPickerModal = document.getElementById('categoryBudgetPickerModal');
  const categoryBudgetPickerCancel = document.getElementById('categoryBudgetPickerCancel');
  const categoryBudgetPickerList = document.getElementById('categoryBudgetPickerList');
  const categoryBudgetPickerEmpty = document.getElementById('categoryBudgetPickerEmpty');
  let draftBudgetPeriod = 'daily';
  let draftCategoryBudgetIds = [];
  let draftCategoryBudgetValues = {};

  const syncBudgetPeriodUI = (period) => {
    draftBudgetPeriod = period;
    const isHybrid = period === 'hybrid';
    budgetPeriodTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.period === period);
    });
    const meta = BUDGET_PERIOD_META[period] || BUDGET_PERIOD_META.daily;
    if (budgetAmountLabel) budgetAmountLabel.textContent = meta.amountLabel;
    if (budgetSingleAmountField) budgetSingleAmountField.hidden = isHybrid;
    if (budgetHybridAmountsField) budgetHybridAmountsField.hidden = !isHybrid;
    if (budgetPeriodHint) budgetPeriodHint.hidden = !isHybrid;
    if (categoryBudgetHint) {
      categoryBudgetHint.textContent = isHybrid
        ? (meta.categoryHint || '分类限额按自然月计算，与今日预算独立。')
        : '按需为支出分类单独设限，点击加号添加。';
    }
  };

  const getExpenseCategories = () => {
    const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
    return categoryList.filter(cat => cat.type === 'expense');
  };

  const collectCategoryBudgetDraftValues = () => {
    if (!categoryBudgetList) return;
    categoryBudgetList.querySelectorAll('input[data-category-id]').forEach(input => {
      draftCategoryBudgetValues[input.dataset.categoryId] = input.value;
    });
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
      const row = document.createElement('div');
      row.className = 'category-budget-row';
      row.innerHTML = `
        <span class="category-budget-name">${cat.name}</span>
        <div class="category-budget-input-wrap">
          <span class="currency">¥</span>
          <input type="number" step="0.01" min="0" placeholder="金额"
            data-category-id="${cat.id}"
            value="${displayValue}"
            aria-label="${cat.name}预算金额">
        </div>
        <button type="button" class="category-budget-remove-btn" data-remove-category-id="${cat.id}" aria-label="移除${cat.name}">&times;</button>
      `;
      categoryBudgetList.appendChild(row);
    });
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

  const openBudgetSettingsPage = () => {
    normalizeBudgetSettings();
    syncBudgetPeriodUI(accountingData.settings.budgetPeriod);
    if (budgetAmountInput) budgetAmountInput.value = accountingData.settings.totalBudget;
    if (budgetDailyAmountInput) budgetDailyAmountInput.value = accountingData.settings.dailyBudget;
    if (budgetMonthlyAmountInput) budgetMonthlyAmountInput.value = accountingData.settings.monthlyBudget;
    budgetResetTimeInput.value = accountingData.settings.resetHour;

    const categoryBudgets = accountingData.settings.categoryBudgets || {};
    draftCategoryBudgetValues = { ...categoryBudgets };
    draftCategoryBudgetIds = getExpenseCategories()
      .filter(cat => parseFloat(categoryBudgets[cat.id]) > 0)
      .map(cat => cat.id);

    renderCategoryBudgetInputs();
    budgetSettingsPage.classList.add('active');
    budgetSettingsPage.setAttribute('aria-hidden', 'false');
  };

  const closeBudgetSettingsPage = () => {
    closeCategoryBudgetPicker();
    budgetSettingsPage.classList.remove('active');
    budgetSettingsPage.setAttribute('aria-hidden', 'true');
  };

  budgetPeriodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      syncBudgetPeriodUI(tab.dataset.period);
    });
  });

  budgetCard.addEventListener('click', openBudgetSettingsPage);
  budgetSettingsBack.addEventListener('click', closeBudgetSettingsPage);

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
      renderCategoryBudgetInputs();
      closeCategoryBudgetPicker();
      const input = categoryBudgetList && categoryBudgetList.querySelector(`input[data-category-id="${catId}"]`);
      if (input) input.focus();
    });
  }

  if (categoryBudgetList) {
    categoryBudgetList.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-category-id]');
      if (!removeBtn) return;
      const catId = removeBtn.dataset.removeCategoryId;
      collectCategoryBudgetDraftValues();
      draftCategoryBudgetIds = draftCategoryBudgetIds.filter(id => id !== catId);
      delete draftCategoryBudgetValues[catId];
      renderCategoryBudgetInputs();
    });
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
  const appIconLink = document.getElementById('appIconLink');
  const appleTouchIconLink = document.getElementById('appleTouchIconLink');

  const setPwaIconStatus = (text) => {
    if (pwaIconStatus) pwaIconStatus.textContent = text || '';
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

  const postIconsToServiceWorker = (payload) => new Promise((resolve) => {
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
      channel.port1.onmessage = () => resolve(true);
      worker.postMessage(payload, [channel.port2]);
      setTimeout(() => resolve(true), 800);
    };
    navigator.serviceWorker.ready.then(send).catch(() => resolve(false));
  });

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

  budgetSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const resetHour = parseInt(budgetResetTimeInput.value, 10);
    accountingData.settings.budgetPeriod = draftBudgetPeriod;

    if (draftBudgetPeriod === 'hybrid') {
      const dailyAmount = parseFloat(budgetDailyAmountInput && budgetDailyAmountInput.value);
      const monthlyAmount = parseFloat(budgetMonthlyAmountInput && budgetMonthlyAmountInput.value);
      if (isNaN(dailyAmount) || dailyAmount <= 0 || isNaN(monthlyAmount) || monthlyAmount <= 0) {
        alert('请填写有效的今日预算和本月预算');
        return;
      }
      accountingData.settings.dailyBudget = dailyAmount;
      accountingData.settings.monthlyBudget = monthlyAmount;
      accountingData.settings.totalBudget = monthlyAmount;
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
    }

    if (!isNaN(resetHour) && resetHour >= 0 && resetHour <= 23) {
      accountingData.settings.resetHour = resetHour;
    }

    const nextCategoryBudgets = {};
    if (categoryBudgetList) {
      categoryBudgetList.querySelectorAll('input[data-category-id]').forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val) && val > 0) {
          nextCategoryBudgets[input.dataset.categoryId] = val;
        }
      });
    }
    accountingData.settings.categoryBudgets = nextCategoryBudgets;

    saveData();
    closeBudgetSettingsPage();
  });

  const billIncludeBudgetRow = document.getElementById('billIncludeBudgetRow');
  const billIncludeMonthlyRow = document.getElementById('billIncludeMonthlyRow');
  const billIncludeDailyLabel = document.getElementById('billIncludeDailyLabel');

  const syncBillBudgetSwitchUI = (periodMeta) => {
    const period = accountingData.settings.budgetPeriod || 'daily';
    const isHybrid = period === 'hybrid';
    const meta = periodMeta || BUDGET_PERIOD_META[period] || BUDGET_PERIOD_META.daily;
    if (billIncludeDailyLabel) {
      billIncludeDailyLabel.textContent = isHybrid ? '计入今日预算' : meta.include;
    }
    if (billIncludeMonthlyRow) billIncludeMonthlyRow.hidden = !isHybrid;
    if (billIncludeBudgetRow) billIncludeBudgetRow.classList.toggle('is-hybrid', isHybrid);
  };

  const syncBillIncludeBudgetDefault = () => {
    const includeCheckbox = document.getElementById('billIncludeBudget');
    const includeMonthlyCheckbox = document.getElementById('billIncludeMonthlyBudget');
    if (includeCheckbox) includeCheckbox.checked = true;
    if (includeMonthlyCheckbox) includeMonthlyCheckbox.checked = true;
  };

  billTypeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      billTypeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateCategorySelect(tab.dataset.type);
      if (tab.dataset.type === 'income') {
        if (billIncludeBudgetRow) billIncludeBudgetRow.style.display = 'none';
      } else {
        if (billIncludeBudgetRow) billIncludeBudgetRow.style.display = 'flex';
        syncBillBudgetSwitchUI();
        syncBillIncludeBudgetDefault();
      }
    });
  });

  const updateCategorySelect = (type) => {
    billCategorySelect.innerHTML = '';
    const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
    categoryList.filter(c => c.type === type).forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
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
    const includeInBudget = document.getElementById('billIncludeBudget').checked;
    const includeMonthlyEl = document.getElementById('billIncludeMonthlyBudget');
    const includeInMonthlyBudget = includeMonthlyEl ? includeMonthlyEl.checked : true;

    if (isNaN(amount) || amount <= 0) return;

    if (editingBillId) {
      const billIndex = accountingData.bills.findIndex(b => b.id === editingBillId);
      if (billIndex !== -1) {
        accountingData.bills[billIndex] = {
          ...accountingData.bills[billIndex],
          type,
          amount: amount.toFixed(2),
          categoryId,
          timestamp,
          note,
          includeInBudget,
          includeInMonthlyBudget
        };
      }
    } else {
      const newBill = {
        id: crypto.randomUUID(),
        type,
        amount: amount.toFixed(2),
        categoryId,
        timestamp,
        note,
        includeInBudget,
        includeInMonthlyBudget
      };
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
  const billsBalanceTotal = document.getElementById('billsBalanceTotal');
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
          byCalendarDay[calendarDay] = { expense: 0, income: 0 };
        }
        if (bill.type === 'expense') byCalendarDay[calendarDay].expense += amount;
        else byCalendarDay[calendarDay].income += amount;
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
    const usesDailyBudget = budgetPeriod === 'daily' || budgetPeriod === 'hybrid';
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
    const isDailyBudget = budgetPeriod === 'daily' || budgetPeriod === 'hybrid';
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

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

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

    let filteredBills = accountingData.bills.filter(bill => {
      const d = new Date(bill.timestamp);
      if (billsViewState.mode === 'monthly') {
        return d.getFullYear() === year && d.getMonth() === month;
      } else {
        return d.getFullYear() === year;
      }
    });

    filteredBills.forEach(bill => {
      if (bill.type === 'expense') expenseTotal += parseFloat(bill.amount);
      else incomeTotal += parseFloat(bill.amount);
    });

    if (billsExpenseTotal) billsExpenseTotal.textContent = formatCurrency(expenseTotal);
    if (billsIncomeTotal) billsIncomeTotal.textContent = formatCurrency(incomeTotal);
    if (billsBalanceTotal) billsBalanceTotal.textContent = formatCurrency(incomeTotal - expenseTotal);

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

  // Assets Settings Modal
  if (mineAssetsBtn) {
    mineAssetsBtn.addEventListener('click', () => {
      initialAssetsInput.value = accountingData.settings.initialAssets || 0;
      assetsSettingsModal.classList.add('active');
      assetsSettingsModal.setAttribute('aria-hidden', 'false');
    });
  }

  if (assetsSettingsCancel) {
    assetsSettingsCancel.addEventListener('click', () => {
      assetsSettingsModal.classList.remove('active');
      assetsSettingsModal.setAttribute('aria-hidden', 'true');
    });
  }

  if (assetsSettingsForm) {
    assetsSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newAssets = parseFloat(initialAssetsInput.value);
      if (!isNaN(newAssets)) {
        accountingData.settings.initialAssets = newAssets;
        saveData();
      }
      assetsSettingsModal.classList.remove('active');
      assetsSettingsModal.setAttribute('aria-hidden', 'true');
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

  if (minePlanBtn) {
    minePlanBtn.addEventListener('click', () => {
      document.getElementById('planNameInput').value = '';
      document.getElementById('planAmountInput').value = '';
      document.getElementById('planStartDateInput').value = '';
      document.getElementById('planEndDateInput').value = '';
      document.getElementById('planColorInput').value = '#4CAF50';
      planSettingsModal.classList.add('active');
      planSettingsModal.setAttribute('aria-hidden', 'false');
    });
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
                : ['food', 'transport', 'shopping', 'entertainment', 'other-expense'],
              categoryBudgets: imported.settings.categoryBudgets && typeof imported.settings.categoryBudgets === 'object'
                ? imported.settings.categoryBudgets
                : {},
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

  if (planSettingsCancel) {
    planSettingsCancel.addEventListener('click', () => {
      planSettingsModal.classList.remove('active');
      planSettingsModal.setAttribute('aria-hidden', 'true');
    });
  }

  if (planTabs.length > 0) {
    planTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        planTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const type = tab.dataset.type;
        if (type === 'savings') {
          planNameLabel.textContent = '目标名字';
          planAmountLabel.textContent = '目标金额 (¥)';
        } else {
          planNameLabel.textContent = '计划名字';
          planAmountLabel.textContent = '债务金额 (¥)';
        }
      });
    });
  }

  if (planSettingsForm) {
    planSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.querySelector('#planSettingsModal .bill-type-tab.active').dataset.type;
      const name = document.getElementById('planNameInput').value.trim();
      const amount = parseFloat(document.getElementById('planAmountInput').value);
      const startDate = document.getElementById('planStartDateInput').value;
      const endDate = document.getElementById('planEndDateInput').value;
      const color = document.getElementById('planColorInput').value;

      if (!name || isNaN(amount) || amount <= 0 || !startDate) return;

      const planId = 'plan_' + Date.now();
      const categoryName = (type === 'savings' ? '小狗钱钱-' : '还钱计划-') + name;
      
      // Add special category
      accountingData.settings.categories.push({
        id: planId,
        name: categoryName,
        type: 'expense',
        isBudgeted: false,
        isPlan: true,
        planType: type
      });

      if (type === 'savings') {
        accountingData.savings.push({
          id: planId,
          name: name,
          targetAmount: amount,
          savedAmount: 0,
          startDate: startDate,
          endDate: endDate || null,
          color: color
        });
      } else {
        accountingData.debts.push({
          id: planId,
          name: name,
          totalAmount: amount,
          paidAmount: 0,
          startDate: startDate,
          endDate: endDate || null,
          color: color
        });
      }

      saveData();
      planSettingsModal.classList.remove('active');
      planSettingsModal.setAttribute('aria-hidden', 'true');
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
