"use client"

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Wajabatt Food
      </motion.h1>
      <div className="flex flex-col md:flex-row items-center mb-12">
        <motion.div 
          className="md:w-1/2 mb-6 md:mb-0 md:pr-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image src="/placeholder.svg?height=400&width=600" alt="Restaurant Interior" width={600} height={400} className="rounded-lg shadow-md" />
        </motion.div>
        <motion.div 
          className="md:w-1/2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            Wajabatt Food was founded in 2010 with a passion for creating exceptional dining experiences. Our team of talented chefs and dedicated staff work tirelessly to bring you the finest cuisine and warm hospitality.
          </p>
          <p className="text-muted-foreground">
            We source our ingredients from local farmers and suppliers, ensuring the freshest and highest quality dishes for our guests. Our menu is a fusion of traditional recipes and innovative culinary techniques, offering a unique and unforgettable dining experience.
          </p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Head Chef', 'Sous Chef', 'Pastry Chef'].map((role, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
            >
              <Image src={`/placeholder.svg?height=200&width=200`} alt={role} width={200} height={200} className="rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{role}</h3>
              <p className="text-muted-foreground">A brief description of the chef and their expertise goes here.</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

