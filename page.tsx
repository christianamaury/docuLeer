import Image from 'next/image'

//In order to use the link anchor feature;
import Link from 'next/link'

//buttonVariants {} from the components/ui section
//This would set the custom button: Comienza Ahora
import {buttonVariants} from "../components/ui/button"

//Importing icon react library
import {ArrowRight} from "lucide-react"

import MaxWidthWrapper from "./Components/MaxWidthWrapper";

//aria-hidde value on the className true is for device screen readers.. 

//items: center is for Vertical Aligment
export default function Home() {
  return (
    <>

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

      {/* Value Reference Section */}
       <div>
          <div className='relative isolate'>
            <div aria-hidden='true' className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3 3xl sm: -top-80'>
              <div style={{
                clipPath: "polygon(50% 0%, 60.4% 10.4%, 70.7% 20.7%, 80.9% 30.9%, 91.1% 41.1%, 94.3% 50%, 91.1% 58.9%, 80.9% 69.1%, 70.7% 79.3%, 60.4% 89.6%, 50% 100%, 39.6% 89.6%, 29.3% 79.3%, 19.1% 69.1%,  8.9% 58.9%, 5.7% 50%, 8.9% 41.1%, 19.1% 30.9%, 29.3% 20.7%, 39.6% 10.4%)",
                

              }} className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#ffffff] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'>

              </div>
  
            </div>

            <div>
                  <div className='mx-auto max-w-6xl px-6 lg:px-8'>

                    <div className='mt-16 flow-root sm:mt-24'>
                        <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                        <Image src='/dashboard-preview.jpg' 
                        alt='Reference of our Product'
                        width={1364} 
                        height={866}
                        quality={100}
                        className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2x1 ring-1 ring-gray-900/10'
                        />
                        </div>

                    </div>

                  </div>
              </div>  

              <div aria-hidden='true' className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3 3xl sm: -top-80'>
                  <div style={{
                    clipPath: "polygon(50% 0%, 60.4% 10.4%, 70.7% 20.7%, 80.9% 30.9%, 91.1% 41.1%, 94.3% 50%, 91.1% 58.9%, 80.9% 69.1%, 70.7% 79.3%, 60.4% 89.6%, 50% 100%, 39.6% 89.6%, 29.3% 79.3%, 19.1% 69.1%,  8.9% 58.9%, 5.7% 50%, 8.9% 41.1%, 19.1% 30.9%, 29.3% 20.7%, 39.6% 10.4%)",
                    

                  }} className='relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#ffffff] opacity-20 sm:left-[calc(50%-37rem)] sm:w-[72.1875rem]'>

                  </div>
              </div>
            

          </div>
       </div>

      {/* Product Features Section */}
        <div className='mx-auto mg-32 mt-32 max-w-5xl sm:mt-56'>
          <div className='mb-12 px-6 lg:px-8'>
  
              <div className='mx-auto max-w-2xl sm:text-center '>
                  <h2 className='mt-2 font-bold text-4xl text-gray-900 sm:text-5xl'>
                      Chatea en tan solo segundos! 
                  </h2>
                  <p className='mt-4 text-lg text-gray-600'>
                    Simplemente más facil que nunca. 

                  </p>
              </div>
          </div>

         {/* Steps to */}
          <ol className='my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0'>
             <li className='md:flex-1'>
              <div className='flex flex-col space-y-2 border-1-4 border-zinc-300 py-2 pl-4 md:border-1-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-red-600'> Primer Paso </span>
                  <span className='text-xl font-semibold'> Registrate ahora </span>
                  <span className='mt-2 text-zinc-700'> </span>
                  Empieza con nuestro plan gratuioto or seleciona nuestro {''} <Link href='/pricing' className='text-red-700 underline underline-offset-2'> plan pro </Link> .
              </div>
            </li>

              <li className='md:flex-1'>
              <div className='flex flex-col space-y-2 border-1-4 border-zinc-300 py-2 pl-4 md:border-1-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-red-600'> Segundo Paso </span>
                  <span className='text-xl font-semibold'> Sube tu documento de PDF! </span>
                  <span className='mt-2 text-zinc-700'> </span>
                  Procesaremos tu documento para que este listo
              </div>
            </li>  

               <li className='md:flex-1'>
              <div className='flex flex-col space-y-2 border-1-4 border-zinc-300 py-2 pl-4 md:border-1-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-red-600'> Tercer Paso </span>
                  <span className='text-xl font-semibold'> Pregunta cualquier pregunta! </span>
                  <span className='mt-2 text-zinc-700'> </span>
                  Más facil que nunca. Listo! Pregunta cualquier tipo de pregunta relacionada a tu documento.
              </div>
            </li>                     

          </ol>

          <div className='mx-auto max-w-6xl px-6 lg:px-8'>

              <div className='mt-16 flow-root sm:mt-24'>
                  <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                  <Image src='/file-upload-preview.jpg' 
                  alt='Upload Preview Image'
                  width={1419} 
                  height={732}
                  quality={100}
                  className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2x1 ring-1 ring-gray-900/10'
                  />
                  </div>

              </div>

          </div>

        </div>

    </>
  )
}
