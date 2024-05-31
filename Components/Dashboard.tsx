
//UploadButton would be an entire upload button module, sort of a component;
import UploadButton from '../Components/UploadButton'
import {trpc} from '@/app/_trpc/client'

const Dashboard = () => {
    // return (<div> Hello Sr. </div>)

    //Reference of our getUSerFile Query; 
    //Automaticallys knows the endpoint data values;
    const {data: files, isLoading} = trpc.getUserFiles.useQuery()
   
    return (
        <main className='mx-auto max-w-7xl md:p-10'>
            <div className = 'mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
                <h1 className='mb-3 font-bold text-5xl text-gray-900'>
                    Mis Documentos
                </h1>

                <UploadButton/>

            </div>

            {/* Display all users Files */}
            {files && files?.length !== 0 ? (
                <div> </div>
            ) : isLoading ? (
                <div> </div>

            ) : (
                <div> </div>
            )}

        </main>
    )
}

export default Dashboard