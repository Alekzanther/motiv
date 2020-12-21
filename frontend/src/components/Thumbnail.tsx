import React from "react";
import { AllMedia_allMedia as Media } from "../queries/types/AllMedia";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Thumbnail: React.FC<Media> = (props) => {
  if (props.processed) {
    return (
      <LazyLoadImage alt={"/m/" + props.id + "/0"} effect="blur" src={"/m/" + props.id + "/1"} />
    );
  } else {
    return <img src={"/m/" + props.id} width="100%" alt={props.id.toString()} />;
  }
};
export default Thumbnail;
