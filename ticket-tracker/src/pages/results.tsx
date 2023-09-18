import { useSearchParams } from "next/navigation"
import Link from "next/link";
import { useEffect, useState } from "react";
import ResultsDisplay, { buttonClasses } from "@/components/resultsDisplay";


export interface EventsType {
    events: [
        {
            id: string,
            stats: {
                lowest_price: number
            },
            datetime_local: string,
            venue: {
                name: string,
                city: string,
                country: string,
                state: string
            },
            url: string,
            performers: [
                {
                    name: string
                }
            ]
        }
    ]
}

export default function Results() {
    const artist = useSearchParams().get('artist');
    const [result, setResult] = useState<EventsType>();
    const client_id = "MzYwMTY1NTl8MTY5Mjk5MTEwMy45NDA4NDI5"

    useEffect(() => {
        if (artist) {
            fetch(`https://api.seatgeek.com/2/events?client_id=${client_id}&performers.slug=${artist}&per_page=30`)
            .then(response => response.json())
            .then(data => {
                setResult(data);
                console.log(data);
            })
        }
    }, [artist])

    return (
        <div className="md:mx-12 md:my-5 space-y-4">
            <Link className={buttonClasses}href="/">Search Again</Link>
            <ResultsDisplay result={result} />
        </div>
    )

}