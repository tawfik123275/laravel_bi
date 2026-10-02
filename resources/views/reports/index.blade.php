@extends('layouts.app')

@section('content')
<div class="section-header fade-in">
    <div>
        <h3><i class="fas fa-chart-bar text-primary me-2"></i>Analysis Reports</h3>
        <p class="text-muted mb-0">Review analysis activity and payment balances.</p>
    </div>
</div>

<div class="row mb-4">
    <div class="col-md-4 col-lg-2 mb-3"><div class="dashboard-card p-3"><div class="stat-number" id="reportRequests">—</div><div class="stat-label">Requests</div></div></div>
    <div class="col-md-4 col-lg-2 mb-3"><div class="dashboard-card p-3"><div class="stat-number" id="reportPending">—</div><div class="stat-label">Pending</div></div></div>
    <div class="col-md-4 col-lg-2 mb-3"><div class="dashboard-card p-3"><div class="stat-number" id="reportCompleted">—</div><div class="stat-label">Completed</div></div></div>
    <div class="col-md-4 col-lg-2 mb-3"><div class="dashboard-card p-3"><div class="stat-number" id="reportRequested">—</div><div class="stat-label">Requested (DA)</div></div></div>
    <div class="col-md-4 col-lg-2 mb-3"><div class="dashboard-card p-3"><div class="stat-number" id="reportReceived">—</div><div class="stat-label">Received (DA)</div></div></div>
    <div class="col-md-4 col-lg-2 mb-3"><div class="dashboard-card p-3"><div class="stat-number" id="reportOutstanding">—</div><div class="stat-label">Outstanding (DA)</div></div></div>
</div>

<div class="table-card">
    <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 class="mb-0">Analysis activity</h5>
        <span class="text-muted" id="reportCount">Loading reports...</span>
    </div>
    <div class="card-body border-bottom">
        <div class="row g-3">
            <div class="col-md-6">
                <label for="reportSearch" class="form-label">Search patient, barcode, or invoice</label>
                <input id="reportSearch" class="form-control" type="search" placeholder="Search">
            </div>
            <div class="col-md-3">
                <label for="reportStatus" class="form-label">Request status</label>
                <select id="reportStatus" class="form-select">
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            <div class="col-md-3">
                <label for="reportPeriod" class="form-label">Period</label>
                <select id="reportPeriod" class="form-select">
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">This month</option>
                </select>
            </div>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table table-hover mb-0">
            <thead>
                <tr>
                    <th>Request</th><th>Patient</th><th>Date</th><th>Status</th>
                    <th>Invoice</th><th>Requested</th><th>Paid</th><th>Balance</th>
                </tr>
            </thead>
            <tbody id="reportRows">
                <tr><td colspan="8" class="text-center">Loading reports...</td></tr>
            </tbody>
        </table>
    </div>
    <div class="card-body d-flex justify-content-between align-items-center">
        <button id="reportPrevious" class="btn btn-outline-primary btn-sm" type="button">Previous</button>
        <span id="reportPageInfo" class="text-muted">Page 1 of 1</span>
        <button id="reportNext" class="btn btn-outline-primary btn-sm" type="button">Next</button>
    </div>
</div>

<script>
(() => {
    const rows = document.getElementById('reportRows');
    const search = document.getElementById('reportSearch');
    const status = document.getElementById('reportStatus');
    const period = document.getElementById('reportPeriod');
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[char]);
    const money = value => `${Number(value || 0).toLocaleString(undefined, {minimumFractionDigits: 2})} DA`;
    let page = 1;
    let pages = 1;
    let debounce;

    async function loadReports() {
        rows.innerHTML = '<tr><td colspan="8" class="text-center">Loading reports...</td></tr>';
        const params = new URLSearchParams({page, search: search.value, status: status.value, period: period.value});

        try {
            const response = await fetch(`/reports/data?${params}`, {
                headers: {'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest'}
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Unable to load reports.');
            }

            pages = result.pages;
            document.getElementById('reportRequests').textContent = result.summary.requests;
            document.getElementById('reportPending').textContent = result.summary.pending;
            document.getElementById('reportCompleted').textContent = result.summary.completed;
            document.getElementById('reportRequested').textContent = money(result.summary.requested);
            document.getElementById('reportReceived').textContent = money(result.summary.received);
            document.getElementById('reportOutstanding').textContent = money(result.summary.outstanding);
            document.getElementById('reportCount').textContent = `${result.summary.requests} requests`;
            document.getElementById('reportPageInfo').textContent = `Page ${result.page} of ${result.pages}`;
            document.getElementById('reportPrevious').disabled = result.page <= 1;
            document.getElementById('reportNext').disabled = result.page >= pages;

            if (!result.data.length) {
                rows.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No reports match these filters.</td></tr>';
                return;
            }

            rows.innerHTML = result.data.map(item => {
                const total = Number(item.total_amount || 0);
                const paid = Number(item.amount_paid || 0);
                const balance = Math.max(0, total - paid);
                return `<tr>
                    <td>${escapeHtml(item.barcode || `#${item.id}`)}<br><small class="text-muted">#${escapeHtml(item.id)}</small></td>
                    <td>${escapeHtml(item.patient_name)}<br><small class="text-muted">${escapeHtml(item.patient_phone)}</small></td>
                    <td>${escapeHtml(item.created_at)}</td>
                    <td><span class="status-badge badge-${escapeHtml(item.status)}">${escapeHtml(item.status)}</span></td>
                    <td>${escapeHtml(item.invoice_number || 'Not invoiced')}</td>
                    <td>${money(total)}</td>
                    <td>${money(paid)}</td>
                    <td>${money(balance)}</td>
                </tr>`;
            }).join('');
        } catch (error) {
            rows.innerHTML = `<tr><td colspan="8" class="text-center text-danger">${escapeHtml(error.message)}</td></tr>`;
            document.getElementById('reportCount').textContent = 'Reports unavailable';
        }
    }

    search.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => { page = 1; loadReports(); }, 250);
    });
    [status, period].forEach(filter => filter.addEventListener('change', () => {
        page = 1;
        loadReports();
    }));
    document.getElementById('reportPrevious').addEventListener('click', () => {
        if (page > 1) { page--; loadReports(); }
    });
    document.getElementById('reportNext').addEventListener('click', () => {
        if (page < pages) { page++; loadReports(); }
    });
    loadReports();
})();
</script>
@endsection
