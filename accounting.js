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
  const billTypeTabs = document.querySelectorAll('.bill-type-tab');
  const billCategorySelect = document.getElementById('billCategory');
  const billTimeInput = document.getElementById('billTime');
  
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
      resetHour: 7,
      budgetCategories: ['food', 'transport', 'shopping', 'entertainment', 'other-expense'],
      initialAssets: 0.00,
      categories: [] // Store custom categories here, or copy default categories if empty
    },
    savings: [],
    debts: []
  };

  let editingBillId = null;

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

  const updateUI = () => {
    const now = new Date();
    accountingDate.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

    // Calculate Totals
    let totalBalance = parseFloat(accountingData.settings.initialAssets) || 0;
    let monthIncome = 0;
    let monthExpense = 0;
    let todayIncome = 0;
    let todayExpense = 0;
    
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayStart = getCalendarDay();

    const uniqueDays = new Set();

    accountingData.bills.forEach(bill => {
      const billDate = new Date(bill.timestamp);
      const amount = parseFloat(bill.amount);
      const billCalendarDay = getCalendarDay(billDate);
      
      uniqueDays.add(billCalendarDay);

      if (bill.type === 'income') {
        totalBalance += amount;
        if (billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear) {
          monthIncome += amount;
        }
        if (billCalendarDay === todayStart) {
          todayIncome += amount;
        }
      } else {
        totalBalance -= amount;
        if (billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear) {
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
    if (todayIncomeEl) todayIncomeEl.textContent = formatCurrency(todayIncome);
    if (todayExpenseEl) todayExpenseEl.textContent = formatCurrency(todayExpense);

    // Update Mine view stats
    if (totalAccountingDaysEl) {
      totalAccountingDaysEl.textContent = uniqueDays.size;
    }
    if (totalAccountingTimesEl) {
      totalAccountingTimesEl.textContent = accountingData.bills.length;
    }

    // Calculate Daily Budget
    let todaySpent = 0;
    const budgetTodayStart = getBudgetDay();
    accountingData.bills.forEach(bill => {
      if (bill.type === 'expense' && 
          getBudgetDay(new Date(bill.timestamp)) === budgetTodayStart) {
        const include = bill.includeInBudget !== undefined 
          ? bill.includeInBudget 
          : accountingData.settings.budgetCategories.includes(bill.categoryId);
        if (include) {
          todaySpent += parseFloat(bill.amount);
        }
      }
    });

    const budgetTotal = accountingData.settings.dailyBudget;
    const isOverBudget = todaySpent > budgetTotal;
    const budgetRemaining = isOverBudget ? todaySpent - budgetTotal : budgetTotal - todaySpent;
    const budgetPercent = Math.min(100, Math.round((todaySpent / budgetTotal) * 100)) || 0;

    const remainingLabelEl = document.querySelector('.budget-remaining-label');
    if (remainingLabelEl) {
      remainingLabelEl.textContent = isOverBudget ? '超支金额' : '剩余预算';
    }

    if (isOverBudget) {
      budgetRemainingEl.textContent = '-¥' + budgetRemaining.toFixed(2);
      budgetRemainingEl.style.color = 'var(--expense)';
      budgetProgressEl.style.backgroundColor = 'var(--expense)';
    } else {
      budgetRemainingEl.textContent = formatCurrency(budgetRemaining);
      budgetRemainingEl.style.color = '';
      budgetProgressEl.style.backgroundColor = '';
    }

    budgetSpentEl.textContent = formatCurrency(todaySpent);
    budgetTotalEl.textContent = formatCurrency(budgetTotal);
    budgetPercentEl.textContent = `${budgetPercent}%`;
    budgetProgressEl.style.width = `${budgetPercent}%`;

    // Render Bills Grouped by Day
    if (billsListContainer) {
      billsListContainer.innerHTML = '';
      
      if (accountingData.bills.length === 0) {
        const emptySection = document.createElement('section');
        emptySection.className = 'accounting-card recent-bills-card';
        emptySection.innerHTML = `
          <div class="empty-bills">
            <p>还没有账单</p>
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
        accountingData.bills.forEach(bill => {
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
          
          const section = document.createElement('section');
          section.className = 'accounting-card recent-bills-card';
          
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
          
          let summaryStr = [];
          if (dayExpense > 0) summaryStr.push(`支 ${dayExpense.toFixed(2)}`);
          if (dayIncome > 0) summaryStr.push(`收 ${dayIncome.toFixed(2)}`);
          
          section.innerHTML = `
            <div class="card-header">
              <h3 class="card-title">${title}</h3>
              <span class="card-entry-btn" style="color: var(--muted); pointer-events: none;">${summaryStr.join(' · ')}</span>
            </div>
            <div class="bills-list"></div>
          `;
          
          const listContainer = section.querySelector('.bills-list');
          
          billsOfDay.forEach(bill => {
            const item = document.createElement('div');
            item.className = 'bill-item';
            item.style.cursor = 'pointer';
            
            const categoryList = accountingData.settings.categories || DEFAULT_CATEGORIES;
            const category = categoryList.find(c => c.id === bill.categoryId)?.name || '未知';
            const date = new Date(bill.timestamp);
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            item.innerHTML = `
              <div class="bill-item-left">
                <span class="bill-category">${category}</span>
                <span class="bill-note-time">${bill.note ? bill.note + ' · ' : ''}${timeStr}</span>
              </div>
              <span class="bill-amount ${bill.type}">${bill.type === 'income' ? '+' : '-'}${bill.amount}</span>
            `;
            
            item.addEventListener('click', () => {
              openEditBillModal(bill);
            });
            
            listContainer.appendChild(item);
          });
          
          billsListContainer.appendChild(section);
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
    const targetTab = document.querySelector(`.bill-type-tab[data-type="${bill.type}"]`);
    if (targetTab) targetTab.classList.add('active');
    
    updateCategorySelect(bill.type);
    billCategorySelect.value = bill.categoryId;
    
    document.getElementById('billAmount').value = bill.amount;
    
    const date = new Date(bill.timestamp);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    billTimeInput.value = date.toISOString().slice(0, 16);
    
    document.getElementById('billNote').value = bill.note || '';
    
    const includeRow = document.getElementById('billIncludeBudgetRow');
    if (bill.type === 'income') {
      if (includeRow) includeRow.style.display = 'none';
    } else {
      if (includeRow) includeRow.style.display = 'flex';
      const includeCheckbox = document.getElementById('billIncludeBudget');
      if (includeCheckbox) includeCheckbox.checked = bill.includeInBudget !== false;
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
    document.querySelector('.bill-type-tab[data-type="expense"]').classList.add('active');
    updateCategorySelect('expense');
    const includeRow = document.getElementById('billIncludeBudgetRow');
    if (includeRow) includeRow.style.display = 'flex';
    const includeCheckbox = document.getElementById('billIncludeBudget');
    if (includeCheckbox) includeCheckbox.checked = true;
    
    document.getElementById('billAmount').value = '';
    document.getElementById('billNote').value = '';
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
  
  // Budget Settings
  const budgetCard = document.getElementById('budgetCard');
  const budgetSettingsModal = document.getElementById('budgetSettingsModal');
  const budgetSettingsForm = document.getElementById('budgetSettingsForm');
  const budgetSettingsCancel = document.getElementById('budgetSettingsCancel');
  const budgetAmountInput = document.getElementById('budgetAmountInput');
  const budgetResetTimeInput = document.getElementById('budgetResetTimeInput');
  
  budgetCard.addEventListener('click', () => {
    budgetAmountInput.value = accountingData.settings.dailyBudget;
    budgetResetTimeInput.value = accountingData.settings.resetHour;
    
    budgetSettingsModal.classList.add('active');
    budgetSettingsModal.setAttribute('aria-hidden', 'false');
  });
  
  budgetSettingsCancel.addEventListener('click', () => {
    budgetSettingsModal.classList.remove('active');
    budgetSettingsModal.setAttribute('aria-hidden', 'true');
  });
  
  budgetSettingsModal.addEventListener('click', (e) => {
    if (e.target === budgetSettingsModal) {
      budgetSettingsModal.classList.remove('active');
      budgetSettingsModal.setAttribute('aria-hidden', 'true');
    }
  });
  
  budgetSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const amount = parseFloat(budgetAmountInput.value);
    const resetHour = parseInt(budgetResetTimeInput.value, 10);
    
    if (!isNaN(amount) && amount > 0) {
      accountingData.settings.dailyBudget = amount;
    }
    
    if (!isNaN(resetHour) && resetHour >= 0 && resetHour <= 23) {
      accountingData.settings.resetHour = resetHour;
    }
    
    saveData();
    
    budgetSettingsModal.classList.remove('active');
    budgetSettingsModal.setAttribute('aria-hidden', 'true');
  });

  const billIncludeBudgetRow = document.getElementById('billIncludeBudgetRow');

  billTypeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      billTypeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateCategorySelect(tab.dataset.type);
      if (tab.dataset.type === 'income') {
        billIncludeBudgetRow.style.display = 'none';
      } else {
        billIncludeBudgetRow.style.display = 'flex';
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

  addBillForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.querySelector('.bill-type-tab.active').dataset.type;
    const amount = parseFloat(document.getElementById('billAmount').value);
    const categoryId = billCategorySelect.value;
    const timestamp = new Date(billTimeInput.value).getTime();
    const note = document.getElementById('billNote').value;
    const includeInBudget = document.getElementById('billIncludeBudget').checked;

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
          includeInBudget
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
        includeInBudget
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
  const chartTabs = document.querySelectorAll('.chart-tab');

  let billsViewState = {
    mode: 'monthly',
    date: new Date(),
    chartType: 'expense'
  };

  // Color palette for charts
  const CHART_COLORS = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', 
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', 
    '#FF5722', '#795548', '#607D8B'
  ];

  const renderBillsView = () => {
    if (!accountingBillsView || !accountingBillsView.classList.contains('active')) return;

    const year = billsViewState.date.getFullYear();
    const month = billsViewState.date.getMonth();

    if (billsViewState.mode === 'monthly') {
      currentDateDisplay.textContent = `${year}年${month + 1}月`;
    } else {
      currentDateDisplay.textContent = `${year}年`;
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

    renderChart(filteredBills, billsViewState.chartType);
  };

  const renderChart = (bills, type) => {
    if (!billsChartContainer) return;

    const filteredBills = bills.filter(b => b.type === type);
    if (filteredBills.length === 0) {
      billsChartContainer.innerHTML = `<div class="chart-empty">暂无${type === 'expense' ? '支出' : '收入'}数据</div>`;
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
      gradientStops.push(`${data.color} ${currentAngle}deg ${currentAngle + angle}deg`);
      currentAngle += angle;
    });

    const gradient = `conic-gradient(${gradientStops.join(', ')})`;

    // Remove old legend generation
    billsChartContainer.innerHTML = `
      <div class="donut-chart" style="background: ${gradient}">
        <div class="donut-hole">
          <span class="donut-hole-label">总${type === 'expense' ? '支出' : '收入'}</span>
          <span class="donut-hole-value">¥${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    `;

    // Generate Category Summary List HTML
    let categoryListHtml = '';
    
    if (chartData.length > 0) {
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

    if (billsDetailContainer) {
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
    }
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
              dailyBudget: imported.settings.dailyBudget ?? 50.00,
              resetHour: imported.settings.resetHour ?? 7,
              budgetCategories: Array.isArray(imported.settings.budgetCategories)
                ? imported.settings.budgetCategories
                : ['food', 'transport', 'shopping', 'entertainment', 'other-expense'],
              initialAssets: imported.settings.initialAssets ?? 0.00,
              categories: Array.isArray(imported.settings.categories) && imported.settings.categories.length > 0
                ? imported.settings.categories
                : [...DEFAULT_CATEGORIES]
            },
            savings: Array.isArray(imported.savings) ? imported.savings : [],
            debts: Array.isArray(imported.debts) ? imported.debts : []
          };

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

  // Initialize
  const accountingAppBtn = document.getElementById('accountingApp');
  if (accountingAppBtn) {
    accountingAppBtn.addEventListener('click', window.openAccountingPage);
  }
  
  window.initializeAccountingApp();
})();
