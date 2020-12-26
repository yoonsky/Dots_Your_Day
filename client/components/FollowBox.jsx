import {
  Avatar,
  Button,
  Flex,
  Input,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import {
  FOLLOW_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  UNFOLLOW_REQUEST,
} from "../reducers/user";
import ModalBox from "./ModalBox";
import { useDispatch } from "react-redux";

const FollowBox = ({ me }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [toggle, setToggle] = useState("follower");
  const dispatch = useDispatch();

  const handleUnFollow = (id) => {
    dispatch({
      type: UNFOLLOW_REQUEST,
      data: id,
    });
    // dispatch({
    //   type: LOAD_FOLLOWERS_REQUEST,
    // });
    // dispatch({
    //   type: LOAD_FOLLOWINGS_REQUEST,
    // });
  };

  const handleFollow = (id) => {
    dispatch({
      type: FOLLOW_REQUEST,
      data: id,
    });
    // dispatch({
    //   type: LOAD_FOLLOWERS_REQUEST,
    // });
    // dispatch({
    //   type: LOAD_FOLLOWINGS_REQUEST,
    // });
  };

  const openModal = (name) => {
    if (name === "follower") {
      setToggle("follower");
    } else {
      setToggle("following");
    }
    onOpen();
  };
  return (
    <Flex padding="20px" alignItems="center">
      <Text fontWeight="bold">{me.greet}</Text>
      {/* 좋아요 숫자 */}

      <Spacer />

      <Stat
        textAlign="right"
        onClick={() => openModal("follower")}
        _hover={{ cursor: "pointer" }}
      >
        <StatLabel>Follower</StatLabel>
        <StatNumber>{me?.Followers.length}</StatNumber>
      </Stat>
      <Stat
        textAlign="right"
        onClick={() => openModal("following")}
        _hover={{ cursor: "pointer" }}
      >
        <StatLabel>Following</StatLabel>
        <StatNumber>{me?.Followings.length}</StatNumber>
      </Stat>
      <ModalBox
        context={
          <>
            {toggle === "follower" ? (
              <>
                {me?.Followers.length > 0 ? (
                  <>
                    {me?.Followers.map((item, index) => (
                      <Flex alignItems="center" padding="2px 0px" key={index}>
                        <Link href={`/profile/${item.id}`}>
                          <a>
                            <Avatar
                              onClick={onClose}
                              name={item.nickname}
                              size="sm"
                              bg="blue.500"
                            />
                          </a>
                        </Link>
                        <Input
                          type="text"
                          value={item.nickname}
                          margin="0px 8px"
                          readOnly
                        />
                        {/* 이 부분 에러날 수 있음 코딩문제로!! */}
                        <>
                          {me?.Followings.findIndex(
                            (user) => user.id === item.id
                          ) === 0 ? (
                            <Button onClick={() => handleUnFollow(item.id)}>
                              차단
                            </Button>
                          ) : (
                            <Button onClick={() => handleFollow(item.id)}>
                              팔로우
                            </Button>
                          )}
                        </>
                      </Flex>
                    ))}
                  </>
                ) : (
                  <Flex
                    flexDirection="column"
                    alignItems="center"
                    padding="20px"
                  >
                    <Text fontWeight="bold">아직 팔로워가 없어요.</Text>
                    <Text fontWeight="bold">
                      다른 유저와 팔로우를 맺어보세요 😊
                    </Text>
                  </Flex>
                )}
              </>
            ) : (
              <>
                {me?.Followings.length > 0 ? (
                  <>
                    {me?.Followings.map((item, index) => (
                      <Flex alignItems="center" padding="2px 0px" key={index}>
                        <Link href={`/profile/${item.id}`}>
                          <a>
                            <Avatar
                              onClick={onClose}
                              name={item.nickname}
                              size="sm"
                              bg="blue.500"
                            />
                          </a>
                        </Link>
                        <Input
                          type="text"
                          value={item.nickname}
                          margin="0px 8px"
                          readOnly
                        />
                        {/* 이 부분 에러날 수 있음 코딩문제로!! */}
                        <>
                          {me?.Followers.findIndex(
                            (user) => user.id === item.id
                          ) === 0 ? (
                            <Button onClick={() => handleUnFollow(item.id)}>
                              언팔로우
                            </Button>
                          ) : (
                            <Button onClick={() => handleFollow(item.id)}>
                              팔로우
                            </Button>
                          )}
                        </>
                      </Flex>
                    ))}
                  </>
                ) : (
                  <Flex
                    flexDirection="column"
                    alignItems="center"
                    padding="20px"
                  >
                    <Text fontWeight="bold">아직 팔로잉을 하지 않았어요.</Text>
                    <Text fontWeight="bold">
                      다른 유저와 팔로우를 맺어보세요. 😊
                    </Text>
                  </Flex>
                )}
              </>
            )}
          </>
        }
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
};

export default FollowBox;
