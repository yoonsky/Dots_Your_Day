import React from "react";
import { Box, Flex } from "@chakra-ui/react";

import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <Flex
      flexDirection="column"
      position="relative"
      height="100vh"
      // backgroundColor="#F9F9F9"
    >
      <Box w="100%" h="70px" position="relative">
        <Navbar />
      </Box>
      <Flex
        w="100%"
        // marginTop="70px"
        // overflowY="scroll"
        position="relative"
        flexDirection="column"
        alignItems="center"
        height="100%"
      >
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
