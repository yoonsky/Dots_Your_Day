import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/Home.module.css";

import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
} from "../reducers/user";
import { END } from "redux-saga";
import wrapper from "../store/configureStore";
import axios from "axios";
import { useEffect } from "react";
import { LOAD_POSTS_REQUEST, LOAD_USER_POSTS_REQUEST } from "../reducers/post";
import Main from "../components/Main";
import Router from "next/router";
import Write from "../components/Write";
import ProfileBox from "../components/ProfileBox";
import styled from "styled-components";

export default function Profile() {
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );

  const myPosts = mainPosts.filter((item) => item.UserId === me.id);

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 500
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId,
            data: me.id,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length, hasMorePosts, loadPostsLoading]);

  useEffect(() => {
    if (!me?.id) {
      Router.push("/");
    }
  }, [me?.id]);

  if (!me) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>Dot Your Day | {me?.nickname}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {me ? (
          <>
            <Tabs variant="unstyled" width="100%" position="relative">
              <TabList
                width="100%"
                top="70px"
                padding="30px"
                zIndex="1"
                background="white"
                margin="auto"
                justifyContent="space-around"
                position="fixed"
                // top="0"
              >
                <Flex width="400px" justifyContent="space-around">
                  <Tab p="14px" fontWeight="bold">
                    내 정보
                  </Tab>
                  <Tab p="16px" fontWeight="bold">
                    내 게시글
                  </Tab>
                  <Tab p="16px" fontWeight="bold">
                    글 작성
                  </Tab>
                </Flex>
              </TabList>
              <TabPanels display="flex" justifyContent="center">
                <TabPanel background="white">
                  <Flex flexDirection="column">
                    <Box position="relative">
                      <ProfileBox me={me} />
                    </Box>
                  </Flex>
                </TabPanel>

                <TabPanel background="white" maxHeight="600px">
                  {me.Posts.length < 1 ? (
                    <Box>
                      <img
                        position="absolute"
                        style={{ width: "500px", border: "2px solid #e7e7e7" }}
                        src="https://i.ibb.co/nQSJq7C/nofd.jpg"
                      />
                    </Box>
                  ) : (
                    <Box position="relative">
                      <div
                        style={{
                          width: "400px",
                          position: "absolute",
                          top: "120px",
                          right: "-208px",
                        }}
                      >
                        {myPosts.map((post) => (
                          <Main key={post.id} post={post} />
                        ))}
                      </div>
                    </Box>
                  )}
                  {/* </Box> */}
                </TabPanel>

                <TabPanel background="white" maxHeight="600px">
                  <Flex>
                    <Box position="relative">
                      <Write me={me} />
                    </Box>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        ) : (
          <Box marginTop="40px" position="relative">
            <img
              position="absolute"
              style={{ width: "500px" }}
              src="https://i.ibb.co/LtTRsLH/ogosd.jpg"
            />
          </Box>
        )}
      </Layout>
      {/* 익스플로어 페이지는 모든 사람들의 게시물을 볼 수 있고 해시태그 검색이 가능 */}

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

    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END);
    console.log("getServerSideProps end!!");
    await context.store.sagaTask.toPromise();
  }
);
