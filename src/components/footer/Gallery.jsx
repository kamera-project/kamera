import GalleryIcon from '../../assets/svg/gallery.svg';

export default function Gallery({ galleryClick }) {
  return (
    <>
      <GalleryIcon onTouchStart={galleryClick} />
    </>
  );
}
