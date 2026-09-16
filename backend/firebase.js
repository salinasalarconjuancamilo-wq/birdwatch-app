import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//
const firebaseConfig = {
  apiKey: "AIzaSyDum5ddNOSLYfwSRe7M7j7R_7Q46_ACEno",
  authDomain: "birdwatch-30879.firebaseapp.com",
  projectId: "birdwatch-30879",
  storageBucket: "birdwatch-30879.firebasestorage.app",
  messagingSenderId: "302352933411",
  appId: "1:302352933411:web:6bc2baccd6f1e4e0be4796",
  measurementId: "G-KPQ5T3LCL1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;