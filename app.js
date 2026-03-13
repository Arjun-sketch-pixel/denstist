document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Appointment Form Submission ---
    const appointmentForm = document.getElementById('appointmentForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    // Form is now handled by Web3Forms in the HTML

    // --- Admin Panel Logic ---
    const appointmentsList = document.getElementById('appointmentsList');
    const totalAppointmentsEl = document.getElementById('totalAppointments');

    if (appointmentsList) {
        renderAppointments();
    }

    // --- Helper Functions ---
    function saveAppointment(appointment) {
        let appointments = getAppointments();
        appointments.unshift(appointment); // Add new appointment to the beginning
        localStorage.setItem('lumina_appointments', JSON.stringify(appointments));
    }

    function getAppointments() {
        const stored = localStorage.getItem('lumina_appointments');
        return stored ? JSON.parse(stored) : [];
    }

    function deleteAppointment(id) {
        let appointments = getAppointments();
        appointments = appointments.filter(app => app.id !== id);
        localStorage.setItem('lumina_appointments', JSON.stringify(appointments));
        renderAppointments();
    }

    function completeAppointment(id) {
        let appointments = getAppointments();
        const index = appointments.findIndex(app => app.id === id);
        if (index !== -1) {
            appointments[index].status = 'completed';
            localStorage.setItem('lumina_appointments', JSON.stringify(appointments));
            renderAppointments();
        }
    }

    function renderAppointments() {
        if (!appointmentsList) return;

        const appointments = getAppointments();
        
        // Update stats
        if (totalAppointmentsEl) {
            totalAppointmentsEl.textContent = appointments.length;
        }

        appointmentsList.innerHTML = '';

        if (appointments.length === 0) {
            appointmentsList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-calendar-xmark"></i>
                    <p>No appointments found yet.</p>
                </div>
            `;
            return;
        }

        appointments.forEach(app => {
            const card = document.createElement('div');
            card.className = `appointment-card ${app.status === 'completed' ? 'completed' : ''}`;
            
            // Format date for display
            const dateObj = new Date(app.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'short', 
                month: 'short', 
                day: 'numeric'
            });

            card.innerHTML = `
                <div class="app-info">
                    <h3>${app.name}</h3>
                    <div class="app-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${formattedDate}</span>
                        <span><i class="fa-regular fa-clock"></i> ${app.time}</span>
                        <span><i class="fa-solid fa-phone"></i> ${app.phone}</span>
                    </div>
                    <span class="app-reason">${app.reason}</span>
                </div>
                <div class="app-actions">
                    <button class="btn-icon btn-complete" title="Mark as Completed" onclick="window.completeAppointmentFn('${app.id}')">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <button class="btn-icon btn-delete" title="Delete" onclick="window.deleteAppointmentFn('${app.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Optionally dim completed appointments
            if(app.status === 'completed') {
                card.style.opacity = '0.6';
            }

            appointmentsList.appendChild(card);
        });
    }

    // Expose functions to global scope for inline handlers
    window.deleteAppointmentFn = deleteAppointment;
    window.completeAppointmentFn = completeAppointment;
});
