import db from "../models/index";
import {Op,Sequelize} from "sequelize";
import followService from "./followService";
import LikepostService from "./likepostService";
import CommentService from "./commentService";
import UserService from "./userService";
import UserGService from "./usergoogleService";
let GetPostwithfollowUser = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let postData = {};
            let post = [];
            let isExist = await checkUserId(idUser);
            if (isExist) {
                let userFollow = await followService.GetAllFollowofUser(idUser);
                if (userFollow.data && userFollow.data.length > 0) {
                    for (const userfollow of userFollow.data) {
                        let resultpost = await GetPostwithUserId(userfollow.userID);
                        if (resultpost) {
                            let newdatapost = {
                                idpost: resultpost.data.id,
                                userID: resultpost.data.UserID,
                                content: resultpost.data.Content,
                                mediaURL: resultpost.data.MediaURL,
                                formatvideo: resultpost.data.Formatvideo,
                                hashtabvideo: resultpost.data.Hashtabvideo,
                                namemusicvideo: resultpost.data.Namemusicvideo
                            }
                            let likepost = await LikepostService.GetAllLikepost(newdatapost.idpost);
                            newdatapost.alllike = likepost;
                        
                            let userinfo = await UserGService.handleGetUser(newdatapost.idpost);
                            if(userinfo.data == {}){
                               userinfo = await UserService.handleUserGetByID(newdatapost.userID);
                            }
                            let commentpost = await CommentService.GetCountcomment(newdatapost.idpost);
                            newdatapost.allcomment = commentpost;
                            newdatapost.userinfo = userinfo.data;
                            post.push(newdatapost);
                        }
                    }
                    postData.errCode = 0;
                    postData.errMessage = "OK";
                    postData.data = post;
                } else {
                    postData.errCode = 0;
                    postData.errMessage = "OK";
                    postData.data = [];
                }
            } else {
                postData.errCode = 1;
                postData.errMessage = "ID user can't found in database please check again";
                postData.data = [];
            }
            resolve(postData);
        } catch (e) {
            reject(e);
        }
    });
}

let GetPostwithUserId = (idUser) => {
    return new Promise(async(resolve,reject) => {
        try{
            let postDatauserId = {};
            let post = await db.Post.findOne({
                where: {UserID:idUser},
                order: [['Timestamp', 'DESC']],
                raw: true
            });
            postDatauserId.errCode = 0;
            postDatauserId.errMessage = 'OK';
            if(post){
                postDatauserId.data = post;
            }
            else postDatauserId.data = {}
            resolve(postDatauserId);
        }catch(e){
            reject(e);
        }
    })
}
let GetAllPost = () => {

    return new Promise(async(resolve,reject) => {
        try{
            let postData = {};
            
            const subqueryResult = await db.Post.findAll({
                attributes: [
                    [Sequelize.fn('MAX', Sequelize.col('id')), 'id']
                ],
                group: ['UserID'],
                raw: true
            });

            // Trích xuất các ID từ kết quả của subquery
            const postIds = subqueryResult.map(row => row.id);

            // Truy vấn chính để lấy chi tiết của post mới nhất cho mỗi user
            let post = await db.Post.findAll({
                where: {
                    id: {
                        [Op.in]: postIds
                    }
                },
                order: [['Timestamp', 'DESC']],
                raw: true
            });
            postData.errCode = 0;
            postData.errMessage = 'OK';
            let allpost = [];
            if(post){
                for (const postofuser of post) {
                    let newdatapost = {
                        idpost: postofuser.id,
                        userID: postofuser.UserID,
                        content: postofuser.Content,
                        mediaURL: postofuser.MediaURL,
                        formatvideo: postofuser.Formatvideo,
                        hashtabvideo: postofuser.Hashtabvideo,
                        namemusicvideo: postofuser.Namemusicvideo
                    }
                    let likepost = await LikepostService.GetAllLikepost(newdatapost.idpost);
                    newdatapost.alllike = likepost;
                
                    let commentpost = await CommentService.GetCountcomment(newdatapost.idpost);
                    newdatapost.allcomment = commentpost;

                    let userinfo = await UserService.handleUserGetByID(newdatapost.userID);
                    if(userinfo.data.length === 0){
                        userinfo = await UserGService.handleGetUser(newdatapost.userID);
                    }
                
                    newdatapost.userinfo = userinfo.data;
                    allpost.push(newdatapost);
                }
                postData.data = allpost;
            }
            else postData.data = {};
            resolve(postData);
        }catch(e){
            reject(e);
        }
    });
}
let checkUserId = (idUser) => {
    return new Promise(async(resolve,reject) => {
        try{
            let user = await db.User.findOne({
                where: {id:idUser}
            })
            if(user) resolve(true);
            else {
                user = await db.Usergoogle.findOne({
                    where: {sub:idUser}
                });
                if(user) resolve(true);
                else resolve(false);
            }
        }catch(e){
            reject(e)
        }
    })
}
let CheckPost = (idpost) => {
    return new Promise(async(resolve,reject) => {
        try{
            let result = await db.Post.findOne({where :{id:idpost}});
            if(result){
                resolve(true);
            }else{ 
                resolve(false);
            }
        }catch(e){
            reject(e);
        }
    });
}
module.exports = {
    GetPostwithUser : GetPostwithfollowUser,
    GetAllPost : GetAllPost,
    Checkpost: CheckPost
}