const jwt = sails.config.custom.jwt;

module.exports = {
    friendlyName: "Jwt",

    description: "Jwt something.",

    inputs: {
        user: {
            type: "ref",
        },
    },

    exits: {
        success: {
            description: "All done.",
        },
    },

    fn: async function (inputs) {
        let userId = inputs.user.id;
        let role = inputs.user.role;

        const token = await jwt.sign(
            { userId: userId, role: role },
            process.env.JWT_KEY,
            {
                expiresIn: "5h",
            }
        );
        return token;
    },
};
