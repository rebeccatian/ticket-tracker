import prisma from '../../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { email } = req.body;

//   events.array.forEach(element => {
//     console.log(element);
//   });

  const result = await prisma.user.create({
    data: {
      email: email
    //   events: {
    //     createMany({
    //         data: [
    //             { name: 'Bob', email: 'bob@prisma.io' },
    //             { name: 'Bobo', email: 'bob@prisma.io' }, // Duplicate unique key!
    //             { name: 'Yewande', email: 'yewande@prisma.io' },
    //             { name: 'Angelique', email: 'angelique@prisma.io' },
    //         ]
    //     })
    //   }
    }
  });
  res.json(result);
}