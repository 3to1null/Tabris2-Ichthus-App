module.exports = (settingName) => {
  return localStorage.getItem(`-s-${settingName}`)
};
