import Link from "next/link";
import React from "react";

const HashtagSplit = ({ postData }) => (
  <div>
    {postData
      .toString()
      .split(/(#[^\s#]+)/g)
      .map((v, i) => {
        if (v.match(/(#[^\s#]+)/)) {
          return (
            <Link href={`/hashtag/${v.slice(1)}`} key={i}>
              <a style={{ color: "#1B7DCA" }}>{v}</a>
            </Link>
          );
        }
        return v;
      })}
  </div>
);

export default HashtagSplit;
