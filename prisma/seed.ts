import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Wajabatt Food',
      description: 'Experience exquisite cuisine in a warm, inviting atmosphere',
      address: '123 Foodie Street, Culinary City',
      phone: '(123) 456-7890',
      email: 'info@wajabattfood.com',
      openingHours: {
        Monday: '11:00 AM - 10:00 PM',
        Tuesday: '11:00 AM - 10:00 PM',
        Wednesday: '11:00 AM - 10:00 PM',
        Thursday: '11:00 AM - 10:00 PM',
        Friday: '11:00 AM - 11:00 PM',
        Saturday: '10:00 AM - 11:00 PM',
        Sunday: '10:00 AM - 10:00 PM'
      },
    },
  })

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'abassdev227@gmail.com',
      password: await bcrypt.hash('admin', 10),
      role: 'ADMIN',
      phoneNumber: "22798241163",
      isVerified: true,
      emailVerified: "2024-12-17T07:51:10.163Z",
    },
  })

  console.log({ adminUser })

  const categories = await Promise.all([
    prisma.menuCategory.create({
      data: { name: 'Appetizers', restaurantId: restaurant.id },
    }),
    prisma.menuCategory.create({
      data: { name: 'Main Courses', restaurantId: restaurant.id },
    }),
    prisma.menuCategory.create({
      data: { name: 'Desserts', restaurantId: restaurant.id },
    }),
  ])

  const menuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'Crispy Calamari',
        description: 'Lightly battered calamari served with zesty marinara sauce',
        price: 12.99,
        image: '/images/appetizer1.jpg',
        categoryId: categories[0].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
        price: 24.99,
        image: '/images/main-course1.jpg',
        categoryId: categories[1].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
        price: 8.99,
        image: '/images/dessert1.jpg',
        categoryId: categories[2].id,
      },
    }),
  ])

  console.log({ restaurant, categories, menuItems })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

