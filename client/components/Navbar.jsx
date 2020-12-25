import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCompass, FaUserCircle } from "react-icons/fa";
import { RiHomeFill } from "react-icons/ri";
import React, { useEffect } from "react";
import IconButtons from "./IconButtons";
import ModalBox from "./ModalBox";
import Link from "next/link";
import { logoutRequestAction } from "../reducers/user";

import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
} from "../reducers/user";

const Navbar = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  const onLogout = () => {
    console.log("로그아웃!");
    dispatch(logoutRequestAction());
  };

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);

  const Followers = [
    {
      nickname: "바보",
    },
  ];

  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex
      alignItems="center"
      height="70px"
      backgroundColor="white"
      position="fixed"
      top="0px"
      zIndex="999"
      width="100%"
    >
      <Box p="2">
        <Heading margin="0 10px">
          <Link href="/">
            <a>DYD</a>
          </Link>
        </Heading>
        {/* 홈이동 구현 */}
      </Box>
      <Spacer />
      <Box>
        <IconButtons hrefLink={"/"} size={"24px"} icon={<RiHomeFill />} />
        <IconButtons hrefLink={"/explore"} icon={<FaCompass />} />
        <Menu>
          <MenuButton
            as={Button}
            width="8px"
            margin="0px 4px"
            backgroundColor="transparent"
          >
            <FaUserCircle fontSize="20px" />
          </MenuButton>
          <MenuList width="140px">
            <MenuItem>
              <Link href={`/profile/${me?.id}`}>
                <a>😊 프로필</a>
              </Link>
            </MenuItem>
            <MenuItem onClick={onOpen}>👥 팔로우</MenuItem>
            <MenuItem onClick={onLogout}>👻 로그아웃</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <ModalBox
        context={
          <>
            {/* {me.Followers.map((item, index) => ( */}
            {Followers.map((item, index) => (
              <Flex alignItems="center" padding="2px 0px" key={index}>
                <Avatar name={item.nickname[0]} size="sm" bg="blue.500" />
                <Input
                  type="text"
                  value={item.nickname}
                  margin="0px 8px"
                  readOnly
                />
                {/* 이 부분 에러날 수 있음 코딩문제로!! */}
                {/* <Button _hover={{ bg: "#E1341C", color: "white" }}>
                  {me.Followings.findIndex((user) => user.id === item.id)
                    ? "팔로잉"
                    : "팔로우"}
                </Button> */}
              </Flex>
            ))}
          </>
        }
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
};

export default Navbar;
