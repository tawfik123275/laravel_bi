@extends('layouts.app')

@section('content')
<div class="section-header fade-in">
    <div>
        <h3><i class="fas fa-file-invoice-dollar text-primary me-2"></i>Network Billing</h3>
        <p class="text-muted mb-0">Track laboratory invoices and payments between doctors and laboratories.</p>
    </div>
</div>

<div class="row mb-4">
    <div class="col-md-4 mb-3">
        <div class="dashboard-card p-3">
            <div class="stat-number" id="totalBilled">0 DA</div>
            <div class="stat-label">Total billed</div>
        </div>
    </div>
    <div class="col-md-4 mb-3">
        <div class="dashboard-card p-3">
            <div class="stat-number" id="totalReceived">0 DA</div>
            <div class="stat-label">Payments received</div>
        </div>
    </div>
    <div class="col-md-4 mb-3">
        <div class="dashboard-card p-3">
            <div class="stat-number" id="totalOutstanding">0 DA</div>
            <div class="stat-label">Outstanding balance</div>
        </div>
    </div>
</div>

<div class="table-card">
    <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 class="mb-0">Invoices</h5>
        <span class="text-muted" id="invoiceCount">Loading...</span>
    </div>
    <div class="card-body border-bottom">
        <div class="row g-3">
            <div class="col-md-8">
                <label for="invoiceSearch" class="form-label">Search invoice, patient, or barcode</label>
                <input id="invoiceSearch" class="form-control" type="search" placeholder="Search">
            </div>
            <div class="col-md-4">
                <label for="invoiceStatus" class="form-label">Payment status</label>
                <select id="invoiceStatus" class="form-select">
                    <option value="all">All statuses</option>
                    <option value="pending">Unpaid</option>
                    <option value="partial">Partially paid</option>
                    <option value="paid">Paid</option>
                </select>
            </div>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table table-hover mb-0">
            <thead>
                <tr>
                    <th>Invoice</th>
                    <th>Patient / Request</th>
                    <th>Doctor</th>
                    <th>Laboratory</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="invoiceRows">
                <tr><td colspan="9" class="text-center">Loading invoices...</td></tr>
            </tbody>
        </table>
    </div>
    <div class="card-body d-flex justify-content-between align-items-center">
        <button id="previousPage" class="btn btn-outline-primary btn-sm" type="button">Previous</button>
        <span id="pageInfo" class="text-muted">Page 1 of 1</span>
        <button id="nextPage" class="btn btn-outline-primary btn-sm" type="button">Next</button>
    </div>
</div>

<dialog id="paymentHistoryDialog" class="p-0 border-0 rounded shadow" style="width:min(700px, 95vw)">
    <div class="p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">Payment history</h5>
            <button type="button" class="btn-close" onclick="document.getElementById('paymentHistoryDialog').close()" aria-label="Close"></button>
        </div>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Reference</th></tr></thead>
                <tbody id="paymentHistoryRows"></tbody>
            </table>
        </div>
    </div>
</dialog>

