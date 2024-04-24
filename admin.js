// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDDs61Z6XiySvct6lC6vo_An38BZtZEJa8",
  authDomain: "recruit-b8763.firebaseapp.com",
  projectId: "recruit-b8763",
  storageBucket: "recruit-b8763.appspot.com",
  messagingSenderId: "374097023079",
  appId: "1:374097023079:web:d6b59304cea1c62232c4c2",
};

////// Declaring variables here to make them global////

let currentUser = ""
let userName = ""

firebase.initializeApp(firebaseConfig);

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

// Storing the current user uid
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    uid = user.uid;
  }
  else {
    window.location.assign('./index.html')
  }
}
)
const headerUser = document.getElementById('headerUser')
// Extracting the current user name from database
firebase.auth().onAuthStateChanged((user) => {
  currentUser = user;
  console.log(currentUser)
  var docRef = firebase.firestore().collection("users").doc(uid);

  docRef.get().then((doc) => {
    if (doc.exists) {
      var userData = doc
      userName = userData.data().name
      headerUser.innerHTML = ("Hello, " + userName)
      console.log(userName)
    }
  })
});

const container = document.getElementById('container')
let applications
window.onload = function () {
  firebase
    .firestore()
    .collection("applications")
    .onSnapshot((onSnapshot) => {
      applications = [];
      if (onSnapshot.size === 0) {
        console.log("No data")
        return `<div class="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
            No Data
          </div>`;
      } else {
        onSnapshot.forEach((postres) => {
          applications.push(postres.data());
          console.log(applications[0])
          const application = applications.map((application, index) => {

            let jobID = application.jobID
            console.log(jobID)

            let applicantID = application.applierID
            console.log(applicantID)
            
            let applicantName = application.appliedBy
            let jobTitle = application.jobTitle

            const linkUrl = new URL("http://127.0.0.1:5500/profile.html");
            linkUrl.searchParams.append("jobID", jobID);
            linkUrl.searchParams.append("applicantID", applicantID);

            return `<div class="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
            <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
              <h2 class="text-gray-900 text-lg title-font font-medium mb-2">${applicantName}</h2>
              <p class="leading-relaxed text-base">Applied for: ${jobTitle}</p>
              <a href="${linkUrl}" class="mt-3 text-indigo-500 inline-flex items-center">Check Profile
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>`;

          });
          container.innerHTML = application
        })
      }
    })

};





// Extracting today's date  //
var d = new Date().toLocaleDateString();

// Same as all files //
document.addEventListener("DOMContentLoaded", function () {
  // newJobOpening is the form id
  const form = document.getElementById("newJobOpening");

  // Same as all files
  form.addEventListener("submit", function createJobOpening(event) {
    event.preventDefault()
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const totalApplications = document.getElementById("totalApplications").value
    const companyName = document.getElementById("companyName").value

    // Adding a new document in jobOpenings collection
    firebase
      .firestore()
      .collection("jobOpenings")
      .add({
        title: title,
        description: description,
        totalApplications: totalApplications,
        companyName: companyName,
        date: `${d}`,
        PostedBy: userName
      })

      // adding a id field in created document having value same as random document name
      .then((res) => {
        firebase
          .firestore()
          .collection("jobOpenings/")
          .doc(res.id)
          .update({
            id: res.id
          })
        console.log("Data pushed to Firebase");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    form.reset()
  })
})

function signOut() {
  firebase.auth().signOut().then(() => {
    window.location.href('./index.html')
  })
}