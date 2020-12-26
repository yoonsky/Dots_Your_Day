import {
  Avatar,
  Box,
  Button,
  Flex,
  FormHelperText,
  Image,
  Input,
  Spacer,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import IconButtons from "./IconButtons";
import React, { useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import ModalBox from "./ModalBox";
import { useDispatch, useSelector } from "react-redux";
import {
  CHANGE_NICKNAME_REQUEST,
  CHANGE_GREET_REQUEST,
} from "../reducers/user";
import FollowBox from "./FollowBox";

const ProfileBox = ({ me }) => {
  const { changeNicknameDone, changeGreetDone } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const toast = useToast();
  const [input, setInput] = useState("");
  const [inputCheck, setInputCheck] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleClick = (e) => {
    const { name } = e.target;

    if (name === "nicknameEdit") {
      // 닉네임 수정을 요청했을 때
      if (input === "") {
        setInputCheck(true);
        setTimeout(() => {
          setInputCheck(false);
        }, 6000);
      } else {
        dispatch({
          type: CHANGE_NICKNAME_REQUEST,
          data: input,
        });

        changeNicknameDone && onClose();
        toast({
          title: "Modification completed.",
          description: "닉네임 변경이 완료되었습니다.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setInput("");
      }
    } else {
      // 인사말 수정을 요청했을 때
      dispatch({
        type: CHANGE_GREET_REQUEST,
        data: input,
      });

      changeGreetDone && onClose();
      toast({
        title: "Modification completed.",
        description: "인사말 변경이 완료되었습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setInput("");
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    setInputCheck(false);
  };

  return (
    <Box
      border="1px solid #e9e9e9"
      backgroundColor="white"
      borderRadius="6px"
      width="400px"
      position="absolute"
      top="140px"
      right="-200px"
    >
      <Flex padding="15px 10px" alignItems="center">
        <Avatar name={me.nickname} size="sm" bg="blue.500" margin="0 6px" />
        <Text fontWeight="bold">{me.nickname}</Text>
        <Spacer />
        <IconButtons onClick={onOpen} icon={<AiFillSetting />} />
      </Flex>
      <Box>
        <Image
          width="100%"
          objectFit="cover"
          src="https://i.ibb.co/KKHv5zS/dotdot.jpg"
        />
      </Box>

      <FollowBox me={me} />
      <ModalBox
        context={
          <>
            <Flex flexDirection="column">
              <Input
                placeholder="수정 사항을 작성해주세요"
                border="none"
                padding="8px"
                width="100%"
                variant="flushed"
                value={input}
                onChange={handleChange}
              />

              <FormHelperText marginBottom="10px">
                {inputCheck && (
                  <span style={{ color: "red", marginLeft: "8px" }}>
                    입력된 정보가 없습니다.
                  </span>
                )}
              </FormHelperText>
            </Flex>
            <Button
              onClick={handleClick}
              name="nicknameEdit"
              margin="6px"
              _hover={{ bg: "#1C84E1", color: "white" }}
            >
              닉네임 수정
            </Button>

            <Button
              onClick={handleClick}
              name="greetEdit"
              margin="6px"
              _hover={{ bg: "#1C84E1", color: "white" }}
            >
              프로필 인사말 수정
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

export default ProfileBox;
