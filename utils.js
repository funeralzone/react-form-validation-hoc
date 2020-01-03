export const scrollToElement = (elementRef, scrollableParentRef) => {
  const elementCheck = setInterval(() => {
    const element = elementRef && elementRef.current;
    const scrollingElement = scrollableParentRef && scrollableParentRef.current;

    if (scrollableParentRef && element) {
      scrollingElement.scrollTo({
        top: element.offsetTop - scrollingElement.offsetTop,
        left: 0,
        behavior: 'smooth',
      });
    } else if (element) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: element.getBoundingClientRect().top + scrollTop,
        left: 0,
        behavior: 'smooth',
      });
    }

    clearInterval(elementCheck);
  }, 100);
};
