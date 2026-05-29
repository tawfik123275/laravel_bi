class DoctorPrescription{
     constructor(){
         this.init();
     }
        init(){
const patients = [
            { id: "P-1001", firstName: "John", lastName: "Smith", dateOfBirth: "1985-03-15", gender: "male" },
            { id: "P-1002", firstName: "Sarah", lastName: "Johnson", dateOfBirth: "1990-07-22", gender: "female" },
            { id: "P-1003", firstName: "Michael", lastName: "Brown", dateOfBirth: "1978-11-05", gender: "male" },
            { id: "P-1004", firstName: "Emily", lastName: "Davis", dateOfBirth: "1995-01-30", gender: "female" },
            { id: "P-1005", firstName: "Robert", lastName: "Wilson", dateOfBirth: "1962-09-18", gender: "male" },
            { id: "P-1006", firstName: "Lisa", lastName: "Anderson", dateOfBirth: "1988-05-12", gender: "female" },
            { id: "P-1007", firstName: "David", lastName: "Martinez", dateOfBirth: "1975-12-03", gender: "male" },
            { id: "P-1008", firstName: "Jennifer", lastName: "Taylor", dateOfBirth: "1992-08-25", gender: "female" }
        ];
         const medications = [
            { id: "M-001", name: "Amoxicillin", genericName: "Amoxicillin Trihydrate", category: "antibiotic", dosageForm: "Capsule", strength: "500mg", description: "Broad-spectrum antibiotic for bacterial infections", sideEffects: "Nausea, diarrhea, rash", contraindications: "Penicillin allergy" },
            { id: "M-002", name: "Ibuprofen", genericName: "Ibuprofen", category: "analgesic", dosageForm: "Tablet", strength: "400mg", description: "Non-steroidal anti-inflammatory drug for pain relief", sideEffects: "Stomach upset, dizziness", contraindications: "Stomach ulcers, kidney disease" },
            { id: "M-003", name: "Lisinopril", genericName: "Lisinopril", category: "antihypertensive", dosageForm: "Tablet", strength: "10mg", description: "ACE inhibitor for high blood pressure", sideEffects: "Dry cough, dizziness", contraindications: "Pregnancy, ACE inhibitor allergy" },
            { id: "M-004", name: "Metformin", genericName: "Metformin Hydrochloride", category: "antidiabetic", dosageForm: "Tablet", strength: "500mg", description: "Oral hypoglycemic for type 2 diabetes", sideEffects: "Nausea, diarrhea, metallic taste", contraindications: "Severe kidney disease" },
            { id: "M-005", name: "Sertraline", genericName: "Sertraline Hydrochloride", category: "antidepressant", dosageForm: "Tablet", strength: "50mg", description: "Selective serotonin reuptake inhibitor (SSRI)", sideEffects: "Insomnia, nausea, headache", contraindications: "MAO inhibitor use" },
            { id: "M-006", name: "Vitamin D3", genericName: "Cholecalciferol", category: "vitamin", dosageForm: "Capsule", strength: "1000 IU", description: "Vitamin D supplement for bone health", sideEffects: "Rare at normal doses", contraindications: "Hypercalcemia" },
            { id: "M-007", name: "Azithromycin", genericName: "Azithromycin", category: "antibiotic", dosageForm: "Tablet", strength: "250mg", description: "Macrolide antibiotic for respiratory infections", sideEffects: "Diarrhea, nausea, abdominal pain", contraindications: "Macrolide allergy" },
            { id: "M-008", name: "Paracetamol", genericName: "Acetaminophen", category: "analgesic", dosageForm: "Tablet", strength: "500mg", description: "Pain reliever and fever reducer", sideEffects: "Rare at recommended doses", contraindications: "Severe liver disease" },
            { id: "M-009", name: "Amlodipine", genericName: "Amlodipine Besylate", category: "antihypertensive", dosageForm: "Tablet", strength: "5mg", description: "Calcium channel blocker for hypertension", sideEffects: "Swelling, dizziness, flushing", contraindications: "Severe aortic stenosis" },
            { id: "M-010", name: "Insulin Glargine", genericName: "Insulin Glargine", category: "antidiabetic", dosageForm: "Injection", strength: "100 units/mL", description: "Long-acting insulin for diabetes", sideEffects: "Hypoglycemia, weight gain", contraindications: "Hypoglycemia" },
            { id: "M-011", name: "Fluoxetine", genericName: "Fluoxetine Hydrochloride", category: "antidepressant", dosageForm: "Capsule", strength: "20mg", description: "SSRI antidepressant", sideEffects: "Insomnia, anxiety, nausea", contraindications: "MAO inhibitor use" },
            { id: "M-012", name: "Vitamin B12", genericName: "Cyanocobalamin", category: "vitamin", dosageForm: "Tablet", strength: "1000mcg", description: "Vitamin B12 supplement", sideEffects: "Rare", contraindications: "Leber's disease" }
        ];
         let prescriptions = [
            {
                id: "RX-2026-001",
                patientId: "P-1001",
                doctor: "Dr. Sarah Johnson",
                date: "2026-05-10",
                status: "active",
                diagnosis: "Upper respiratory tract infection",
                medications: [
                    { medicationId: "M-001", dosage: "1 capsule", frequency: "3 times daily", duration: "7 days", instructions: "Take after meals" },
                    { medicationId: "M-008", dosage: "1 tablet", frequency: "Every 6 hours", duration: "5 days", instructions: "Take as needed for fever" }
                ]
            },
            {
                id: "RX-2026-002",
                patientId: "P-1002",
                doctor: "Dr. Michael Chen",
                date: "2026-05-12",
                status: "active",
                diagnosis: "Type 2 Diabetes - routine management",
                medications: [
                    { medicationId: "M-004", dosage: "1 tablet", frequency: "Twice daily", duration: "30 days", instructions: "Take with meals" },
                    { medicationId: "M-006", dosage: "1 capsule", frequency: "Once daily", duration: "30 days", instructions: "Take with breakfast" }
                ]
            },
            {
                id: "RX-2026-003",
                patientId: "P-1003",
                doctor: "Dr. Emily Roberts",
                date: "2026-05-13",
                status: "pending",
                diagnosis: "Hypertension - new onset",
                medications: [
                    { medicationId: "M-003", dosage: "1 tablet", frequency: "Once daily", duration: "30 days", instructions: "Take in the morning" }
                ]
            },
            {
                id: "RX-2026-004",
                patientId: "P-1004",
                doctor: "Dr. James Wilson",
                date: "2026-05-08",
                status: "completed",
                diagnosis: "Post-operative pain management",
                medications: [
                    { medicationId: "M-002", dosage: "1 tablet", frequency: "Every 8 hours", duration: "7 days", instructions: "Take with food" }
                ]
            },
            {
                id: "RX-2026-005",
                patientId: "P-1005",
                doctor: "Dr. Sarah Johnson",
                date: "2026-05-11",
                status: "cancelled",
                diagnosis: "Depression - initial assessment",
                medications: [
                    { medicationId: "M-005", dosage: "1 tablet", frequency: "Once daily", duration: "30 days", instructions: "Take in the morning" }
                ]
            }
        ];

        let letters = [
            {
                id: "ML-2026-001",
                patientId: "P-1001",
                doctor: "Dr. Sarah Johnson",
                type: "sick_leave",
                subject: "Sick Leave Certificate - 5 Days",
                content: "This is to certify that Mr. John Smith has been under my medical care from May 10, 2026 to May 15, 2026 due to upper respiratory tract infection. He is advised to rest at home during this period and return to work on May 16, 2026.",
                startDate: "2026-05-10",
                endDate: "2026-05-15",
                date: "2026-05-10"
            },
            {
                id: "ML-2026-002",
                patientId: "P-1002",
                doctor: "Dr. Michael Chen",
                type: "medical_certificate",
                subject: "Medical Fitness Certificate",
                content: "This is to certify that Ms. Sarah Johnson has been examined and found to be medically fit. She has been managing her Type 2 Diabetes condition effectively with prescribed medications and lifestyle modifications.",
                startDate: "",
                endDate: "",
                date: "2026-05-12"
            },
            {
                id: "ML-2026-003",
                patientId: "P-1003",
                doctor: "Dr. Emily Roberts",
                type: "referral",
                subject: "Referral to Cardiologist",
                content: "Dear Colleague, I am referring Mr. Michael Brown to your care for further cardiac evaluation. He presented with newly diagnosed hypertension and requires specialist assessment for potential underlying cardiac conditions. Please find attached his recent lab results and current medication list.",
                startDate: "",
                endDate: "",
                date: "2026-05-13"
            }
        ];
          let deleteTarget = { type: null, id: null };
        let medicationEntryCount = 0;
         document.addEventListener('DOMContentLoaded', function() {
            populatePatientSelects();
            updateStats();
            renderPrescriptions();
            renderMedications();
            renderLetters();
        });
         document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePrescriptionModal();
                closeViewPrescriptionModal();
                closeLetterModal();
                closeViewLetterModal();
                closeDeleteModal();
            }
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });
    
        }
        // ===================== DATA =====================
        

       
       

      

        // ===================== INITIALIZATION =====================
       

        populatePatientSelects() {
            const options = patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName} (${p.id})</option>`).join('');
            document.getElementById('rxPatient').innerHTML = '<option value="">Select Patient</option>' + options;
            document.getElementById('letterPatient').innerHTML = '<option value="">Select Patient</option>' + options;
        }

        // ===================== TABS =====================
         switchTab(tabName) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tabName + 'Tab').classList.add('active');
        }

        // ===================== STATS =====================
        updateStats() {
            const totalRx = prescriptions.length;
            const activeMeds = prescriptions.filter(p => p.status === 'active').reduce((acc, p) => acc + p.medications.length, 0);
            const pending = prescriptions.filter(p => p.status === 'pending').length;
            const totalMeds = medications.length;

            animateNumber('statTotalPrescriptions', totalRx);
            animateNumber('statActiveMeds', activeMeds);
            animateNumber('statPendingPrescriptions', pending);
            animateNumber('statTotalMeds', totalMeds);
        }

         animateNumber(id, target) {
            const el = document.getElementById(id);
            let current = 0;
            const increment = target / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = Math.floor(current);
            }, 30);
        }

        // ===================== PRESCRIPTIONS =====================
         renderPrescriptions() {
            const tbody = document.getElementById('prescriptionsTableBody');
            const filtered = getFilteredPrescriptions();

            if (filtered.length === 0) {
                tbody.innerHTML = `
                    <tr><td colspan="7">
                        <div class="empty-state">
                            <i class="fas fa-file-prescription"></i>
                            <h4>No prescriptions found</h4>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    </td></tr>
                `;
            } else {
                tbody.innerHTML = filtered.map(rx => {
                    const patient = patients.find(p => p.id === rx.patientId);
                    return `
                        <tr>
                            <td><span class="badge bg-light text-dark border fw-bold">${rx.id}</span></td>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="patient-avatar" style="width: 35px; height: 35px; font-size: 0.8rem;">${getInitials(patient.firstName, patient.lastName)}</div>
                                    <div>
                                        <div class="fw-bold">${patient.firstName} ${patient.lastName}</div>
                                        <small class="text-muted">${patient.id}</small>
                                    </div>
                                </div>
                            </td>
                            <td><i class="fas fa-user-md me-1 text-primary"></i>${rx.doctor}</td>
                            <td><i class="fas fa-calendar me-1 text-muted"></i>${formatDate(rx.date)}</td>
                            <td><span class="badge bg-primary">${rx.medications.length} meds</span></td>
                            <td><span class="status-badge badge-${rx.status}">${capitalize(rx.status)}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewPrescription('${rx.id}')" title="View">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-success" onclick="editPrescription('${rx.id}')" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deletePrescription('${rx.id}')" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            }

            document.getElementById('prescriptionCount').textContent = `Showing ${filtered.length} prescriptions`;
        }

         getFilteredPrescriptions() {
            const query = document.getElementById('prescriptionSearch').value.toLowerCase();
            const statusFilter = document.getElementById('prescriptionStatusFilter').value;
            const dateFilter = document.getElementById('prescriptionDateFilter').value;

            return prescriptions.filter(rx => {
                const patient = patients.find(p => p.id === rx.patientId);
                const matchesSearch = !query ||
                    rx.id.toLowerCase().includes(query) ||
                    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query) ||
                    rx.doctor.toLowerCase().includes(query) ||
                    rx.diagnosis.toLowerCase().includes(query);

                const matchesStatus = statusFilter === 'all' || rx.status === statusFilter;
                
                let matchesDate = true;
                const rxDate = new Date(rx.date);
                const today = new Date();
                if (dateFilter === 'today') {
                    matchesDate = rxDate.toDateString() === today.toDateString();
                } else if (dateFilter === 'week') {
                    const weekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = rxDate >= weekAgo;
                } else if (dateFilter === 'month') {
                    matchesDate = rxDate.getMonth() === today.getMonth() && rxDate.getFullYear() === today.getFullYear();
                }

                return matchesSearch && matchesStatus && matchesDate;
            });
        }

         filterPrescriptions() {
            renderPrescriptions();
        }

         resetPrescriptionFilters() {
            document.getElementById('prescriptionSearch').value = '';
            document.getElementById('prescriptionStatusFilter').value = 'all';
            document.getElementById('prescriptionDateFilter').value = 'all';
            renderPrescriptions();
            showToast('Filters reset', 'info');
        }

        // ===================== MEDICATIONS =====================
     renderMedications() {
            const grid = document.getElementById('medicationsGrid');
            const filtered = getFilteredMedications();

            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div class="col-12">
                        <div class="empty-state">
                            <i class="fas fa-pills"></i>
                            <h4>No medications found</h4>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    </div>
                `;
            } else {
                grid.innerHTML = filtered.map(med => `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="medication-card h-100">
                            <div class="d-flex align-items-start gap-3 mb-3">
                                <div class="medication-icon bg-gradient-primary">
                                    <i class="fas fa-capsules"></i>
                                </div>
                                <div style="flex: 1;">
                                    <div class="medication-name">${med.name}</div>
                                    <div class="medication-generic">${med.genericName}</div>
                                    <span class="badge bg-light text-dark border mt-1">${capitalize(med.category)}</span>
                                </div>
                            </div>
                            <div class="mb-2">
                                <span class="dosage-badge">${med.strength}</span>
                                <span class="frequency-badge ms-2">${med.dosageForm}</span>
                            </div>
                            <p class="text-muted mb-2" style="font-size: 0.9rem;">${med.description}</p>
                            <div class="border-top pt-2 mt-2">
                                <small class="text-muted d-block"><i class="fas fa-exclamation-triangle me-1 text-warning"></i><strong>Side Effects:</strong> ${med.sideEffects}</small>
                                <small class="text-muted d-block mt-1"><i class="fas fa-ban me-1 text-danger"></i><strong>Contraindications:</strong> ${med.contraindications}</small>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
         getFilteredMedications() {
            const query = document.getElementById('medicationSearch').value.toLowerCase();
            const categoryFilter = document.getElementById('medicationCategoryFilter').value;

            return medications.filter(med => {
                const matchesSearch = !query ||
                    med.name.toLowerCase().includes(query) ||
                    med.genericName.toLowerCase().includes(query) ||
                    med.description.toLowerCase().includes(query);

                const matchesCategory = categoryFilter === 'all' || med.category === categoryFilter;

                return matchesSearch && matchesCategory;
            });
        }

         filterMedications() {
            renderMedications();
        }

         resetMedicationFilters() {
            document.getElementById('medicationSearch').value = '';
            document.getElementById('medicationCategoryFilter').value = 'all';
            renderMedications();
            showToast('Filters reset', 'info');
        }

        // ===================== MEDICAL LETTERS =====================
         renderLetters() {
            const tbody = document.getElementById('lettersTableBody');
            const filtered = getFilteredLetters();

            if (filtered.length === 0) {
                tbody.innerHTML = `
                    <tr><td colspan="7">
                        <div class="empty-state">
                            <i class="fas fa-envelope-open-text"></i>
                            <h4>No letters found</h4>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    </td></tr>
                `;
            } else {
                tbody.innerHTML = filtered.map(letter => {
                    const patient = patients.find(p => p.id === letter.patientId);
                    const typeLabels = {
                        sick_leave: 'Sick Leave',
                        medical_certificate: 'Medical Certificate',
                        referral: 'Referral',
                        discharge: 'Discharge',
                        follow_up: 'Follow-up'
                    };
                    const typeColors = {
                        sick_leave: 'warning',
                        medical_certificate: 'success',
                        referral: 'primary',
                        discharge: 'info',
                        follow_up: 'secondary'
                    };
                    return `
                        <tr>
                            <td><span class="badge bg-light text-dark border fw-bold">${letter.id}</span></td>
                            <td><span class="badge bg-${typeColors[letter.type]}">${typeLabels[letter.type]}</span></td>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="patient-avatar" style="width: 35px; height: 35px; font-size: 0.8rem;">${getInitials(patient.firstName, patient.lastName)}</div>
                                    <div class="fw-bold">${patient.firstName} ${patient.lastName}</div>
                                </div>
                            </td>
                            <td>${letter.subject}</td>
                            <td><i class="fas fa-calendar me-1 text-muted"></i>${formatDate(letter.date)}</td>
                            <td><i class="fas fa-user-md me-1 text-primary"></i>${letter.doctor}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewLetter('${letter.id}')" title="View">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteLetter('${letter.id}')" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }

         getFilteredLetters() {
            const query = document.getElementById('letterSearch').value.toLowerCase();
            const typeFilter = document.getElementById('letterTypeFilter').value;

            return letters.filter(letter => {
                const patient = patients.find(p => p.id === letter.patientId);
                const matchesSearch = !query ||
                    letter.id.toLowerCase().includes(query) ||
                    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query) ||
                    letter.subject.toLowerCase().includes(query) ||
                    letter.content.toLowerCase().includes(query);

                const matchesType = typeFilter === 'all' || letter.type === typeFilter;

                return matchesSearch && matchesType;
            });
        }

         filterLetters() {
            renderLetters();
        }

        // ===================== PRESCRIPTION MODAL =====================
         openPrescriptionModal() {
            document.getElementById('prescriptionModal').classList.add('active');
            document.getElementById('prescriptionForm').reset();
            document.getElementById('medicationsContainer').innerHTML = '';
            medicationEntryCount = 0;
            addMedicationEntry();
            clearValidation();
        }

         closePrescriptionModal() {
            document.getElementById('prescriptionModal').classList.remove('active');
        }

         addMedicationEntry() {
            medicationEntryCount++;
            const container = document.getElementById('medicationsContainer');
            const medOptions = medications.map(m => `<option value="${m.id}">${m.name} (${m.strength})</option>`).join('');
            
            const entry = document.createElement('div');
            entry.className = 'medication-entry';
            entry.id = `medEntry_${medicationEntryCount}`;
            entry.innerHTML = `
                <button type="button" class="remove-btn" onclick="removeMedicationEntry(${medicationEntryCount})" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Medication *</label>
                        <select class="form-select med-select" required>
                            <option value="">Select Medication</option>
                            ${medOptions}
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Dosage *</label>
                        <input type="text" class="form-control med-dosage" placeholder="e.g., 1 tablet" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Frequency *</label>
                        <select class="form-select med-frequency" required>
                            <option value="">Select Frequency</option>
                            <option value="Once daily">Once daily</option>
                            <option value="Twice daily">Twice daily</option>
                            <option value="3 times daily">3 times daily</option>
                            <option value="4 times daily">4 times daily</option>
                            <option value="Every 6 hours">Every 6 hours</option>
                            <option value="Every 8 hours">Every 8 hours</option>
                            <option value="Every 12 hours">Every 12 hours</option>
                            <option value="As needed">As needed</option>
                            <option value="Before meals">Before meals</option>
                            <option value="After meals">After meals</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Duration *</label>
                        <div class="duration-input-group">
                            <input type="number" class="form-control med-duration-value" placeholder="Duration" min="1" required>
                            <select class="form-select med-duration-unit">
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <label class="form-label">Instructions</label>
                        <input type="text" class="form-control med-instructions" placeholder="e.g., Take with food, Avoid alcohol...">
                    </div>
                </div>
            `;
            container.appendChild(entry);
        }

        removeMedicationEntry(id) {
            const entry = document.getElementById(`medEntry_${id}`);
            if (entry) {
                entry.remove();
            }
            if (document.querySelectorAll('.medication-entry').length === 0) {
                addMedicationEntry();
            }
        }

         loadPatientInfo() {
            // Auto-populate patient info if needed
        }

         savePrescription() {
            const patientId = document.getElementById('rxPatient').value;
            const doctor = document.getElementById('rxDoctor').value;
            const diagnosis = document.getElementById('rxDiagnosis').value;

            if (!patientId || !doctor) {
                showToast('Please fill in all required fields', 'error');
                if (!patientId) document.getElementById('rxPatient').classList.add('is-invalid');
                if (!doctor) document.getElementById('rxDoctor').classList.add('is-invalid');
                return;
            }

            const medEntries = [];
            const entries = document.querySelectorAll('.medication-entry');
            let valid = true;

            entries.forEach(entry => {
                const medId = entry.querySelector('.med-select').value;
                const dosage = entry.querySelector('.med-dosage').value;
                const frequency = entry.querySelector('.med-frequency').value;
                const durationValue = entry.querySelector('.med-duration-value').value;
                const durationUnit = entry.querySelector('.med-duration-unit').value;
                const instructions = entry.querySelector('.med-instructions').value;

                if (!medId || !dosage || !frequency || !durationValue) {
                    valid = false;
                    return;
                }

                medEntries.push({
                    medicationId: medId,
                    dosage: dosage,
                    frequency: frequency,
                    duration: `${durationValue} ${durationUnit}`,
                    instructions: instructions
                });
            });

            if (!valid) {
                showToast('Please fill in all medication fields', 'error');
                return;
            }

            const newId = `RX-2026-${String(prescriptions.length + 1).padStart(3, '0')}`;
            const newPrescription = {
                id: newId,
                patientId: patientId,
                doctor: doctor,
                date: new Date().toISOString().split('T')[0],
                status: 'active',
                diagnosis: diagnosis,
                medications: medEntries
            };

            prescriptions.unshift(newPrescription);
            closePrescriptionModal();
            updateStats();
            renderPrescriptions();
            showToast('Prescription created successfully', 'success');
        }

         viewPrescription(rxId) {
            const rx = prescriptions.find(p => p.id === rxId);
            if (!rx) return;

            const patient = patients.find(p => p.id === rx.patientId);
            const modalBody = document.getElementById('viewPrescriptionBody');

            let medsHtml = rx.medications.map((med, index) => {
                const medication = medications.find(m => m.id === med.medicationId);
                return `
                    <div class="medication-list-item">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <div class="fw-bold text-primary">${index + 1}. ${medication.name}</div>
                                <div class="text-muted small">${medication.genericName} | ${medication.strength}</div>
                            </div>
                            <span class="dosage-badge">${med.dosage}</span>
                        </div>
                        <div class="mt-2 d-flex gap-2 flex-wrap">
                            <span class="frequency-badge"><i class="fas fa-clock me-1"></i>${med.frequency}</span>
                            <span class="frequency-badge"><i class="fas fa-calendar-alt me-1"></i>${med.duration}</span>
                        </div>
                        ${med.instructions ? `<div class="mt-2 text-muted small"><i class="fas fa-info-circle me-1 text-info"></i>${med.instructions}</div>` : ''}
                    </div>
                `;
            }).join('');

            modalBody.innerHTML = `
                <div class="prescription-letter">
                    <div class="prescription-header">
                        <div class="rx-symbol">℞</div>
                        <h4>MEDICAL PRESCRIPTION</h4>
                        <p class="text-muted mb-0">MediLab Pro Medical Center</p>
                    </div>
                    <div class="prescription-row">
                        <span class="prescription-label">Prescription ID</span>
                        <span class="prescription-value fw-bold">${rx.id}</span>
                    </div>
                    <div class="prescription-row">
                        <span class="prescription-label">Date</span>
                        <span class="prescription-value">${formatDate(rx.date)}</span>
                    </div>
                    <div class="prescription-row">
                        <span class="prescription-label">Patient</span>
                        <span class="prescription-value">${patient.firstName} ${patient.lastName} (${patient.id})</span>
                    </div>
                    <div class="prescription-row">
                        <span class="prescription-label">Doctor</span>
                        <span class="prescription-value">${rx.doctor}</span>
                    </div>
                    <div class="prescription-row">
                        <span class="prescription-label">Status</span>
                        <span class="prescription-value"><span class="status-badge badge-${rx.status}">${capitalize(rx.status)}</span></span>
                    </div>
                    ${rx.diagnosis ? `
                    <div class="prescription-row">
                        <span class="prescription-label">Diagnosis</span>
                        <span class="prescription-value">${rx.diagnosis}</span>
                    </div>
                    ` : ''}
                </div>
                <h5 class="mt-4 mb-3"><i class="fas fa-pills me-2 text-primary"></i>Prescribed Medications</h5>
                ${medsHtml}
            `;

            document.getElementById('viewPrescriptionModal').classList.add('active');
        }

        closeViewPrescriptionModal() {
            document.getElementById('viewPrescriptionModal').classList.remove('active');
        }

        editPrescription(rxId) {
            showToast('Edit functionality - Prescription ' + rxId, 'info');
        }

         deletePrescription(rxId) {
            deleteTarget = { type: 'prescription', id: rxId };
            document.getElementById('deleteMessage').textContent = `You are about to delete prescription ${rxId}. This action cannot be undone.`;
            document.getElementById('deleteModal').classList.add('active');
        }

         printPrescription() {
            window.print();
        }

        // ===================== LETTER MODAL =====================
        openLetterModal() {
            document.getElementById('letterModal').classList.add('active');
            document.getElementById('letterForm').reset();
            clearValidation();
        }

         closeLetterModal() {
            document.getElementById('letterModal').classList.remove('active');
        }

         updateLetterTemplate() {
            const type = document.getElementById('letterType').value;
            const subjectField = document.getElementById('letterSubject');
            const contentField = document.getElementById('letterContent');
            
            const templates = {
                sick_leave: {
                    subject: 'Sick Leave Certificate',
                    content: 'This is to certify that [Patient Name] has been under my medical care and requires rest due to [condition]. The patient is advised to take leave from [start date] to [end date] and return to work on [return date].'
                },
                medical_certificate: {
                    subject: 'Medical Fitness Certificate',
                    content: 'This is to certify that [Patient Name] has been examined and found to be medically fit/unfit. [Additional details about condition and recommendations].'
                },
                referral: {
                    subject: 'Referral Letter',
                    content: 'Dear Colleague,\\n\\nI am referring [Patient Name] to your care for further evaluation and management. The patient presents with [symptoms/condition] and requires specialist assessment.\\n\\nPlease find attached relevant medical records and test results.'
                },
                discharge: {
                    subject: 'Discharge Summary',
                    content: 'Patient Name: [Patient Name]\\nDate of Admission: [Date]\\nDate of Discharge: [Date]\\n\\nDiagnosis: [Diagnosis]\\n\\nTreatment Provided: [Details]\\n\\nDischarge Instructions: [Instructions]\\n\\nFollow-up: [Follow-up plan]'
                },
                follow_up: {
                    subject: 'Follow-up Note',
                    content: 'Follow-up visit for [Patient Name].\\n\\nCurrent Status: [Status]\\n\\nChanges in Condition: [Details]\\n\\nUpdated Treatment Plan: [Plan]\\n\\nNext Follow-up: [Date]'
                }
            };

            if (templates[type]) {
                subjectField.value = templates[type].subject;
                contentField.value = templates[type].content;
            }
        }

        saveLetter() {
            const patientId = document.getElementById('letterPatient').value;
            const doctor = document.getElementById('letterDoctor').value;
            const type = document.getElementById('letterType').value;
            const subject = document.getElementById('letterSubject').value;
            const content = document.getElementById('letterContent').value;
            const startDate = document.getElementById('letterStartDate').value;
            const endDate = document.getElementById('letterEndDate').value;

            if (!patientId || !doctor || !type || !content) {
                showToast('Please fill in all required fields', 'error');
                if (!patientId) document.getElementById('letterPatient').classList.add('is-invalid');
                if (!doctor) document.getElementById('letterDoctor').classList.add('is-invalid');
                if (!type) document.getElementById('letterType').classList.add('is-invalid');
                if (!content) document.getElementById('letterContent').classList.add('is-invalid');
                return;
            }

            const newId = `ML-2026-${String(letters.length + 1).padStart(3, '0')}`;
            const newLetter = {
                id: newId,
                patientId: patientId,
                doctor: doctor,
                type: type,
                subject: subject || 'Medical Letter',
                content: content,
                startDate: startDate,
                endDate: endDate,
                date: new Date().toISOString().split('T')[0]
            };

            letters.unshift(newLetter);
            closeLetterModal();
            renderLetters();
            showToast('Medical letter created successfully', 'success');
        }

         viewLetter(letterId) {
            const letter = letters.find(l => l.id === letterId);
            if (!letter) return;

            const patient = patients.find(p => p.id === letter.patientId);
            const typeLabels = {
                sick_leave: 'Sick Leave Certificate',
                medical_certificate: 'Medical Fitness Certificate',
                referral: 'Referral Letter',
                discharge: 'Discharge Summary',
                follow_up: 'Follow-up Note'
            };

            const modalBody = document.getElementById('viewLetterBody');
            modalBody.innerHTML = `
                <div class="prescription-letter">
                    <div class="prescription-header">
                        <h4>${typeLabels[letter.type]}</h4>
                        <p class="text-muted mb-0">MediLab Pro Medical Center</p>
                    </div>
                    <div class="prescription-row">
                        <span class="prescription-label">Letter ID</span>
                        <span class="prescription-value fw-bold">${letter.id}</span>
                    </div>
                    <div class="prescription-row">
                        <span class="prescription-label">Date</span>
                        <span class="prescription-value">${formatDate(letter.date)}</span>
                    </div>
                    <div class="prescription-row">
                        <span class="prescription-label">Patient</span>
                        <span class="prescription-value">${patient.firstName} ${patient.lastName} (${patient.id})</span>
                    </div>
                    <div class="prescription-row">
                        <span class="prescription-label">Doctor</span>
                        <span class="prescription-value">${letter.doctor}</span>
                    </div>
                    ${letter.startDate ? `
                    <div class="prescription-row">
                        <span class="prescription-label">Period</span>
                        <span class="prescription-value">${formatDate(letter.startDate)} - ${formatDate(letter.endDate)}</span>
                    </div>
                    ` : ''}
                    <div class="prescription-row">
                        <span class="prescription-label">Subject</span>
                        <span class="prescription-value">${letter.subject}</span>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-light rounded">
                    <h6 class="text-muted mb-2">Content:</h6>
                    <p style="white-space: pre-line; line-height: 1.8;">${letter.content}</p>
                </div>
            `;

            document.getElementById('viewLetterModal').classList.add('active');
        }

        closeViewLetterModal() {
            document.getElementById('viewLetterModal').classList.remove('active');
        }

         deleteLetter(letterId) {
            deleteTarget = { type: 'letter', id: letterId };
            document.getElementById('deleteMessage').textContent = `You are about to delete letter ${letterId}. This action cannot be undone.`;
            document.getElementById('deleteModal').classList.add('active');
        }

         printLetter() {
            window.print();
        }

        // ===================== DELETE =====================
         closeDeleteModal() {
            document.getElementById('deleteModal').classList.remove('active');
            deleteTarget = { type: null, id: null };
        }

         confirmDelete() {
            if (!deleteTarget.id) return;

            if (deleteTarget.type === 'prescription') {
                prescriptions = prescriptions.filter(p => p.id !== deleteTarget.id);
                updateStats();
                renderPrescriptions();
                showToast('Prescription deleted successfully', 'success');
            } else if (deleteTarget.type === 'letter') {
                letters = letters.filter(l => l.id !== deleteTarget.id);
                renderLetters();
                showToast('Letter deleted successfully', 'success');
            }

            closeDeleteModal();
        }

        // ===================== VALIDATION =====================
         clearValidation() {
            document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        }

        // ===================== UTILITIES =====================
         getInitials(first, last) {
            return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
        }

         formatDate(dateStr) {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }

         capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        // ===================== TOASTS =====================
         showToast(message, type = 'success') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `custom-toast ${type}`;
            
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-times-circle',
                warning: 'fa-exclamation-circle',
                info: 'fa-info-circle'
            };
            
            const colors = {
                success: 'var(--success-color)',
                error: 'var(--danger-color)',
                warning: 'var(--warning-color)',
                info: 'var(--accent-color)'
            };

            toast.innerHTML = `
                <i class="fas ${icons[type]}" style="font-size: 1.5rem; color: ${colors[type]};"></i>
                <span style="font-weight: 500;">${message}</span>
            `;

            container.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideOut 0.4s ease forwards';
                setTimeout(() => toast.remove(), 400);
            }, 3000);
        }

        // ===================== KEYBOARD & EVENTS =====================
       
}
document.addEventListener('DOMContentLoaded', () => {
    window.ap = new DoctorPrescription();
});