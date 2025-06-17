<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - Gestión de Reservas</title>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>
    <style>
        /* Estilos CSS para esta página */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }

        header {
            background-color: #333;
            color: white;
            padding: 1em 0;
            text-align: center;
        }

        nav ul {
            list-style: none;
            padding: 0;
        }

        nav ul li {
            display: inline;
            margin: 0 15px;
        }

        nav ul li a {
            color: white;
            text-decoration: none;
            font-weight: bold;
        }

        main {
            padding: 20px;
            max-width: 900px;
            margin: 20px auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        footer {
            text-align: center;
            padding: 1em 0;
            color: #777;
            font-size: 0.9em;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group select,
        .form-group textarea {
            width: calc(100% - 22px); /* Ajuste para padding y border */
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box; /* Incluye padding y border en el ancho total */
        }

        button {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
            margin-right: 10px;
        }

        button:hover {
            background-color: #0056b3;
        }

        #adminMessage {
            margin-top: 10px;
            font-weight: bold;
        }
        .success {
            color: green;
        }
        .error {
            color: red;
        }

        h3 {
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            color: #555;
        }

        .filters {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .filters label {
            font-weight: bold;
        }

        .filters select, .filters input[type="text"] {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            min-width: 150px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        table, th, td {
            border: 1px solid #ddd;
        }

        th, td {
            padding: 10px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background-color: #f2f2f2;
        }

        .action-buttons button {
            padding: 5px 10px;
            font-size: 0.8em;
            margin-bottom: 5px;
        }

        .delete-btn {
            background-color: #dc3545;
        }

        .delete-btn:hover {
            background-color: #c82333;
        }

        .save-btn {
            background-color: #28a745;
        }

        .save-btn:hover {
            background-color: #218838;
        }

        .cancel-btn {
            background-color: #ffc107;
            color: #333;
        }

        .cancel-btn:hover {
            background-color: #e0a800;
        }

        .restaurant-header td {
            background-color: #e0e0e0;
            font-weight: bold;
            text-align: center;
            padding: 8px;
        }

        .restaurant-total-row td {
            background-color: #d4edda;
            font-weight: bold;
            color: #155724;
            text-align: right;
            padding: 8px;
        }

        .grand-total {
            font-size: 1.2em;
            font-weight: bold;
            margin-top: 20px;
            text-align: right;
            padding: 10px;
            background-color: #cce5ff;
            border-radius: 5px;
            color: #004085;
        }

        /* Estilos para inputs en modo edición en la tabla */
        table input[type="text"],
        table input[type="number"],
        table select,
        table textarea {
            width: calc(100% - 10px); /* Ajuste para que quepa bien en la celda */
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 3px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <header>
        <h1>Sistema de Reservas</h1>
        <nav>
            <ul>
                <li><a href="add_booking.html">Agregar Reserva</a></li>
                <li><a href="view_bookings.html">Ver Reservas</a></li>
                <li><a href="admin_bookings.html">Administrador</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <h2>Panel de Administración de Reservas</h2>
        <p>Gestionando reservas para hoy, 17 de junio de 2025.</p>

        <h3>Agregar Nueva Reserva (Administrador)</h3>
        <div class="form-group">
            <label for="adminRoom">Room:</label>
            <input type="text" id="adminRoom" required>
        </div>
        <div class="form-group">
            <label for="adminName">Name:</label>
            <input type="text" id="adminName" required>
        </div>
        <div class="form-group">
            <label for="adminRestaurant">Restaurante:</label>
            <select id="adminRestaurant" required>
                <option value="">Selecciona un restaurante</option>
                <option value="El Patio">El Patio</option>
                <option value="Olio">Olio</option>
                <option value="Bluewater">Bluewater</option>
                <option value="Bordeaux">Bordeaux</option>
                <option value="Himitsu">Himitsu</option>
                <option value="Hibachi">Hibachi</option>
            </select>
        </div>
        <div class="form-group">
            <label for="adminTime">Time:</label>
            <select id="adminTime" required disabled>
                <option value="">Selecciona un horario</option>
            </select>
        </div>
        <div class="form-group">
            <label for="adminPax">Pax:</label>
            <input type="number" id="adminPax" min="1" required>
        </div>
        <div class="form-group">
            <label for="adminNotes">Notes (Opcional):</label>
            <textarea id="adminNotes" rows="3"></textarea>
        </div>
        <button id="addAdminBookingBtn">Agregar Reserva</button>
        <button id="clearAdminFormBtn">Limpiar Campos</button>
        <p id="adminMessage"></p>

        <h3 style="margin-top: 30px;">Reservas Existentes</h3>
        <div class="filters">
            <label for="adminFilterRestaurant">Filtrar por Restaurante:</label>
            <select id="adminFilterRestaurant">
                <option value="">Todos</option>
                <option value="El Patio">El Patio</option>
                <option value="Olio">Olio</option>
                <option value="Bluewater">Bluewater</option>
                <option value="Bordeaux">Bordeaux</option>
                <option value="Himitsu">Himitsu</option>
                <option value="Hibachi">Hibachi</option>
            </select>
            <label for="adminSearchQuery">Buscar (Nombre/Room):</label>
            <input type="text" id="adminSearchQuery" placeholder="Buscar...">
        </div>
        <div id="adminBookingsTableContainer">
            <p>Cargando reservas...</p>
        </div>
    </main>

    <footer>
        <p>Gestionando reservas para hoy, 17 de junio de 2025.</p>
    </footer>

    <script>
        // Configuración de Firebase (REEMPLAZA CON TUS PROPIAS CREDENCIALES)
        const firebaseConfig = {
            apiKey: "TU_API_KEY",
            authDomain: "TU_PROYECTO.firebaseapp.com",
            databaseURL: "https://TU_PROYECTO-default-rtdb.firebaseio.com",
            projectId: "TU_PROYECTO",
            storageBucket: "TU_PROYECTO.appspot.com",
            messagingSenderId: "TU_SENDER_ID",
            appId: "TU_APP_ID"
        };
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();
        const bookingsRef = database.ref('bookings');

        // Definir los restaurantes y sus horarios
        const RESTAURANTS = {
            "El Patio": ["18:00", "21:00"],
            "Olio": ["18:00", "21:00"],
            "Bluewater": ["18:00", "21:00"],
            "Bordeaux": ["18:00", "21:00"],
            "Himitsu": ["18:00", "21:00"],
            "Hibachi": ["17:30", "18:45", "20:00", "21:15"]
        };

        // --- Lógica del formulario de Agregar en Admin ---
        const adminRestaurantSelect = document.getElementById('adminRestaurant');
        const adminTimeSelect = document.getElementById('adminTime');
        const addAdminBookingBtn = document.getElementById('addAdminBookingBtn');
        const clearAdminFormBtn = document.getElementById('clearAdminFormBtn');
        const adminMessageElement = document.getElementById('adminMessage');

        adminRestaurantSelect.addEventListener('change', () => {
            const selectedRestaurant = adminRestaurantSelect.value;
            adminTimeSelect.innerHTML = '<option value="">Selecciona un horario</option>';
            if (selectedRestaurant) {
                RESTAURANTS[selectedRestaurant].forEach(time => {
                    const option = document.createElement('option');
                    option.value = time;
                    option.textContent = time;
                    adminTimeSelect.appendChild(option);
                });
                adminTimeSelect.disabled = false;
            } else {
                adminTimeSelect.disabled = true;
            }
        });

        addAdminBookingBtn.addEventListener('click', async () => {
            const room = document.getElementById('adminRoom').value.trim();
            const name = document.getElementById('adminName').value.trim();
            const restaurant = adminRestaurantSelect.value;
            const time = adminTimeSelect.value;
            const pax = parseInt(document.getElementById('adminPax').value);
            const notes = document.getElementById('adminNotes').value.trim();

            if (!room || !name || !restaurant || !time || isNaN(pax) || pax < 1) {
                adminMessageElement.textContent = 'Por favor, completa todos los campos requeridos y asegúrate que Pax sea un número válido.';
                adminMessageElement.className = 'error';
                return;
            }

            const newBooking = {
                room,
                name,
                restaurant,
                time,
                pax,
                notes: notes || 'N/A',
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };

            try {
                await bookingsRef.push(newBooking);
                adminMessageElement.textContent = 'Reserva agregada con éxito.';
                adminMessageElement.className = 'success';
                // Limpiar el formulario
                document.getElementById('adminRoom').value = '';
                document.getElementById('adminName').value = '';
                adminRestaurantSelect.value = '';
                adminTimeSelect.innerHTML = '<option value="">Selecciona un horario</option>';
                adminTimeSelect.disabled = true;
                document.getElementById('adminPax').value = '';
                document.getElementById('adminNotes').value = '';
            } catch (error) {
                adminMessageElement.textContent = `Error al agregar reserva: ${error.message}`;
                adminMessageElement.className = 'error';
                console.error("Error adding booking:", error);
            }
        });

        clearAdminFormBtn.addEventListener('click', () => {
            document.getElementById('adminRoom').value = '';
            document.getElementById('adminName').value = '';
            adminRestaurantSelect.value = '';
            adminTimeSelect.innerHTML = '<option value="">Selecciona un horario</option>';
            adminTimeSelect.disabled = true;
            document.getElementById('adminPax').value = '';
            document.getElementById('adminNotes').value = '';
            adminMessageElement.textContent = '';
        });

        // --- Lógica de la tabla de Administración (Ver, Modificar, Eliminar) ---
        const adminBookingsTableContainer = document.getElementById('adminBookingsTableContainer');
        const adminFilterRestaurantSelect = document.getElementById('adminFilterRestaurant');
        const adminSearchQueryInput = document.getElementById('adminSearchQuery');

        let allAdminBookings = {}; // Para guardar todas las reservas cargadas en admin

        const renderAdminBookingsTable = () => {
            let filteredBookings = Object.entries(allAdminBookings); // [ [key, value], ... ]

            // Filtrar por restaurante
            if (adminFilterRestaurantSelect.value) {
                filteredBookings = filteredBookings.filter(([key, booking]) => booking.restaurant === adminFilterRestaurantSelect.value);
            }

            // Buscar por nombre o room
            const query = adminSearchQueryInput.value.toLowerCase().trim();
            if (query) {
                filteredBookings = filteredBookings.filter(([key, booking]) =>
                    (booking.name && booking.name.toLowerCase().includes(query)) ||
                    (booking.room && booking.room.toLowerCase().includes(query))
                );
            }

            // Agrupar por restaurante y ordenar por hora para la tabla
            const groupedForTable = {};
            Object.keys(RESTAURANTS).forEach(r => groupedForTable[r] = []);
            filteredBookings.forEach(([key, booking]) => {
                if (groupedForTable[booking.restaurant]) {
                    groupedForTable[booking.restaurant].push({ key, ...booking }); // Incluir la key para eliminar/modificar
                }
            });

            // Ordenar las reservas dentro de cada restaurante por hora
            Object.keys(groupedForTable).forEach(restaurantName => {
                groupedForTable[restaurantName].sort((a, b) => a.time.localeCompare(b.time));
            });

            let tableHtml = '';
            let totalGrandPax = 0;

            if (filteredBookings.length === 0) {
                tableHtml = '<p class="no-bookings-message">No hay reservas para mostrar con los filtros actuales.</p>';
            } else {
                tableHtml += `<table>
                    <thead>
                        <tr>
                            <th>Room</th>
                            <th>Name</th>
                            <th>Restaurante</th>
                            <th>Time</th>
                            <th>Pax</th>
                            <th>Notes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>`;

                Object.keys(groupedForTable).forEach(restaurantName => {
                    const bookingsForRestaurant = groupedForTable[restaurantName];
                    let totalPaxRestaurant = 0;

                    if (bookingsForRestaurant.length > 0) {
                        // Fila de encabezado para el restaurante
                        tableHtml += `<tr class="restaurant-header"><td colspan="7"><strong>--- ${restaurantName} ---</strong></td></tr>`;

                        bookingsForRestaurant.forEach(booking => {
                            tableHtml += `
                                <tr data-key="${booking.key}">
                                    <td><input type="text" value="${booking.room || ''}" class="edit-room" disabled></td>
                                    <td><input type="text" value="${booking.name || ''}" class="edit-name" disabled></td>
                                    <td>
                                        <select class="edit-restaurant" disabled>
                                            ${Object.keys(RESTAURANTS).map(r => `<option value="${r}" ${r === booking.restaurant ? 'selected' : ''}>${r}</option>`).join('')}
                                        </select>
                                    </td>
                                    <td>
                                        <select class="edit-time" disabled data-current-restaurant="${booking.restaurant}">
                                            ${RESTAURANTS[booking.restaurant] ? RESTAURANTS[booking.restaurant].map(time => `<option value="${time}" ${time === booking.time ? 'selected' : ''}>${time}</option>`).join('') : '<option value="">Cargando...</option>'}
                                        </select>
                                    </td>
                                    <td><input type="number" value="${booking.pax || 0}" class="edit-pax" min="1" disabled></td>
                                    <td><textarea class="edit-notes" disabled>${booking.notes || ''}</textarea></td>
                                    <td class="action-buttons">
                                        <button class="modify-btn">Modificar</button>
                                        <button class="save-btn" style="display:none;">Guardar</button>
                                        <button class="cancel-btn" style="display:none;">Cancelar</button>
                                        <button class="delete-btn">Eliminar</button>
                                    </td>
                                </tr>`;
                            totalPaxRestaurant += (booking.pax || 0);
                        });
                        tableHtml += `<tr><td colspan="7" class="restaurant-total-row"><strong>Total Pax ${restaurantName}: ${totalPaxRestaurant}</strong></td></tr>`;
                        totalGrandPax += totalPaxRestaurant;
                    }
                });

                tableHtml += `</tbody></table>`;
                tableHtml += `<div class="grand-total">Total General de Pax: ${totalGrandPax}</div>`;
            }
            adminBookingsTableContainer.innerHTML = tableHtml;

            // Añadir listeners a los botones de la tabla para modificar/guardar/cancelar/eliminar
            adminBookingsTableContainer.querySelectorAll('.modify-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const row = e.target.closest('tr');
                    const inputs = row.querySelectorAll('input, select, textarea');
                    inputs.forEach(input => input.disabled = false);
                    e.target.style.display = 'none'; // Ocultar Modificar
                    row.querySelector('.save-btn').style.display = 'inline-block';
                    row.querySelector('.cancel-btn').style.display = 'inline-block';
                    row.querySelector('.delete-btn').disabled = true; // Deshabilitar eliminar durante edición

                    // Para actualizar las opciones de tiempo si cambia el restaurante en edición
                    const editRestaurantSelect = row.querySelector('.edit-restaurant');
                    const editTimeSelect = row.querySelector('.edit-time');
                    editRestaurantSelect.addEventListener('change', () => {
                        const currentRest = editRestaurantSelect.value;
                        editTimeSelect.innerHTML = ''; // Limpiar opciones
                        if (RESTAURANTS[currentRest]) {
                            RESTAURANTS[currentRest].forEach(time => {
                                const option = document.createElement('option');
                                option.value = time;
                                option.textContent = time;
                                editTimeSelect.appendChild(option);
                            });
                        }
                    });
                });
            });

            adminBookingsTableContainer.querySelectorAll('.save-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const row = e.target.closest('tr');
                    const key = row.dataset.key;
                    const room = row.querySelector('.edit-room').value.trim();
                    const name = row.querySelector('.edit-name').value.trim();
                    const restaurant = row.querySelector('.edit-restaurant').value;
                    const time = row.querySelector('.edit-time').value;
                    const pax = parseInt(row.querySelector('.edit-pax').value);
                    const notes = row.querySelector('.edit-notes').value.trim();

                    if (!room || !name || !restaurant || !time || isNaN(pax) || pax < 1) {
                        alert('Por favor, completa todos los campos requeridos y asegúrate que Pax sea un número válido.');
                        return;
                    }

                    try {
                        await bookingsRef.child(key).update({ room, name, restaurant, time, pax, notes: notes || 'N/A' });
                        alert('Reserva modificada con éxito.');
                        // Deshabilitar edición y restaurar botones
                        const inputs = row.querySelectorAll('input, select, textarea');
                        inputs.forEach(input => input.disabled = true);
                        e.target.style.display = 'none'; // Ocultar Guardar
                        row.querySelector('.cancel-btn').style.display = 'none'; // Ocultar Cancelar
                        row.querySelector('.modify-btn').style.display = 'inline-block'; // Mostrar Modificar
                        row.querySelector('.delete-btn').disabled = false; // Habilitar eliminar
                    } catch (error) {
                        alert(`Error al modificar reserva: ${error.message}`);
                        console.error("Error modifying booking:", error);
                    }
                });
            });

            adminBookingsTableContainer.querySelectorAll('.cancel-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const row = e.target.closest('tr');
                    const key = row.dataset.key;
                    const originalBooking = allAdminBookings[key];

                    // Restaurar valores originales
                    row.querySelector('.edit-room').value = originalBooking.room || '';
                    row.querySelector('.edit-name').value = originalBooking.name || '';
                    row.querySelector('.edit-restaurant').value = originalBooking.restaurant || '';
                    const editTimeSelect = row.querySelector('.edit-time');
                    editTimeSelect.innerHTML = RESTAURANTS[originalBooking.restaurant] ? RESTAURANTS[originalBooking.restaurant].map(time => `<option value="${time}" ${time === originalBooking.time ? 'selected' : ''}>${time}</option>`).join('') : '<option value="">Selecciona un horario</option>';
                    row.querySelector('.edit-pax').value = originalBooking.pax || 0;
                    row.querySelector('.edit-notes').value = originalBooking.notes || '';

                    // Deshabilitar edición y restaurar botones
                    const inputs = row.querySelectorAll('input, select, textarea');
                    inputs.forEach(input => input.disabled = true);
                    e.target.style.display = 'none'; // Ocultar Cancelar
                    row.querySelector('.save-btn').style.display = 'none'; // Ocultar Guardar
                    row.querySelector('.modify-btn').style.display = 'inline-block'; // Mostrar Modificar
                    row.querySelector('.delete-btn').disabled = false; // Habilitar eliminar
                });
            });

            adminBookingsTableContainer.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const row = e.target.closest('tr');
                    const key = row.dataset.key;
                    if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
                        try {
                            await bookingsRef.child(key).remove();
                            alert('Reserva eliminada con éxito.');
                        } catch (error) {
                            alert(`Error al eliminar reserva: ${error.message}`);
                            console.error("Error deleting booking:", error);
                        }
                    }
                });
            });
        };

        // Escuchar cambios en la base de datos para la tabla de administración
        bookingsRef.on('value', (snapshot) => {
            allAdminBookings = snapshot.val() || {};
            renderAdminBookingsTable(); // Renderizar cada vez que los datos cambian
        }, (error) => {
            console.error("Error al cargar reservas para admin:", error);
            adminBookingsTableContainer.innerHTML = '<p class="no-bookings-message" style="color: red;">Error al cargar reservas. Por favor, inténtalo de nuevo más tarde.</p>';
        });

        // Event listeners para filtros en la tabla de administración
        adminFilterRestaurantSelect.addEventListener('change', renderAdminBookingsTable);
        adminSearchQueryInput.addEventListener('input', renderAdminBookingsTable);
    </script>
</body>
</html>
