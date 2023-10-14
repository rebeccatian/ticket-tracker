import prisma from '../../../../lib/prisma';

// PUT /api/put
export default async function handle(req, res) {
    const { email } = req.body;
    let price = 0;
    if (req.body.inputPrice) {
        price = req.body.inputPrice
    }
    else {
        price = req.body.inputEvents[0].targetPrice
    }

    const result = await prisma.event.updateMany({
        where: { authorEmail: email },
        data: {
            targetPrice: price
        }
    });
    res.json(result);
}