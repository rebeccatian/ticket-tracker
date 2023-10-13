import { DataGrid, GridCallbackDetails, GridRowSelectionModel } from '@mui/x-data-grid';
import InputTextField from "@/components/input";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AnchorHTMLAttributes, ChangeEventHandler, DetailedHTMLProps, Fragment, MouseEventHandler, useState } from "react";
import { columns } from './colDef';
import { EventsType, EventType } from '../pages/results';


export interface TableType {
    id: number;
    lowestPrice: string;
    artist?: string;
    venue: string;
    location: string;
    date: string;
    link: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
}

export interface ResultsProps {
    result?: EventsType;
    results?: EventsType[];
    onSelectEvents?: (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails<any>) => void;
    selected: GridRowSelectionModel;
    disableSubmit?: boolean;
    onSubmitEvents?: MouseEventHandler<HTMLButtonElement>;
    targetPrice?: string;
    email?: string;
    onSubmitEmail?: MouseEventHandler<HTMLButtonElement>;
    onEnterPrice?: ChangeEventHandler<HTMLInputElement>;
    onEnterEmail?: ChangeEventHandler<HTMLInputElement>
}

export const buttonClasses = "border px-2 py-1 rounded-sm transition ease-in-out duration-300 border-stone-500 enabled:hover:opacity-80 enabled:hover:bg-orange-700 enabled:hover:text-black";

export default function ResultsDisplay({ result, results, onSelectEvents, selected, disableSubmit, 
    onSubmitEvents, onSubmitEmail, targetPrice, email, onEnterPrice, onEnterEmail }
    : ResultsProps) {

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
                        onRowSelectionModelChange={onSelectEvents}
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
                                        onClick={onSubmitEvents}
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
                                onChange={onEnterPrice}
                                value={targetPrice}
                            />
                            <InputTextField
                                disabled={disableSubmit}
                                label="Email"
                                placeholder="Eg: abcde@gmail.com"
                                onChange={onEnterEmail}
                                value={email}
                            />
                            <button 
                                disabled={disableSubmit} 
                                className={buttonClasses} 
                                onClick={onSubmitEmail}
                            >Submit</button>
                        </div>
                    </Fragment>
                )
                : (
                    <div className={`${disableSubmit ? 'opacity-100' : 'opacity-50'} space-y-6 min-w-[15%]`}>
                        <p className="font-bold text-lg">Update Events and Price</p>
                        <InputTextField
                            label="Price"
                            placeholder="Eg: 85"
                            onChange={onEnterPrice}
                            value={targetPrice}
                        />
                        <ul className="list-disc">
                        {
                            results.map((obj, index) => {
                                if (selected?.includes(index)) {
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
                        <p className={selected?.length > 0 ? 'hidden' : 'text-stone-300'}>Select the events you want to untrack</p>
                        <button
                            disabled={!disableSubmit}
                            className={buttonClasses} 
                            onClick={onSubmitEmail}
                        >
                            Submit
                        </button>
                    </div>
                )
            }
            
        </main>
    )
}