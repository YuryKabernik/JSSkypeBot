const keyWords = {
    "iteration": {
        "word": "iteration",
        "access": "Admin"
    },
    "joke": {
        "word": "joke",
        "access": "User"
    }
};

module.exports = {
    isAdminKeyWord: (key) => !!key && !!keyWords[key] && keyWords[key].access === "Admin",
    isUserKeyWord: (key) => !!key && !!keyWords[key] && keyWords[key].access === "User",
    keyWords: keyWords
};
