import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import React from "react";

const AccordionBox = ({ focus, title, text, overflowEvent = null }) => {
  return (
    <AccordionItem isFocusable={focus}>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          {title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel
        maxHeight="150px"
        overflowY={overflowEvent}
        // padding="10px"
        margin="3px 0px"
      >
        {text}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default AccordionBox;
