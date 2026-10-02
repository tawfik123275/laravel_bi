<aside class="sidebar" id="sidebar">

    <div class="sidebar-brand">
        <h5>
            <i class="fas fa-flask"></i>
            <span class="sidebar-text">LabManager</span>
        </h5>
        <small class="sidebar-text">Analysis & Notification</small>
    </div>

    <nav class="sidebar-nav">

        <a href="/doctor/newPatient" class="nav-link">
            <i class="fas fa-list"></i>
            <span class="sidebar-text">Analysis Requests</span>
        </a>

        <a href="/doctor/newAnalysisTest" class="nav-link">
            <i class="fas fa-plus-circle"></i>
            <span class="sidebar-text">New Analysis</span>
        </a>
        <a href="/doctor/analysisManager" class="nav-link">
            <i class="fas fa-cogs"></i>
            <span class="sidebar-text">Analysis Management</span>
        </a>
          <a href="/doctor/newPatients" class="nav-link">
            <i class="fas fa-users"></i>
            <span class="sidebar-text">Patients</span>
        </a>
        <a href="/doctor/patients" class="nav-link">
            <i class="fas fa-users"></i>
            <span class="sidebar-text">New Patients</span>
        </a>
         <a href="/doctor/prescription" class="nav-link">
            <i class="fas fa-users"></i>
            <span class="sidebar-text">Prescription</span>
        </a>

        <a href="/reports" class="nav-link">
            <i class="fas fa-chart-bar"></i>
            <span class="sidebar-text">Reports</span>
        </a>

        <a href="/settings" class="nav-link">
            <i class="fas fa-cog"></i>
            <span class="sidebar-text">Settings</span>
        </a>

        <hr>

        <form action="{{ route('logout') }}" method="POST">
            @csrf
            <button type="submit" class="nav-link text-danger border-0 bg-transparent w-100 text-start">
                <i class="fas fa-sign-out-alt"></i>
                <span class="sidebar-text">Logout</span>
            </button>
        </form>

    </nav>

</aside>