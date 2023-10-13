import prisma from '../../../../lib/prisma';
import Prism, { Prisma } from '@prisma/client';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
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