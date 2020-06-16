const Image = require('../models/image')
const User = require("../models/user");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");


exports.getImageById = (req, res, next, id) => {
    Image.findById(id)
    .exec((err, img) => {
      if (err) {
        return res.status(400).json({
          error: "Image not found."
        });
      }
      req.image = img;
      next();
    });
  };


  exports.getImage = (req, res) => {
    res.json(req.image)
    
  };

  exports.createImage = (req, res) => {
    const id = req.params.userId

    const image = new Image(req.body);
        image.save((err, image) => {
            if (err) {
              res.status(400).json({
                error: err
              });
            }
            else{
                res.json(image);
                User.findById(id).exec((err, user) => {
                    if(err || !user){
                        return res.status(400).json({
                            error: "No user was found in DB"
                          });
                    }
                    else{
                        user.photos.push(image._id)
                        user.save()
                      }
                })
            }
          });  
  }