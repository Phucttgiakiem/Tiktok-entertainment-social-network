import postService from  "../services/postService";

let GetAllPost = async(req,res) => {
    let userId = req.body.Iduser;
    let postData;
    if(userId){
        postData = await postService.GetPostwithUser(userId);
        //if(!postData.data || (Array.isArray(postData.data) && postData.data.length === 0) || (typeof postData.data === 'object' && Object.keys(postData.data).length === 0)) postData = await postService.GetAllPost();
    }
    else postData = await postService.GetAllPost();
    //console.log(postData);
    return res.status(200).json({
        errCode: postData.errCode,
        message: postData.errMessage,
        post: postData.data ? postData.data : {}
    })
}
module.exports = {
    GetAllPost : GetAllPost
}