import User from "../models/user.js";

async function registerUser(data) {
    const newUser = User.create({
        ...data,
    })

    return newUser;
}

export { registerUser };