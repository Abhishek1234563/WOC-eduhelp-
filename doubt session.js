import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, child, push, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


const firebaseConfig= {
    apiKey: "AIzaSyAR4yovLewStBOsQgp4MTBOr_Erhp6TbeI",
    authDomain: "sign-ip-5d29a.firebaseapp.com",
    projectId: "sign-ip-5d29a",
    storageBucket: "sign-ip-5d29a.appspot.com",
    messagingSenderId: "997289414831",
    appId: "1:997289414831:web:4ca3e6fca101749cdb845a",
    databaseURL: "https://sign-ip-5d29a-default-rtdb.firebaseio.com/",
    measurementId: "G-KDV3SDCDLN"
}


const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);


let shownAns = [];


function askDoubt(uid, username, doubt) {

    // Get a key for a new Post.
    const newDoubtKey = push(child(ref(database), 'doubts')).key;

    // A post entry.
    const doubtData = {
      author: username,
      uid: uid,
      content: doubt,
    };
    
    
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates['/doubts/' + newDoubtKey] = doubtData;
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    
    return update(ref(database), updates);
}

// read
const doubtsRef = ref(database, 'doubts/');
onValue(doubtsRef, (snapshot) => {
    const data = snapshot.val();
    document.getElementById("doubtList").innerHTML = "";
    snapshot.forEach(element => {
        // console.log(element.val());
        document.getElementById("doubtList").innerHTML += "<li id='"+element.key+"'></li>";
        document.getElementById(element.key).innerHTML += "<div class='authorName'>"+element.val().author+":</div>" +
                                                          "<div class='doubtText'>"+element.val().content+"</div>" +
                                                          "<div class='reply-button' id='r"+element.key+"'><button class='reply'>Replies</button></div>";
    });
    reply_check();
    shownAns.forEach(element => {
        document.getElementById(element).children[0].click()
    });
    check_ans_change();
});

function check_ans_change() {
    shownAns.forEach(key => {
        key = key.slice(1);
        onValue(ref(database, 'answers/'+key+'/'), (snapshot) => {
            const data = snapshot.val();
            document.getElementById("lr"+key).innerHTML = '';
            snapshot.forEach(element => {
                document.getElementById("lr"+key).innerHTML += "<li id='"+element.key+"'></li>";
                document.getElementById(element.key).innerHTML += "<div class='ansAuthorName'>"+element.val().author+":</div>" +
                                                                  "<div class='ansText'>"+element.val().content+"</div>";
            });
        });
    });
}

function reply_check() {
    document.querySelectorAll(".reply").forEach(element =>{
        element.addEventListener("click", (Event) => {
            let ansPage = Event.target.parentElement
            const key = ansPage.id
            ansPage.className = "ansPage"
            ansPage.innerHTML = "<ul id='l"+key+"'></ul>" +
                                "<form class='ansForm'><input type='text' class='ansName' name='name' required>" +
                                "<textarea class='answer' name='answer' rows='2' required></textarea>" +
                                "<button type='submit'>Submit Answer</button>" +
                                "</form>" +
                                "<button class='hide-reply'>Hide Replies</button>";
            shownAns.push(key);
            hide_reply_check();
            check_ans_change();
            ans_check();
        });
    });
}
                    
function hide_reply_check() {
    document.querySelectorAll(".hide-reply").forEach(element =>{
        element.addEventListener("click", (Event) => {
            let ansPage = Event.target.parentElement
            const key = ansPage.id
            ansPage.className = "reply-button"
            ansPage.innerHTML = "<button class='reply'>Replies</button>";
            const index = shownAns.indexOf("l"+key);
            shownAns.splice(index, 1);
            reply_check();
        });
    });
}

// update
function writeAnswer(uid, username, key, answer) {
    // A post entry.
    const ansData = {
        author: username,
        uid: uid,
        content: answer
    };
    
    const newAnsKey = push(child(ref(database), 'answers/' + key)).key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates['/answers/' + key + '/' + newAnsKey] = ansData;
    
    return update(ref(database), updates);
}

// askDoubt("anon", "ab", "why");

const doubtForm = document.getElementById("doubtForm");
doubtForm.addEventListener('submit', (Event) => {
    Event.preventDefault();
    const name = doubtForm.name.value;
    const doubt = doubtForm.doubt.value;
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        const uid = user.uid;
        askDoubt(uid, name, doubt);
        // ...
    } else {
        // User is signed out
        window.location.assign("login.html");
    }
    });
});

function ans_check() {
    document.querySelectorAll(".ansForm").forEach(element=>{
        element.addEventListener('submit', (Event) => {
            Event.preventDefault();
            const key = Event.target.parentElement.id.slice(1);
            const name = Event.target['name'].value;
            const answer = Event.target['answer'].value;
            const auth = getAuth(app);
            onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                const uid = user.uid;
                writeAnswer(uid, name, key, answer);
                // ...
            } else {
                // User is signed out
                window.location.assign("login.html");
            }
            });
        });
    });
}
