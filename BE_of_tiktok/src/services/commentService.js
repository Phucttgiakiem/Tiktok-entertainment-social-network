import db from "../models/index";
import {Op,Sequelize} from "sequelize";
import postService from "./postService";
import userService from "./userService";
import usergoogleService from "./usergoogleService";
import moment from "moment";
let GetCountcomment = (idpost) => {
    return new Promise (async(resolve,reject) => {
        try {
            let countcomment = await db.Comment.count({
                where: {PostID:idpost}
            })
            if(countcomment > 0) resolve(countcomment);
            else resolve(0);
        } catch (error) {
            reject(error)
        }
    });
}
let GetAllDetailcomment = (Checkpost,idpost) => {
    return new Promise (async(resolve,reject) => {
        try {
            let isExist = await Checkpost(idpost);
            let commentdata = {};
            if(isExist){
                
                let resultquery = await db.Comment.findAll({
                    where: {PostID:idpost}
                });
                let userid = resultquery.map(row => row.UserID);
                let Users = await userService.handleUserGetAllByID(userid);
                
                let userMap = Users.data.reduce((map, user) => {
                    map[user.id] = user;
                    return map;
                }, {});

                //get list IDUser from userMap was found User
                let foundUserIds = Object.keys(userMap);

                //search all IDUser wasn't found User
                let notFoundIds = userid.filter(id => !foundUserIds.includes(id));

                //search User in usergoogle table
                let thirdPartyUsers;
                if (notFoundIds.length > 0) {
                    thirdPartyUsers = await usergoogleService.handleGetAllUserwithID(notFoundIds);
                    foundUserIds = foundUserIds.concat(thirdPartyUsers.data.map(tpu => tpu.sub));
                }
                let usergMap = {}
                if(thirdPartyUsers){
                    usergMap = thirdPartyUsers.data.reduce((map,user) => {
                        map[user.sub] = user;
                        return map;
                    },{});
                }
                

                //mix two list user and usergoogle
                let newUser = {
                    ...userMap,
                    ...usergMap
                }

                let detailComments = resultquery.map(comment => ({
                    ...comment.dataValues,
                    user: newUser[comment.UserID]
                }));



                commentdata.errCode = 0;
                commentdata.errMessage = "OK";
                commentdata.data = detailComments;
            }else{
                commentdata.errCode = 1;
                commentdata.errMessage = 'Cannot found comment';
                commentdata.data = {};
            }
            resolve(commentdata);
        } catch(e){
            reject(e)
        }
    })
}
let HandleAddCommentPost = (Checkpost,idpost,idUser,contentcomment) => {
    return new Promise (async(resolve,reject) => {
        try{
            let commentData = {};
            let isExist = await Checkpost(idpost);
            if(isExist){
                let newComment = await db.Comment.create({
                    PostID : idpost,
                    UserID : idUser,
                    Content : contentcomment,
                    Timestamp : moment().format('YYYY-MM-DD HH:mm:ss')
                });
                //Get Info comment of user
                let user = await userService.handleUserGetByID(newComment.UserID);

                if(user.data == null){
                    user = await usergoogleService.handleGetUser(newComment.UserID);
                }
                
                let newcommentData = {
                    ...newComment.dataValues, // Spread existing properties of newComment
                    user: user.data, // Add user data
                };
                
                console.log(newcommentData);
               // create data response
                commentData.errCode = 0;
                commentData.errMessage = 'OK';
                commentData.data = newcommentData;
            }
            else {
                commentData.errCode = 1;
                commentData.errMessage = 'Update comment fail Please retry';
            }
            resolve(commentData);
        }catch(e){
            reject(e);
        }
    });
}
let HandleRemoveComment = (idComment) => {
    return new Promise (async(resolve,reject) => {
        try{
            let commentdata = {};
            let result = await db.Comment.destroy({
                where: {
                    id : idComment
                }
            });
            if (result > 0){
                commentdata.errCode = 0;
                commentdata.errMessage = 'OK';
            }else{
                commentdata.errCode = 1;
                commentdata.errMessage = "Cannot delete comment Please retry";
            }
            resolve(commentdata);
        }catch(e){
            reject(e);
        }
    })
}

module.exports = {
    GetCountcomment : GetCountcomment,
    HandleAddCommentPost : HandleAddCommentPost,
    HandleRemoveComment : HandleRemoveComment,
    HandleGetAllDetailComment : GetAllDetailcomment
}