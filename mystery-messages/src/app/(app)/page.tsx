"use client"

import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/Messages.json"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function page() {
  return (
    <>
      <main className='flex-grow flext flex-col items-center justify-center px-4 md:px-24 py-12'>
        <section>
          <h1 className='text-3xl md:text-5xl font-bold'>Dive into World of Anonymous Conversation</h1>
          <p className='mt-3 md:mt-4 text-base'>Explore Mystery Messages - Where your identity remains secret.</p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-xs text-center mx-auto mt-10">
          <CarouselContent>
            {
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader>
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center">
                        <span className="text-lg font-semibold">{message.content}</span>
                      </CardContent>
                      <TooltipProvider>
                        <Tooltip >
                          <TooltipTrigger asChild className='mb-4'>
                            <Button variant="outline">Recieved date</Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{message.received}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className='text-center p-4 md:p-6'>&copy; Mystery Message. All rights reserved.</footer>
    </>
  )
}

export default page