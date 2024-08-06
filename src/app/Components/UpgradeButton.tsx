'use client'

//Marking this as use client Component
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { trpc } from "../_trpc/client"

const UpgradeButton = () => {

  //Destrucing it.. 
  //invocking this function on the button below;
  const {mutate: createStripeSession} = trpc.createStripeSession.useMutation({
      onSuccess: ({url}) => {
        window.location.href = url ?? '/dashboard/billing'

      }
  })

    //From Upgrade Now to Actualizate Ahora.
    return (
        <Button onClick={() => createStripeSession()} className='w-full'> 
          Actualizate Ahora <ArrowRight className='h-5 w-5 ml-1.5'/>
        
        </Button>
    )
}

export default UpgradeButton