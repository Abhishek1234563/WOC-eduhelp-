import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
const firebaseConfig= {
    apiKey: "AIzaSyAR4yovLewStBOsQgp4MTBOr_Erhp6TbeI",
  authDomain: "sign-ip-5d29a.firebaseapp.com",
  projectId: "sign-ip-5d29a",
  storageBucket: "sign-ip-5d29a.appspot.com",
  messagingSenderId: "997289414831",
  appId: "1:997289414831:web:4ca3e6fca101749cdb845a",
  measurementId: "G-KDV3SDCDLN"
   
}
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// document.getElementById('button-container').addEventListener('click', login, false);

const loginForm = document.querySelector('.log');
loginForm.addEventListener('submit',(Event)=>{
    Event.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    signInWithEmailAndPassword(auth,email,password)
    .then((cred)=>{
        console.log('The user logged in:', cred.user)
        window.location.assign("home_page1.html");
    })
    .catch((err)=>{
        alert("Wrong Credential")
        console.log(err.message)
})
})

// function login() {
//     alert("working");
//     const email=document.getElementById('email').value;
//     const password=document.getElementById('password').value;

//    signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential)=>{
//        console.log('the user has signed in:',userCredential.user)
//         window.location.href="home_page1.html"
//     })

//     .catch((error)=>{
//         const errorCode=error.code;
//         const errorMessage=error.message;
//         alert('Error');
//     });
// }