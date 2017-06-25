module.exports = () => {
    if(localStorage.getItem('isLoggedIn') === 'true'){
        if(localStorage.getItem('__key') && localStorage.getItem('__sessionID')){
            return true;
        }
    }
    return false;
};