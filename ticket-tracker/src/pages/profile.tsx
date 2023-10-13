import ResultsDisplay, { buttonClasses } from '../components/resultsDisplay';
import { Event } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import prisma from '../../lib/prisma';
import { EventsType } from './results';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const selectedUser = await prisma.user.findUnique({
        where: {
          email: String(context.query.email),
        },
        include: {
            events: true
        }
    });
    console.log('query');
    return {
        props: { selectedUser },
    }
};

export default function Profile ({ selectedUser } : InferGetServerSidePropsType<typeof getServerSideProps>) {
    const client_id = "MzYwMTY1NTl8MTY5Mjk5MTEwMy45NDA4NDI5";
    let testing: EventsType[] = [];
    const [results, setResults] = useState<EventsType[]>([]);

    async function fetchData(selectedEvents) {

        Promise.all(selectedEvents.events.map(async (event: Event, index: number) => {
            const { id } = event;
            const data = await fetch(`https://api.seatgeek.com/2/events?client_id=${client_id}&id=${id}`);
            const data_1 = await data.json();
            return testing[index] = data_1;
        })).then(data => setResults(testing))
    }


    useEffect(() => {
        fetchData(selectedUser).catch(console.error);
        console.log(results)
    }, [])

    return (
        <div className="md:mx-12 md:my-5 space-y-4">
            <button className={buttonClasses}>
                <Link href="/">Back to Search</Link>
            </button>
            <h1>Your Events</h1>
            {
                results?.length > 1 
                ? (
                    <ResultsDisplay results={results}/>
                )
                : <p>No Results</p>
            }
        </div>
    )
}
