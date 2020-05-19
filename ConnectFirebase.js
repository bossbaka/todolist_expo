import firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAh90ahoDRVi5U7kK51O8hQ_OXw3zKjyuk",
  authDomain: "todolist-expo.firebaseapp.com",
  databaseURL: "https://todolist-expo.firebaseio.com",
  projectId: "todolist-expo",
  storageBucket: "todolist-expo.appspot.com",
  messagingSenderId: "242240125042",
  appId: "1:242240125042:web:e60c1ca4467a06d45deaeb",
};

class ConnectFirebase {
  constructor(callback) {
    this.init(callback);
  }
  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        callback(null, user);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            callback(error);
          });
      }
    });
  }

  getLists(callback) {
    let ref = this.ref.orderBy("name");

    this.unsubscribe = ref.onSnapshot((snapshot) => {
      lists = [];
      snapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
      });
      callback(lists);
    });
  }

  addList(list) {
    let ref = this.ref;
    ref.add(list);
  }

  updateList(list) {
    let ref = this.ref;
    ref.doc(list.id).update(list);
  }

  get userId() {
    return firebase.auth().currentUser.uid;
  }

  get ref() {
    return firebase
      .firestore()
      .collection("users")
      .doc(this.userId)
      .collection("lists");
  }

  detach() {
    this.unsubscribe();
  }
}

export default ConnectFirebase;
