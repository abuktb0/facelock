    import jwt from "jsonwebtoken"

    const verifyAuth = (req, res, next) => {
        const {token} = req.cookies
        if(!token){
            return res.status(401).json({success: false, message: "Unauthorized"})
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        if(decoded.id){
            req.user = decoded.id
        }else{
            return res.status(401).json({success:false, message: "Unauthorized"})
        }
        next()
    }

    export default verifyAuth