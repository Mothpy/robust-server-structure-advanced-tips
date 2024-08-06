
// import users data file 
const users = require("../data/users-data");


// function to list users 
function list(req, res) {
    res.json({ data: users });
}

// check if user exists by checking userId
function userExists(req, res, next) {
    const { userId } = req.params;
    const foundUser = users.find(user => user.id === Number(userId));
    if (foundUser) {
        res.locals.user = foundUser;
        return next();
    }
    next({
        status: 404,
        message: `User id not found: ${userId}`,
    });
};

// read a user's data 
function read(req, res, next) {
    res.json({ data: res.locals.user });
};

// exports user functions 
module.exports = {
    list,
    read: [userExists, read],
    userExists,
};