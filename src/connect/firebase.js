import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  update,
  remove,
  query,
  startAt,
  endAt,
} from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  databaseURL: process.env.VUE_APP_DATABASEURL,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPID,
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
export const firebase = {
  database,
  firbaseRef: ref,
  set,
  get,
  child,
  push,
  update,
  remove,
  query,
  startAt,
  endAt,
};
