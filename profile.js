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
// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//         uid = user.uid;
//     }
//     // else {
//     //     window.location.assign('./index.html')
//     // }
// }
// )


let userData
let jobData
const headerUser = document.getElementById('headerUser')
// Extracting the current user name from database
firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
    console.log(currentUser)
    var docRef = firebase.firestore().collection("users").doc(user.uid);

    docRef.get().then((doc) => {
        if (doc.exists) {
            var userData = doc
            userName = userData.data().name
            headerUser.innerHTML = ("Hello, " + userName)
            console.log(userName)
        }
    })
});


// Function to parse URL parameters
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

// Get the value of the 'jobID' parameter from the URL
var jobIDValue = getUrlParameter('jobID');
var applicantIDValue = getUrlParameter('applicantID');

const nameElement = document.getElementById("applicantName");
const skillsContainer = document.getElementById("skillsContainer")
const educationContainer = document.getElementById("educationContainer")
const experienceContainer = document.getElementById("experienceContainer")
const profileHeadline = document.getElementById("profileHeadline")
const email = document.getElementById("email")
const phoneNumber = document.getElementById("phoneNumber")
const address = document.getElementById("address")
const appliedFor = document.getElementById("appliedFor")

window.onload = function () {
    firebase.firestore().collection("users").doc(applicantIDValue).get().then((doc) => {
        if (doc.exists) {
            var applicant = doc.data()
            nameElement.innerHTML = applicant.name;
            profileHeadline.innerHTML = (applicant.profileHeadline? applicant.profileHeadline:"")
            email.innerHTML = (applicant.email? applicant.email:"")
            phoneNumber.innerHTML = (applicant.phoneNumber? applicant.phoneNumber:"")
            address.innerHTML = (applicant.address? applicant.address:"")

            console.log(applicant)

            const skills = applicant.skills.map((skill, index) => {

                return `<div class="flex items-center my-1">

                <div class="ml-2">${skill}</div>
            </div>`;
              }).join("")
              skillsContainer.innerHTML = skills


              const education = applicant.education.map((education, index) => {

                return `<div class="flex flex-col">
                <p class="text-sm font-medium">
                    <span class="text-green-700">${education.name}
                </p>
                </div>
                `;
              }).join("")
              educationContainer.innerHTML = education

const experience = applicant.experience.map((experience, index) => {

                return `<div class="flex flex-col">
                <p class="text-lg font-bold text-gray-700">${experience.organization? experience.organization:""}</p>
                <p class="font-semibold text-sm text-gray-700">${experience.date_start ? experience.date_start:""
                } - ${experience.date_end ? experience.date_end:""}</p>
                <p class="font-semibold text-sm text-gray-700 mt-2">Title - ${experience.title? experience.title:""}</p>
                <p class="font-semibold text-sm text-gray-700 mb-1">${experience.location ? "Location - "+experience.location:""}</p>
            </div>
`;
              }).join("")
              experienceContainer.innerHTML = experience




        }
    })
    firebase.firestore().collection("jobOpenings").doc(jobIDValue).get().then((doc) => {
        if (doc.exists) {
            var jobData = doc.data()
            console.log(jobData)
            appliedFor.innerHTML = (jobData.title? jobData.title:"")
        }
    })

}
