import './bootstrap';
// ============================================
// DEMO DATA FOR LIST TABLE
// ============================================
const demoRequests = [
    { id: 1, daily_number: 1, barcode: 'BC001234567', patient_name: 'Ahmed Benali', patient_phone: '+213 555 123 456', total_amount: 4500, priority: 'normal', status: 'pending', created_at: '2026-04-30 10:30:00' },
    { id: 2, daily_number: 2, barcode: 'BC001234568', patient_name: 'Fatima Zohra', patient_phone: '+213 555 789 012', total_amount: 8200, priority: 'urgent', status: 'in-progress', created_at: '2026-04-30 11:15:00' },
    { id: 3, daily_number: 3, barcode: 'BC001234569', patient_name: 'Mohamed Amine', patient_phone: '+213 555 456 789', total_amount: 3200, priority: 'normal', status: 'completed', created_at: '2026-04-29 09:00:00' },
    { id: 4, daily_number: 4, barcode: 'BC001234570', patient_name: 'Aicha Merabet', patient_phone: '+213 555 321 654', total_amount: 5600, priority: 'high', status: 'pending', created_at: '2026-04-30 14:20:00' },
    { id: 5, daily_number: 5, barcode: 'BC001234571', patient_name: 'Karim Taleb', patient_phone: '+213 555 987 321', total_amount: 2100, priority: 'low', status: 'completed', created_at: '2026-04-28 16:45:00' },
    { id: 6, daily_number: 6, barcode: 'BC001234572', patient_name: 'Nadia Boudiaf', patient_phone: '+213 555 741 852', total_amount: 9400, priority: 'urgent', status: 'in-progress', created_at: '2026-04-30 08:10:00' },
    { id: 7, daily_number: 7, barcode: 'BC001234573', patient_name: 'Youcef Khaled', patient_phone: '+213 555 963 741', total_amount: 1500, priority: 'normal', status: 'pending', created_at: '2026-04-30 15:00:00' },
    { id: 8, daily_number: 8, barcode: 'BC001234574', patient_name: 'Samira Hadj', patient_phone: '+213 555 159 753', total_amount: 6700, priority: 'high', status: 'completed', created_at: '2026-04-27 11:30:00' },
];

