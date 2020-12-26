import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

const ModalBox = ({ onClose, isOpen, context }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody maxHeight="400px" overflow="auto">
          <Flex flexDirection="column">{context}</Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalBox;
