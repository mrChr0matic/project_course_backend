const {PrismaClient}= require('@prisma/client');
const prisma = new PrismaClient();

const joinComm = async (req,res)=>{
    try{
        const body= req.body;
        if(!req.user.userId || !body.communityId)
            return res.status(400).json({error : "fields missing userId, commId"});
        const membership = await prisma.membership.create({
            data : {
                userId : req.user.userId,
                communityId : body.communityId
            }
        });
        res.status(200).json(membership);
    }
    catch(err){
        return res.status(400).json({error : err.message})
    }
}


module.exports = {joinComm}