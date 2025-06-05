import StickerIcon from '../../assets/svg/smile.svg';

export default function Sticker({ stickerClick }) {
  return (
    <>
      <StickerIcon onTouchStart={stickerClick} />
    </>
  );
}
