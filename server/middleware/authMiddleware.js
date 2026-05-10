import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {

    let token;

    try {

        // CHECK TOKEN EXISTS
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            token = req.headers.authorization.split(" ")[1];



            // VERIFY TOKEN
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );



            // GET USER
            req.user = await User.findById(decoded.id)
                .select("-password");



            next();

        } else {

            res.status(401);

            throw new Error("Not authorized, no token");

        }

    } catch (error) {

        res.status(401).json({
            message: error.message,
        });

    }
};

const adminOnly = (req, res, next) => {

    if (req.user && req.user.role === "admin") {

        next();

    } else {

        res.status(403).json({
            message: "Admin access only",
        });

    }
};

export {
    protect,
    adminOnly,
};