 
 
@extends('layouts/doctor.doctor')

@section('content')

<div id="page-new" ">
        <div class="section-header fade-in">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <h3><i class="fas fa-plus-circle text-primary me-2"></i>New Analysis Request</h3>
                    <p class="text-muted mb-0">Create a new patient analysis request and send notifications</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary btn-sm" onclick="toggleLanguage()">
                        <i class="fas fa-globe me-1"></i> EN / AR
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="showPage('list')">
                        <i class="fas fa-arrow-left me-1"></i> Back to List
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
                            <div class="stat-number" id="statTotal">0</div>
                            <div class="stat-label">Selected</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="dashboard-card p-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="card-icon bg-gradient-success"><i class="fas fa-money-bill-wave"></i></div>
                        <div>
                            <div class="stat-number" id="statAmount">0</div>
                            <div class="stat-label">Total (DA)</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="dashboard-card p-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="card-icon bg-gradient-warning"><i class="fas fa-clock"></i></div>
                        <div>
                            <div class="stat-number" id="statPendingNew">0</div>
                            <div class="stat-label">Pending</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="dashboard-card p-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="card-icon bg-gradient-info"><i class="fas fa-paper-plane"></i></div>
                        <div>
                            <div class="stat-number" id="statSent">0</div>
                            <div class="stat-label">Sent Today</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-lg-4">
                <div class="dashboard-card fade-in">
                    <div class="card-header">
                        <h5><i class="fas fa-user-injured text-primary me-2"></i>Patient Information</h5>
                    </div>
                    <div class="card-body">
                        <form id="patientForm">
                            <div class="mb-3">
                                <label class="form-label">Full Name <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-user text-primary"></i></span>
                                    <input type="text" class="form-control"  id="patientName" placeholder="Enter patient's full name" required>
                                    @error('patientName')
                                        <div class="invalid-feedback d-block">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone Number <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-phone text-primary"></i></span>
                                    <input type="tel" class="form-control" id="patientPhone" placeholder="+213 555 123 456" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email Address</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-envelope text-primary"></i></span>
                                    <input type="email" class="form-control" id="patientEmail" placeholder="patient@email.com">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 mb-3">
                                    <label class="form-label">Date of Birth</label>
                                    <input type="date" class="form-control" id="patientDob" max="">
                                </div>
                                <div class="col-6 mb-3">
                                    <label class="form-label">َAge </label>
                                    <input type="number" class="form-control" id="patientAge" placeholder="Enter patient's age">
                                </div>
                                <div class="col-6 mb-3">
                                    <label class="form-label">Gender</label>
                                    <select class="form-select" id="patientGender">
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                 <div class="col-6 mb-3">
                                    <label class="form-label">Convention</label>
                                    <select class="form-select" id="patientConvention">
                                        <option value="">Select</option>
                                        <option value="police">Police</option>
                                        <option value="protectionCivile">Protection Civile</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Priority <span class="text-danger">*</span></label>
                                <select class="form-select" id="prioritySelect" required>
                                    <option value="normal" selected>Normal</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="high">High</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <div class="mb-0">
                                <label class="form-label">Required Date <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="requiredDate" required>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="dashboard-card fade-in mt-4">
                    <div class="card-header">
                        <h5><i class="fas fa-bell text-primary me-2"></i>Notification Method</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted small mb-3">Select how the patient should receive notifications:</p>
                        <div class="row g-3">
                            <div class="col-6">
                                <div class="notification-method-card active" onclick="toggleNotification('sms')" id="smsCard">
                                    <div class="method-icon"><i class="fas fa-sms"></i></div>
                                    <h6 class="mb-1 fw-bold">SMS</h6>
                                    <small class="text-muted">Text Message</small>
                                    <div class="form-check mt-2 d-flex justify-content-center">
                                        <input class="form-check-input" type="checkbox" id="smsCheck" checked>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="notification-method-card" onclick="toggleNotification('email')" id="emailCard">
                                    <div class="method-icon"><i class="fas fa-envelope"></i></div>
                                    <h6 class="mb-1 fw-bold">Email</h6>
                                    <small class="text-muted">Electronic Mail</small>
                                    <div class="form-check mt-2 d-flex justify-content-center">
                                        <input class="form-check-input" type="checkbox" id="emailCheck">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-card fade-in mt-4">
                    <div class="card-body">
                        <div class="total-summary-box mb-3">
                            <div class="total-label">Total Amount</div>
                            <div class="total-amount" id="totalAmount">0.00 DA</div>
                            <div class="total-count" id="totalCount">0 analyses selected</div>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" id="submitRequestButton">
                                <i class="fas fa-paper-plane me-2"></i>Submit & Notify
                            </button>
                            <button class="btn btn-outline-secondary" >
                                <i class="fas fa-times me-2"></i>Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-8">
                <div class="dashboard-card fade-in">
                    <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h5 class="mb-0"><i class="fas fa-vials text-primary me-2"></i>Select Analysis Types</h5>
                        <span class="badge bg-primary" id="headerCount">0 selected</span>
                    </div>
                    <div class="card-body">
                        <div class="row g-3 mb-4">
                            <div class="col-md-7">
                                <div class="search-box-wrapper">
                                    <i class="fas fa-search"></i>
                                    <input type="text" class="form-control" id="analysisSearch" placeholder="Search analysis by name or description..." >
                                </div>
                            </div>
                            <div class="col-md-5">
                                <select class="form-select" id="categoryFilter" onchange="filterAnalyses()">
                                    <option value="">All Categories</option>
                                    <option value="blood">Blood Tests</option>
                                    <option value="urine">Urine Tests</option>
                                    <option value="imaging">Imaging</option>
                                    <option value="hormone">Hormone Tests</option>
                                    <option value="microbiology">Microbiology</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-4 d-flex gap-2 flex-wrap">
                            <button class="btn btn-sm btn-outline-primary" id="selectAllBPO" >
                                <i class="fas fa-flask me-1"></i>BPO Panel
                            </button>
                            <button class="btn btn-sm btn-outline-success" onclick="selectCommon('basic')">
                                <i class="fas fa-heartbeat me-1"></i>Basic Checkup
                            </button>
                            <button class="btn btn-sm btn-outline-warning" onclick="selectCommon('diabetes')">
                                <i class="fas fa-tint me-1"></i>Diabetes Panel
                            </button>
                            <button class="btn btn-sm btn-outline-danger ms-auto" id="clearButton">
                                <i class="fas fa-trash-alt me-1"></i>Clear All
                            </button>
                        </div>
                        <div class="analysis-grid-container" id="analysisContainer"></div>
                        <div id="noResults" class="alert alert-warning d-none mt-3">
                            <i class="fas fa-search me-2"></i>No analyses found matching your search.
                        </div>
                    </div>
                </div>

                <div class="dashboard-card fade-in mt-4">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-clipboard-list text-primary me-2"></i>Selected Analyses Summary</h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0" id="summaryTable">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Analysis Name</th>
                                        <th>Category</th>
                                        <th >Price (DA)</th>
                                        <th >Action</th>
                                    </tr>
                                </thead>
                                <tbody id="summaryTableBody">
                                    
                                    <tr>
                                        <td colspan="5" class="text-center text-muted py-4">
                                            <i class="fas fa-vials fa-2x mb-2 d-block"></i>
                                            No analyses selected yet
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot class="table-group-divider">
                                    <tr class="fw-bold">
                                        <td colspan="3" class="text-end">Total:</td>
                                        <td class="text-end" id="tableTotal">0.00 DA</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="dashboard-card fade-in mt-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0"><i class="fas fa-history text-primary me-2"></i>Recent Notifications</h5>
                        <span class="badge bg-secondary" id="historyCount">0</span>
                    </div>
                    <div class="card-body" id="notificationHistory">
                        <div class="text-center text-muted py-4">
                            <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
                            <p>No notifications sent yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</div>

@endsection