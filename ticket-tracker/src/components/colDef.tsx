import { EventType } from "../pages/results";
import { GridRenderCellParams, GridColDef } from "@mui/x-data-grid/models";

const renderLink = (data: GridRenderCellParams<EventType[]>) => {
    return <a className="underline text-orange-700" href={data.value?.url}>SeatGeek Link</a>
}

export const columns: GridColDef[] = [
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
        flex: 1,
    },
    {
        field: 'link',
        headerName: 'Link',
        renderCell: renderLink,
        flex: 1,
    }
  ];
