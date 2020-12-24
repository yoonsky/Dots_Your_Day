import {
  Accordion,
  Avatar,
  Box,
  Flex,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import IconButtons from "./IconButtons";
import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import AccordionBox from "./AccordionBox";

const me = {
  name: "윤하늘",
};
const OtherSaves = () => {
  return (
    <Box
      border="1px solid #e9e9e9"
      margin="20px 0px"
      backgroundColor="white"
      borderRadius="6px"
      maxWidth="300px"
    >
      <Flex padding="15px 10px" alignItems="center">
        <Avatar name={me.name[0]} size="xs" bg="blue.500" margin="0 6px" />
        <Text fontWeight="bold" fontSize="12px">
          {me.name}
        </Text>
        <Spacer />
      </Flex>
      <Box width="100%" maxWidth="300px">
        <Image
          width="100%"
          objectFit="cover"
          src="https://post-phinf.pstatic.net/MjAxODA0MzBfMTMx/MDAxNTI1MDY5Mjk4Mjg2.51OWZ6gUjfTDoQ5lYE7StRChvsJRIyK0tQGw2N10EUUg.ozmnTHMNF4zGMg4I7sPwh8AsZ6bkWFgy7B0MsEJATEsg.JPEG/1_2.jpg?type=w1200"
        />
      </Box>
      <Accordion allowMultiple width="100%">
        <AccordionBox title="Record" text="오늘은 열심히 공부를 했습니다." />
      </Accordion>
    </Box>
  );
};

export default OtherSaves;
