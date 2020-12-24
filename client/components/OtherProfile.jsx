import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import IconButtons from "./IconButtons";
import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import ModalBox from "./ModalBox";
import { useDispatch, useSelector } from "react-redux";
import { UNFOLLOW_REQUEST, FOLLOW_REQUEST } from "../reducers/user";

const OtherProfile = ({ userInfo }) => {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  // console.log("userInfo", userInfo);
  // console.log("me", me);

  const isFollowing = me?.Followings.findIndex(
    (user) => user.id === userInfo.id
  );

  console.log(isFollowing);

  const handleUnFollow = () => {
    dispatch({
      type: UNFOLLOW_REQUEST,
      data: userInfo.id,
    });
  };

  const handleFollow = () => {
    dispatch({
      type: FOLLOW_REQUEST,
      data: userInfo.id,
    });
  };

  const handleReport = async () => {
    // 인사말 수정을 요청했을 때

    await toast({
      title: "Report",
      description: "신고가 접수되었습니다.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    await setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Box
      border="1px solid #e9e9e9"
      margin="40px 0px"
      backgroundColor="white"
      borderRadius="6px"
      maxWidth="600px"
      width="100%"
    >
      <Flex padding="15px 10px" alignItems="center">
        <Avatar
          name={userInfo.nickname[0]}
          size="sm"
          bg="blue.500"
          margin="0 6px"
        />
        <Text fontWeight="bold">{userInfo.nickname}</Text>
        <Spacer />
        <IconButtons onClick={onOpen} icon={<HiDotsVertical />} />
      </Flex>
      <Box>
        <Image
          width="100%"
          objectFit="cover"
          src="https://i.pinimg.com/736x/68/94/93/6894931eb3e93f6d6ef2dd000d8acdc6.jpg"
        />
        {/* <Center>
          <OtherSaves />
        </Center> */}
      </Box>
      <Flex padding="20px" alignItems="center">
        <Text fontWeight="bold">{userInfo.nickname}</Text>
        {/* 좋아요 숫자 */}

        <Spacer />

        <Stat textAlign="right">
          <StatLabel>Follower</StatLabel>
          <StatNumber>{userInfo.Followers}</StatNumber>
        </Stat>
        <Stat textAlign="right">
          <StatLabel>Following</StatLabel>
          <StatNumber>{userInfo.Followings}</StatNumber>
        </Stat>
      </Flex>

      <ModalBox
        context={
          <>
            {isFollowing ? (
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

            <Button
              onClick={handleReport}
              name="report"
              margin="6px"
              _hover={{ bg: "#E1341C", color: "white" }}
            >
              신고하기
            </Button>

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

export default OtherProfile;
