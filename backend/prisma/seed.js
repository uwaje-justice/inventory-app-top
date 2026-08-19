import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const main = async () => {
  console.log("Seeding database...");

  const password = await bcrypt.hash("password123", 10);

  const user = await db.user.upsert({
    where: { email: "demo@motiv.com" },
    update: {},
    create: {
      username: "demo",
      email: "demo@motiv.com",
      password,
    },
  });

  console.log(`Created user: ${user.username} (${user.email})`);

  const categories = await Promise.all([
    db.category.upsert({
      where: { name_userId: { name: "Engine", userId: user.id } },
      update: {},
      create: { name: "Engine", description: "Engine parts and components", userId: user.id },
    }),
    db.category.upsert({
      where: { name_userId: { name: "Brakes", userId: user.id } },
      update: {},
      create: { name: "Brakes", description: "Brake pads, rotors, and calipers", userId: user.id },
    }),
    db.category.upsert({
      where: { name_userId: { name: "Electrical", userId: user.id } },
      update: {},
      create: { name: "Electrical", description: "Batteries, alternators, and wiring", userId: user.id },
    }),
    db.category.upsert({
      where: { name_userId: { name: "Suspension", userId: user.id } },
      update: {},
      create: { name: "Suspension", description: "Shocks, struts, and control arms", userId: user.id },
    }),
    db.category.upsert({
      where: { name_userId: { name: "Exhaust", userId: user.id } },
      update: {},
      create: { name: "Exhaust", description: "Mufflers, catalytic converters, and pipes", userId: user.id },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  const suppliers = await Promise.all([
    db.supplier.upsert({
      where: { name_userId: { name: "AutoZone", userId: user.id } },
      update: {},
      create: {
        name: "AutoZone",
        contactName: "John Smith",
        email: "john@autozone.com",
        phone: "555-0100",
        userId: user.id,
      },
    }),
    db.supplier.upsert({
      where: { name_userId: { name: "NAPA AutoParts", userId: user.id } },
      update: {},
      create: {
        name: "NAPA AutoParts",
        contactName: "Jane Doe",
        email: "jane@napa.com",
        phone: "555-0200",
        userId: user.id,
      },
    }),
    db.supplier.upsert({
      where: { name_userId: { name: "O'Reilly Auto Parts", userId: user.id } },
      update: {},
      create: {
        name: "O'Reilly Auto Parts",
        contactName: "Mike Johnson",
        email: "mike@oreilly.com",
        phone: "555-0300",
        userId: user.id,
      },
    }),
  ]);

  console.log(`Created ${suppliers.length} suppliers`);

  const vehicles = await Promise.all([
    db.vehicle.upsert({
      where: { id: "00000000-0000-0000-0000-000000000001" },
      update: {},
      create: { make: "Toyota", model: "Camry", year: 2023, userId: user.id },
    }),
    db.vehicle.upsert({
      where: { id: "00000000-0000-0000-0000-000000000002" },
      update: {},
      create: { make: "Honda", model: "Civic", year: 2022, userId: user.id },
    }),
    db.vehicle.upsert({
      where: { id: "00000000-0000-0000-0000-000000000003" },
      update: {},
      create: { make: "Ford", model: "F-150", year: 2024, userId: user.id },
    }),
    db.vehicle.upsert({
      where: { id: "00000000-0000-0000-0000-000000000004" },
      update: {},
      create: { make: "Chevrolet", model: "Silverado", year: 2023, userId: user.id },
    }),
    db.vehicle.upsert({
      where: { id: "00000000-0000-0000-0000-000000000005" },
      update: {},
      create: { make: "BMW", model: "3 Series", year: 2024, userId: user.id },
    }),
  ]);

  console.log(`Created ${vehicles.length} vehicles`);

  const items = await Promise.all([
    db.item.create({
      data: {
        name: "Oil Filter",
        price: 12.99,
        quantity: 50,
        categoryId: categories[0].id,
        supplierId: suppliers[0].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Air Filter",
        price: 8.99,
        quantity: 30,
        categoryId: categories[0].id,
        supplierId: suppliers[1].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Spark Plugs (Set)",
        price: 24.99,
        quantity: 25,
        categoryId: categories[0].id,
        supplierId: suppliers[0].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Brake Pads (Front)",
        price: 45.99,
        quantity: 20,
        categoryId: categories[1].id,
        supplierId: suppliers[2].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Brake Rotor (Front)",
        price: 65.99,
        quantity: 15,
        categoryId: categories[1].id,
        supplierId: suppliers[0].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Brake Fluid",
        price: 9.99,
        quantity: 40,
        categoryId: categories[1].id,
        supplierId: suppliers[1].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Car Battery",
        price: 129.99,
        quantity: 10,
        categoryId: categories[2].id,
        supplierId: suppliers[0].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Alternator",
        price: 189.99,
        quantity: 5,
        categoryId: categories[2].id,
        supplierId: suppliers[2].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Spark Plug Wires",
        price: 34.99,
        quantity: 12,
        categoryId: categories[2].id,
        supplierId: suppliers[1].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Shock Absorber",
        price: 89.99,
        quantity: 8,
        categoryId: categories[3].id,
        supplierId: suppliers[0].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Strut Assembly",
        price: 149.99,
        quantity: 6,
        categoryId: categories[3].id,
        supplierId: suppliers[2].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Control Arm",
        price: 79.99,
        quantity: 10,
        categoryId: categories[3].id,
        supplierId: suppliers[1].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Muffler",
        price: 99.99,
        quantity: 7,
        categoryId: categories[4].id,
        supplierId: suppliers[0].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Catalytic Converter",
        price: 249.99,
        quantity: 4,
        categoryId: categories[4].id,
        supplierId: suppliers[2].id,
        userId: user.id,
      },
    }),
    db.item.create({
      data: {
        name: "Exhaust Pipe",
        price: 59.99,
        quantity: 12,
        categoryId: categories[4].id,
        supplierId: suppliers[1].id,
        userId: user.id,
      },
    }),
  ]);

  console.log(`Created ${items.length} items`);

  // Add vehicle compatibility
  await Promise.all([
    db.itemVehicle.create({ data: { itemId: items[0].id, vehicleId: vehicles[0].id } }),
    db.itemVehicle.create({ data: { itemId: items[0].id, vehicleId: vehicles[1].id } }),
    db.itemVehicle.create({ data: { itemId: items[3].id, vehicleId: vehicles[0].id } }),
    db.itemVehicle.create({ data: { itemId: items[3].id, vehicleId: vehicles[2].id } }),
    db.itemVehicle.create({ data: { itemId: items[6].id, vehicleId: vehicles[0].id } }),
    db.itemVehicle.create({ data: { itemId: items[6].id, vehicleId: vehicles[1].id } }),
    db.itemVehicle.create({ data: { itemId: items[6].id, vehicleId: vehicles[2].id } }),
    db.itemVehicle.create({ data: { itemId: items[9].id, vehicleId: vehicles[4].id } }),
  ]);

  console.log("Created vehicle-item compatibility links");

  console.log("Seed completed!");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
