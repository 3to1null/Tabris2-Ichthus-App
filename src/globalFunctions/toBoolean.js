module.exports = (inputString, defaultTo=false) => {
  if(defaultTo === false){
    if(inputString === 'true' || inputString === 'True' || inputString === true){
      return true
    }
    return false
  }else{
    if(inputString === 'false' || inputString === 'False' || inputString === false){
      return false
    }
    return true
  }
};
