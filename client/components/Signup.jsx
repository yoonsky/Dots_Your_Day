import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { SIGN_UP_REQUEST } from "../reducers/user";
import Link from "next/link";

function CheckEmail(str) {
  var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

  if (!reg_email.test(str)) {
    return false;
  } else {
    return true;
  }
}

const SignUp = () => {
  const toast = useToast();

  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState({
    email: "",
    nickname: "",
    password: "",
    confirm: "",
  });

  const { email, nickname, password, confirm } = inputValue;

  const handleClick = () => {
    if (
      email !== "" &&
      nickname !== "" &&
      password !== "" &&
      confirm !== "" &&
      CheckEmail(email) &&
      password == confirm
    ) {
      toast({
        title: "Account created.",
        description: "회원가입이 완료되었습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      dispatch({
        type: SIGN_UP_REQUEST,
        data: { email, password, nickname },
      });
    } else {
      toast({
        title: "Warning.",
        description: "입력값이 없거나 올바르지 않습니다.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  return (
    <Box
      width="90%"
      maxWidth="400px"
      border="1px solid #d5d5d5"
      padding="50px 30px"
      margin="auto"
    >
      <Heading marginBottom="20px">SING UP</Heading>
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input
          id="email"
          name="email"
          type="email"
          onChange={handleChange}
          value={email}
        />

        <FormHelperText marginBottom="10px">
          {CheckEmail(email) || email === "" ? null : (
            <span style={{ color: "red" }}>올바른 이메일 형식이 아닙니다.</span>
          )}
        </FormHelperText>

        <FormLabel>Nickname</FormLabel>
        <Input
          id="nickname"
          name="nickname"
          type="text"
          onChange={handleChange}
          value={nickname}
        />

        <FormLabel>Password</FormLabel>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          value={password}
        />

        <FormLabel>Password Confirm</FormLabel>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          onChange={handleChange}
          value={confirm}
        />
        <FormHelperText marginBottom="10px">
          {password === confirm ? null : (
            <span style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</span>
          )}
        </FormHelperText>

        <Flex direction="row" spacing={4} alignItems="center" marginTop="30px">
          <Button variant="link">
            <Link href="/">
              <a>SIGN IN</a>
            </Link>
          </Button>
          <Spacer />
          <Button colorScheme="blue" variant="solid" onClick={handleClick}>
            SIGN UP
          </Button>
        </Flex>
      </FormControl>
    </Box>
  );
};

export default SignUp;
