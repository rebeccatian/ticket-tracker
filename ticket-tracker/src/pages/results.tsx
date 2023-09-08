import { useSearchParams } from "next/navigation"
import Link from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps, useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { ThemeProvider } from "@mui/material/styles";
import theme from '../styles/muiOverrides'

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
            url: string
        }
    ]
}

interface TableType {
    id: number,
    lowestPrice: string,
    venue: string,
    location: string,
    date: string,
    link: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
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
            })
        console.log('fetch')
        }
    }, [artist])

    const renderLink = (data: GridRenderCellParams<EventsType>) => {
        return <a className="underline text-orange-700" href={data.value?.url}>SeatGeek Link</a>
    }

    const columns: GridColDef[] = [
        { 
            field: 'lowestPrice', 
            headerName: 'Lowest Price',
            flex: 0.8,
        },
        {
            field: 'venue',
            headerName: 'Venue',
            flex: 1,
        },
        {
            field: 'location',
            headerName: 'Location',
            flex: 1,
        },
        {
            field: 'date',
            headerName: 'Date',
            flex: 0.5,
        },
        {
            field: 'link',
            headerName: 'Link',
            renderCell: renderLink,
            flex: 1,
        }
      ];

    const createRow = () => {
        let array: TableType[] = []
        result?.events.map((event, index) => {
            const date = event.datetime_local.split('T');
            array[index] = {
                id: index,
                lowestPrice: `$${event.stats.lowest_price}`,
                venue: event.venue.name,
                location: `${event.venue.city}, ${event.venue.state}, ${event.venue.country}`,
                date: date[0],
                link: event
            }
        })
        
        return array;
    };

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    return (
        <div className="mx-12 my-5 space-y-2">
            <Link href="/">Home</Link>
            <main className="flex space-x-10">
                <div className="w-6/12">
                    <ThemeProvider theme={theme}>
                        <DataGrid
                            sx={{ color: 'white' }}
                            columns={columns}
                            rows={createRow()}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            getRowHeight={() => 'auto'}
                            checkboxSelection={true}
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                setRowSelectionModel(newRowSelectionModel);
                            }}
                            rowSelectionModel={rowSelectionModel}
                        />
                    </ThemeProvider>
                </div>
                <form>
                    <label>Min. Price</label>
                </form>
            </main>
        </div>
    )
}