// ============================================
// ANALYSIS MANAGER CLASS
// ============================================
class AnalysisManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.tbody = document.getElementById('analysisTableBody');
        this.allData = [...demoRequests];
        this.filteredData = [...demoRequests];
        this.initEvents();
        this.loadTable(1);
        this.updateStats();
    }

    getFilters() {
        return {
            search: document.getElementById('searchInput').value.toLowerCase(),
            status: document.getElementById('statusFilter').value,
            date: document.getElementById('dateFilter').value,
            barcode: document.getElementById('barcodeSearch').value.toLowerCase()
        };
    }

    applyFilters() {
        const f = this.getFilters();
        this.filteredData = this.allData.filter(r => {
            const matchesSearch = !f.search || 
                (r.patient_name && r.patient_name.toLowerCase().includes(f.search)) ||
                (r.patient_phone && r.patient_phone.toLowerCase().includes(f.search));
            const matchesStatus = f.status === 'all' || r.status === f.status;
            const matchesBarcode = !f.barcode || (r.barcode && r.barcode.toLowerCase().includes(f.barcode));
            
            let matchesDate = true;
            if (f.date !== 'all') {
                const rDate = new Date(r.created_at);
                const today = new Date();
                if (f.date === 'today') {
                    matchesDate = rDate.toDateString() === today.toDateString();
                } else if (f.date === 'week') {
                    const weekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = rDate >= weekAgo;
                } else if (f.date === 'month') {
                    matchesDate = rDate.getMonth() === today.getMonth() && rDate.getFullYear() === today.getFullYear();
                }
            }
            return matchesSearch && matchesStatus && matchesDate && matchesBarcode;
        });
        this.currentPage = 1;
        this.loadTable(1);
    }

    loadTable(page = 1) {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage) || 1;
        if (page > totalPages) page = totalPages;
        if (page < 1) page = 1;
        this.currentPage = page;
        
        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageData = this.filteredData.slice(start, end);
        
        this.renderTable(pageData);
        document.getElementById('pageInfo').innerText = `Page ${page} / ${totalPages}`;
    }

    renderTable(data) {
        this.tbody.innerHTML = '';
        if (!data.length) {
            this.tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4"><i class="fas fa-flask fa-2x mb-2 d-block"></i>No analysis requests found</td></tr>`;
            return;
        }
        data.forEach(r => {
            const dailyNum = r.daily_number ? String(r.daily_number).padStart(3, '0') : String(r.id).padStart(4, '0');
            const actions = this.getActions(r);
            this.tbody.innerHTML += `
            <tr class="analysis-row" data-status="${r.status}" data-date="${r.created_at}">
                <td><strong>#${dailyNum}</strong></td>
                <td class="barcode-cell">${r.barcode ? `<small class="barcode-text">${r.barcode}</small>` : '<span class="badge bg-warning">No barcode</span>'}</td>
                <td><strong>${r.patient_name || 'Unknown'}</strong><br><small class="text-muted">${r.patient_phone || 'No phone'}</small></td>
                <td><strong>${r.total_amount || 0} DA</strong></td>
                <td><span class="priority-badge priority-${r.priority || 'normal'}">${(r.priority || 'normal').charAt(0).toUpperCase() + (r.priority || 'normal').slice(1)}</span></td>
                <td><span class="status-badge badge-${r.status || 'pending'}">${(r.status || 'pending').charAt(0).toUpperCase() + (r.status || 'pending').slice(1)}</span></td>
                <td>${new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td><div class="action-buttons">${actions}</div></td>
            </tr>`;
        });
    }

    getActions(r) {
        let btns = '';
        btns += `<button class="btn btn-sm btn-outline-primary" onclick="viewAnalysisDetails(${r.id})" title="View"><i class="fas fa-eye"></i></button>`;
        if (r.status === 'pending' || r.status === 'in-progress') {
            btns += `<button class="btn btn-sm btn-outline-success" onclick="printTickets(${r.id})" title="Tickets"><i class="fas fa-ticket-alt"></i></button>`;
        } else {
            btns += `<button class="btn btn-sm btn-outline-success" onclick="updateResults(${r.id})" title="Results"><i class="fas fa-edit"></i></button>`;
            btns += `<button class="btn btn-sm btn-outline-info" onclick="printReport(${r.id})" title="Report"><i class="fas fa-file-alt"></i></button>`;
        }
        btns += `<button class="btn btn-sm btn-outline-danger" onclick="deleteRequest(${r.id}, '${r.patient_name}')" title="Delete"><i class="fas fa-trash"></i></button>`;
        return btns;
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage) || 1;
        if (this.currentPage < totalPages) {
            this.loadTable(this.currentPage + 1);
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.loadTable(this.currentPage - 1);
        }
    }

    updateStats() {
        const total = this.allData.length;
        const pending = this.allData.filter(r => r.status === 'pending').length;
        const completed = this.allData.filter(r => r.status === 'completed').length;
        const revenue = this.allData.reduce((sum, r) => sum + (parseInt(r.total_amount) || 0), 0);
        document.getElementById('statTotalRequests').textContent = total;
        document.getElementById('statPending').textContent = pending;
        document.getElementById('statCompleted').textContent = completed;
        document.getElementById('statRevenue').textContent = revenue.toLocaleString();
    }

    initEvents() {
        let timeout;
        ['searchInput','barcodeSearch'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => this.applyFilters(), 300);
                });
            }
        });
        ['statusFilter','dateFilter'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                const barcodeInput = document.getElementById('barcodeSearch');
                if (barcodeInput) {
                    barcodeInput.focus();
                    barcodeInput.select();
                }
            }
        });
    }
}

