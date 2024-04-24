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

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit',function Login(event) {
  event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    console.log("Email:", email)
    console.log("Password:", password)
  
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        form.reset()
        const user = userCredential.user.uid;
        console.log("User Login:", user);

//////////////////////  Accessing Database  //////////////////////////////
        var docRef = firebase.firestore().collection("users").doc(user);

        docRef.get().then((doc) => {
            if (doc.exists) {
                var userData = doc
                // Printing User Data //
                console.log(userData.data())
                // Checking if the user is admin or applicant and redirecting accordingly
                setTimeout(()=>{
                  if(userData.data().userType === "Admin"){
                    window.location.assign("./admin.html")
                  }
                  else{
                    window.location.assign("./applicant.html")
                  }
                },1000)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            //////////////////////////////////////////////
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
        alert(errorMessage)
          // Handling account-exists-with-different-credential
          if (errorCode == 'auth/account-exists-with-different-credential') {
            alert(errorMessage)
            return false;
          }else if(errorCode == "auth/internal-error"){
            alert(errorMessage)
          }
        });
      })
      .catch((error) => {
        form.reset()
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Login error:", errorCode, errorMessage);
        const errorMessageScreen = document.getElementById("errorMessageScreen");
        errorMessageScreen.innerHTML = ("Invalid Login Credentials!!");
        setTimeout(() => {
          errorMessageScreen.style.display = 'none';
        }, 5000);
      });
      console.log(firebase.auth().currentUser)
  })


})