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
import "../../styles/Home.module.css";

import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
  LOAD_USER_REQUEST,
} from "../../reducers/user";
import { END } from "redux-saga";
import wrapper from "../../store/configureStore";
import axios from "axios";
import { useEffect } from "react";
import OtherProfile from "../../components/OtherProfile";
import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";
import { useRouter } from "next/router";
import Main from "../../components/Main";

export default function User() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const { userInfo } = useSelector((state) => state.user);
  const {
    mainPosts,
    hasMorePosts,
    loadPostsLoading,
    // retweetError,
  } = useSelector((state) => state.post);

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
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Dot Your Day | {userInfo.nickname}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 테스트 장소 */}
      <Layout>
        {userInfo?.id ? (
          <>
            <Tabs variant="unstyled" width="100%">
              <TabList
                mb="1em"
                display="flex"
                paddingTop="80px"
                paddingBottom="20px"
                maxWidth="600px"
                width="100%"
                top="70px"
                zIndex="1"
                background="white"
                margin="auto"
                justifyContent="space-around"
              >
                <Tab p="14px" fontWeight="bold">
                  유저정보
                </Tab>
                <Tab p="16px" fontWeight="bold">
                  게시글
                </Tab>
              </TabList>
              <TabPanels display="flex" justifyContent="center">
                <TabPanel background="white">
                  <Flex flexDirection="column">
                    <Box>
                      <OtherProfile userInfo={userInfo} />
                    </Box>
                  </Flex>
                </TabPanel>

                <TabPanel background="white" maxHeight="600px" overflow="auto">
                  <Box marginTop="40px" position="relative">
                    {/* <Box position="absolute"> */}
                    {/* 여기서 내 게시글만 가져와서 뿌려줘야 함 */}

                    {mainPosts.map((post) => (
                      <Main key={post.id} post={post} />
                    ))}
                  </Box>
                  {/* </Box> */}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        ) : (
          <SignIn />
        )}
      </Layout>
      {/* 익스플로어 페이지는 모든 사람들의 게시물을 볼 수 있고 해시태그 검색이 가능 */}

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