<script>
(() => {
    const rows = document.getElementById('invoiceRows');
    const searchInput = document.getElementById('invoiceSearch');
    const statusFilter = document.getElementById('invoiceStatus');
    const token = document.querySelector('meta[name="csrf-token"]').content;
    let page = 1;
    let pages = 1;
    let searchDelay;

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[char]);
    const money = (value) => `${Number(value || 0).toLocaleString(undefined, {minimumFractionDigits: 2})} DA`;

    async function loadInvoices() {
        rows.innerHTML = '<tr><td colspan="9" class="text-center">Loading invoices...</td></tr>';
        const params = new URLSearchParams({
            page,
            search: searchInput.value,
            status: statusFilter.value
        });

        try {
            const response = await fetch(`/billing/invoices?${params}`, {
                headers: {'Accept': 'application/json'}
            });
            if (!response.ok) throw new Error('Unable to load invoices.');

            const result = await response.json();
            pages = result.pages;
            document.getElementById('totalBilled').textContent = money(result.totals.billed);
            document.getElementById('totalReceived').textContent = money(result.totals.received);
            document.getElementById('totalOutstanding').textContent = money(result.totals.outstanding);
            document.getElementById('invoiceCount').textContent = `${result.totals.count} invoices`;
            document.getElementById('pageInfo').textContent = `Page ${result.page} of ${result.pages}`;
            document.getElementById('previousPage').disabled = page <= 1;
            document.getElementById('nextPage').disabled = page >= pages;

            if (!result.data.length) {
                rows.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No invoices found.</td></tr>';
                return;
            }

            rows.innerHTML = result.data.map((invoice) => {
                const balance = Math.max(0, Number(invoice.total_amount) - Number(invoice.amount_paid));
                const statusLabel = {pending: 'Unpaid', partial: 'Partially paid', paid: 'Paid'}[invoice.status] || invoice.status;
                const paymentControls = balance > 0
                    ? `<form class="payment-form d-flex gap-1" data-id="${invoice.id}">
                            <input class="form-control form-control-sm" name="amount" type="number" min="0.01" max="${balance.toFixed(2)}" step="0.01" placeholder="Amount" required aria-label="Payment amount">
                            <select class="form-select form-select-sm" name="method" aria-label="Payment method">
                                <option value="cash">Cash</option><option value="card">Card</option><option value="transfer">Transfer</option>
                            </select>
                            <button class="btn btn-sm btn-primary" type="submit">Pay</button>
                       </form>`
                    : '';

                return `<tr>
                    <td>${escapeHtml(invoice.invoice_number)}</td>
                    <td>${escapeHtml(invoice.patient_name || '—')}<br><small class="text-muted">Request #${escapeHtml(invoice.request_id)}${invoice.barcode ? ` · ${escapeHtml(invoice.barcode)}` : ''}</small></td>
                    <td>${invoice.doctor_id ? `#${escapeHtml(invoice.doctor_id)}` : '—'}</td>
                    <td>${invoice.laboratory_id ? `#${escapeHtml(invoice.laboratory_id)}` : '—'}</td>
                    <td>${money(invoice.total_amount)}</td>
                    <td>${money(invoice.amount_paid)}</td>
                    <td>${money(balance)}</td>
                    <td>${escapeHtml(statusLabel)}</td>
                    <td>${paymentControls}<button type="button" class="btn btn-link btn-sm history-button" data-id="${invoice.id}">History</button></td>
                </tr>`;
            }).join('');
        } catch (error) {
            rows.innerHTML = `<tr><td colspan="9" class="text-center text-danger">${escapeHtml(error.message)}</td></tr>`;
        }
    }

    rows.addEventListener('submit', async (event) => {
        if (!event.target.matches('.payment-form')) return;
        event.preventDefault();
        const form = event.target;
        const values = Object.fromEntries(new FormData(form));
        const paymentKey = `billing-payment-${form.dataset.id}`;
        values.idempotency_key = sessionStorage.getItem(paymentKey) || crypto.randomUUID();
        sessionStorage.setItem(paymentKey, values.idempotency_key);
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        try {
            const response = await fetch(`/billing/invoices/${form.dataset.id}/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                body: JSON.stringify(values)
            });
            const result = await response.json();
            if (!response.ok) {
                if (response.status === 422) sessionStorage.removeItem(paymentKey);
                throw new Error(result.message || Object.values(result.errors || {}).flat().join(' ') || 'Payment could not be recorded.');
            }
            sessionStorage.removeItem(paymentKey);
            await loadInvoices();
        } catch (error) {
            alert(error.message);
            button.disabled = false;
        }
    });

    rows.addEventListener('click', async (event) => {
        const button = event.target.closest('.history-button');
        if (!button) return;
        const response = await fetch(`/billing/invoices/${button.dataset.id}/payments`, {
            headers: {'Accept': 'application/json'}
        });
        if (!response.ok) {
            alert('Unable to load payment history.');
            return;
        }
        const result = await response.json();
        const historyRows = document.getElementById('paymentHistoryRows');
        historyRows.innerHTML = result.data.length
            ? result.data.map((payment) => `<tr>
                <td>${escapeHtml(payment.created_at)}</td>
                <td>${money(payment.amount)}</td>
                <td>${escapeHtml(payment.method)}</td>
                <td>${escapeHtml(payment.reference || '—')}</td>
            </tr>`).join('')
            : '<tr><td colspan="4" class="text-center text-muted">No payments recorded.</td></tr>';
        document.getElementById('paymentHistoryDialog').showModal();
    });

    searchInput.addEventListener('input', () => {
        clearTimeout(searchDelay);
        searchDelay = setTimeout(() => { page = 1; loadInvoices(); }, 250);
    });
    statusFilter.addEventListener('change', () => { page = 1; loadInvoices(); });
    document.getElementById('previousPage').addEventListener('click', () => { if (page > 1) { page--; loadInvoices(); } });
    document.getElementById('nextPage').addEventListener('click', () => { if (page < pages) { page++; loadInvoices(); } });

    loadInvoices();
})();
</script>
@endsection
