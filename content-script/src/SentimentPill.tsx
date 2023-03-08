/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import "./main.css";

const SentimentPill = (props: any) => {
  let id: string = props.id;

  return (
    <div
      id={props.id}
      className={`${props.class} cursor-pointer`}
      onClick={() => props.onClick(id)}
    >
      {props.message}
    </div>
  );
};

export default SentimentPill;
