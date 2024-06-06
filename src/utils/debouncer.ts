function debouncer_leading(callback: Function, delay = 3000) {
  let timer: any;
  console.log("Calledthe doubcer");

  return (...args: any) => {
    if (!timer) {
      callback(...args);
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
}

export default debouncer_leading;
