import Head from "next/head";
import Layout from "../components/Layout";
import SignIn from "../components/Signin";
import Main from "../components/Main";

import { useDispatch, useSelector } from "react-redux";
import { LOAD_POSTS_REQUEST, LOAD_POST_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );

  console.log("렌더링 몇번");

  let followPost = [];

  me?.Followings.forEach((user) => {
    followPost.push(mainPosts.filter((item) => item.User.id === user.id));
  });

  const myPost = mainPosts.filter((item) => item.User.id === me?.id);

  let lastPost = [];
  followPost.forEach((item) => {
    item.map((post) => lastPost.push(post));
  });

  myPost.map((item) => lastPost.push(item));

  let sortingField = "id";
  lastPost.sort(function (a, b) {
    return b[sortingField] - a[sortingField];
  });

  console.log(lastPost[lastPost.length - 1]);

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_POSTS_REQUEST,
  //   });
  // }, []);

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
        <title>Dot Your Day</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 테스트 장소 */}
      <Layout>
        {me ? (
          <>
            {lastPost.length > 0 ? (
              <div
                style={{
                  marginTop: "140px",
                }}
              >
                {lastPost.map((post, index) => (
                  <Main key={index} post={post} />
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
                  src="https://i.ibb.co/P5cPrJT/newnewn.jpg"
                ></img>
              </div>
            )}
          </>
        ) : (
          <SignIn />
        )}
      </Layout>
      {/* 메인페이지는 팔로우한 사람들의 게시글이 보이도록! */}

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
      type: LOAD_POST_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);
