const socket = io('https://sarlextracoiffure.onrender.com');

document.addEventListener('DOMContentLoaded', () => {
    const reservationList = document.getElementById('reservationList');
    const modal = document.getElementById('confirmationModal');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    let currentReservationId;

    socket.on('newReservation', (reservation) => {
        const li = document.createElement('li');
        li.dataset.id = reservation.id;
        li.innerHTML = `
            <strong>${reservation.name}</strong> |
            Téléphone - ${reservation.phone} |
            Coiffure - ${reservation.haircut} |
            Type - ${reservation.type}
            <button class="delete-btn" data-id="${reservation.id}">Supprimer</button>
        `;
        reservationList.prepend(li);
    });

    reservationList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            currentReservationId = e.target.dataset.id;
            openModal();
        }
    });

    confirmDelete.addEventListener('click', () => {
        socket.emit('deleteReservation', currentReservationId);
        const li = document.querySelector(`[data-id="${currentReservationId}"]`);
        if (li) li.remove();
        closeModal();
    });

    cancelDelete.addEventListener('click', closeModal);

    function openModal() {
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }
});
