import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequestAction } from "../reducers/user";

const SignIn = () => {
  const dispatch = useDispatch();
  const { loginLoading, loginError } = useSelector((state) => state.user);
  const toast = useToast();

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (loginError) {
      toast({
        title: "SignIn Error",
        description: `${loginError}`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [loginError]);

  const { email, password } = inputValue;

  const handleClick = () => {
    if (email !== "" && password !== "") {
      dispatch(loginRequestAction({ email, password }));
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
      <Heading marginBottom="20px">SING IN</Heading>
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input
          id="email"
          name="email"
          type="email"
          onChange={handleChange}
          value={email}
        />

        <FormLabel>Password</FormLabel>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          value={password}
        />

        <Flex direction="row" spacing={4} alignItems="center" marginTop="30px">
          <Button variant="link">
            <Link href="/signup">
              <a>SIGN UP</a>
            </Link>
          </Button>
          <Spacer />
          <Button
            isLoading={loginLoading}
            colorScheme="blue"
            variant="solid"
            onClick={handleClick}
          >
            SIGN IN
          </Button>
        </Flex>
      </FormControl>
    </Box>
  );
};

export default SignIn;
