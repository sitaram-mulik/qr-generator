let toastFunction = null;

export const setToastFunction = (fn) => {
  toastFunction = fn;
};

export const showToast = (message, severity = "info") => {
  if (toastFunction) {
    toastFunction(message, severity);
  } else {
    console.warn("Toast function is not set yet.");
  }
};
