import {
  Accordion,
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Spacer,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import IconButtons from "./IconButtons";
import React, { useCallback, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaRegHeart, FaHeart, FaTelegramPlane } from "react-icons/fa";
import AccordionBox from "./AccordionBox";
import ModalBox from "./ModalBox";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_COMMENT_REQUEST,
  LIKE_POST_REQUEST,
  REMOVE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
} from "../reducers/post";
import Link from "next/link";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";
import HashtagSplit from "./HashtagSplit";
import moment from "moment";
moment.locale("ko");

const OtherPost = ({ post }) => {
  const toast = useToast();
  const { removePostLoading } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);
  const id = me?.id;

  const isFollowing = me?.Followings.findIndex(
    (user) => user.id === post.User.id
  );

  const [input, setInput] = useState("");
  const [focus, setFocus] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();

  const handleUnFollow = () => {
    dispatch({
      type: UNFOLLOW_REQUEST,
      data: post.User.id,
    });
    onClose();
  };

  const handleFollow = () => {
    dispatch({
      type: FOLLOW_REQUEST,
      data: post.User.id,
    });
    onClose();
  };

  const onLike = useCallback(() => {
    if (!id) {
      return toast({
        title: "Warning",
        description: "You need to Log in",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onUnLike = useCallback(() => {
    if (!id) {
      return toast({
        title: "Warning",
        description: "You need to Log in",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return toast({
        title: "Warning",
        description: "You need to Log in",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else {
      dispatch({
        type: REMOVE_POST_REQUEST,
        data: post.id,
      });
      onClose();
    }
  }, []);

  const writeComment = useCallback(
    (input) => {
      if (!id) {
        return toast({
          title: "Warning",
          description: "You need to Log in",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      } else {
        dispatch({
          type: ADD_COMMENT_REQUEST,
          data: { content: input, postId: post.id, userId: id },
        });
        setInput("");
        setFocus(true);
      }
    },
    [input, id]
  );

  const liked = post?.Likers.find((v) => v.id === id);

  return (
    <Box
      border="1px solid #e9e9e9"
      margin="20px 0px"
      backgroundColor="white"
      borderRadius="6px"
      maxWidth="600px"
      width="100%"
    >
      <Flex padding="15px 10px" alignItems="center">
        {post.User.id !== me.id ? (
          <Link href={`/user/${post.User.id}`}>
            <a>
              <Avatar
                name={post.User.nickname}
                size="sm"
                bg="blue.500"
                margin="0 6px"
              />
            </a>
          </Link>
        ) : (
          <Avatar
            name={post.User.nickname}
            size="sm"
            bg="blue.500"
            margin="0 6px"
          />
        )}

        <Text fontWeight="bold">{post.User.nickname}</Text>
        <Spacer />
        <IconButtons onClick={onOpen} icon={<HiDotsVertical />} />
      </Flex>
      <Box>
        {post.Images && (
          <Image
            width="100%"
            objectFit="cover"
            src={`${post?.Images[0]?.src}`}
          />
        )}
      </Box>
      <Flex padding="15px 10px" alignItems="center">
        {liked ? (
          <IconButtons
            size={"22px"}
            onClick={onUnLike}
            icon={<FaHeart color="#E11313" />}
          />
        ) : (
          <IconButtons size={"22px"} onClick={onLike} icon={<FaRegHeart />} />
        )}
        <Text>{post.Likers.length}</Text>
        {/* 좋아요 숫자 */}

        <Spacer />
        <Text fontWeight="bold" marginRight="4px">
          {moment(post.createdAt).format("YYYY.MM.DD")}
        </Text>
      </Flex>
      <Accordion allowMultiple width="100%">
        {/* <AccordionBox title="나의 기록" text={post.content} /> */}
        <div style={{ padding: "8px 16px" }}>
          <HashtagSplit postData={post.content} />
        </div>

        <Flex borderTop="1px solid #e7e7e7">
          <Input
            placeholder="댓글달기..."
            border="none"
            padding="8px 16px"
            variant="unstyled"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {input !== "" && (
            <IconButtons
              onClick={() => writeComment(input)} //값 제출.
              size={"24px"}
              icon={<FaTelegramPlane color="#1C73E1" />}
            />
          )}
        </Flex>
        <AccordionBox
          title={`${post.Comments.length}개의 댓글이 있습니다...`}
          focus={focus}
          overflowEvent="scroll"
          text={
            <>
              {post.Comments.map((item) => (
                <Flex alignItems="center" padding="2px 0px" key={item.id}>
                  {post.User.id !== me.id ? (
                    <Link href={`/user/${item.User.id}`}>
                      <a>
                        <Avatar
                          name={item.User.nickname}
                          size="sm"
                          bg="blue.500"
                          margin="0 6px"
                        />
                      </a>
                    </Link>
                  ) : (
                    <Avatar
                      name={item.User.nickname}
                      size="sm"
                      bg="blue.500"
                      margin="0 6px"
                    />
                  )}
                  <Input type="text" value={item.content} readOnly />
                </Flex>
              ))}
            </>
          }
        />
      </Accordion>
      <ModalBox
        context={
          <>
            {id && post.User.id === id ? ( //자기 게시물인지 타인의 게시물인지 체크!
              <>
                <Button margin="6px" _hover={{ bg: "#1C84E1", color: "white" }}>
                  수정
                </Button>
                <Button
                  onClick={onRemovePost}
                  isLoading={removePostLoading}
                  margin="6px"
                  _hover={{ bg: "#E1341C", color: "white" }}
                >
                  삭제
                </Button>
              </>
            ) : (
              <>
                {isFollowing === -1 ? (
                  <Button
                    onClick={handleFollow}
                    name="follow"
                    margin="6px"
                    _hover={{ bg: "#1C84E1", color: "white" }}
                  >
                    팔로우
                  </Button>
                ) : (
                  <Button
                    onClick={handleUnFollow}
                    name="unfollow"
                    margin="6px"
                    _hover={{ bg: "#1C84E1", color: "white" }}
                  >
                    언팔로우
                  </Button>
                )}
                <Button margin="6px" _hover={{ bg: "#E1341C", color: "white" }}>
                  신고하기
                </Button>
              </>
            )}

            <Button
              margin="6px"
              _hover={{ bg: "#616263", color: "white" }}
              onClick={onClose}
            >
              취소
            </Button>
          </>
        }
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
};

export default React.memo(OtherPost);
