import { useSearchParams } from "next/navigation"
import Events from "../components/seat-geek";

export default function Results() {
    const resultsParams = useSearchParams()
 
    const artist = resultsParams.get('artist')
    return (
        <Events artist={artist} />
    )
}