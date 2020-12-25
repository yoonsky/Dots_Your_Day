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
import ProfileBox from "../components/ProfileBox";
import Main from "../components/Main";
import Write from "../components/Write";
import "../styles/Home.module.css";

import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_MY_INFO_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
} from "../reducers/user";
import { END } from "redux-saga";
import wrapper from "../store/configureStore";
import axios from "axios";
import { useEffect } from "react";
import Router from "next/router";
import SignIn from "../components/Signin";

export default function Profile() {
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (!me?.id) {
      Router.push("/");
    }
  }, [me, me?.id]);

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
        <title>Dot Your Day | Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 테스트 장소 */}
      <Layout>
        {me ? (
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
                  내정보
                </Tab>
                <Tab p="16px" fontWeight="bold">
                  게시글
                </Tab>
                <Tab p="16px" fontWeight="bold">
                  글작성
                </Tab>
              </TabList>
              <TabPanels display="flex" justifyContent="center">
                <TabPanel background="white">
                  <Flex flexDirection="column">
                    <Box>
                      <ProfileBox me={me} />
                    </Box>
                  </Flex>
                </TabPanel>

                <TabPanel background="white" maxHeight="600px" overflow="auto">
                  <Box marginTop="40px" position="relative">
                    {/* <Box position="absolute"> */}
                    {/* 여기서 내 게시글만 가져와서 뿌려줘야 함 */}

                    {me.posts?.map((post, index) => (
                      <Main key={index} post={post} />
                    ))}
                  </Box>
                  {/* </Box> */}
                </TabPanel>

                <TabPanel background="white" maxHeight="600px" overflow="auto">
                  <Flex>
                    <Box>
                      <Write me={me} />
                    </Box>
                  </Flex>
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
