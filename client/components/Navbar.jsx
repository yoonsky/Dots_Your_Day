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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCompass, FaUserCircle } from "react-icons/fa";
import { RiHomeFill } from "react-icons/ri";
import React from "react";
import IconButtons from "./IconButtons";
import ModalBox from "./ModalBox";
import Link from "next/link";
import { logoutRequestAction } from "../reducers/user";

import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const onLogout = () => {
    console.log("로그아웃!");
    dispatch(logoutRequestAction());
  };

  const FollowOpen = () => {
    onOpen();
  };

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
              <Link href="/profile">
                <a>😊 프로필</a>
              </Link>
            </MenuItem>
            <MenuItem onClick={FollowOpen}>👥 팔로우</MenuItem>
            <MenuItem onClick={onLogout}>👻 로그아웃</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <ModalBox
        context={
          <>
            {me?.Followers.length > 0 ? (
              <>
                {me.Followers.map((item, index) => (
                  <Flex alignItems="center" padding="2px 0px" key={index}>
                    <Link href={`/user/${item.id}`}>
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

export default Navbar;
