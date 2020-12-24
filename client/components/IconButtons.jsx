import { IconButton } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";

const IconButtons = ({
  hrefLink = null,
  icon,
  size = "20px",
  onClick = null,
}) => {
  return hrefLink ? (
    <Link href={hrefLink}>
      <a>
        <IconButton
          margin="0 4px"
          cursor="pointer"
          outline="none"
          border="none"
          fontSize={size}
          background="transparent"
          icon={icon}
        ></IconButton>
      </a>
    </Link>
  ) : (
    <IconButton
      onClick={onClick}
      margin="0 4px"
      cursor="pointer"
      outline="none"
      border="none"
      fontSize={size}
      background="transparent"
      icon={icon}
    ></IconButton>
  );
};

export default IconButtons;
