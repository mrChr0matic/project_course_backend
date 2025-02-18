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
        console.log(JWT_SECRET)
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
        const {username, email, password}=req.body;
        const hashPass = await bcrypt.hash(password,10)
        const user = await prisma.user.create({
            data : {
                username,
                email,
                password : hashPass,
            }
        })
        return res.status(201).json(user);
    }
    catch (err){
        return res.status(400).json({error:err.message});
    }
}


module.exports={userLogin,userRegister}