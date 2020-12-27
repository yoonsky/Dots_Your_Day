import Head from "next/head";
import Layout from "../components/Layout";
import SignUp from "../components/Signup";

import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import Router from "next/router";

import axios from "axios";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { END } from "redux-saga";
import wrapper from "../store/configureStore";
import { useToast } from "@chakra-ui/react";

export default function Home() {
  const { signupDone, signupError } = useSelector((state) => state.user);

  const toast = useToast();

  useEffect(() => {
    if (signupDone) {
      Router.replace("/");
    }
  }, [signupDone]);

  useEffect(() => {
    if (signupError) {
      toast({
        title: "SignUp Error",
        description: `${signupError}`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [signupError]);

  return (
    <div>
      <Head>
        <title>Dot Your Day | Sign Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 테스트 장소 */}
      <Layout>
        <SignUp />
      </Layout>

      <footer></footer>
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log("getServerSideProps start!");
    console.log(context.req.headers);

    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END);
    console.log("getServerSideProps end!!");
    await context.store.sagaTask.toPromise();
  }
);
