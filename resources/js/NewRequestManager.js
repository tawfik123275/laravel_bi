class NewRequestManager {

    constructor() {
        console.log("RequestManager loaded");

        this.selectedAnalyses = new Map();
        this.sentCount = 0;
        this.analysisData = [];

        this.init(); // ✅ مهم: شغّل مباشرة
    }

    // =========================
    // INIT
    // =========================
    init() {

        const searchInput = document.getElementById('analysisSearch');
        searchInput.addEventListener('keyup', () => {
            this.filterAnalyses();
        });
        const clearButton = document.getElementById('clearButton');
        clearButton.addEventListener('click', () => {
            this.clearAnalyses();
        });
        const selectBPO = document.getElementById('selectAllBPO');
        if (selectBPO) {
            selectBPO.addEventListener('click', () => {
                this.selectCommonAnalyses('BPO');
            });
        }
        const emailCard = document.getElementById('emailCard');
        emailCard.addEventListener('click', () => {
            this.toggleNotification('email');
            // this.showToast("Email notifications toggled.",'info');
        });
        const smsCard = document.getElementById('smsCard');
        smsCard.addEventListener('click', () => {
            this.toggleNotification('sms');
            // this.showToast("SMS notifications toggled.",'info');
        });
        const submitButton = document.getElementById('submitRequestButton');
        submitButton.addEventListener('click', () => {
            this.submitRequest();
        });

        const today = new Date().toISOString().split('T')[0];

        const dob = document.getElementById('patientDob');
        const reqDate = document.getElementById('requiredDate');

        if (dob) dob.max = today;
        if (reqDate) {
            reqDate.min = today;
            reqDate.value = today;
        }

        this.loadData();

        this.updateStats();

        // if (searchInput) {
        //     this.enableAutoSelect(searchInput);
        // }
    }

    // =========================
    // LOAD DATA (Laravel API)
    // =========================
    loadData() {
        fetch('/analysis-data')
            .then(res => res.json())
            .then(data => {

                this.analysisData = data;
                console.log(data);
                this.renderAnalyses(data);
            })
            .catch(err => console.error("API error:", err));
    }

    // =========================
    // RENDER
    // =========================
    renderAnalyses(data) {

        const container = document.getElementById('analysisContainer');
        if (!container) return;

        container.innerHTML = '';

        let grouped = {};

        data.forEach(item => {
            let cat = item.category || 'Other';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
        });

        for (const [category, analyses] of Object.entries(grouped)) {

            const section = document.createElement('div');
            section.className = 'analysis-category-section';

            const itemsHtml = analyses.map(a => `
                <div class="col-md-6 mb-3 analysis-item-wrapper"
                    data-name="${a.name.toLowerCase()}"
                    data-desc="${(a.normal_range || '').toLowerCase()}">

                    <div class="analysis-item-card"
                       data-name="${a.name}"
                       onclick="app.toggleAnalysis(${a.id})"
                       id="analysis-${a.id}"
                        onclick="app.toggleAnalysis(${a.id})"
                        id="analysis-${a.id}">

                        <div class="check-icon"><i class="fas fa-check"></i></div>

                        <div class="analysis-name">${a.name}</div>
                        <div class="analysis-desc">  ${a.normal_range ? a.normal_range : 'No normal range'} </div>

                        <span class="analysis-price">
                            ${Number(a.price).toLocaleString()} DA
                        </span>
                    </div>
                </div>
            `).join('');

            section.innerHTML = `
                <div class="category-header">
                    <span>${category}</span>
                </div>
                <div class="row">${itemsHtml}</div>
            `;

            container.appendChild(section);
        }
    }

    // =========================
    // TOGGLE
    // =========================
    toggleAnalysis(id) {

        let found = this.analysisData.find(a => a.id === id);
        if (!found) return;

        const el = document.getElementById(`analysis-${id}`);

        if (this.selectedAnalyses.has(id)) {
            this.selectedAnalyses.delete(id);
            el?.classList.remove('selected');
        } else {
            this.selectedAnalyses.set(id, found);
            el?.classList.add('selected');
        }

        this.updateAll();
    }

    // =========================
    updateAll() {
        this.updateTotal();
        this.updateSummaryTable();
        this.updateStats();
    }

    updateTotal() {
        let total = 0;

        this.selectedAnalyses.forEach(a => total += parseFloat(a.price || 0));

        const totalAmount = document.getElementById('totalAmount');
        const totalCount = document.getElementById('totalCount');

        if (totalAmount) totalAmount.textContent = total.toLocaleString() + ' DA';
        if (totalCount) totalCount.textContent = `${this.selectedAnalyses.size} selected`;
    }

    updateSummaryTable() {

        const tbody = document.getElementById('summaryTableBody');
        if (!tbody) return;

        if (this.selectedAnalyses.size === 0) {
            tbody.innerHTML = `     <tr>
                                        <td colspan="5" class="text-center text-muted py-4">
                                            <i class="fas fa-vials fa-2x mb-2 d-block"></i>
                                            No analyses selected yet
                                        </td>
                                    </tr>
                            `;
            return;
        }

        let html = '';
        let i = 1;

        this.selectedAnalyses.forEach((a, id) => {
            html += `
                <tr>
                    <td>${i++}</td>
                    <td>${a.name}</td>
                    <td>${a.category || ''}</td>
                    <td class="">${a.price} DA</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="app.toggleAnalysis(${id})"><i class="fas fa-times"></i></button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    updateStats() {

        let total = 0;
        this.selectedAnalyses.forEach(a => total += parseFloat(a.price || 0));

        const statTotal = document.getElementById('statTotal');
        const statAmount = document.getElementById('statAmount');
        const statSent = document.getElementById('statSent');

        if (statTotal) statTotal.textContent = this.selectedAnalyses.size;
        if (statAmount) statAmount.textContent = total;
        if (statSent) statSent.textContent = this.sentCount;
    }

    // =========================
    filterAnalyses() {
        const search = document.getElementById('analysisSearch').value.toLowerCase();

        const container = document.getElementById('analysisContainer');

        const sections = Array.from(document.querySelectorAll('.analysis-category-section'));

        let matchedSections = [];
        let otherSections = [];

        sections.forEach(section => {
            let items = section.querySelectorAll('.analysis-item-wrapper');

            let hasMatch = false;

            items.forEach(item => {
                const name = item.dataset.name || '';
                const desc = item.dataset.desc || '';

                const match = name.includes(search) || desc.includes(search);

                item.style.display = match ? '' : 'none';

                if (match) {
                    hasMatch = true;
                }
            });

            if (hasMatch) {
                matchedSections.push(section);
            } else {
                otherSections.push(section);
            }
        });

        // 🔥 move matched categories to top
        matchedSections.forEach(sec => container.prepend(sec));
    }

    // =========================
    clearAnalyses() {
        this.selectedAnalyses.clear();

        document.querySelectorAll('.analysis-item-card')
            .forEach(el => el.classList.remove('selected'));

        this.updateAll();
        this.showToast("Analyses cleared successfully.", 'success')
    }

    submitRequest() {
        
        if (this.selectedAnalyses.size === 0) {
            alert("Select analyses");
            return;
        }

        const payload = {
            patientName: document.getElementById('patientName').value,
            patientPhone: document.getElementById('patientPhone').value,
            patientDob: document.getElementById('patientDob').value,
            prioritySelect: document.getElementById('prioritySelect').value,
            patientEmail: document.getElementById('patientEmail').value,
            requiredDate: document.getElementById('requiredDate').value,
            notification_methods:
            {
                      emailCheck: document.getElementById('emailCheck').checked,
                      smsCheck: document.getElementById('smsCheck').checked
            },

           analyses: Array.from(this.selectedAnalyses.values()).map(a => a.name)
        };

        fetch('/save-analysis-requests', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute('content')
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    console.log("SUCCESS BLOCK");
                    this.showToast("Saved successfully", 'success');
                    // this.clearAll();
                } else {
                    this.showToast(data.message || "Error", 'error');
                }
            })
            .catch(err => {

                console.log(err);
                this.showToast("Server error ", 'error');
            });
    }
    selectCommonAnalyses(type) {

        const common = {
            basic: ['fns', 'glyc', 'uree'],
            diabetes: ['glyc', 'hba1c'],
            BPO: ['FNS', 'tp', 'GROUPAGE SANGUIN', 'HBS', 'HCV', 'HIV', 'UREE SANGUIN', 'GLYCÉMIE À JEUN', 'CREATININE SANGUINE']

        };

        const normalize = (t) =>
            t.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, '')
                .trim();

        const list = common[type] || [];
        console.log("Selecting common analyses for type:", type, list);
        document.querySelectorAll('.analysis-item-card').forEach(el => {

            const name = normalize(el.dataset.name || '');

            const match = list.some(word => name === normalize(word));

            const id = parseInt(el.id.replace('analysis-', ''));

            if (match) {
                el.classList.add('selected');

                const found = this.analysisData.find(a => a.id === id);
                if (found) this.selectedAnalyses.set(id, found);
                console.log(`Selected: ${name} (ID: ${id})`);
            } else {
                el.classList.remove('selected');
                this.selectedAnalyses.delete(id);
                console.log(`Deselected: ${name} (ID: ${id})`);
            }
        });

        this.updateAll();
        this.showToast("BPO analyses selected.", 'success');
    }


    showToast(message, type = 'success') {
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
    toggleNotification(type) {
        const checkbox = document.getElementById(type + 'Check');
        const card = document.getElementById(type + 'Card');
        if (!checkbox || !card)
            return;
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
            this.showToast(`${type.toUpperCase()} notifications enabled.`, 'success');
            card.classList.toggle('active', checkbox.checked);
        } else {
            this.showToast(`${type.toUpperCase()} notifications disabled.`, 'error');
            card.classList.toggle('active', checkbox.checked);
        }
    }
    isValidAlgerianPhone(phone) {
        return /^\+213[5-7][0-9]{8}$/.test(phone);
    }




}
document.getElementById('patientPhone').addEventListener('blur', function () {

    let val = this.value.replace(/\s/g, '');

    if (val.startsWith('0')) {
        val = '+213' + val.substring(1);
    }

    if (val.startsWith('213') && !val.startsWith('+213')) {
        val = '+' + val;
    }

    this.value = val;
});



document.addEventListener('DOMContentLoaded', () => {
    window.app = new NewRequestManager();
});

