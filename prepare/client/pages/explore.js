import { Box, Flex, Input, InputGroup } from "@chakra-ui/react";
import Head from "next/head";
import Layout from "../components/Layout";
import IconButtons from "../components/IconButtons";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
} from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import Router from "next/router";
import SignIn from "../components/Signin";
import OtherPost from "../components/OtherPost";

export default function Explore() {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const { me } = useSelector((state) => state.user);

  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );

  const handleSearch = () => {
    Router.push(`/hashtag/${input}`);
  };

  const ohtersPost = mainPosts.filter((item) => item.UsesId !== me.id);

  useEffect(() => {
    if (!me?.id) {
      Router.push("/");
    }
  }, [me, me?.id]);

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 500
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <div>
      <Head>
        <title>Dot Your Day | Explore</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 테스트 장소 */}
      <Layout>
        {me ? (
          <>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                position: "fixed",
                top: "70px",
                zIndex: "1",
                backgroundColor: "white", //#53BBF0
              }}
            >
              <InputGroup
                margin="10px 0"
                border="2px solid #1C73E1"
                padding="4px 10px"
                width="100%"
                maxWidth="350px"
                borderRadius="12px"
                backgroundColor="white"
              >
                <Input
                  placeholder="해시태그 검색"
                  border="none"
                  padding="8px"
                  variant="unstyled"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <IconButtons
                  onClick={handleSearch} //값 제출.
                  size={"24px"}
                  icon={<FiSearch color="#1C73E1" />}
                />
              </InputGroup>
            </div>
            <Box marginTop="140px">
              {ohtersPost.map((post, index) => (
                <OtherPost key={index} post={post} />
              ))}
            </Box>
          </>
        ) : (
          <SignIn />
        )}
      </Layout>
      <footer></footer>
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);
