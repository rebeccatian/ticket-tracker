import prisma from '../../../../lib/prisma';

// PUT /api/put
export default async function handle(req, res) {
    const { email, inputEvents } = req.body;

    const result = await prisma.event.updateMany({
        where: { authorEmail: email },
        data: {
            targetPrice: inputEvents[0].targetPrice
        }
    });
    res.json(result);
}