import React from "react";
import { AllMedia_allMedia as Media } from "../queries/types/AllMedia";
import { LazyLoadImage } from "react-lazy-load-image-component";
import LazyLoad from "react-lazyload";
import "react-lazy-load-image-component/src/effects/blur.css";

const Thumbnail: React.FC<Media> = (props) => {
  if (props.processed) {
    return (
      <LazyLoadImage
        placeholderSrc={"/m/" + props.id + "/0"}
        alt={"/m/" + props.id.toString() + "/0"}
        effect="blur"
        src={"/m/" + props.id.toString() + "/1"}
      />
    );
  } else {
    return (
      <LazyLoad height={300}>
        <img src={"/m/" + props.id} width="100%" alt={props.id.toString()} />
      </LazyLoad>
    );
  }
};
export default Thumbnail;
