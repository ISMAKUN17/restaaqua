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
let db;
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('Firebase initialized successfully');
    }
} catch (error) {
    console.error('Error initializing Firebase:', error);
    alert('Error connecting to the database. Please try again later.');
}

// Handle range input value display
function setupRangeInputs() {
    document.querySelectorAll('input[type="range"]').forEach(range => {
        const valueDisplay = range.nextElementSibling;
        range.addEventListener('input', () => {
            valueDisplay.textContent = range.value;
        });
    });
}

// Handle conditional questions
function setupConditionalQuestions() {
    // Overall experience rating
    const overallExperience = document.getElementById('overall-experience');
    const improvementGroup = document.getElementById('improvement-group');
    
    overallExperience.addEventListener('input', () => {
        improvementGroup.style.display = parseInt(overallExperience.value) <= 6 ? 'block' : 'none';
    });

    // Dish issues
    const dishIssuesInputs = document.querySelectorAll('input[name="dish-issues"]');
    const dishDetailsGroup = document.getElementById('dish-details-group');

    dishIssuesInputs.forEach(input => {
        input.addEventListener('change', () => {
            dishDetailsGroup.style.display = input.value === 'si' ? 'block' : 'none';
        });
    });

    // Menu variety
    const menuVarietyInputs = document.querySelectorAll('input[name="menu-variety"]');
    const menuSuggestionsGroup = document.getElementById('menu-suggestions-group');

    menuVarietyInputs.forEach(input => {
        input.addEventListener('change', () => {
            menuSuggestionsGroup.style.display = input.value === 'no' ? 'block' : 'none';
        });
    });

    // Service issues
    const serviceIssuesInputs = document.querySelectorAll('input[name="service-issues"]');
    const serviceDetailsGroup = document.getElementById('service-details-group');

    serviceIssuesInputs.forEach(input => {
        input.addEventListener('change', () => {
            serviceDetailsGroup.style.display = input.value === 'si' ? 'block' : 'none';
        });
    });

    // Ambience
    const ambienceInputs = document.querySelectorAll('input[name="ambience"]');
    const ambienceImprovementGroup = document.getElementById('ambience-improvement-group');

    ambienceInputs.forEach(input => {
        input.addEventListener('change', () => {
            ambienceImprovementGroup.style.display = input.value === 'no' ? 'block' : 'none';
        });
    });

    // Previous issues
    const previousIssuesInputs = document.querySelectorAll('input[name="previous-issues"]');
    const previousIssuesDetailsGroup = document.getElementById('previous-issues-details-group');

    previousIssuesInputs.forEach(input => {
        input.addEventListener('change', () => {
            previousIssuesDetailsGroup.style.display = input.value === 'si' ? 'block' : 'none';
        });
    });
}

// Form submission handler
function setupFormSubmission() {
    const surveyForm = document.getElementById('surveyForm');
    const modal = document.getElementById('guestInfoModal');
    const guestInfoForm = document.getElementById('guestInfoForm');
    let surveyData = null;

    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate survey form
        if (!surveyForm.checkValidity()) {
            surveyForm.reportValidity();
            return;
        }
        
        // Collect form data
        const formData = new FormData(surveyForm);
        surveyData = {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            overallExperience: parseInt(formData.get('overall-experience')),
            improvement: formData.get('improvement') || null,
            nps: parseInt(formData.get('nps')),
            npsReason: formData.get('nps-reason'),
            foodTemperature: formData.get('food-temperature'),
            foodQuality: parseInt(formData.get('food-quality')),
            dishIssues: formData.get('dish-issues'),
            dishDetails: formData.get('dish-details') || null,
            menuVariety: formData.get('menu-variety'),
            menuSuggestions: formData.get('menu-suggestions') || null,
            waitTimeSeat: formData.get('wait-time-seat'),
            waitTimeFood: formData.get('wait-time-food'),
            staffFriendliness: parseInt(formData.get('staff-friendliness')),
            serviceIssues: formData.get('service-issues'),
            serviceDetails: formData.get('service-details') || null,
            cleanlinessRating: formData.get('cleanliness-rating'),
            ambience: formData.get('ambience'),
            ambienceImprovement: formData.get('ambience-improvement') || null,
            singleImprovement: formData.get('single-improvement'),
            previousIssues: formData.get('previous-issues'),
            previousIssuesDetails: formData.get('previous-issues-details') || null
        };

        // Show the modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    });

    guestInfoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate guest info form
        if (!guestInfoForm.checkValidity()) {
            guestInfoForm.reportValidity();
            return;
        }

        if (!surveyData) {
            console.error('No survey data available');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger';
            errorMessage.textContent = 'Error: No se encontraron datos de la encuesta. Por favor, intente nuevamente.';
            modal.querySelector('.modal-body').prepend(errorMessage);
            setTimeout(() => errorMessage.remove(), 3000);
            return;
        }

        const submitButton = e.target.querySelector('button[type="submit"]');
        const cancelButton = modal.querySelector('button[data-bs-dismiss="modal"]');
        submitButton.disabled = true;
        cancelButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            const guestFormData = new FormData(guestInfoForm);
            const completeData = {
                ...surveyData,
                restaurant: guestFormData.get('restaurant-select'),
                roomNumber: parseInt(guestFormData.get('room-number')),
                guestName: guestFormData.get('guest-name')
            };

            // Save to Firebase with retry mechanism
            let retries = 3;
            while (retries > 0) {
                try {
                    await db.collection('surveys').add(completeData);
                    break;
                } catch (error) {
                    retries--;
                    if (retries === 0) throw error;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.textContent = '¡Gracias por completar la encuesta!';
            modal.querySelector('.modal-body').prepend(successMessage);
            
            // Reset forms after a short delay
            setTimeout(() => {
                // Reset forms
                surveyForm.reset();
                guestInfoForm.reset();
                
                // Reset conditional groups
                document.querySelectorAll('.conditional-group').forEach(group => {
                    group.style.display = 'none';
                });
                
                // Reset range input displays
                document.querySelectorAll('.rating-value').forEach(display => {
                    display.textContent = '5';
                });

                // Hide modal
                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();
                surveyData = null;

                // Remove success message
                successMessage.remove();
            }, 2000);

        } catch (error) {
            console.error('Error al guardar la encuesta:', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger';
            errorMessage.textContent = 'Hubo un error al enviar la encuesta. Por favor, intente nuevamente.';
            modal.querySelector('.modal-body').prepend(errorMessage);
            setTimeout(() => errorMessage.remove(), 3000);
        } finally {
            submitButton.disabled = false;
            cancelButton.disabled = false;
            submitButton.textContent = 'Confirmar';
        }
    });

    // Handle modal close
    modal.addEventListener('hidden.bs.modal', () => {
        surveyData = null;
        // Reset guest info form
        guestInfoForm.reset();
        // Remove any existing alerts
        modal.querySelectorAll('.alert').forEach(alert => alert.remove());
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupRangeInputs();
    setupConditionalQuestions();
    setupFormSubmission();
});