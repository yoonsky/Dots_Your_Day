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
  UNFOLLOW_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
} from "../reducers/user";
import ModalBox from "./ModalBox";
import { useDispatch, useSelector } from "react-redux";

const FollowBox = ({ me }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();

  const [toggle, setToggle] = useState(false);

  const { followDone, unfollowDone } = useSelector((state) => state.user);

  const handleUnFollow = (id) => {
    dispatch({
      type: UNFOLLOW_REQUEST,
      data: id,
    });
    if (unfollowDone) {
      dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
      });
      dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
      });
      setToggle(true);
      onClose();
    }
  };

  const handleFollow = (id) => {
    dispatch({
      type: FOLLOW_REQUEST,
      data: id,
    });
    if (followDone) {
      dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
      });
      dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
      });
      setToggle(false);
      onClose();
    }
  };

  return (
    <Flex padding="20px" alignItems="center">
      <Text fontWeight="bold">{me.greet}</Text>
      {/* 좋아요 숫자 */}

      <Spacer />

      <Stat textAlign="right" onClick={onOpen} _hover={{ cursor: "pointer" }}>
        <StatLabel>Follower</StatLabel>
        <StatNumber>{me?.Followers.length}</StatNumber>
      </Stat>
      <Stat textAlign="right" onClick={onOpen} _hover={{ cursor: "pointer" }}>
        <StatLabel>Following</StatLabel>
        <StatNumber>{me?.Followings.length}</StatNumber>
      </Stat>
      <ModalBox
        context={
          <>
            {me?.Followers.length > 0 ? (
              <>
                {me.Followers.map((item, index) => (
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

                    <>
                      {me.Followings.filter((user) => user.id === item.id) ===
                        null || toggle ? (
                        <Button onClick={() => handleFollow(item.id)}>
                          팔로우
                        </Button>
                      ) : (
                        <Button onClick={() => handleUnFollow(item.id)}>
                          언팔로우
                        </Button>
                      )}
                    </>
                  </Flex>
                ))}
              </>
            ) : (
              <Flex flexDirection="column" alignItems="center" padding="20px">
                <Text fontWeight="bold">아직 팔로우가 없어요.</Text>
                <Text fontWeight="bold">
                  다른 유저와 팔로우를 맺어보세요 😊
                </Text>
              </Flex>
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
