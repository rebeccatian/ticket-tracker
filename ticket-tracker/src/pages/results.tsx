import { useSearchParams } from "next/navigation"
import Link from "next/link";
import { useEffect, useState } from "react";
import ResultsDisplay, { buttonClasses } from "@/components/resultsDisplay";
import Router from "next/router";
import { GridRowSelectionModel } from "@mui/x-data-grid/models";


export interface EventsType {
    events: EventType[]
}

export interface EventType {
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


    const [selected, setSelected] = useState<GridRowSelectionModel>([]);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [events, setEvents] = useState<EventType[]>();
    const [targetPrice, setTargetPrice] = useState('');
    const [email, setEmail] = useState('');

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const inputEvents = events.map(item => {
            return {
                eventId: item.id.toString(), 
                price: item.stats.lowest_price,
                targetPrice: parseInt(targetPrice)
            }
        })

        try {
          const body = { email, inputEvents };
          await fetch('/api/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          console.log('success!');
          await Router.push('/');
        } catch (error) {
          console.error(error);
        }
    };

    return (
        <div className="md:mx-12 md:my-5 space-y-4">
            <Link className={buttonClasses}href="/">Search Again</Link>
            <ResultsDisplay 
                result={result}
                onSelectEvents={(newRowSelectionModel) => {
                    setSelected(newRowSelectionModel);
                    if (!disableSubmit) {
                        setDisableSubmit(true);
                    }
                }}
                selected={selected}
                disableSubmit={disableSubmit}
                onSubmitEvents={() => {
                    setEvents(result?.events.filter((event, index) => selected.includes(index)));
                    setDisableSubmit(false);
                }}
                onEnterPrice={event => setTargetPrice(event.target.value)}
                onEnterEmail={event => setEmail(event.target.value)}
                email={email}
                targetPrice={targetPrice}
                onSubmitEmail={submitData}
            />
        </div>
    )

}