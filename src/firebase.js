import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/database'

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCi_Ckgpk5DuHraGJFb9yEBu32F5Ar7M_g",
  authDomain: "m-city-99cc3.firebaseapp.com",
  databaseURL: "https://m-city-99cc3.firebaseio.com",
  projectId: "m-city-99cc3",
  storageBucket: "m-city-99cc3.appspot.com",
  messagingSenderId: "743845304185"
};

firebase.initializeApp(config);

const firebaseDB = firebase.database();
const firebaseMatches = firebaseDB.ref('matches');
const firebasePromotions = firebaseDB.ref('promotions');

export {
    firebase,
    firebaseMatches,
    firebasePromotions
}