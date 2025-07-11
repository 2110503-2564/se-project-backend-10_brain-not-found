const User = require('../models/User');
//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, tel, role } = req.body;

        if (!name) return res.status(400).json({ success: false, message: "Please add a name" });
        if (!email) return res.status(400).json({ success: false, message: "Please add an email" });
        if (!password) return res.status(400).json({ success: false, message: "Please add a password" });
        if (!tel) return res.status(400).json({ success: false, message: "Please add a phone number" });

        // ตรวจสอบ Email ซ้ำ
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // ตรวจสอบเบอร์โทรซ้ำ
        const existingTel = await User.findOne({ tel });
        if (existingTel) {
            return res.status(400).json({ success: false, message: "Phone number already exists" });
        }

        // สร้าง User ใหม่
        const user = await User.create({ name, email, password, tel, role });

        sendTokenResponse(user, 200, res); // Create token
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = async (req,res,next) => {
    //********ที่เพิ่มเข้ามา*********
    try {
    //********ที่เพิ่มเข้ามา*********
    const {email , password} = req.body;

    // Validate email & password
    if(!email || !password){
        return res.status(400).json({success:false, msg:'Please provide an email and password'});
    }

    // Check for user
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return res.status(400).json({sucess:false , msg:'Invalid credentials'});
    }

    // Check if password matches

    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(401).json({success: false,msg:'Invalid credentials'});
    }

    // const token = user.getSignedJwtToken();
    // res.status(200).json({sucess:true,token});
    sendTokenResponse(user,200,res);


    //********ที่เพิ่มเข้ามา*********
    } catch(err){
        return res.status(401).json({success: false, msg: "Cannot convert email or password to string"});
    }
    //********ที่เพิ่มเข้ามา*********
}

//Get token from model, create cookie and send response
const sendTokenResponse=(user, statusCode, res)=>{
    //Create token
    const token=user.getSignedJwtToken();
    const options = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };
    console.log(options.expires);
    if(process.env.NODE_ENV==='production') {
        options.secure=true;
    }

    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    });
}

//At the end of file
//@desc Get current Logged in user
//@route POST /api/vl/auth/me
//@access Private
exports.getMe = async (req, res, next) => {
    const user=await User.findById(req.user.id);
    res.status (200).json({
        success: true,
        data: user
    });
};

//@desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout=async(req,res,next)=>{
    res.cookie('token','none',{
        expires: new Date(Date.now()+ 10*1000),
        httpOnly:true
    });
    res.status(200).json({success:true,data:{}});
};