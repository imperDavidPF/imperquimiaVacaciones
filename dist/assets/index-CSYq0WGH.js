import{initializeApp as I}from"https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";import{getFirestore as b,addDoc as h,collection as B,serverTimestamp as S}from"https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}})();const L={apiKey:"AIzaSyDlHYozWrYCxdYXgyOvk_fPrkuISGyrw-M",authDomain:"vacacionesimperquimia.firebaseapp.com",projectId:"vacacionesimperquimia",storageBucket:"vacacionesimperquimia.appspot.com",messagingSenderId:"850305630573",appId:"1:850305630573:web:2b69bd3781f309e6f25a64",measurementId:"G-4MM5CMLZT0"},M=I(L),O=b(M);document.addEventListener("DOMContentLoaded",function(){const n=document.getElementById("vacationForm"),o=n.querySelector('button[type="submit"]');n.addEventListener("submit",async function(l){l.preventDefault();const s=n.querySelectorAll("input, select, textarea");let e=!0;if(s.forEach(r=>{r.value.trim()?r.classList.remove("error"):(e=!1,r.classList.add("error"))}),!e){alert("Por favor, completa todos los campos obligatorios.");return}o.disabled=!0,o.textContent="Enviando...";const t=document.getElementById("name").value,a=document.getElementById("employeeNumber").value,m=document.getElementById("department").value,d=document.getElementById("company").value,u=document.getElementById("email").value,p=document.getElementById("vacationStartDate").value,f=document.getElementById("vacationEndDate").value,v=document.getElementById("daysRequested").value,y=document.getElementById("supervisorName").value,g=document.getElementById("supervisorEmail").value,E=document.getElementById("comments").value;let i="",c="";d==="LEMMA"?(i="Arturo Garcia Zamora",c="davidgaston2341@gmail.com"):["IMPERQUIMIA","GRAVIQ"].includes(d)&&(i="Rosa Isela Zuares",c="davidgaston2341@gmail.com");try{const r=await h(B(O,"vacationRequests"),{timestamp:S(),nombreEmpleado:t,numeroEmpleado:a,departamento:m,razon:d,emailSolicitante:u,fechaInicio:p,fechaFin:f,diasSolicitados:v,nombreSupervisor:y,supervisorEmail:g,comentarios:E,aprobado:"",responsableNominas:i,emailNominas:c});(await fetch("http://localhost:3000/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({supervisorEmail:g,nombreEmpleado:t,numeroEmpleado:a,departamento:m,fechaInicio:p,fechaFin:f,diasSolicitados:v,comentarios:E,nombreSupervisor:y,emailSolicitante:u,requestId:r.id,responsableNominas:i,emailNominas:c})})).ok?alert("¡Datos enviados con éxito y correo enviado al supervisor!"):alert("¡Datos enviados con éxito, pero hubo un error al enviar el correo!"),n.reset()}catch(r){console.error("Error al guardar los datos: ",r),alert("Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.")}finally{o.disabled=!1,o.textContent="Enviar Solicitud"}})});
