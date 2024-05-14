import Image from 'next/image'

//In order to use the link anchor feature;
import Link from 'next/link'

//buttonVariants {} from the components/ui section
//This would set the custom button: Comienza Ahora
import {buttonVariants} from "../components/ui/button"

//Importing icon react library
import {ArrowRight} from "lucide-react"

import MaxWidthWrapper from "./Components/MaxWidthWrapper";

//items: center is for Vertical Aligment
export default function Home() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">

      <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2  shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">
              DocuLeer ya esta disponible.
          </p>
      </div>
      <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
              Chatea con tu <span className='text-red-600'> Documento PDF </span> en tan solo segundos.
      </h1>

      <p className='mt-5 max-w-prose text-zinc-700 sm:text-lg'>
        DocuLeer te permitira tener cualquier tipo de conversación con tu documento de PDF. Solo asegurate de subir tu documento y comienza a hacer cualquier tipo de pregunta relacionada al documento. 

      </p>

      <Link className={buttonVariants({size: 'lg',className:'mt-5',})} href='/dashboard' target='_blank'>

        Comienza ahora <ArrowRight className='ml-2 h-5 w-5'/>
        
      </Link>

    </MaxWidthWrapper>
  )
}
