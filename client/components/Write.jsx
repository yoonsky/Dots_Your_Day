import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Spacer,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import IconButtons from "./IconButtons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ImFilePicture } from "react-icons/im";
import { MdDelete } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import {
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
  ADD_POST_REQUEST,
} from "../reducers/post";

import Router from "next/router";

const Write = ({ me }) => {
  // console.log(me);
  const toast = useToast();
  const dispatch = useDispatch();
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const imageInput = useRef();

  // console.log(imagePaths.length);

  const [text, setText] = useState("");

  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleClick = useCallback(() => {
    if (text === "" || imagePaths.length < 1) {
      return toast({
        title: "warning.",
        description: "사진과 글을 모두 작성해주세요.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else {
      const formData = new FormData();

      imagePaths.forEach((p) => {
        formData.append("image", p);
      });
      console.log(formData);
      formData.append("content", text);

      dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
      });
      toast({
        title: "Post Creation Complete.",
        description: "게시글 등록이 완료되었습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      Router.replace("/");
    }
  }, [text, imagePaths]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log("images", e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append("image", f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback(() => {
    dispatch({
      type: REMOVE_IMAGE,
      data: 0,
      //여기서 에러나면 1로 수정
    });
  }, []);

  return (
    <Box
      border="1px solid #e9e9e9"
      margin="40px 0px"
      backgroundColor="white"
      borderRadius="6px"
      maxWidth="600px"
      width="100%"
    >
      <Flex padding="20px 10px" alignItems="center">
        <Avatar name={me?.nickname} size="sm" bg="blue.500" margin="0 6px" />
        <Text fontWeight="bold">{me?.nickname}</Text>
      </Flex>
      <Box minWidth="380px" minHeight="380px">
        {imagePaths.map((v) => (
          <Image
            key={v}
            width="100%"
            objectFit="cover"
            src={`http://localhost:5000/${v}`}
            alt={v}
          />
        ))}
      </Box>
      <Flex padding="20px" alignItems="center">
        <Text fontWeight="bold">📃 오늘은 어떤 하루였나요?</Text>

        <Spacer />
        <IconButtons
          onClick={onClickImageUpload}
          size={"24px"}
          icon={<ImFilePicture />}
        />
        <IconButtons
          onClick={() => onRemoveImage()}
          size={"24px"}
          icon={<MdDelete />}
        />
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        {/* 좋아요 숫자 */}
      </Flex>
      <Flex flexDirection="column">
        <Textarea
          borderRadius="0"
          height="150px"
          resize="none"
          placeholder="please write your today here"
          onChange={handleChange}
          value={text}
        />
        <Button
          onClick={handleClick}
          borderRadius="0"
          formEncType="multipart/form-data"
          //우선은 버튼에 입력함 오류시 Form 디브에 작성할것
        >
          저장하기
        </Button>
      </Flex>
    </Box>
  );
};

export default Write;
