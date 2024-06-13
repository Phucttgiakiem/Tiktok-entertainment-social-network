import likeService from "../services/likepostService";
import { getIo } from '../socket'; // Import io from server.js
let AddLikepost = async (req,res) => {
    let idUser = req.body.iduser;
    let idPost = req.body.idpost;
    if(!idUser || !idPost){
        return res.status(500).json({
            errCode : 4,
            message : "all inputs parameter is imperative!"
        });
    }
    console.log(idUser+" "+idPost+"like");
    try{
        let resultLike = await likeService.AddLikepost(idPost,idUser);
        let Like = {
            idpost : idPost,
            iduser : idUser
        }
        if(resultLike.errCode === 0){
            try {
                const io = getIo(); // Get the initialized io instance
                io.emit("Server_send_like",Like);
            } catch (socketError) {
                    console.log('Socket error:', socketError);
                    return res.status(500).json({
                    errCode: 1,
                    message: "Socket error"
                    });
                }
            }
            return res.status(200).json({
                errCode:resultLike.errCode,
                message:resultLike.errMessage
            });
    } catch(err){
        return res.status(500).json({
            errCode: 1,
            message: "Internal server error"
        });
    }
}
let RemoveLikepost = async (req,res) => {
    let idUser = req.body.iduser;
    let idPost = req.body.idpost;
    console.log(idUser+" "+idPost+"unlike");
    if(!idUser || !idPost){
        return res.status(500).json({
            errCode : 4,
            message : "all inputs parameter is imperative!"
        });
    }
    let resultLike = await likeService.RemoveLikepost(idPost,idUser);
    let Like = {
        idpost : idPost,
        iduser : idUser
    }
    if(resultLike.errCode === 0){
        try {
            const io = getIo(); // Get the initialized io instance
            io.emit("Server_send_deletelike",Like);
          } catch (socketError) {
            console.log('Socket error:', socketError);
            return res.status(500).json({
              errCode: 1,
              message: "Socket error"
            });
        }
    }
    return res.status(200).json({
        errCode:resultLike.errCode,
        message:resultLike.errMessage,
    });
}
let CheckLikepostUser = async (req,res) => {
    let idUser = req.body.iduser;
    let idPost = req.body.idpost;
    if(!idUser || !idPost){
        return res.status(500).json({
            errCode : 4,
            message : "all inputs parameter is imperative!"
        });
    }
    let resultLike = await likeService.CheckLikeofUser(idPost,idUser);
    return res.status(200).json({
        errCode:resultLike.errCode,
        message:resultLike.errMessage,
        data:resultLike.data
    });
}
module.exports = {
    AddLikepost:AddLikepost,
    RemoveLikepost:RemoveLikepost,
    CheckLikepostUser:CheckLikepostUser
}