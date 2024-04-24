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

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", function signUp(event) {
    event.preventDefault()
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const address = document.getElementById("address").value;
    const profileHeadline = document.getElementById("profileHeadline").value;
    const userType = document.getElementById("userType").value;

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

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User created successfully, do something (e.g., redirect)
        form.reset()
        console.log("User created:", userCredential.user);

        firebase
          .firestore()
          .collection("users")
          .doc(userCredential.user.uid)
          .set({
            name: name,
            email: email,
            address: address,
            profileHeadline: profileHeadline,
            userType: userType,
          })
          .then(() => {
            const user = firebase.auth().currentUser;
            console.log("Data pushed to Firebase");
          })
          .catch((error) => {
            console.error("Error pushing data:", error);
          });


          setTimeout(()=>{
            if(userType === "Admin"){
              window.location.assign("./admin.html")
            }
            else{
              window.location.assign("./applicant.html")
            }
          },1000)
      })
      .catch((error) => {
        // Handle errors
        form.reset()
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Signup error:", errorCode, errorMessage);
      }); // Add a new document with a generated ID
  });
});
