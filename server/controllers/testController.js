const getTestMessage = (req, res) => {
    res.json({
        message: "Backend API Working Successfully"
    });
};

export { getTestMessage };