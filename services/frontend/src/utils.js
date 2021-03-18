export const providers = (component, ...wrappers) => {
  let wrappedComponent = component;

  wrappers.forEach(fn => wrappedComponent = fn(wrappedComponent));

  return wrappedComponent;
};

export const setPrerenderReady = status => (window.prerenderReady = status);

