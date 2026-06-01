@extends('layouts.login')



<div class="insta-card">

    <h6>Login</h6>

    @if (!empty($error))
        <div class="error-message">
            <i class="fas fa-exclamation-circle me-2"></i>
            {{ $error }}
        </div>
    @endif

    <form method="POST" id="loginForm" >
        @csrf

        <div class="role-selections">
            <div class="role-card doctor" data-role="doctor">
                <i class="fas fa-user-md"></i>
                Doctor
            </div>

            <div class="role-card patient" data-role="patient">
                <i class="fas fa-user"></i>
                Patient
            </div>

            <div class="role-card clinic" data-role="clinic">
                <i class="fas fa-hospital"></i>
                Clinic
            </div>

            <div class="role-card lab" data-role="lab_staff">
                <i class="fas fa-flask"></i>
                Laboratory
                <span class="role-badge">NEW</span>
            </div>
        </div>

        <div id="loginFields" class="d-none">

            <input type="hidden" name="role" id="roleInput">

            <div class="mb-3">
                <input type="email" name="email" class="form-control"
                       placeholder="Email"
                       value="{{ old('email') }}" required>
            </div>

            <div class="mb-3">
                <input type="password" name="password" class="form-control"
                       placeholder="Password" required>
            </div>

            <button type="submit" class="btn btn-login w-100">
                <i class="fas fa-sign-in-alt me-2"></i>
                Login
            </button>

        </div>
    </form>

    <div class="register-footer">
        Don’t have an account?<br>

        <a href="{{ url('register_lab') }}">Register Laboratory</a>
    </div>

    <div class="mt-3 p-3 border rounded" style="background: #f8f9fa; display: none;" id="labInfo">
        <p class="small text-muted text-center mb-0">
            Access the laboratory management system for technicians, supervisors, and administrators.
        </p>
    </div>

</div>

