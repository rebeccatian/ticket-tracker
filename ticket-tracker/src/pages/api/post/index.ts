import prisma from '../../../../lib/prisma';

// POST /api/post
export default async function handle(req, res) {
    const { email, inputEvents } = req.body;

    const result = await prisma.user.create({
        data: {
            email: email,
            events: {
                createMany: {
                    data: inputEvents
                }
            }
        }
    });
    res.json(result);
}