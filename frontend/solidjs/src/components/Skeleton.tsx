import { JSXElement } from "solid-js";

export type SkeletonProps = {
  icon: JSXElement;
};

const Skeleton = (props: SkeletonProps) => {
  return (
    <div
      class={
        "rounded-md xl:rounded-2xl flex justify-center items-center bg-base-200 animate-pulse w-full h-full"
      }
    >
      {props.icon}
    </div>
  );
};

export default Skeleton;
