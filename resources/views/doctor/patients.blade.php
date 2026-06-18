 
@extends('layouts/doctor.doctor')

@section('content')

<div id="page-list">
        <div class="section-header fade-in">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <h3><i class="fas fa-list text-primary me-2"></i>Analysis Requests</h3>
                    <p class="text-muted mb-0">Manage and track all analysis requests</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-info btn-sm" onclick="printTable()">
                        <i class="fas fa-print me-1"></i> Print
                    </button>
                    <button class="btn btn-outline-success btn-sm" onclick="exportToExcel()">
                        <i class="fas fa-file-excel me-1"></i> Export
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="toggleLanguage()">
                        <i class="fas fa-globe me-1"></i> EN / AR
                    </button>
                </div>
            </div>
        </div>

        <div class="row mb-4 fade-in">
            <div class="col-md-3 col-sm-6">
                <div class="dashboard-card p-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="card-icon bg-gradient-primary"><i class="fas fa-vials"></i></div>
                        <div>
                            <div class="stat-number" id="statTotalRequests">0</div>
                            <div class="stat-label">Total Requests</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="dashboard-card p-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="card-icon bg-gradient-warning"><i class="fas fa-clock"></i></div>
                        <div>
                            <div class="stat-number" id="statPending">0</div>
                            <div class="stat-label">Pending</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="dashboard-card p-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="card-icon bg-gradient-success"><i class="fas fa-check-circle"></i></div>
                        <div>
                            <div class="stat-number" id="statCompleted">0</div>
                            <div class="stat-label">Completed</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="dashboard-card p-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="card-icon bg-gradient-info"><i class="fas fa-money-bill-wave"></i></div>
                        <div>
                            <div class="stat-number" id="statRevenue">0</div>
                            <div class="stat-label">Revenue (DA)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="table-card fade-in">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="fas fa-list me-2"></i>Analysis Requests</h5>
               
            </div>
            <div class="card-body border-bottom">
                <div class="row g-3 align-items-center">
                    <div class="col-md-3">
                        <label class="form-label fw-bold">Search</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-search"></i></span>
                            <input type="text"   class="form-control"  id="searchInput" 
                                   placeholder="Search by patient name or phone..." 
                                   >
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label fw-bold">Status</label>
                        <select id="statusFilter" class="form-select">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label fw-bold">Date</label>
                        <select id="dateFilter" class="form-select">
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-bold"><i class="fas fa-qrcode me-1"></i>Barcode Search</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="barcodeSearch" 
                                   placeholder="Enter barcode..." 
                                  ">
                            <button class="btn btn-outline-success" type="button" onclick="manualBarcodeEntry()" title="Manual Entry">
                                <i class="fas fa-keyboard"></i>
                            </button>
                        </div>
                        <small class="form-text text-muted"><i class="fas fa-keyboard me-1"></i>Press Ctrl+B to focus here</small>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label fw-bold">&nbsp;</label>
                        <button class="btn btn-outline-secondary w-100" onclick="app.ClearFilters()">
                            <i class="fas fa-times me-1"></i> Clear
                        </button>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <div class="d-flex flex-wrap gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick=" app.setQuickFilter('today')" >
                                <i class="fas fa-calendar-day me-1"></i> Today
                            </button>
                            <button class="btn btn-sm btn-outline-primary" onclick=" app.setQuickFilter('pending')"  >
                                <i class="fas fa-clock me-1"></i> Pending
                            </button>
                             <button class="btn btn-sm btn-outline-primary"  onclick=" app.setQuickFilter('in-progress')" >
                                <i class="fas fa-check-circle me-1"></i> In Progress
                            </button>
                            <button class="btn btn-sm btn-outline-primary" onclick=" app.setQuickFilter('completed')" >
                                <i class="fas fa-check-circle me-1"></i> Completed
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover" id="analysisTable">
                        <thead>
                            <tr>
                                <th>Daily N</th>
                                <th>Barcode</th>
                                <th>Patient Name</th>
                                <th>Price (DA)</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Request Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="analysisTableBody"></tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <button class="btn btn-outline-primary btn-sm" onclick="app.prevPage()">
                        <i class="fas fa-chevron-left me-1"></i> Prev
                    </button>
                    <span id="pageInfo" class="text-muted">Page 1 / 1</span>
                    <button class="btn btn-outline-primary btn-sm" onclick="app.nextPage()">
                        Next <i class="fas fa-chevron-right ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

@endsection