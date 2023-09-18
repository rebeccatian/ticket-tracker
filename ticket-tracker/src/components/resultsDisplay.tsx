import { EventsType } from "@/pages/results";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import InputTextField from "@/components/input";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AnchorHTMLAttributes, DetailedHTMLProps, Fragment, useState } from "react";


export interface TableType {
    id: number,
    lowestPrice: string,
    artist?: string,
    venue: string,
    location: string,
    date: string,
    link: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
}

export const buttonClasses = "border px-2 py-1 rounded-sm transition ease-in-out duration-300 border-stone-500 enabled:hover:opacity-80 enabled:hover:bg-orange-700 enabled:hover:text-black";

export default function ResultsDisplay({ result, results }: {result?: EventsType, results?: EventsType[]}) {
    const renderLink = (data: GridRenderCellParams<EventsType>) => {
        return <a className="underline text-orange-700" href={data.value?.url}>SeatGeek Link</a>
    }

    const columns: GridColDef[] = [
        { 
            field: 'lowestPrice', 
            headerName: 'Lowest Price',
            flex: 0.8,
            sortable: false
        },
        {
            field: 'artist',
            headerName: 'Artist',
            flex: 1,
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
        if (!results) {
            result?.events.map((event, index) => {
                const date = event.datetime_local.split('T');
                const price = event.stats.lowest_price === null ? 'Not Available' : `$${event.stats.lowest_price}`
                array[index] = {
                    id: index,
                    lowestPrice: `${price}`,
                    venue: event.venue.name,
                    location: `${event.venue.city}, ${event.venue.state}, ${event.venue.country}`,
                    date: date[0],
                    link: event
                }
            })
        }
        else {
            results.map((obj, index) => {
                    const date = obj.events[0].datetime_local.split('T');
                    const price = obj.events[0].stats.lowest_price === null ? 'Not Available' : `$${obj.events[0].stats.lowest_price}`
                    array[index] = {
                        id: index,
                        lowestPrice: `${price}`,
                        venue: obj.events[0].venue.name,
                        location: `${obj.events[0].venue.city}, ${obj.events[0].venue.state}, ${obj.events[0].venue.country}`,
                        date: date[0],
                        link: obj.events[0],
                        artist: obj.events[0].performers[0].name
                    }
                })
        }
        
        return array;
    };

    const [selected, setSelected] = useState<GridRowSelectionModel>([]);
    const [targetPrice, setTargetPrice] = useState('');
    const [email, setEmail] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(true);
    const profile = results ? true : false

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });

    return (
        <main className="flex space-x-10">
            <div className="min-w-full md:min-w-[60%] space-y-3">
                <p className="text-slate-200">
                    {
                        !results 
                        ? 'Select which events you want to track then enter the price you want and an email to notify you at. You will receive an email when any of the selected events hit the price you want.' 
                        : 'Select which events you want to no longer track then hit Submit to update.'
                    }
                </p>
                <ThemeProvider theme={darkTheme}>
                    <DataGrid
                        autoHeight
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
                            setSelected(newRowSelectionModel);
                            if (!disableSubmit) {
                                setDisableSubmit(true);
                            }
                        }}
                        rowSelectionModel={selected}
                        columnVisibilityModel={{
                            artist: profile
                        }}
                    />
                </ThemeProvider>
            </div>
            {
                !results 
                ? (
                    <Fragment>
                        <div className={`${disableSubmit ? 'opacity-100' : 'opacity-50'} space-y-6 min-w-[15%]`}>
                            <p className="font-bold text-lg">Selected Events</p>
                            <ul className="list-disc">
                            {
                                result?.events.map((item, index) => {
                                    if (selected.includes(index)) {
                                        return (
                                            <li key={item.id}>
                                                <p className="font-semibold">{item.venue.name}</p>
                                                <div className="flex space-x-2">
                                                    <p>${item.stats.lowest_price}</p>
                                                    <p>{item.datetime_local.split('T')[0]}</p>
                                                </div>
                                            </li>
                                        );
                                    }
                                })
                            }
                            </ul>
                            {
                                selected.length > 0 
                                ? ( 
                                    <button 
                                        disabled={!disableSubmit}
                                        className={buttonClasses} 
                                        onClick={() => {
                                            const array = result?.events.filter((event, index) => selected.includes(index));
                                            console.log(array);
                                            setDisableSubmit(false);
                                        }}
                                    >
                                        Next
                                    </button>
                                ) : <p className="text-stone-300">Select the events you want to track</p>
                            }
                        </div>
                        <div className={`${disableSubmit ? 'opacity-50' : 'opacity-100'} space-y-6`}>
                            <p className="font-bold text-lg">Price to Notify</p>
                            <InputTextField
                                disabled={disableSubmit}
                                label="Price"
                                placeholder="Eg: 85"
                                onSubmit={event => {console.log(targetPrice)}}
                                onChange={event => setTargetPrice(event.target.value)}
                                value={targetPrice}
                            />
                            <InputTextField
                                disabled={disableSubmit}
                                label="Email"
                                placeholder="Eg: abcde@gmail.com"
                                onSubmit={event => {console.log(email)}}
                                onChange={event => setEmail(event.target.value)}
                                value={email}
                            />
                            <button disabled={disableSubmit} className={buttonClasses} onClick={() => {console.log(targetPrice); console.log(email); console.log(selected)}}>Submit</button>
                        </div>
                    </Fragment>
                )
                : (
                    <div className={`${disableSubmit ? 'opacity-100' : 'opacity-50'} space-y-6 min-w-[15%]`}>
                        <p className="font-bold text-lg">Unfollowed Events</p>
                        <ul className="list-disc">
                        {
                            results.map((obj, index) => {
                                if (selected.includes(index)) {
                                    return (
                                        <li key={obj.events[0].id}>
                                            <p className="font-semibold">{obj.events[0].performers[0].name}</p>
                                            <p className="font-semibold">{obj.events[0].venue.name}</p>
                                            <div className="flex space-x-2">
                                                <p>${obj.events[0].stats.lowest_price}</p>
                                                <p>{obj.events[0].datetime_local.split('T')[0]}</p>
                                            </div>
                                        </li>
                                    );
                                }
                            })
                        }
                        </ul>
                        {
                            selected.length > 0 
                            ? ( 
                                <button 
                                    disabled={!disableSubmit}
                                    className={buttonClasses} 
                                    onClick={() => {
                                        const array = result?.events.filter((event, index) => selected.includes(index));
                                        console.log(array);
                                        setDisableSubmit(false);
                                    }}
                                >
                                    Submit
                                </button>
                            ) : <p className="text-stone-300">Select the events you want to untrack</p>
                        }
                    </div>
                )
            }
            
        </main>
    )
}