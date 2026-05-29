
<@extends('layouts.app')
@section('content') 
 
 <div id="price_manage" >

            <!-- Your price management content remains the same -->

          

               

                    <div class="table-card">

                        <div class="card-header d-flex justify-content-between align-items-center">

                            <h5 class="mb-0">Analysis Types & Pricing</h5>

                            <button class="btn btn-sm btn-primary" onclick="showAddAnalysisTypeModal()">

                                <i class="fas fa-plus-circl 'ms-2' : 'me-2' ?>"></i>Add New Analysis Type

                            </button>

                        </div>

                        <div class="card-body">

                            <!-- Price Management Filters -->

                            <div class="row mb-3">

                                <div class="col-md-4">

                                    <input type="text" class="form-control" id="priceSearch" placeholder="Search analysis types..." oninput="filterPriceTable()">

                                </div>

                                <div class="col-md-3">

                                    <select class="form-select" id="categoryFilter" onchange="filterPriceTable()">

                                        <option value="all">All Categories</option>

                                      

                                    </select>

                                </div>

                                <div class="col-md-2">

                                    <button class="btn btn-outline-secondary w-100" onclick="clearPriceFilters()">

                                        <i class="fas fa-times"></i> Clear

                                    </button>

                                </div>

                            </div>



                            <div class="table-responsive">

                                <table class="table table-hover" id="priceTable">

                                    <thead>

                                        <tr>

                                            <th>Analysis Name</th>

                                            <th>Category</th>

                                            <th>Description</th>

                                            <th>Color</th>

                                            <th>Normal Range</th>

                                            <th>Price (DA)</th>

                                            

                                            <th>Status</th>

                                            <th>Actions</th>

                                        </tr>

                                    </thead>
                                    <tbody id="analysisManagerTableBody"></tbody>
                                </table>

                            </div>

                        </div>

                    </div>

                

            
</div>
@endsection


                                           