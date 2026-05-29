<!DOCTYPE html>
<html>
<head>
    <title>Doctor Manager</title>

  
      <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta name="csrf-token" content="{{ csrf_token() }}">
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    @vite(['resources/css/doctor.css','resources/js/DoctorPrescription.js'])
    <!-- 'resources/js/ap.js' , -->
</head>

<body  class="ltr">

<div class="app-container">

    @include('partials.doctor-navbar')

    <main class="main-content">
        @yield('content')
       
    </main>

    @include('layouts.updateResult');

</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>