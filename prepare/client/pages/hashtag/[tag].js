import React, { useEffect, useState } from "react";
import { LOAD_HASHTAG_POSTS_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Layout from "../../components/Layout";
import SignIn from "../../components/Signin";
import { Input, InputGroup } from "@chakra-ui/react";
import IconButtons from "../../components/IconButtons";
import { FiSearch } from "react-icons/fi";
import Router from "next/router";
import OtherPost from "../../components/OtherPost";

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;

  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );
  const { me } = useSelector((state) => state.user);
  const [input, setInput] = useState("");

  const handleSearch = () => {
    Router.push(`/hashtag/${input}`);
  };

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            lastId,
            data: tag,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length, hasMorePosts, tag, loadPostsLoading]);

  return (
    <div>
      <Head>
        <title>Dot Your Day</title>
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

            <>
              {mainPosts.length > 0 ? (
                <div
                  style={{
                    marginTop: "140px",
                  }}
                >
                  {mainPosts.map((post, index) => (
                    <OtherPost key={index} post={post} />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "140px",
                  }}
                >
                  <img
                    style={{ maxWidth: "700px", width: "90%", margin: "auto" }}
                    src="https://i.ibb.co/yV4P01z/sdffgsd.jpg"
                  ></img>
                </div>
              )}
            </>
          </>
        ) : (
          <SignIn />
        )}
      </Layout>
      <footer></footer>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_HASHTAG_POSTS_REQUEST,
      data: context.params.tag,
    });

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Hashtag;
