import userService from "../services/userService";
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }
    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleRegister = async (req,res) => {
    let email = req.body.email;
    let password = req.body.password;
    let dateofbirth = req.body.dateofbirth;
    if (!email || !password || !dateofbirth){
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }
    let userData = await userService.handleUserRegister(email,password,dateofbirth);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleChoosePass = async (req,res) => {
    let email = req.body.email;
    let newpass = req.body.newpass;
    if(!email || !newpass){
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }
    let userData = await userService.handleUserChoosepass(email,newpass);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
module.exports = {
    handleLogin: handleLogin,
    handleRegister:handleRegister,
    handleChoosepass: handleChoosePass
}
