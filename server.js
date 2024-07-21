const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
      origin: "https://sarlextracoiffure.onrender.com",
      methods: ["GET", "POST"]
    }
});
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

const reservations = new Map();

io.on('connection', (socket) => {
    console.log('Un client s\'est connecté');

    socket.on('newReservation', (reservation) => {
        const reservationTime = new Date(`2000-01-01T${reservation.time}`);
        const endTime = new Date(reservationTime.getTime() + 10 * 60000); // 10 minutes later

        let isTimeSlotAvailable = true;

        for (let [time, existingReservation] of reservations) {
            const existingEndTime = new Date(time.getTime() + 10 * 60000);
            if (
                (reservationTime >= time && reservationTime < existingEndTime) ||
                (endTime > time && endTime <= existingEndTime) ||
                (reservationTime <= time && endTime >= existingEndTime)
            ) {
                isTimeSlotAvailable = false;
                break;
            }
        }

        if (isTimeSlotAvailable) {
            reservations.set(reservationTime, reservation);
            io.emit('newReservation', reservation);
            socket.emit('reservationResponse', {
                success: true
            });
        } else {
            socket.emit('reservationResponse', {
                success: false,
                message: "Une réservation pour cette heure est déjà en cours. Veuillez choisir un autre horaire."
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
