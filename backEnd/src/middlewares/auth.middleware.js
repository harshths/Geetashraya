import jwt from "jsonwebtoken";

const authArtist = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized..",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SCRT);
        
        if(decoded.role !== "artist") {
            return res.status(403).json({
                message: "You dont have permission to perform this action.."
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token..",
        });
    }
}

const authUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized..",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SCRT);
        
        if(decoded.role !== "user" && decoded.role !== "artist") {
            return res.status(403).json({
                message: "You dont have permission to perform this action.."
            });
        }

        req.user = decoded;
        next(); 
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token..",
        });
    }
}

export {authArtist, authUser};