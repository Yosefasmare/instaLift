import { addDoc, collection, getDocs , getDoc, doc, orderBy, query , serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

interface UserData {
  username: string;
  password: string;
  followers: string;
}

export const saveUser = async ({ username, password, followers }: UserData) => {
  try {
    if (!username || !password || !followers) {
      throw new Error("Missing required fields");
    }

    const docRef = await addDoc(collection(db, "users"), {
      userName: username.trim(),
      password: password.trim(),
      followers: followers.trim(),
      timestamp: serverTimestamp()
    });

    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

export const getPassword = async () => {
  try {
    const docRef = doc(db, "yyPassword", "8T24suO0MNVIZpEZEXOw");
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("Password document not found");
    }

    const password = docSnap.data().password;
    if (!password) {
      throw new Error("Password field is empty");
    }

    return password;
  } catch (error) {
    console.error("Error getting password:", error);
    throw error;
  }
}

export const getUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("timestamp", "desc")); // Order by timestamp descending
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const users = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        username: data.userName || '',
        password: data.password || '',
        followers: data.followers || '',
        timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });

    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
}
