import prisma from '../../../../lib/prisma';

// POST /api/post
export default async function handle(req, res) {
    const { email, inputEvents } = req.body;

    const result = await prisma.user.upsert({
        where: { email: email},
        update: {
            events: {
                createMany: {
                    data: inputEvents
                }
            }
        },
        create: {
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