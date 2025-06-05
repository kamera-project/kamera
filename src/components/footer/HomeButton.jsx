import HomeButtonIcon from '../../assets/svg/HomeBtn.svg';

export default function HomeBtn({ homeBtnClick }) {
  return (
    <>
      <HomeButtonIcon onTouchStart={homeBtnClick} />
    </>
  );
}
