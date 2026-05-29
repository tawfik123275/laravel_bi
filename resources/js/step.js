
let step = 1;

function showStep(n) {

    document.querySelectorAll('[id^="step-"]').forEach(el => {
        el.style.display = 'none';
    });

    document.getElementById('step-' + n).style.display = 'block';

    document.getElementById('progressBar').style.width = (n * 33) + '%';
}

function nextStep() {
    if (step < 3) {
        step++;
        showStep(step);
        updateSummary();
    }
}

function prevStep() {
    if (step > 1) {
        step--;
        showStep(step);
    }
}

function updateSummary() {

    document.getElementById('summaryPatient').innerText =
        document.getElementById('patientName').value || 'No name';

    let list = document.getElementById('summaryList');
    list.innerHTML = '';

    document.querySelectorAll('#step-2 input[type=checkbox]:checked')
        .forEach(el => {
            let li = document.createElement('li');
            li.textContent = el.parentElement.innerText;
            list.appendChild(li);
        });
}

// init
showStep(1);
