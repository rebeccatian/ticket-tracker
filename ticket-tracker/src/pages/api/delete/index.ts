import prisma from '../../../../lib/prisma';

// DELETE /api/delete
export default async function handle(req, res) {
    const { email, inputEvents } = req.body;

    const result = await prisma.user.update({
        where: {email: email},
        data: {
            events: {
                deleteMany: inputEvents
            }
        }
    });
    res.json(result);
}