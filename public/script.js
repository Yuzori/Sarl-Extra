const socket = io('https://sarlextracoiffure.onrender.com');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservationForm');
    const confirmation = document.getElementById('confirmation');
    
    gsap.from('input, button', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const reservation = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            haircut: document.getElementById('haircut').value,
            type: document.getElementById('type').value,
        };

        socket.emit('newReservation', reservation);

        gsap.to(form, {
            scale: 0.9,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                form.reset();
                gsap.to(form, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.3,
                    delay: 0.1
                });
            }
        });

        document.getElementById('reservationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission du formulaire
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = "Félicitations, votre réservation a été transmise.";
    messageDiv.style.color = 'green';
});
        
    });
});