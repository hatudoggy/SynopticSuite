import { useEffect, useState } from 'react'

function getWindowDimension(winRef) {
  const [winHeight, setWinHeight] = useState(0);
  const [winWidth, setWinWidth] = useState(0);
  const [winLeft, setWinLeft] = useState(0);

  const updateDimensions = () => {
    setWinHeight(winRef.current.clientHeight);
    setWinWidth(winRef.current.clientWidth);
    setWinLeft(winRef.current.getBoundingClientRect().left);
  };

  useEffect(() => {
    updateDimensions();
    // window.addEventListener("resize", updateDimensions);
    // return () => window.removeEventListener("resize", updateDimensions);
  }, [winRef]);

  return [winHeight, winWidth, winLeft];
}

export function usePosRelativeScreen(popupRef, buttonRef, winRef) {
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);
  const [height, width, left] = getWindowDimension(winRef);

  useEffect(() => {
    changeYPosition(popupRef, buttonRef, height);
    changeXPosition(popupRef, width, left);
  }, [popupRef, buttonRef, height, width, left]);

  function changeXPosition(popRef, width, left) {
    const pB = popRef.current.getBoundingClientRect().right;
    const pL = popRef.current.getBoundingClientRect().left;

    if (pB > width) {
      setCoordX(-100);
    } else {
      setCoordX(-10);
    }
  }

  function changeYPosition(popRef, btnRef, height) {
    const pB = popRef.current.getBoundingClientRect().bottom;

    const pHeight =
      popRef.current.clientHeight +
      2 * parseFloat(window.getComputedStyle(popRef.current).margin);
    const bHeight = btnRef.current.clientHeight;
    const newY = pHeight + bHeight;

    if (pB > height) {
      setCoordY(newY);
    } else {
      setCoordY(0);
    }
  }

  return [coordX, coordY];
}