// ============================================
// ANALYSIS DATA
// ============================================
const analysisData = {
    "Blood Tests": [
        { id: 1, name: "Complete Blood Count (CBC)", price: 1500, desc: "Red & white blood cells, hemoglobin, platelets" },
        { id: 2, name: "Blood Sugar (Glucose)", price: 800, desc: "Fasting blood glucose level" },
        { id: 3, name: "HbA1c", price: 1200, desc: "3-month average blood sugar" },
        { id: 4, name: "Lipid Profile", price: 2000, desc: "Cholesterol, triglycerides, HDL, LDL" },
        { id: 5, name: "Liver Function", price: 1800, desc: "ALT, AST, ALP, bilirubin" },
        { id: 6, name: "Kidney Function", price: 1600, desc: "Creatinine, BUN, eGFR" },
        { id: 7, name: "Iron Panel", price: 1400, desc: "Ferritin, iron, TIBC" },
        { id: 8, name: "Vitamin D", price: 2000, desc: "25-hydroxyvitamin D level" }
    ],
    "Urine Tests": [
        { id: 9, name: "Urinalysis", price: 600, desc: "Physical, chemical, microscopic exam" },
        { id: 10, name: "Urine Culture", price: 1200, desc: "Bacterial identification & sensitivity" },
        { id: 11, name: "24h Urine Protein", price: 1500, desc: "Protein excretion over 24 hours" },
        { id: 12, name: "Microalbumin", price: 1000, desc: "Early kidney damage marker" }
    ],
    "Imaging": [
        { id: 13, name: "Chest X-Ray", price: 2500, desc: "Thoracic cavity examination" },
        { id: 14, name: "Abdominal Ultrasound", price: 3000, desc: "Organs in abdominal cavity" },
        { id: 15, name: "Thyroid Ultrasound", price: 2800, desc: "Thyroid gland structure" },
        { id: 16, name: "ECG", price: 1200, desc: "Electrical activity of heart" }
    ],
    "Hormone Tests": [
        { id: 17, name: "TSH", price: 1000, desc: "Thyroid stimulating hormone" },
        { id: 18, name: "T3 & T4", price: 1500, desc: "Thyroid hormones panel" },
        { id: 19, name: "Cortisol", price: 1800, desc: "Stress hormone level" },
        { id: 20, name: "Testosterone", price: 2000, desc: "Male sex hormone" },
        { id: 21, name: "Progesterone", price: 2000, desc: "Female sex hormone" },
        { id: 22, name: "FSH & LH", price: 2200, desc: "Reproductive hormones" }
    ],
    "Microbiology": [
        { id: 23, name: "Blood Culture", price: 2500, desc: "Bacterial/fungal detection in blood" },
        { id: 24, name: "Stool Culture", price: 1800, desc: "Pathogen identification" },
        { id: 25, name: "H. pylori Test", price: 1500, desc: "Stomach bacteria detection" },
        { id: 26, name: "COVID-19 PCR", price: 4000, desc: "Viral RNA detection" }
    ]
};

let selectedAnalyses = new Map();
let sentCount = 0;
let app;

// ============================================
// PAGE NAVIGATION
// ============================================


// ============================================
// LIST PAGE FUNCTIONS
// ============================================
function filterTable() {
    if (app) app.applyFilters();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('barcodeSearch').value = '';
    if (app) app.applyFilters();
}

function setQuickFilter(type) {
    if (type === 'today') {
        document.getElementById('dateFilter').value = 'today';
        document.getElementById('statusFilter').value = 'all';
    } else {
        document.getElementById('statusFilter').value = type;
        document.getElementById('dateFilter').value = 'all';
    }
    if (app) app.applyFilters();
}

function manualBarcodeEntry() {
    const input = document.getElementById('barcodeSearch');
    input.focus();
    input.select();
}

function printTable() {
    window.print();
}

function exportToExcel() {
    showToast('Export to Excel feature coming soon', 'info');
}

function viewAnalysisDetails(id) {
    showToast('Viewing analysis #' + id, 'info');
}

function printTickets(id) {
    showToast('Printing tickets for analysis #' + id, 'info');
}

function updateResults(id) {
    showToast('Updating results for analysis #' + id, 'info');
}

function printReport(id) {
    showToast('Printing report for analysis #' + id, 'info');
}

function deleteRequest(id, name) {
    if (confirm('Are you sure you want to delete analysis request for ' + name + '?')) {
        showToast('Analysis #' + id + ' deleted', 'success');
        if (app) {
            app.allData = app.allData.filter(r => r.id !== id);
            app.applyFilters();
            app.updateStats();
        }
    }
}

// ============================================
// NEW PAGE FUNCTIONS
// ============================================
function initNewPage() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('patientDob').max = today;
    document.getElementById('requiredDate').min = today;
    document.getElementById('requiredDate').value = today;
    renderAnalyses();
}

function renderAnalyses() {
    const container = document.getElementById('analysisContainer');
    if (!container) return;
    container.innerHTML = '';
    for (const [category, analyses] of Object.entries(analysisData)) {
        const section = document.createElement('div');
        section.className = 'analysis-category-section';
        section.dataset.category = category.toLowerCase().replace(/\\s/g, '');
        const itemsHtml = analyses.map(a => `
            <div class="col-md-6 mb-3 analysis-item-wrapper" 
                 data-name="${a.name.toLowerCase()}" 
                 data-desc="${a.desc.toLowerCase()}"
                 data-category="${category.toLowerCase().replace(/\\s/g, '')}">
                <div class="analysis-item-card" onclick="toggleAnalysis(${a.id})" id="analysis-${a.id}">
                    <div class="check-icon"><i class="fas fa-check"></i></div>
                    <div class="analysis-name">${a.name}</div>
                    <div class="analysis-desc">${a.desc}</div>
                    <span class="analysis-price">${a.price.toLocaleString()} DA</span>
                </div>
            </div>
        `).join('');
        section.innerHTML = `
            <div class="category-header">
                <span><i class="fas fa-folder-open me-2"></i>${category}</span>
                <span class="badge bg-light text-dark" id="count-${category.replace(/\\s/g, '')}">0/${analyses.length}</span>
            </div>
            <div class="row">${itemsHtml}</div>
        `;
        container.appendChild(section);
    }
}

