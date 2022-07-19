import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

export class Contact {
  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ unique: true, required: true })
  email: string;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop({ _id: false })
  contact: Contact;

  @prop({
    default: "https://good-deed-app.s3-us-west-1.amazonaws.com/user.png",
  })
  profilePictureUrl: string;

  @prop({ unique: true, required: true })
  userName: string;

  @prop({ default: false })
  isDeleted: Boolean;

  @prop()
  deletedBy: string;
}

const userModel = getModelForClass(User);

export default userModel;
