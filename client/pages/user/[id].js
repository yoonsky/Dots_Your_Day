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
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import wrapper from "../../store/configureStore";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
  LOAD_USER_REQUEST,
} from "../../reducers/user";
import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";
import Router from "next/router";
import OtherPost from "../../components/OtherPost";
import { useRouter } from "next/router";
import OtherProfile from "../../components/OtherProfile";

export default function User() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );
  const { userInfo, me } = useSelector((state) => state.user);

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId,
            data: id,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length, hasMorePosts, id, loadPostsLoading]);

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
        <title>Dot Your Day | {userInfo?.nickname}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {userInfo?.id ? (
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
                    유저 정보
                  </Tab>
                  <Tab p="16px" fontWeight="bold">
                    유저 게시글
                  </Tab>
                </Flex>
              </TabList>
              <TabPanels display="flex" justifyContent="center">
                <TabPanel background="white">
                  <Flex flexDirection="column">
                    <Box position="relative">
                      <OtherProfile userInfo={userInfo} id={id} />
                    </Box>
                  </Flex>
                </TabPanel>

                <TabPanel background="white" maxHeight="600px">
                  {mainPosts.length < 1 ? (
                    <Box>
                      <img
                        style={{
                          marginTop: "140px",
                          width: "400px",
                          border: "2px solid #e7e7e7",
                        }}
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
                        {mainPosts.map((post) => (
                          <OtherPost key={post.id} post={post} />
                        ))}
                      </div>
                    </Box>
                  )}
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
      type: LOAD_USER_POSTS_REQUEST,
      data: context.params.id,
    });

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_USER_REQUEST,
      data: context.params.id,
    });

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);
