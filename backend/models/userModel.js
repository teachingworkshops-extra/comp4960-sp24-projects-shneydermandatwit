import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        displayName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            validate: {
                validator: function(email) {
                    return email.endsWith("@wit.edu");
                },
                message: props => `${props.value} is not a valid email ending with @wit.edu!`
            }
        },
        password: {
            type: String,
            required: true
        },
        permission: {
            type: String,
            default: "user"
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model('users', userSchema);