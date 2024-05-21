//router navigation; 
import {useRouter, useSearchParams} from 'next/navigation'
//Getting the origin dashboard reference for th euser

const Page = () => {

    const router = useRouter()
    const searchParams = useSearchParams()
    const origin = searchParams.get('orgin')

    

}

export default Page