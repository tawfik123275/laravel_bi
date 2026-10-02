function parseJsonValue(value, fallback) {
    if (!value) return fallback;

    if (typeof value !== 'string') return value;

    try {
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

class AnalysisManager {

    constructor() {

        this.cache = {};
        this.currentPage = 1;
        this.totalPages = 1;

        this.tbody = document.getElementById('analysisTableBody');
        this.tbodymanager = document.getElementById('analysisManagerTableBody');
     
        this.initEvents();

        this.loadTable(1);
           this.loadPriceTable();
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

            // STORE CACHE
            this.cache[cacheKey] = res;

            this.renderTable(res.data);

            this.updatePagination(res.page, res.pages);

        } catch (error) {

            console.error(error);

            this.tbody.innerHTML = `
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

            this.tbodymanager.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger">
                        Failed to load data2
                    </td>
                </tr>
            `;
        }
    }
     renderManagerTable(data) {

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

            this.tbody.innerHTML += `
                <tr>
                    <td>#${r.daily_number ?? r.id}</td>

                    <td>${r.barcode ?? ''}</td>

                    <td>
                        <strong>${r.patient_name ?? ''}</strong>
                        <br>
                        <small>${r.patient_phone ?? ''}</small>
                    </td>

                    <td>${r.total_amount ?? 0} DA</td>

                    <td>${r.priority ?? ''}</td>

                    <td>
                        <span class="status-badge badge-${r.status}">
                            ${r.status}
                        </span>
                    </td>

                    <td>${r.created_at ?? ''}</td>

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

        let btns = `
            <button class="btn btn-sm btn-outline-primary"
                    onclick=" app.viewAnalysisDetails(${r.id})">

                <i class="fas fa-eye"></i> View
            </button>
        `;

        if (r.status === 'pending' || r.status === 'in-progress') {

            btns += `
                <button class="btn btn-sm btn-outline-success"
                        onclick="app.printTickets(${r.id})">

                    Tickets
                </button>
            `;

        } else {

            btns += `
                <button class="btn btn-sm btn-outline-success"
                        onclick=" app.openUpdateModal( ${r.id})">

                    <i class="fas fa-edit"></i> Results
                </button>

                <button class="btn btn-sm btn-outline-info"
                        onclick="app.printReport(${r.id})">

                    Report
                </button>
            `;
        }

        btns += `
            <button class="btn btn-sm btn-outline-danger"
                    onclick="app.delete(${r.id}, '${r.patient_name}')">

                Delete
            </button>
        `;

        return btns;
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
                            <h6>Patient: ${analysis.patient_name}</h6>
                            <h6>Doctor: ${analysis.doctor_id ?? 'N/A'}</h6>
                            <h6>Request Date: ${new Date(analysis.created_at).toLocaleDateString()}</h6>
                        </div>

                        <div class="col-md-6">
                            <h6>Priority:
                                <span class="priority-badge priority-${analysis.priority}">
                                    ${analysis.priority}
                                </span>
                            </h6>

                            <h6>Status:
                                <span class="status-badge badge-${analysis.status}">
                                    ${analysis.status}
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
                    detailsHtml += `<li>${type}</li>`;
                });

                detailsHtml += `</ul>`;

                if (analysis.clinical_notes) {
                    detailsHtml += `
                        <hr>
                        <h6>Clinical Notes:</h6>
                        <p>${analysis.clinical_notes}</p>
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
                                    <h6>${key}:</h6>
                                    <p>${value}</p>
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

    printTickets(id) {
        this.printAnalysis(id, 'Analysis Request');
    }

    printReport(id) {
        this.printAnalysis(id, 'Analysis Report');
    }

    printAnalysis(id, title) {
        const printWindow = window.open('', '_blank', 'width=900,height=700');

        if (!printWindow) {
            Swal.fire('Print unavailable', 'Please allow popups to print this request.', 'warning');
            return;
        }

        fetch(`/analysis-requests-details/${id}`, {
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Unable to load the request');
                }

                return response.json();
            })
            .then(data => {
                if (!data.success) {
                    throw new Error(data.message || 'Unable to load the request');
                }

                const request = data.data.request;
                const analysisTypes = parseJsonValue(request.analysis_types, []);
                const analysisDetails = parseJsonValue(request.analysis_details, []);
                const analyses = Array.isArray(analysisDetails) && analysisDetails.length
                    ? analysisDetails
                    : (Array.isArray(analysisTypes) ? analysisTypes : []);
                const results = parseJsonValue(request.results, {});
                const analysisRows = analyses.map((analysis, index) => {
                    const name = typeof analysis === 'object'
                        ? (analysis.real_name || analysis.name || '')
                        : analysis;
                    const price = typeof analysis === 'object' && analysis.price != null
                        ? `${escapeHtml(analysis.price)} DA`
                        : '';

                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${escapeHtml(name)}</td>
                            <td>${price}</td>
                        </tr>`;
                }).join('');
                const resultRows = results && typeof results === 'object'
                    ? Object.entries(results).map(([key, value]) => `
                        <tr>
                            <td>${escapeHtml(key)}</td>
                            <td>${escapeHtml(value)}</td>
                        </tr>`).join('')
                    : '';

                printWindow.document.write(`
                    <!doctype html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <title>${escapeHtml(title)} #${escapeHtml(request.id)}</title>
                        <style>
                            body { font-family: Arial, sans-serif; color: #212529; margin: 32px; }
                            h1 { margin-bottom: 4px; }
                            .muted { color: #6c757d; }
                            .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 32px; margin: 20px 0; }
                            table { border-collapse: collapse; width: 100%; margin: 12px 0 24px; }
                            th, td { border: 1px solid #ced4da; padding: 8px; text-align: left; }
                            th { background: #f1f3f5; }
                            @media print { body { margin: 15mm; } }
                        </style>
                    </head>
                    <body>
                        <h1>${escapeHtml(title)}</h1>
                        <div class="muted">Request #${escapeHtml(request.id)}${request.barcode ? ` · ${escapeHtml(request.barcode)}` : ''}</div>
                        <div class="summary">
                            <div><strong>Patient:</strong> ${escapeHtml(request.patient_name || 'N/A')}</div>
                            <div><strong>Phone:</strong> ${escapeHtml(request.patient_phone || 'N/A')}</div>
                            <div><strong>Doctor:</strong> ${escapeHtml(request.doctor_id || 'N/A')}</div>
                            <div><strong>Date:</strong> ${escapeHtml(request.created_at || 'N/A')}</div>
                            <div><strong>Status:</strong> ${escapeHtml(request.status || 'N/A')}</div>
                            <div><strong>Total:</strong> ${escapeHtml(request.total_amount || 0)} DA</div>
                        </div>
                        <h2>Requested analyses</h2>
                        <table>
                            <thead><tr><th>#</th><th>Analysis</th><th>Price</th></tr></thead>
                            <tbody>${analysisRows || '<tr><td colspan="3">No analyses found</td></tr>'}</tbody>
                        </table>
                        ${request.clinical_notes ? `<h2>Clinical notes</h2><p>${escapeHtml(request.clinical_notes)}</p>` : ''}
                        ${resultRows ? `<h2>Results</h2><table><thead><tr><th>Parameter</th><th>Value</th></tr></thead><tbody>${resultRows}</tbody></table>` : ''}
                    </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                printWindow.onload = () => printWindow.print();
            })
            .catch(error => {
                printWindow.close();
                Swal.fire('Print failed', error.message, 'error');
            });
    }

  openUpdateModal(id) {

    fetch(`/analysis-requests-details/${id}`)
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                const analysis = data.data.request;

                // تعبئة الفورم
                document.getElementById("analysisId").value = analysis.id;
                document.getElementById("analysisStatus").value = analysis.status;

                // عرض النتائج القديمة داخل المودال
                let results = {};

                try {
                    results = analysis.results ? JSON.parse(analysis.results) : {};
                } catch (e) {
                    results = {};
                }

                let container = document.getElementById("resultsContainer");
                container.innerHTML = "";

                for (const key in results) {
                    container.innerHTML += `
                        <div class="mb-4 d-flex align-items-center gap-3">
    <label 
        for="result-${key}" 
        class="form-label fw-bold text-dark text-nowrap mb-0" 
        style="min-width: 140px; font-size: 0.95rem;">
        ${key}
    </label>
    
    <div class="text-secondary opacity-50" style="font-size: 1.1rem;">|</div>
    
    <div class="flex-grow-1 position-relative">
        <input 
            type="text"
            id="result-${key}"
            name="results[${key}]" 
            value="${results[key] ?? ''}"
            class="form-control form-control-lg shadow-sm border-0 bg-light"
            style="padding-left: 1rem; font-size: 0.95rem;"
            placeholder="Enter value..."
            autocomplete="off"
            aria-label="Value for ${key}">
        <div class="position-absolute top-50 end-0 translate-middle-y pe-3">
            <i class="bi bi-pencil-square text-muted opacity-25"></i>
        </div>
    </div>
</div>
                    `;
                }

                // فتح المودال
                new bootstrap.Modal(document.getElementById('updateResultsModal')).show();
            }
        });
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
    .then(res => res.json())
    .then(data => {

        if (data.success) {

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
                text: data.message
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

    window.app = new AnalysisManager();
});