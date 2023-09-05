import Link from "next/link";
import { useEffect, useState } from "react";

interface EventsType {
    events: [
        {
            id: string,
            stats: {
                lowest_price: number
            },
            venue: {
                name: string
            }
        }
    ]
}


export default function Events({ artist } : { artist : string | undefined | null}) {
    const [result, setResult] = useState<EventsType>();
    const client_id = "MzYwMTY1NTl8MTY5Mjk5MTEwMy45NDA4NDI5"
    useEffect(() => {
        fetch(`https://api.seatgeek.com/2/events?client_id=${client_id}&performers.slug=${artist}`)
            .then(response => response.json())
            .then(data => {
                setResult(data);
                console.log(data);
            })
        console.log('working')
    }, [artist]);

    return (
        <div>
            <Link href="/">Home</Link>
            <ul>
                {
                    result?.events?.map(event => {
                        return (
                            <li className="border p-2" key={event.id}>
                                <h2>{event.venue.name}</h2>
                                <h3>{`Lowest ticket price: ${event.stats.lowest_price}`}</h3>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
};