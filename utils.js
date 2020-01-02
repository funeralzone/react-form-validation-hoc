export const scrollToElement = (elementRef, scrollableParentRef) => {
  const elementCheck = setInterval(() => {
    const element = elementRef.current;

    if (scrollableParentRef) {
      const scrollingElement = scrollableParentRef && scrollableParentRef.current;
      if (elementRef.current && scrollingElement) {
        scrollingElement.scrollTo({
          top: element.getBoundingClientRect().top - scrollingElement.offsetTop,
          left: 0,
          behavior: 'smooth',
        });
      }
    } else {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (elementRef.current) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + scrollTop,
          left: 0,
          behavior: 'smooth',
        });
      }
    }

    clearInterval(elementCheck);
  }, 100);
};

