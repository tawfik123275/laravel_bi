@extends('layouts.app')

@section('content')

<div class="container mt-4">

    <h3 class="mb-3">Analysis Requests</h3>

    <table id="analysisTable" class="display table table-bordered">
        <thead>
            <tr>
                <th></th>
                <th>ID</th>
                <th>Patient</th>
                <th>Status</th>
                <th>Date</th>
            </tr>
        </thead>

        <tbody>
            @foreach($requests as $r)
            <tr>
                <td class="details-control" data-id="{{ $r->id }}">+</td>
                <td>{{ $r->id }}</td>
                <td>{{ $r->patient_name }}</td>
                <td>{{ $r->status }}</td>
                <td>{{ $r->created_at }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

</div>

@endsection