import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtener referencia a Firestore
const db = getFirestore(app);

// Obtener el formulario y agregar un evento de envío
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('vacationForm');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Evitar que la página se recargue

    // Validar que todos los campos estén llenos
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error'); // Agregar clase de error
      } else {
        input.classList.remove('error'); // Remover clase de error
      }
    });

    if (!isValid) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Deshabilitar el botón de enviar
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    // Obtener los valores del formulario
    const nombreEmpleado = document.getElementById('name').value;
    const numeroEmpleado = document.getElementById('employeeNumber').value;
    const departamento = document.getElementById('department').value;
    const razon = document.getElementById('company').value;
    const emailSolicitante = document.getElementById('email').value;
    const fechaInicio = document.getElementById('vacationStartDate').value;
    const fechaFin = document.getElementById('vacationEndDate').value;
    const diasSolicitados = document.getElementById('daysRequested').value;
    const nombreSupervisor = document.getElementById('supervisorName').value;
    const supervisorEmail = document.getElementById('supervisorEmail').value;
    const comentarios = document.getElementById('comments').value;

    // Determinar el responsable de nóminas
    let responsableNominas = '';
    let emailNominas = '';
    if (razon === "LEMMA") {
      responsableNominas = 'Arturo Garcia Zamora';
      emailNominas = import.meta.env.VITE_EMAIL_NOMINAS_ARTURO;
    } else if (["IMPERQUIMIA", "GRAVIQ"].includes(razon)) {
      responsableNominas = 'Rosa Isela Zuares';
      emailNominas = import.meta.env.VITE_EMAIL_NOMINAS_ROSA_ISELA;
    }

    try {
      // Guardar los datos en Firestore
      const docRef = await addDoc(collection(db, 'vacationRequests'), {
        timestamp: serverTimestamp(),
        nombreEmpleado: nombreEmpleado,
        numeroEmpleado: numeroEmpleado,
        departamento: departamento,
        razon: razon,
        emailSolicitante: emailSolicitante,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        diasSolicitados: diasSolicitados,
        nombreSupervisor: nombreSupervisor,
        supervisorEmail: supervisorEmail,
        comentarios: comentarios,
        aprobado: '',
        responsableNominas: responsableNominas,
        emailNominas: emailNominas
      });

      // Enviar correo electrónico al supervisor
      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supervisorEmail,
          nombreEmpleado,
          numeroEmpleado,
          departamento,
          fechaInicio,
          fechaFin,
          diasSolicitados,
          comentarios,
          nombreSupervisor,
          emailSolicitante,
          requestId: docRef.id,
          responsableNominas,
          emailNominas
        }),
      });

      if (response.ok) {
        alert('¡Datos enviados con éxito y correo enviado al supervisor!');
      } else {
        alert('¡Datos enviados con éxito, pero hubo un error al enviar el correo!');
      }

      form.reset(); // Limpiar el formulario
    } catch (error) {
      console.error('Error al guardar los datos: ', error);
      alert('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      // Habilitar el botón de enviar nuevamente
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar Solicitud';
    }
  });
});