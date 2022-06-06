import "react-lazy-load-image-component/src/effects/blur.css";
import { ThumbnailProps } from "./Thumbnail";
import ThumbnailImage from "./ThumbnailImage";


const ThumbnailGif = (props: ThumbnailProps) => {
  return <ThumbnailImage {...props}/>;
};
export default ThumbnailGif;
