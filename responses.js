// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUirwoSQgvcMZn7uLjKMAxlTA15Jkl2BM",
    authDomain: "ismakun-bf0fa.firebaseapp.com",
    databaseURL: "https://ismakun-bf0fa-default-rtdb.firebaseio.com",
    projectId: "ismakun-bf0fa",
    storageBucket: "ismakun-bf0fa.firebasestorage.app",
    messagingSenderId: "1028877703945",
    appId: "1:1028877703945:web:331de48acbcdf2234a51d8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Chart instances
let satisfactionChart;
let serviceChart;

// Calculate NPS score
function calculateNPS(responses) {
    const promoters = responses.filter(r => r.nps >= 9).length;
    const detractors = responses.filter(r => r.nps <= 6).length;
    const total = responses.length;
    return Math.round(((promoters - detractors) / total) * 100);
}

// Calculate average
function calculateAverage(array) {
    return array.reduce((a, b) => a + b, 0) / array.length || 0;
}

// Update statistics
function updateStats(responses) {
    // Calculate averages
    const avgSatisfaction = calculateAverage(responses.map(r => r.overallExperience));
    const avgFoodQuality = calculateAverage(responses.map(r => r.foodQuality));
    const avgService = calculateAverage(responses.map(r => r.staffFriendliness));
    const npsScore = calculateNPS(responses);

    // Update DOM
    document.getElementById('avgSatisfaction').textContent = avgSatisfaction.toFixed(1);
    document.getElementById('avgFoodQuality').textContent = avgFoodQuality.toFixed(1);
    document.getElementById('avgService').textContent = avgService.toFixed(1);
    document.getElementById('npsScore').textContent = npsScore;
}

// Create satisfaction chart
function createSatisfactionChart(responses) {
    const ctx = document.getElementById('satisfactionChart').getContext('2d');
    
    // Prepare data
    const ratings = Array(10).fill(0);
    responses.forEach(r => ratings[r.overallExperience - 1]++);

    if (satisfactionChart) {
        satisfactionChart.destroy();
    }

    satisfactionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({length: 10}, (_, i) => i + 1),
            datasets: [{
                label: 'Calificación General',
                data: ratings,
                backgroundColor: 'rgba(72, 187, 120, 0.5)',
                borderColor: 'rgba(72, 187, 120, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución de Calificaciones Generales'
                }
            }
        }
    });
}

// Create service chart
function createServiceChart(responses) {
    const ctx = document.getElementById('serviceChart').getContext('2d');
    
    // Prepare data
    const waitTimes = {
        'menos-5': 0,
        '5-10': 0,
        'mas-10': 0
    };
    
    responses.forEach(r => waitTimes[r.waitTimeSeat]++);

    if (serviceChart) {
        serviceChart.destroy();
    }

    serviceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Menos de 5 min', '5-10 min', 'Más de 10 min'],
            datasets: [{
                data: Object.values(waitTimes),
                backgroundColor: [
                    'rgba(72, 187, 120, 0.5)',
                    'rgba(246, 173, 85, 0.5)',
                    'rgba(252, 129, 129, 0.5)'
                ],
                borderColor: [
                    'rgba(72, 187, 120, 1)',
                    'rgba(246, 173, 85, 1)',
                    'rgba(252, 129, 129, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Tiempo de Espera para ser Atendido'
                }
            }
        }
    });
}

// Create response item HTML
function createResponseItem(response) {
    const date = response.timestamp?.toDate() || new Date();
    const formattedDate = date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
        <div class="response-item">
            <p><strong>Fecha:</strong> ${formattedDate}</p>
            <p><strong>Calificación General:</strong> ${response.overallExperience}/10</p>
            <p><strong>NPS:</strong> ${response.nps}/10</p>
            <p><strong>Calidad de la Comida:</strong> ${response.foodQuality}/5</p>
            <p><strong>Servicio:</strong> ${response.staffFriendliness}/5</p>
            ${response.improvement ? `<p><strong>Sugerencia de Mejora:</strong> ${response.improvement}</p>` : ''}
        </div>
    `;
}

// Update responses list
function updateResponsesList(responses) {
    const responsesList = document.getElementById('responsesList');
    responsesList.innerHTML = responses.map(createResponseItem).join('');
}

// Filter responses by date
function filterResponses(responses, filter) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
        case 'today':
            return responses.filter(r => r.timestamp?.toDate() >= today);
        case 'week':
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return responses.filter(r => r.timestamp?.toDate() >= weekAgo);
        case 'month':
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return responses.filter(r => r.timestamp?.toDate() >= monthAgo);
        default:
            return responses;
    }
}

// Initialize date filter
function setupDateFilter() {
    const dateFilter = document.getElementById('dateFilter');
    dateFilter.addEventListener('change', () => {
        loadResponses(dateFilter.value);
    });
}

// Load responses from Firebase
async function loadResponses(dateFilter = 'all') {
    try {
        const snapshot = await db.collection('surveys')
            .orderBy('timestamp', 'desc')
            .get();

        let responses = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Apply date filter
        responses = filterResponses(responses, dateFilter);

        // Update UI
        updateStats(responses);
        createSatisfactionChart(responses);
        createServiceChart(responses);
        updateResponsesList(responses);
    } catch (error) {
        console.error('Error al cargar las respuestas:', error);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupDateFilter();
    loadResponses();
});