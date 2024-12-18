"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { Card, CardContent } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MenuItem } from '@/types/menu'

interface MenuCarouselProps {
  items: MenuItem[]
}

export function MenuCarousel({ items }: MenuCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item) => (
            <div key={item.id} className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]">
              <Link href={`/menu/${item.id}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </AspectRatio>
                    <h3 className="mt-2 text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="mt-2 font-bold">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Category: {item.category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

