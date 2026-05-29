

document.addEventListener('keydown', function(e) {

    // CTRL + C
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {

        // prevent browser copy
        e.preventDefault();

        // clear text inputs
        document.querySelectorAll('input').forEach(input => {

            switch(input.type) {

                case 'text':
                case 'email':
                case 'tel':
                case 'number':
                case 'date':
                    input.value = '';
                    break;

                case 'checkbox':
                case 'radio':
                    input.checked = false;
                    break;
            }
        });

        // reset selects
        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });

        // clear textarea
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.value = '';
        });

        // optional summary clear
        const summary = document.getElementById('summaryList');
        if(summary){
            summary.innerHTML = '';
        }

        // optional alert
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Cleared',
        //     text: 'All fields reset successfully',
        //     timer: 1500,
        //     showConfirmButton: false
        // });
    }

});