function toggleAnalysis(id) {
    const element = document.getElementById(`analysis-${id}`);
    if (!element) return;
    if (selectedAnalyses.has(id)) {
        selectedAnalyses.delete(id);
        element.classList.remove('selected');
    } else {
        for (const [cat, analyses] of Object.entries(analysisData)) {
            const analysis = analyses.find(a => a.id === id);
            if (analysis) {
                selectedAnalyses.set(id, { ...analysis, category: cat });
                break;
            }
        }
        element.classList.add('selected');
    }
    updateTotal();
    updateCategoryCounts();
    updateSummaryTable();
    updateNewStats();
}

function updateTotal() {
    let total = 0;
    selectedAnalyses.forEach(a => total += a.price);
    document.getElementById('totalAmount').textContent = total.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' DA';
    document.getElementById('totalCount').textContent = `${selectedAnalyses.size} analysis${selectedAnalyses.size !== 1 ? 'es' : ''} selected`;
    document.getElementById('headerCount').textContent = `${selectedAnalyses.size} selected`;
    document.getElementById('tableTotal').textContent = total.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' DA';
}

function updateCategoryCounts() {
    for (const [category, analyses] of Object.entries(analysisData)) {
        const count = analyses.filter(a => selectedAnalyses.has(a.id)).length;
        const badge = document.getElementById(`count-${category.replace(/\\s/g, '')}`);
        if (badge) badge.textContent = `${count}/${analyses.length}`;
    }
}

function updateSummaryTable() {
    const tbody = document.getElementById('summaryTableBody');
    if (!tbody) return;
    if (selectedAnalyses.size === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    <i class="fas fa-vials fa-2x mb-2 d-block"></i>
                    No analyses selected yet
                </td>
            </tr>`;
        return;
    }
    let html = '';
    let idx = 1;
    selectedAnalyses.forEach((analysis, id) => {
        html += `
            <tr>
                <td class="text-muted">${idx}</td>
                <td><strong>${analysis.name}</strong></td>
                <td><span class="badge bg-light text-dark">${analysis.category}</span></td>
                <td class="text-end fw-semibold">${analysis.price.toLocaleString()} DA</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeAnalysis(${id})" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>`;
        idx++;
    });
    tbody.innerHTML = html;
}

function removeAnalysis(id) {
    toggleAnalysis(id);
}

