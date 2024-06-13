import commentService from "../services/commentService";
import postService from "../services/postService";
import usergoogleService from "../services/usergoogleService";
import { getIo } from '../socket'; // Import io from server.js
let PushCommentpost = async (req,res) => {
    let idpost = req.body.idpost;
    let comment = req.body.comment;
    let iduser = req.body.iduser;
    if (!idpost || !comment || !iduser) {
        return res.status(500).json({
            errCode: 1,
            message: "all inputs parameter is imperative!"
        });
    }
    try {
            let resultcomment = await commentService.HandleAddCommentPost(postService.Checkpost,idpost, iduser, comment);
            if (resultcomment.errCode == 0) {
                try {
                    const io = getIo(); // Get the initialized io instance
                    io.emit("Server_send", resultcomment.data);
                  } catch (socketError) {
                    console.log('Socket error:', socketError);
                    return res.status(500).json({
                      errCode: 1,
                      message: "Socket error"
                    });
                }
            }
            
            return res.status(200).json({
                errCode: resultcomment.errCode,
                message: resultcomment.errMessage,
                data: resultcomment.data
            });
    } catch (error) {
        return res.status(500).json({
            errCode: 1,
            message: "Internal server error"
        });
    }
}
let RemoveCommentpost = async (req,res) => {
    let idcomment = req.body.idcomment;
    if(!idcomment){
        return res.status(500).json({
            errCode: 1,
            message: "idcomment parameter is imperative"
        });
    }
    let result = await commentService.HandleRemoveComment(idcomment);
    if(result.errCode === 0){
        try {
            const io = getIo(); // Get the initialized io instance
            io.emit("Server_send_deletecomment",idcomment);
          } catch (socketError) {
            console.log('Socket error:', socketError);
            return res.status(500).json({
              errCode: 1,
              message: "Socket error"
            });
        }
    }
    return res.status(200).json({
        errCode: result.errCode,
        message: result.errMessage
    });
}
let GetAlldetailComment = async (req,res) => {
    let idpost = req.body.IDpost;
    if(!idpost){
        return res.status(500).json({
            errCode: 1,
            message: "idcomment parameter is imperative"
        });
    }
    let result = await commentService.HandleGetAllDetailComment(postService.Checkpost,idpost);
    return res.status(200).json({
        errCode: result.errCode,
        message: result.errMessage,
        data: result.data
    });
}
let GetCountComment = async (req,res) => {
    let idpost = req.body.IDpost;
    if(!idpost){
        return res.status(500).json({
            errCode: 1,
            message: "idcomment parameter is imperative"
        });
    }
    let result = await commentService.GetCountcomment(idpost);

        try {
            const io = getIo(); // Get the initialized io instance
            let newresult = {
                idpost: idpost,
                totalComments: result
            }
            io.emit("server_totalcomment", newresult);
            } catch (socketError) {
            console.log('Socket error:', socketError);
            return res.status(500).json({
                errCode: 1,
                message: "Socket error"
            });
        }
    
    return res.status(200).json({
        errCode: 0,
        message: "OK",
        data: result
    });
}
module.exports = {
    PushCommentpost:PushCommentpost,
    RemoveCommentpost:RemoveCommentpost,
    GetAlldetailComment:GetAlldetailComment,
    GetTotalComment:GetCountComment
}