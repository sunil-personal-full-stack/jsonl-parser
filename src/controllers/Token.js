const { signToken } = require('../helpers/Token');

const generateToken = (req, res) => {
    // For testing purposes, we can use a static payload
    const payload = {
        id: 1,
        username: 'testuser',
    };

    const token = signToken(payload);
    res.json({ token });
};

module.exports = { generateToken };
