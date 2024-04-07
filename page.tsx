import Image from 'next/image'
import MaxWidthWrapper from "./Components/MaxWidthWrapper";

//items: center is for Vertical Aligment
export default function Home() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center">

      <div>
          Hello Mundo!
      </div>

    </MaxWidthWrapper>
  )
}
