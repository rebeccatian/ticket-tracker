import { useSearchParams } from "next/navigation"
import Link from "next/link";
import { ChangeEventHandler, useEffect, useState } from "react";

export interface EventsType {
    events: [
        {
            id: string,
            stats: {
                lowest_price: number
            },
            venue: {
                name: string,
                city: string,
                country: string,
                state: string
            }
        }
    ]
}

export default function Results() {

    const artist = useSearchParams().get('artist');
    const [result, setResult] = useState<EventsType>();
    const [selected, setSelected] = useState<string []>([]);
    const client_id = "MzYwMTY1NTl8MTY5Mjk5MTEwMy45NDA4NDI5"

    useEffect(() => {
        if (artist) {
            fetch(`https://api.seatgeek.com/2/events?client_id=${client_id}&performers.slug=${artist}`)
            .then(response => response.json())
            .then(data => {
                setResult(data);
            })
        console.log('fetch')
        }
    }, [artist])

    const handleOnCheck: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.target.checked !== false) {
            setSelected(prevState => [
                ...prevState,
                event.target.id
            ])
        } 
        else {
            setSelected(prevState => prevState.filter(option => option !== event.target.id));
        }
    }

    return (
        <div className="mx-12 my-5 space-y-2">
            <Link href="/">Home</Link>
            <main className="flex space-x-10">
                <ul>
                    {
                        result?.events?.map(event => {
                            return (
                                <li className="border p-2 flex justify-evenly" key={event.id}>
                                    <label htmlFor={event.id}>
                                        <p>{event.venue.name}</p>
                                        <p>{`${event.venue.city}, ${event.venue.state}, ${event.venue.country}`}</p>
                                        <p>{`Lowest ticket price: ${event.stats.lowest_price}`}</p>
                                    </label>
                                    <input id={event.id} type="checkbox" onChange={handleOnCheck}/>
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        result?.events?.filter(item => selected.includes(`${item.id}`)).map(option => <li key={option.id}>{option.venue.name}</li>)
                    }
                </ul>
                <form>
                    <label>Min. Price</label>
                </form>
            </main>
        </div>
    )
}