function filterAnalyses() {
    const search = document.getElementById('analysisSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value.toLowerCase();
    let visibleCount = 0;
    document.querySelectorAll('.analysis-item-wrapper').forEach(item => {
        const name = item.dataset.name;
        const desc = item.dataset.desc;
        const cat = item.dataset.category;
        const matchesSearch = !search || name.includes(search) || desc.includes(search);
        const matchesCategory = !category || cat === category;
        if (matchesSearch && matchesCategory) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    document.querySelectorAll('.analysis-category-section').forEach(section => {
        const visibleItems = section.querySelectorAll('.analysis-item-wrapper:not([style*="display: none"])');
        section.style.display = visibleItems.length > 0 ? '' : 'none';
    });
    document.getElementById('noResults').classList.toggle('d-none', visibleCount > 0);
}

function selectCommon(type) {
    clearAnalyses();
    let ids = [];
    if (type === 'BPO') {
        ids = [1, 2, 4, 5, 6];
    } else if (type === 'basic') {
        ids = [1, 2, 9, 16];
    } else if (type === 'diabetes') {
        ids = [2, 3, 4, 12];
    }
    ids.forEach(id => toggleAnalysis(id));
}

function clearAnalyses() {
    selectedAnalyses.clear();
    document.querySelectorAll('.analysis-item-card').forEach(el => el.classList.remove('selected'));
    updateTotal();
    updateCategoryCounts();
    updateSummaryTable();
    updateNewStats();
}

function toggleNotification(type) {
    const checkbox = document.getElementById(type + 'Check');
    const card = document.getElementById(type + 'Card');
    if (!checkbox || !card) return;
    checkbox.checked = !checkbox.checked;
    card.classList.toggle('active', checkbox.checked);
}

function submitRequest() {
    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const email = document.getElementById('patientEmail').value.trim();
    const sms = document.getElementById('smsCheck').checked;
    const emailNotif = document.getElementById('emailCheck').checked;
    
    if (!name) { showToast('Please enter patient name', 'error'); return; }
    if (!phone) { showToast('Please enter phone number', 'error'); return; }
    if (selectedAnalyses.size === 0) { showToast('Please select at least one analysis', 'error'); return; }
    if (!sms && !emailNotif) { showToast('Please select a notification method', 'error'); return; }
    if (emailNotif && !email) { showToast('Please enter email for email notification', 'error'); return; }
    
    const notifications = [];
    if (sms) notifications.push('SMS');
    if (emailNotif) notifications.push('Email');
    
    showToast(`Sending ${notifications.join(' & ')} notification...`, 'info');
    
    setTimeout(() => {
        showToast(`Request submitted! ${notifications.join(' & ')} sent to ${name}`, 'success');
        addToHistory(name, phone, selectedAnalyses.size, notifications);
        sentCount++;
        updateNewStats();
        
        // Add to list data
        const newId = Math.max(...demoRequests.map(r => r.id)) + 1;
        let total = 0;
        selectedAnalyses.forEach(a => total += a.price);
        const newRequest = {
            id: newId,
            daily_number: newId,
            barcode: '',
            patient_name: name,
            patient_phone: phone,
            total_amount: total,
            priority: document.getElementById('prioritySelect').value,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        demoRequests.unshift(newRequest);
        if (app) {
            app.allData = [...demoRequests];
            app.applyFilters();
            app.updateStats();
        }
        clearAll();
    }, 1500);
}

function addToHistory(name, phone, count, methods) {
    const history = document.getElementById('notificationHistory');
    const time = new Date().toLocaleString();
    const methodIcons = methods.map(m =>
        m === 'SMS' ? '<i class="fas fa-sms text-primary"></i>' : '<i class="fas fa-envelope text-success"></i>'
    ).join(' ');
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div>
                <h6 class="mb-1 fw-bold">${name}</h6>
                <small class="text-muted"><i class="fas fa-phone me-1"></i>${phone}</small>
            </div>
            <span class="status-badge badge-completed">Sent</span>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2">
            <small class="text-muted">${count} analyses • ${methodIcons}</small>
            <small class="text-muted">${time}</small>
        </div>`;
    if (history.querySelector('.text-center')) history.innerHTML = '';
    history.insertBefore(item, history.firstChild);
    document.getElementById('historyCount').textContent = history.querySelectorAll('.history-item').length;
}

function updateNewStats() {
    let total = 0;
    selectedAnalyses.forEach(a => total += a.price);
    document.getElementById('statTotal').textContent = selectedAnalyses.size;
    document.getElementById('statAmount').textContent = total.toLocaleString();
    document.getElementById('statPendingNew').textContent = selectedAnalyses.size;
    document.getElementById('statSent').textContent = sentCount;
}

function clearAll() {
    document.getElementById('patientForm').reset();
    clearAnalyses();
    document.getElementById('smsCheck').checked = true;
    document.getElementById('emailCheck').checked = false;
    document.getElementById('smsCard').classList.add('active');
    document.getElementById('emailCard').classList.remove('active');
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('requiredDate').value = today;
}

// ============================================
// GLOBAL FUNCTIONS
// ============================================
function toggleLanguage() {
    const body = document.body;
    if (body.classList.contains('ltr')) {
        body.classList.remove('ltr');
        body.classList.add('rtl');
    } else {
        body.classList.remove('rtl');
        body.classList.add('ltr');
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    const icons = {
        success: '<i class="fas fa-check-circle text-success fa-lg"></i>',
        error: '<i class="fas fa-exclamation-circle text-danger fa-lg"></i>',
        info: '<i class="fas fa-info-circle text-primary fa-lg"></i>'
    };
    const borders = {
        success: 'var(--success-color)',
        error: 'var(--danger-color)',
        info: 'var(--primary-color)'
    };
    const isRTL = document.body.classList.contains('rtl');
    toast.style.borderLeftColor = isRTL ? 'transparent' : borders[type];
    toast.style.borderRightColor = isRTL ? borders[type] : 'transparent';
    toast.innerHTML = `
        ${icons[type]}
        <div>
            <div class="fw-semibold">${type === 'error' ? 'Error' : type === 'info' ? 'Processing' : 'Success'}</div>
            <small class="text-muted">${message}</small>
        </div>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ============================================
// SEARCH INPUT - SELECT ALL ON FOCUS
// ============================================
function setupSearchSelect(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('focus', function() {
        const self = this;
        setTimeout(() => { self.select(); }, 0);
    });
    input.addEventListener('click', function() {
        const self = this;
        setTimeout(() => { self.select(); }, 0);
    });
}

// ============================================
// INITIALIZATION
// ============================================
