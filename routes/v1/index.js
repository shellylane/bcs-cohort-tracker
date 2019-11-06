const router = require("express").Router();
const axios = require("axios");

router.get("/login", function (req, res) {
    //user object to build and send back to front end
    const user = {
        authToken: "",
        userId: "",
        firstName: "",
        lastName: "",
        cohorts: [],
    }
    // axios call to login to bootcampspot
    axios({
        method: 'POST',
        url: 'https://bootcampspot.com/api/instructor/v1/login',
        data: {
            email: req.body.email,
            password: req.body.password
        }
    })
        .then(function (response) {
            //get auth token and store it for use in nexted axios call
            user.authToken = response.data.authenticationInfo.authToken;
            //2nd axios call that fires after response from first to get user's info and course enrollments
            axios({
                method: 'GET',
                url: 'https://bootcampspot.com/api/instructor/v1/me',
                headers: { "Content-Type": "application/json", "authToken": user.authToken }
            })
                .then(function (response) {
                    //set values to keys on user object 
                    user.userId = response.data.userAccount.id;
                    user.firstName = response.data.userAccount.firstName;
                    user.lastName = response.data.userAccount.lastName;
                    user.cohorts = response.data.enrollments;

                    //send user object 
                    res.json(user);
                })
                .catch(function (error) {
                    console.log(error);
                })
        })
        //catch any errors
        .catch(function (error) {
            console.log(error);
        })
})

module.exports = router;