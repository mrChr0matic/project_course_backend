const {PrismaClient}= require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken')


const JWT_SECRET = process.env.JWT_SECRET;

const userLogin = async (req,res) => {
    try{
        const body=req.body;
        if(!body.password || !body.username)
            return res.status(400).json({error: "input fields missing"});
        const user=await prisma.user.findFirst({
            where : {
                username : body.username
            }
        })
        if(!user) 
            return res.status(400).json({error: "user not found"});
        
        const validPass = await bcrypt.compare(body.password,user.password);
        console.log(validPass)
        if(!validPass)
            return res.status(401).json({error : "invalid login attempt"});
        const token = jwt.sign({userId: user.id},JWT_SECRET,{expiresIn : "1hr"})
        return res.status(200).json(token);
    }
    catch(err){
        return res.status(400).json({error : err.message})
    }
}

const userRegister = async(req,res) =>{
    try{
        const {username, email, password, profileImage}=req.body;
        const hashPass = await bcrypt.hash(password,10)
        const user = await prisma.user.create({
            data : {
                username,
                email,
                password : hashPass,
                profileImage
            }
        })
        return res.status(201).json(user);
    }
    catch (err){
        return res.status(400).json({error:err.message});
    }
}

const updatePfp = async(req,res) =>{
    try{
        const {profileImage} = req.body;
        if (!profileImage) 
            return res.status(400).json({ error: "No profile image provided" });
        const user = await prisma.user.update({
            where : {
                id : req.user.userId
            },
            data : {
                profileImage 
            }
        });
        return res.status(200).json(user);
    }
    catch(err){
        return res.status(400).json({error : err.message});
    }
}

module.exports={userLogin,userRegister,updatePfp}