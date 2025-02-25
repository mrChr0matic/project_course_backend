const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userVote = async (req, res) => {
    try {
        const { postId, voteType } = req.body;
        const userId = req.user.userId;

        console.log(postId);

        if (!userId || !postId || !["upvote", "downvote"].includes(voteType)) 
            return res.status(400).json({ error: "Invalid input" });

        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_postId: { userId, postId }
            }
        });
        let updateData = {};
        if (!existingVote) {
            await prisma.vote.create({
                data: {
                    userId,
                    postId,
                    voteType
                }
            });

            updateData[voteType === "upvote" ? "upvotes" : "downvotes"] = {
                increment: 1
            };
        } 
        else if (existingVote.voteType === voteType) {
            await prisma.vote.delete({
                where: { id: existingVote.id }
            });

            updateData[voteType === "upvote" ? "upvotes" : "downvotes"] = {
                decrement: 1
            };
        } 
        else {
            await prisma.vote.update({
                where: { id: existingVote.id },
                data: { voteType }
            });

            updateData = {
                upvotes: voteType === "upvote" ? { increment: 1 } : { decrement: 1 },
                downvotes: voteType === "downvote" ? { increment: 1 } : { decrement: 1 }
            };
        }
        await prisma.post.update({
            where: { id: postId },
            data: updateData
        });
        return res.status(200).json({ message: "Vote updated successfully" });
    } 
    catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { userVote };
