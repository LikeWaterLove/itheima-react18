const TOKENKEY = "token_key";
function setLocalStorageToken(token) {
  localStorage.setItem(TOKENKEY, token);
}
function getLocalStorageToken() {
  return localStorage.getItem(TOKENKEY);
}
function removeLocalStorageToken() {
  localStorage.removeItem(TOKENKEY);
}
export { setLocalStorageToken, getLocalStorageToken, removeLocalStorageToken };
