import { mongoose, Schema } from "mongoose";

export const ContactSchema = new Schema({
    firstName: {
        type: String,
        required: true 
    },
    lastName: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        unique: true,
        required: true 
    }
}, {
    _id: false
});


const userSchema = new Schema(
    {
        contact: { type: ContactSchema },

        profilePictureUrl: { type: String, default: "https://good-deed-app.s3-us-west-1.amazonaws.com/user.png" },

        userName: { type: String, unique: true, required: true },

        isDeleted: { type: Boolean, default: false },
        deletedBy: { type: String }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                delete ret.__v;
            }
        },
    }
);

export default mongoose.model("User", userSchema);