import { all, fork } from "redux-saga/effects";
import axios from "axios";

import postSaga from "./post";
import userSaga from "./user";

axios.defaults.baseURL = "http://54.180.114.14/";
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
