import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";



export const saveUser = async ({username , password , followers} : {username: string, password: string, followers:string}) => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
          userName: username,
          password: password,
          followers: followers
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      



}