const express = require('express')
const router = express.Router()

const {
    getImageById,
    createImage,
    getImage,
} = require('../controller/images')
const { getUserById } = require("../controller/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controller/auth");


router.param("userId", getUserById);
router.param("imageId", getImageById);
//create
router.post(
    "/create/image/:userId",
    isSignedIn,
    isAuthenticated,
    createImage
)


//read
router.get("/image/:imageId/:userId" ,isSignedIn, getImage)



module.exports = router;