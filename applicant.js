// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDDs61Z6XiySvct6lC6vo_An38BZtZEJa8",
  authDomain: "recruit-b8763.firebaseapp.com",
  projectId: "recruit-b8763",
  storageBucket: "recruit-b8763.appspot.com",
  messagingSenderId: "374097023079",
  appId: "1:374097023079:web:d6b59304cea1c62232c4c2",
};

firebase.initializeApp(firebaseConfig);


let uid;

const helloUser = document.getElementById("helloUser")

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });


  let currentUser = ""
  let userName = ""
  let userData = ""

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      uid = user.uid; }
    else{
      window.location.assign('./index.html')
    }}
      )


      const headerUser = document.getElementById('headerUser')
      firebase.auth().onAuthStateChanged((user) => {
        currentUser = user;
        console.log(currentUser)
        var docRef = firebase.firestore().collection("users").doc(uid);
  
          docRef.get().then((doc) => {
              if (doc.exists) {
                  userData = doc
                  userName = userData.data().name
                  headerUser.innerHTML = ("Hello, "+userName) 
                  console.log(userName)
  }})});
//job openings show
const title = document.getElementById('title');
const description = document.getElementById('description');
const container = document.getElementById('container')
let jobOpenings;



window.onload = function () {
  firebase
    .firestore()
    .collection("jobOpenings")
    .onSnapshot((onSnapshot) => {
      jobOpenings = [];
      if (onSnapshot.size === 0) {
        console.log("No data")
      } else {
        onSnapshot.forEach((postres) => {
          jobOpenings.push(postres.data());
          console.log(jobOpenings[0])
          const jobOpening = jobOpenings.map((job, index) => {

            return `<div class="py-8 flex flex-wrap md:flex-nowrap">
                    <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                      <span class="font-semibold title-font text-gray-700" id="company">${job.companyName}</span>
                      <span class="mt-1 text-gray-500 text-sm" id="postedOn">${job.date}</span>
                    </div>
                    <div class="md:flex-grow">
                      <h2 class="text-2xl font-medium text-gray-900 title-font mb-2" id="title">${job.title}</h2>
                      <p class="leading-relaxed" id="description">${job.description}</p>
                      <a class="text-indigo-500 inline-flex items-center mt-4" id="totalApplications">${job.totalApplications} Openings
                      </a>
                    </div>
                    <button onclick="applyNow('${job.id}','${job.title}')" class="flex mx-auto mt-20 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Apply Now</button>
                  </div>`;
          }).join("")
          container.innerHTML = jobOpening
        })
      }
    })

  };

var resumeData = ""

// Same as all files //
document.addEventListener("DOMContentLoaded", function () {
  // newJobOpening is the form id
  const form = document.getElementById("resumeForm");

  // Same as all files
  form.addEventListener("submit", function uploadResume(event) {
    event.preventDefault()
    const input = document.getElementById('fileInput');
    const upload = (file) => {
      fetch('https://api.apilayer.com/resume_parser/upload', { // Your POST endpoint
        method: 'POST',
        headers: {
          "Content-Type": "application/octet-stream",
          "apikey": "gTxETeCSKG8B06UrjpZqRjkag2Ciy112"

        },
        body: file // This is your file object
      }).then(function (response) { return response.json() })
        .then(
          function (data) {
            firebase
              .firestore()
            .collection("users").doc(uid).update({
              skills: data.skills,
              education: data.education,
              experience: data.experience,
              phone: data.phone
            })
            console.log(data)
            resumeData = data
          } // if the response is a JSON object
        ).then(
          success => console.log(success) // Handle the success response object
        ).catch(
          error => console.log(error) // Handle the error response object
        );
    }
    console.log("Uploading")
    const uploadedResumeScreen = document.getElementById("uploadedResumeScreen");
          uploadedResumeScreen.innerHTML = ("Resume Uploaded!!");
          setTimeout(() => {
            uploadedResumeScreen.style.display = 'none';
          }, 5000)
    upload(input.files[0])
  })
})

function signOut(){
  firebase.auth().signOut().then(() => {
    window.location.href('./index.html')
  })
}

function applyNow(jobID,jobTitle){
console.log("working")


  firebase
          .firestore()
          .collection("applications")
          .add({
            jobID:jobID,
            appliedBy: userName,
            jobTitle: jobTitle,
applierID: currentUser.uid
          })
          .then(() => {
            console.log("Data pushed to Firebase");
          })
          .catch((error) => {
            console.error("Error pushing data:", error);
          });
}


