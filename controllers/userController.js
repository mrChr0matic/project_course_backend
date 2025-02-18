const {PrismaClient}= require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt= require('bcryptjs');

const getUser = async(req,res) =>{
    try{
        const body = req.body;
        if(body.password)
            return res.status(400).json({error: "cant search with password"});
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    body.username ? { username: { contains: body.username, mode: "insensitive" } } : {},
                    body.email ? { email: { contains: body.email, mode: "insensitive" } } : {}
                ]
            },
            select: {
                id: true,
                username: true,
                email: true,
                memberships: true,
                posts: true,
            }
        })
        if(users.length==0)
            return res.status(201).json({error: "no users found"})
        return res.status(201).json(users)
    }
    catch(err){
        return res.status(400).json({error:err.message});
    }
}

const getSelf = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { 
                username : true, 
                email : true, 
                communities : true, 
                memberships : true, 
                posts : true 
            }
        });

        if (!user) 
            return res.status(404).json({ error: "User not found" });

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


module.exports={getUser,getSelf}