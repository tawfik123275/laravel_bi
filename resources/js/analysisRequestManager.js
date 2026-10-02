class AnalysisManager {

    constructor() {

        this.cache = {};
        this.currentPage = 1;
        this.totalPages = 1;

        this.tbody = document.getElementById('analysisTableBody');
        this.tbodymanager = document.getElementById('analysisManagerTableBody');
     
        this.initEvents();

        if (this.tbody) this.loadTable(1);
        if (this.tbodymanager) this.loadPriceTable();
    }

    // ============================================
    // GET FILTERS
    // ============================================

    getFilters() {

        return {
            search: document.getElementById('searchInput')?.value || '',
            status: document.getElementById('statusFilter')?.value || 'all',
            date: document.getElementById('dateFilter')?.value || 'all',
            barcode: document.getElementById('barcodeSearch')?.value || '',
           


        };
    }
   
    // ============================================
    // LOAD TABLE
    // ============================================

    async loadTable(page = 1) {

        const f = this.getFilters();

        const cacheKey = JSON.stringify({
            page,
            ...f
        });

        // CACHE
        if (this.cache[cacheKey]) {

            console.log('FROM CACHE');

            this.currentPage = page;

            this.renderTable(this.cache[cacheKey].data);

            this.updatePagination(
                this.cache[cacheKey].page,
                this.cache[cacheKey].pages
            );

            return;
        }

        try {

            const url = `/analysis-requests?page=${page}`
                + `&search=${encodeURIComponent(f.search)}`
                + `&status=${encodeURIComponent(f.status)}`
                + `&date=${encodeURIComponent(f.date)}`
                + `&barcode=${encodeURIComponent(f.barcode)}`
                

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
               const text = await response.text();
               console.log(text);

             throw new Error(text);
            }

            const res = await response.json();

            this.currentPage = res.page;
            this.totalPages = res.pages;
            if (res.stats) {
                const statNodes = {
                    statTotalRequests: res.stats.total,
                    statPending: res.stats.pending,
                    statCompleted: res.stats.completed,
                    statRevenue: `${Number(res.stats.amount).toLocaleString()} DA`
                };
                Object.entries(statNodes).forEach(([id, value]) => {
                    const node = document.getElementById(id);
                    if (node) node.textContent = value;
                });
            }

            // STORE CACHE
            this.cache[cacheKey] = res;

            this.renderTable(res.data);

            this.updatePagination(res.page, res.pages);

        } catch (error) {

            console.error(error);

            if (this.tbody) this.tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger">
                        Failed to load data
                    </td>
                </tr>
            `;
        }
    }

    // pagepricemanager table 

     async loadPriceTable() {
        if (!this.tbodymanager) return;

        const f = this.getFilters();

        try {

          
                //  +`&search=${encodeURIComponent(f.search)}`
            const response = await fetch('/analysis-manager/prices', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
               const text = await response.text();
            //    console.log(text);

             throw new Error(text);
            }

            const res = await response.json();
           
             console.log("price manager data");
              
            // console.log(res);
            this.renderManagerTable(res);

        

        } catch (error) {

            console.error(error);

            if (this.tbodymanager) this.tbodymanager.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger">
                        Failed to load data2
                    </td>
                </tr>
            `;
        }
    }
     renderManagerTable(data) {
    if (!this.tbodymanager) return;

    console.log("am here on rendermanagertable function");
    console.log(data);

    this.tbodymanager.innerHTML = '';

    if (!data || !data.length) {

        this.tbodymanager.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    No data found
                </td>
            </tr>
        `;

        return;
    }

    let html = '';

data.forEach(r => {

    html += `
        <tr class="price-row">

            <td>
                <strong>${r.name ?? ''}</strong>
            </td>

            <td>
                <span class="badge bg-primary">
                    ${r.category ?? ''}
                </span>
            </td>

            <td>
                <small class="text-muted">
                    ${r.description ?? 'No description'}
                </small>
            </td>

            <td>
                <small class="text-muted">
                    ${r.tube_color ?? 'No tube color'}
                </small>
            </td>

            <td>
                <small>
                    ${r.normal_range ?? 'Not specified'}
                </small>
            </td>

            <td>
                <strong class="text-success">
                    ${r.price ?? 0} DA
                </strong>
            </td>

            <td>
                ${
                    r.is_active
                        ? `<span class="badge bg-success">Active</span>`
                        : `<span class="badge bg-secondary">Inactive</span>`
                }
            </td>

            <td>
                <div class="btn-group btn-group-sm">

                    <button class="btn btn-outline-primary"
                            onclick="editAnalysisType(${r.id})">
                        Edit
                    </button>

                </div>
            </td>

        </tr>
    `;
});

this.tbodymanager.innerHTML = html;
}
    // ============================================
    // UPDATE PAGINATION
    // ============================================

    updatePagination(page, pages) {

        document.getElementById('pageInfo').innerText =
            `Page ${page} / ${pages}`;
    }

    // ============================================
    // RENDER TABLE
    // ============================================

    renderTable(data) {

        this.tbody.innerHTML = '';

        if (!data || !data.length) {

            this.tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        No data found
                    </td>
                </tr>
            `;

            return;
        }

        data.forEach(r => {
            const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
            })[char]);

            this.tbody.innerHTML += `
                <tr>
                    <td>#${escapeHtml(r.daily_number ?? r.id)}</td>

                    <td>${escapeHtml(r.barcode)}</td>

                    <td>
                        <strong>${escapeHtml(r.patient_name)}</strong>
                        <br>
                        <small>${escapeHtml(r.patient_phone)}</small>
                    </td>

                    <td>${escapeHtml(r.total_amount ?? 0)} DA</td>

                    <td>${escapeHtml(r.priority)}</td>

                    <td>
                        <span class="status-badge badge-${escapeHtml(r.status)}">
                            ${escapeHtml(r.status)}
                        </span>
                    </td>

                    <td>${escapeHtml(r.created_at)}</td>

                    <td>
                        ${this.getActions(r)}
                    </td>
                </tr>
            `;
        });
    }

    // ============================================
    // ACTION BUTTONS
    // ============================================

    getActions(r) {
        const role = document.querySelector('meta[name="auth-role"]')?.content;
        const userId = document.querySelector('meta[name="auth-user-id"]')?.content;
        let btns = `
            <button class="btn btn-sm btn-outline-primary"
                    onclick=" app.viewAnalysisDetails(${r.id})">

                <i class="fas fa-eye"></i> View
            </button>
        `;

        if (['lab', 'lab_staff'].includes(role) && r.status === 'pending' && !r.laboratory_id) {
            btns += `
                <button class="btn btn-sm btn-outline-success" onclick="app.claimRequest(${r.id})">
                    Claim request
                </button>
            `;
        } else if (['lab', 'lab_staff'].includes(role) && r.status === 'in-progress' && Number(r.laboratory_id) === Number(userId)) {
            btns += `
                <button class="btn btn-sm btn-outline-success"
                        onclick=" app.openUpdateModal( ${r.id})">

                    <i class="fas fa-edit"></i> Results
                </button>

            `;
        }

        return btns;
    }

    async claimRequest(id) {
        try {
            const response = await fetch(`/analysis-requests/${id}/claim`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Unable to claim this request.');
            this.cache = {};
            this.loadTable(this.currentPage);
        } catch (error) {
            Swal.fire({icon: 'error', title: 'Unable to claim request', text: error.message});
        }
    }

    // ============================================
    // PAGINATION
    // ============================================

    nextPage() {

        if (this.currentPage < this.totalPages) {

            this.loadTable(this.currentPage + 1);
        }
    }

    prevPage() {

        if (this.currentPage > 1) {

            this.loadTable(this.currentPage - 1);
        }
    }

    // ============================================
    // EVENTS
    // ============================================

    initEvents() {

        let timeout;

        ['searchInput', 'barcodeSearch'].forEach(id => {

            document.getElementById(id)?.addEventListener('input', () => {

                clearTimeout(timeout);

                timeout = setTimeout(() => {

                    this.cache = {};

                    this.loadTable(1);

                }, 300);
            });
        });

        ['statusFilter', 'dateFilter'].forEach(id => {

            document.getElementById(id)?.addEventListener('change', () => {

                this.cache = {};

                this.loadTable(1);
            });
        });

        // CTRL + B
        document.addEventListener('keydown', (e) => {

            if (e.ctrlKey && e.key === 'b') {

                e.preventDefault();

                document.getElementById('barcodeSearch')?.focus();
            }
        });
    }
    setQuickFilter(type) {

    // reset filters
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('dateFilter').value = 'all';

    if (type === 'pending') {
        document.getElementById('statusFilter').value = 'pending';
    }

    if (type === 'completed') {
        document.getElementById('statusFilter').value = 'completed';
    }
    if (type === 'in-progress') {
        document.getElementById('statusFilter').value = 'in-progress';
    }

    if (type === 'today') {
        document.getElementById('dateFilter').value = 'today';
    }


    this.loadTable(1);
}

    ClearFilters(){
        document.getElementById('statusFilter').value = 'all';
         document.getElementById('dateFilter').value = 'all';
        document.getElementById('searchInput').value = '';
        document.getElementById('barcodeSearch').value = '';

        this.loadTable(1);
        
    }

 viewAnalysisDetails(id) {

   

    fetch(`/analysis-requests-details/${id}`)
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
                    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
                })[char]);

                // ✅ FIX 1: correct path (IMPORTANT)
                const analysis = data.data.request;

                // ✅ FIX 2: parse JSON string safely
                let analysisTypes = [];
                try {
                    analysisTypes = JSON.parse(analysis.analysis_types || '[]');
                } catch (e) {
                    analysisTypes = [];
                }

                let detailsHtml = `
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Patient: ${escapeHtml(analysis.patient_name)}</h6>
                            <h6>Doctor: ${escapeHtml(analysis.doctor_id ?? 'N/A')}</h6>
                            <h6>Request Date: ${new Date(analysis.created_at).toLocaleDateString()}</h6>
                        </div>

                        <div class="col-md-6">
                            <h6>Priority:
                                <span class="priority-badge priority-${escapeHtml(analysis.priority)}">
                                    ${escapeHtml(analysis.priority)}
                                </span>
                            </h6>

                            <h6>Status:
                                <span class="status-badge badge-${escapeHtml(analysis.status)}">
                                    ${escapeHtml(analysis.status)}
                                </span>
                            </h6>
                        </div>
                    </div>

                    <hr>
                    <h6>Requested Analyses:</h6>
                    <ul>
                `;

                // ✅ FIX 3: safe loop
                analysisTypes.forEach(type => {
                    detailsHtml += `<li>${escapeHtml(type)}</li>`;
                });

                detailsHtml += `</ul>`;

                if (analysis.clinical_notes) {
                    detailsHtml += `
                        <hr>
                        <h6>Clinical Notes:</h6>
                        <p>${escapeHtml(analysis.clinical_notes)}</p>
                    `;
                }

                // results (safe check)
                if (analysis.results) {
                    let results = {};

                    try {
                        results = typeof analysis.results === "string"
                            ? JSON.parse(analysis.results)
                            : analysis.results;
                    } catch (e) {
                        results = {};
                    }

                    if (Object.keys(results).length > 0) {

                        detailsHtml += `<hr><h6>Results:</h6>`;

                        for (const [key, value] of Object.entries(results)) {
                            detailsHtml += `
                                <div class="result-card">
                                    <h6>${escapeHtml(key)}:</h6>
                                    <p>${escapeHtml(value)}</p>
                                </div>
                            `;
                        }
                    }
                }

                if (analysis.completed_at) {
                    detailsHtml += `
                        <hr>
                        <h6>Completed: ${new Date(analysis.completed_at).toLocaleDateString()}</h6>
                    `;
                }

                Swal.fire({
                    title: 'Analysis Details',
                    html: detailsHtml,
                    width: 700,
                    icon: 'info',
                    confirmButtonText: 'Close'
                });

            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.message || 'Failed to load analysis details',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }

        })
        .catch(error => {
            console.error(error);

            Swal.fire({
                title: 'Error!',
                text: 'Failed to load analysis details',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
}
  openUpdateModal(id) {

    fetch(`/analysis-requests-details/${id}`)
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                const analysis = data.data.request;
                document.getElementById("analysisId").value = analysis.id;
                document.getElementById("analysisStatus").value = 'in-progress';
                let results = {};

                try {
                    results = typeof analysis.results === 'string'
                        ? JSON.parse(analysis.results || '{}')
                        : (analysis.results || {});
                } catch (e) {
                    results = {};
                }

                let analysisDetails = [];
                try {
                    analysisDetails = typeof analysis.analysis_details === 'string'
                        ? JSON.parse(analysis.analysis_details || '[]')
                        : (analysis.analysis_details || []);
                } catch (e) {
                    analysisDetails = [];
                }

                let selectedNames = [];
                try {
                    selectedNames = typeof analysis.analysis_types === 'string'
                        ? JSON.parse(analysis.analysis_types || '[]')
                        : (analysis.analysis_types || []);
                } catch (e) {
                    selectedNames = [];
                }
                const parameters = data.data.parameters || [];
                const resultNames = analysisDetails.flatMap((detail, index) => {
                    const candidates = [detail.real_name, detail.name, selectedNames[index]].filter(Boolean);
                    const matchingParameters = parameters
                        .filter(parameter => candidates.includes(parameter.analysis_name))
                        .map(parameter => parameter.parameter_name);
                    return matchingParameters.length ? matchingParameters : [detail.real_name || detail.name];
                }).concat(Object.keys(results))
                    .filter((name, index, names) => name && names.indexOf(name) === index);
                const container = document.getElementById("resultsContainer");
                container.replaceChildren();

                resultNames.forEach((name, index) => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'mb-3';
                    const label = document.createElement('label');
                    label.className = 'form-label fw-bold';
                    label.htmlFor = `analysis-result-${index}`;
                    label.textContent = name;
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = `analysis-result-${index}`;
                    input.name = `results[${name}]`;
                    input.value = results[name] ?? '';
                    input.maxLength = 1000;
                    input.className = 'form-control';
                    input.autocomplete = 'off';
                    wrapper.append(label, input);
                    container.appendChild(wrapper);
                });

                new bootstrap.Modal(document.getElementById('updateResultsModal')).show();
            } else {
                Swal.fire({icon: 'error', title: 'Unable to load request', text: data.message || 'Request not found.'});
            }
        })
        .catch(() => Swal.fire({icon: 'error', title: 'Unable to load request', text: 'Please try again.'}));
}
submitResultsForm() {

    const id = document.getElementById("analysisId").value;
    const status = document.getElementById("analysisStatus").value;

    const form = document.getElementById("updateResultsForm");
    const formData = new FormData(form);

    fetch(`/analysis-requests-details/${id}/update-results`, {
        method: "POST",
        headers: {
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
            "Accept": "application/json"
        },
        body: formData
    })
    .then(async res => ({response: res, data: await res.json()}))
    .then(({response, data}) => {

        if (response.ok && data.success) {

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Results updated successfully"
            });

            bootstrap.Modal.getInstance(document.getElementById('updateResultsModal')).hide();

            location.reload();

        } else {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.message || Object.values(data.errors || {}).flat().join(' ') || 'Unable to update results.'
            });

        }

    })
    .catch(err => {
        console.error(err);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Server error"
        });
    });
}
 

 
}

// ============================================
// INIT
// ============================================

window.app = null;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('analysisTableBody') || document.getElementById('analysisManagerTableBody')) {
        window.app = new AnalysisManager();
    }
});