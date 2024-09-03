import mongoose from "mongoose";

interface UserAttrs {
    userId: string;
    email: string;
    password: string;
}

interface UserDoc extends mongoose.Document {
    userId: string;
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
mongoose.connect(url)
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
