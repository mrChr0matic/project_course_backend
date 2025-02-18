const {PrismaClient}= require('@prisma/client');
const { connect } = require('http2');
const prisma = new PrismaClient();

const addPost = async (req,res) =>{
    try{
        const {title, content, communityId} = req.body;
        if(!title || !content || !communityId)
            return res.status(400).json({error : "post mandatory input fields missing"});   
        const post = await prisma.post.create({
            data : {
                title,
                content,
                author : { connect : {id : req.user.userId}},
                community : { connect : {id : communityId}}
            }
        });
        return res.status(200).json(post);
    }
    catch(err) {
        return res.status(400).json({error : err.message});
    }
}

const getPosts = async (req,res) =>{
    try{
        const posts= await prisma.post.findMany({
            orderBy : {
                createdAt : 'desc'
            },
            include: {
                author: { select: { id: true, username: true } }, 
                community: { select: { id: true, name: true } },
            }
        });
        return res.status(200).json(posts);
    }
    catch(err){
        return res.status(400).json({error : err.message});
    }
}

module.exports={addPost,getPosts}