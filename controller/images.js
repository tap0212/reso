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


  exports.getImage = (req, res, next) => {
    if (req.image.image.data) {
      res.set("Content-Type", req.image.image.contentType);
      return res.send(req.image.image.data);
    }
    next();
  };

  exports.createImage = (req, res) => {
    const id = req.params.userId
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, (err, fields,file) => {
        if (err) {
            return res.status(400).json({
              error: "problem with image"
            });
        }

        const {user} = fields;

        let image = new Image(fields)

        if (file.image) {
            if (file.image.size > 3000000) {
              return res.status(400).json({
                error: "File size too big!"
              });
            }
            image.image.data = fs.readFileSync(file.image.path);
            image.image.contentType = file.image.type;
        }

        image.save((err, image) => {
            if (err) {
              res.status(400).json({
                error: "Saving image in DB failed"
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
      })
  }