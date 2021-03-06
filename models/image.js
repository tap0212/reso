const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema;
const imageSchema = new mongoose.Schema(
    {
        image:{
            type:String
        },
        user: {
            type: ObjectId,
            ref: "User",
            required: true
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Image", imageSchema)