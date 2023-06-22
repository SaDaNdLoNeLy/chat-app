export const logout = () => {
  window.location.pathname = "/login"
  localStorage.clear();
}