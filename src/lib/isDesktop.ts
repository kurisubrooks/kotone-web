const isDesktop = () => {
  return window.electron && !!window.api
}

export default isDesktop
