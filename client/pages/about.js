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
import OtherProfile from "../components/OtherProfile";
import Main from "../components/Main";
import "../styles/Home.module.css";

import { useSelector } from "react-redux";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../reducers/user";
import { END } from "redux-saga";
import wrapper from "../store/configureStore";
import axios from "axios";

export default function About() {
  const { me, userInfo } = useSelector((state) => state.user);

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
        <title>Dot Your Day | About</title>
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
                      {/* 포스트 정보도 보내야 함 */}
                    </Box>
                  </Flex>
                </TabPanel>

                <TabPanel background="white" maxHeight="600px" overflow="auto">
                  <Box marginTop="40px" position="relative">
                    {userInfo?.Posts?.map((post, index) => (
                      <Main key={index} post={post} />
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
      type: LOAD_USER_REQUEST,
      data: 1,
    });
    context.store.dispatch(END);
    console.log("getServerSideProps end!!");
    await context.store.sagaTask.toPromise();
  }
);
