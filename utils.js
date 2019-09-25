export const scrollToElement = (elementRef) => {
  const elementCheck = setInterval(() => {
    const element = elementRef.current;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (elementRef.current) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + scrollTop,
        left: 0,
        behavior: 'smooth',
      });
      clearInterval(elementCheck);
    }
  }, 100);
};
