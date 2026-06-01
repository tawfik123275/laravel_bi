 
    document.addEventListener('DOMContentLoaded', () => {
        const roleCards = document.querySelectorAll('.role-card');
        const loginFields = document.getElementById('loginFields');
        const roleInput = document.getElementById('roleInput');
        const loginForm = document.getElementById('loginForm');
        const labInfo = document.getElementById('labInfo');

        // Role selection
        roleCards.forEach(card => {
            card.addEventListener('click', () => {
                roleCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                roleInput.value = card.dataset.role;
                loginFields.classList.remove('d-none');
                
                // Show/hide lab info
                if (card.dataset.role === 'lab_staff') {
                    labInfo.style.display = 'block';
                } else {
                    labInfo.style.display = 'none';
                }
                
                // Scroll to form fields on mobile
                if (window.innerWidth < 768) {
                    loginFields.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });

        // Form validation
        loginForm.addEventListener('submit', (e) => {
            if (!roleInput.value) {
                e.preventDefault();
                // alert('<?= $lang['choose_role_first'] ?? "Please select your role first" ?>');
                return;
            }

            const email = loginForm.querySelector('input[name="email"]');
            const password = loginForm.querySelector('input[name="password"]');
            
            if (!email.value || !password.value) {
                e.preventDefault();
                // alert('<?= $lang['fill_all_fields'] ?? "Please fill in all fields" ?>');
                return;
            }
        });

        // Auto-focus email field when role is selected
        document.addEventListener('click', (e) => {
            if (e.target.closest('.role-card')) {
                setTimeout(() => {
                    const emailField = loginForm.querySelector('input[name="email"]');
                    if (emailField) emailField.focus();
                }, 300);
            }
        });

        // Keyboard navigation for role cards
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.role-card')) {
                const currentCard = e.target.closest('.role-card');
                const cards = Array.from(roleCards);
                const currentIndex = cards.indexOf(currentCard);
                
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextCard = cards[(currentIndex + 1) % cards.length];
                    nextCard.click();
                    nextCard.focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevCard = cards[(currentIndex - 1 + cards.length) % cards.length];
                    prevCard.click();
                    prevCard.focus();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    currentCard.click();
                }
            }
        });

        // Preserve form data on page refresh
        const savedRole = sessionStorage.getItem('selectedRole');
        if (savedRole) {
            const savedCard = document.querySelector(`.role-card[data-role="${savedRole}"]`);
            if (savedCard) {
                savedCard.click();
                if (savedRole === 'lab_staff') {
                    labInfo.style.display = 'block';
                }
            }
        }

        // Save selected role
        roleCards.forEach(card => {
            card.addEventListener('click', () => {
                sessionStorage.setItem('selectedRole', card.dataset.role);
            });
        });

        // Show lab info if lab role was previously selected
        if (savedRole === 'lab_staff') {
            const labCard = document.querySelector('.role-card[data-role="lab_staff"]');
            if (labCard) {
                labInfo.style.display = 'block';
            }
        }
    });
    