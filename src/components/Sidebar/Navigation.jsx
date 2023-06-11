function Navigation({
  image,
  nameOfNav,
  classOfImage,
  classOfNav,
  classOfWrapper,
}) {
  return (
    <div
      className={
        "flex flex-row items-center rounded-lg px-5 py-2 font-sans text-lg text-white hover:cursor-pointer hover:bg-hover-color " +
        (classOfWrapper ? classOfWrapper : "sm:gap-8")
      }
    >
      <img src={image} alt="calendar" className={classOfImage} />
      <p className={classOfNav}>{nameOfNav}</p>
    </div>
  );
}

export default Navigation;
