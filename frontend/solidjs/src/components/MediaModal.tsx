import { JSXElement } from "solid-js";

export type MediaModalProps = {
  content?: JSXElement;
};

const MediaModal = (props: MediaModalProps) => {
  return (
    <div class="modal modal-open">
      <div class="modal-box">
        {props.content}
        <h3 class="font-bold text-lg">Congratulations random Interner user!</h3>
        <p class="py-4">
          You've been selected for a chance to get one year of subscription to use Wikipedia for
          free!
        </p>
      </div>
    </div>
  );
};

export default MediaModal;
