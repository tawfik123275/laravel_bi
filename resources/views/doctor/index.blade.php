@extends('layouts.doctor')
@section('content')
 
            <!-- Header -->
            <div class="section-header fade-in">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h3><i class="fas fa-user-injured me-2" style="color: var(--primary-color);"></i>Patient Management</h3>
                        <p class="text-muted mb-0">Manage patient records, view details, and track patient history</p>
                    </div>
                    <button class="btn btn-primary" onclick="openModal('add')">
                        <i class="fas fa-plus me-2"></i>Add New Patient
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
                                    <i class="fas fa-users"></i>
                                </div>
                                <div>
                                    <div class="stat-number" id="statTotal">0</div>
                                    <div class="stat-label">Total Patients</div>
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
                                    <i class="fas fa-user-check"></i>
                                </div>
                                <div>
                                    <div class="stat-number" id="statActive">0</div>
                                    <div class="stat-label">Active Patients</div>
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
                                    <div class="stat-number" id="statPending">0</div>
                                    <div class="stat-label">Pending Tests</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-4">
                    <div class="dashboard-card">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="card-icon bg-gradient-info me-3">
                                    <i class="fas fa-calendar-day"></i>
                                </div>
                                <div>
                                    <div class="stat-number" id="statToday">0</div>
                                    <div class="stat-label">Registered Today</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filters & Search -->
            <div class="dashboard-card fade-in mb-4">
                <div class="card-body">
                    <div class="row align-items-end g-3">
                        <div class="col-md-4">
                            <label class="form-label">Search Patients</label>
                            <div class="search-box-wrapper">
                                <i class="fas fa-search"></i>
                                <input type="text" class="form-control" id="searchInput" placeholder="Search by name, ID, phone..." oninput="handleSearch()">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Status Filter</label>
                            <select class="form-select" id="statusFilter" onchange="handleFilter()">
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Gender Filter</label>
                            <select class="form-select" id="genderFilter" onchange="handleFilter()">
                                <option value="all">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-outline-secondary w-100" onclick="resetFilters()">
                                <i class="fas fa-undo me-1"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Patients Table -->
            <div class="table-card fade-in">
                <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h5><i class="fas fa-list me-2"></i>Patient List</h5>
                    <div class="d-flex align-items-center gap-2">
                        <span class="text-muted" id="showingText">Showing 0 of 0 patients</span>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover mb-0" id="patientsTable">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Age / Gender</th>
                                <th>Contact</th>
                                <th>Last Visit</th>
                                <th>Status</th>
                                <th>Tests</th>
                                <th style="width: 180px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="patientsTableBody">
                            <!-- Dynamic content -->
                        </tbody>
                    </table>
                </div>
                <div class="card-body border-top d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div class="d-flex align-items-center gap-2">
                        <label class="text-muted mb-0">Show:</label>
                        <select class="form-select" style="width: 80px;" id="pageSize" onchange="changePageSize()">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span class="text-muted">per page</span>
                    </div>
                    <div class="pagination" id="pagination">
                        <!-- Dynamic pagination -->
                    </div>
                </div>
            </div>
       

         <!-- Add/Edit Patient Modal -->
@endsection