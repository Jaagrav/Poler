import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCPyJRy3Ks29ZTjITEmysq7kgEDnnKDNqY",
    authDomain: "chatroom-5a319.firebaseapp.com",
    databaseURL: "https://chatroom-5a319.firebaseio.com",
    projectId: "chatroom-5a319",
    storageBucket: "chatroom-5a319.appspot.com",
    messagingSenderId: "511570809971",
    appId: "1:511570809971:web:5bff98292a01aeb1b58606",
    measurementId: "G-BB6N09ZN37"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;