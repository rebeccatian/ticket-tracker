import ResultsDisplay, { buttonClasses } from '../components/resultsDisplay';
import { Event } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import prisma from '../../lib/prisma';
import { EventsType, EventType } from './results';
import { GridRowSelectionModel } from '@mui/x-data-grid/models/gridRowSelectionModel';
import Router from 'next/router';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const selectedUser = await prisma.user.findUnique({
        where: {
          email: String(context.query.email),
        },
        include: {
            events: true
        }
    });
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
        console.log(results);
    }, [])

    const [selected, setSelected] = useState<GridRowSelectionModel>([]);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [targetPrice, setTargetPrice] = useState('');

    const updateData = async (e: React.SyntheticEvent, events: EventsType[]) => {
        e.preventDefault();
        const email = window.location.search.split('=')[1]

        const inputEvents = events.map(item => {
            return {
                id: item.events[0].id.toString(), 
                price: item.events[0].stats.lowest_price,
                targetPrice: parseInt(targetPrice)
            }
        })

        const body = { email, inputEvents };

        try {
          await fetch('/api/put', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          console.log('update price success!');
        } catch (error) {
          console.error(error);
        }

        try {
            await fetch('/api/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="md:mx-12 md:my-5 space-y-4">
            <button className={buttonClasses}>
                <Link href="/">Back to Search</Link>
            </button>
            <h1>Your Events</h1>
            {
                results?.length > 1 
                ? (
                    <ResultsDisplay 
                        selected={selected} 
                        results={results}
                        disableSubmit={disableSubmit}
                        onSelectEvents={(newRowSelectionModel) => {
                            setSelected(newRowSelectionModel);
                            if (!disableSubmit) {
                                setDisableSubmit(true);
                            }
                        }}
                        onEnterPrice={event => setTargetPrice(event.target.value)}
                        onSubmitEmail={event => {
                            const array = results.filter((obj, index) => selected.includes(index));
                            updateData(event, array);
                        }}
                        targetPrice={targetPrice}
                    />
                )
                : <p>No Results</p>
            }
        </div>
    )
}
