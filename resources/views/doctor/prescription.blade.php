@extends('layouts/doctor.doctor')

@section('content')
 
            <!-- Header -->
            <div class="section-header fade-in">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h3><i class="fas fa-prescription-bottle-alt me-2" style="color: var(--primary-color);"></i>Medical Prescriptions & Medications</h3>
                        <p class="text-muted mb-0">Create prescriptions, manage medications, and track patient treatments</p>
                    </div>
                    <button class="btn btn-primary" onclick="ap.openPrescriptionModal()">
                        <i class="fas fa-file-prescription me-2"></i>New Prescription
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="row fade-in">
                <div class="col-md-3 col-sm-6 mb-4">
                    <div class="dashboard-card">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="card-icon bg-gradient-primary me-3">
                                    <i class="fas fa-file-prescription"></i>
                                </div>
                                <div>
                                    <div class="stat-number" id="statTotalPrescriptions">0</div>
                                    <div class="stat-label">Total Prescriptions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-4">
                    <div class="dashboard-card">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="card-icon bg-gradient-success me-3">
                                    <i class="fas fa-pills"></i>
                                </div>
                                <div>
                                    <div class="stat-number" id="statActiveMeds">0</div>
                                    <div class="stat-label">Active Medications</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-4">
                    <div class="dashboard-card">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="card-icon bg-gradient-warning me-3">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div>
                                    <div class="stat-number" id="statPendingPrescriptions">0</div>
                                    <div class="stat-label">Pending</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-4">
                    <div class="dashboard-card">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="card-icon bg-gradient-purple me-3">
                                    <i class="fas fa-capsules"></i>
                                </div>
                                <div>
                                    <div class="stat-number" id="statTotalMeds">0</div>
                                    <div class="stat-label">Medication Types</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tab-nav fade-in">
                <button class="tab-btn active" onclick="ap.switchTab('prescriptions')">
                    <i class="fas fa-file-prescription me-2"></i>Prescriptions
                </button>
                <button class="tab-btn" onclick="ap.switchTab('medications')">
                    <i class="fas fa-pills me-2"></i>Medication Library
                </button>
                <button class="tab-btn" onclick="ap.switchTab('letters')">
                    <i class="fas fa-envelope-open-text me-2"></i>Medical Letters
                </button>
            </div>

            <!-- Prescriptions Tab -->
            <div class="tab-content active fade-in" id="prescriptionsTab">
                <div class="dashboard-card mb-4">
                    <div class="card-body">
                        <div class="row align-items-end g-3">
                            <div class="col-md-4">
                                <label class="form-label">Search Prescriptions</label>
                                <div class="search-box-wrapper">
                                    <i class="fas fa-search"></i>
                                    <input type="text" class="form-control" id="prescriptionSearch" placeholder="Search by patient, doctor, ID..." oninput="filterPrescriptions()">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="prescriptionStatusFilter" onchange="filterPrescriptions()">
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Date Range</label>
                                <select class="form-select" id="prescriptionDateFilter" onchange="filterPrescriptions()">
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-outline-secondary w-100" onclick="resetPrescriptionFilters()">
                                    <i class="fas fa-undo me-1"></i> Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="table-card">
                    <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h5><i class="fas fa-list me-2"></i>Prescription List</h5>
                        <span class="text-muted" id="prescriptionCount">Showing 0 prescriptions</span>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover mb-0" id="prescriptionsTable">
                            <thead>
                                <tr>
                                    <th>Rx ID</th>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Medications</th>
                                    <th>Status</th>
                                    <th style="width: 200px;">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="prescriptionsTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Medications Tab -->
            <div class="tab-content fade-in" id="medicationsTab">
                <div class="dashboard-card mb-4">
                    <div class="card-body">
                        <div class="row align-items-end g-3">
                            <div class="col-md-5">
                                <label class="form-label">Search Medications</label>
                                <div class="search-box-wrapper">
                                    <i class="fas fa-search"></i>
                                    <input type="text" class="form-control" id="medicationSearch" placeholder="Search by name, generic name, category..." oninput="filterMedications()">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Category</label>
                                <select class="form-select" id="medicationCategoryFilter" onchange="filterMedications()">
                                    <option value="all">All Categories</option>
                                    <option value="antibiotic">Antibiotics</option>
                                    <option value="analgesic">Analgesics</option>
                                    <option value="antihypertensive">Antihypertensives</option>
                                    <option value="antidiabetic">Antidiabetics</option>
                                    <option value="antidepressant">Antidepressants</option>
                                    <option value="vitamin">Vitamins & Supplements</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-outline-secondary w-100" onclick="resetMedicationFilters()">
                                    <i class="fas fa-undo me-1"></i> Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row" id="medicationsGrid"></div>
            </div>

            <!-- Medical Letters Tab -->
            <div class="tab-content fade-in" id="lettersTab">
                <div class="dashboard-card mb-4">
                    <div class="card-body">
                        <div class="row align-items-end g-3">
                            <div class="col-md-6">
                                <label class="form-label">Search Letters</label>
                                <div class="search-box-wrapper">
                                    <i class="fas fa-search"></i>
                                    <input type="text" class="form-control" id="letterSearch" placeholder="Search by patient, type, subject..." oninput="filterLetters()">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Letter Type</label>
                                <select class="form-select" id="letterTypeFilter" onchange="filterLetters()">
                                    <option value="all">All Types</option>
                                    <option value="sick_leave">Sick Leave</option>
                                    <option value="medical_certificate">Medical Certificate</option>
                                    <option value="referral">Referral Letter</option>
                                    <option value="discharge">Discharge Summary</option>
                                    <option value="follow_up">Follow-up Note</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-primary w-100" onclick="openLetterModal()">
                                    <i class="fas fa-plus me-1"></i> New
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="table-card">
                    <div class="card-header">
                        <h5><i class="fas fa-envelope-open-text me-2"></i>Medical Letters</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Letter ID</th>
                                    <th>Type</th>
                                    <th>Patient</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Doctor</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="lettersTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        
             <div class="modal-overlay" id="prescriptionModal">
        <div class="modal-content">
            <div class="modal-header">
                <h4><i class="fas fa-file-prescription me-2"></i>New Prescription</h4>
                <button class="modal-close" onclick="closePrescriptionModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="prescriptionForm">
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label">Patient *</label>
                            <select class="form-select" id="rxPatient" onchange="loadPatientInfo()">
                                <option value="">Select Patient</option>
                            </select>
                            <div class="invalid-feedback">Please select a patient</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Doctor *</label>
                            <select class="form-select" id="rxDoctor">
                                <option value="">Select Doctor</option>
                                <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                                <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                                <option value="Dr. Emily Roberts">Dr. Emily Roberts</option>
                                <option value="Dr. James Wilson">Dr. James Wilson</option>
                            </select>
                            <div class="invalid-feedback">Please select a doctor</div>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Diagnosis / Notes</label>
                            <textarea class="form-control" id="rxDiagnosis" rows="2" placeholder="Enter diagnosis or clinical notes..."></textarea>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0"><i class="fas fa-pills me-2" style="color: var(--primary-color);"></i>Medications</h5>
                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="addMedicationEntry()">
                            <i class="fas fa-plus me-1"></i>Add Medication
                        </button>
                    </div>

                    <div id="medicationsContainer"></div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline-secondary" onclick="closePrescriptionModal()">Cancel</button>
                <button class="btn btn-primary" onclick="savePrescription()">
                    <i class="fas fa-save me-2"></i>Save Prescription
                </button>
            </div>
        </div>
    </div>
@endsection
