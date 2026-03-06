// prisma/seed.ts
import { PrismaClient, Role, PetStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@pawsible.com" },
    update: {},
    create: {
      name: "Sarah Mitchell",
      email: "admin@pawsible.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      points: 500,
      bio: "Shelter director at Happy Paws Rescue. Dog mom x3.",
    },
  });

  const mod = await prisma.user.upsert({
    where: { email: "mod@pawsible.com" },
    update: {},
    create: {
      name: "James Rivera",
      email: "mod@pawsible.com",
      passwordHash: adminPassword,
      role: Role.MODERATOR,
      points: 220,
      bio: "Volunteer coordinator & cat whisperer.",
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice Chen",
      email: "alice@example.com",
      passwordHash: userPassword,
      role: Role.ADOPTER,
      points: 150,
      bio: "First-time adopter, love hiking & outdoor adventures.",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "Bob Thompson",
      email: "bob@example.com",
      passwordHash: userPassword,
      role: Role.ADOPTER,
      points: 75,
    },
  });

  const cara = await prisma.user.upsert({
    where: { email: "cara@example.com" },
    update: {},
    create: {
      name: "Cara Williams",
      email: "cara@example.com",
      passwordHash: userPassword,
      role: Role.ADOPTER,
      points: 320,
      bio: "Experienced pet owner. Currently have 2 cats.",
    },
  });

  console.log("✅ Users created");

  // ── Pets ───────────────────────────────────────────────────────────────────
  const petsData = [
    {
      name: "Buddy",
      breed: "Golden Retriever",
      species: "Dog",
      age: 2,
      weight: 28.5,
      gender: "Male",
      color: "Golden",
      photoUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600",
      photos: [
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600",
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600",
      ],
      status: PetStatus.AVAILABLE,
      description: "Buddy is an energetic and loving Golden Retriever who adores kids and other pets. He's house-trained and knows basic commands.",
      traits: ["Playful", "Friendly", "Energetic", "Loyal"],
      vaccinated: true,
      neutered: true,
      houseTrained: true,
      goodWithKids: true,
      goodWithPets: true,
      shelterId: admin.id,
    },
    {
      name: "Luna",
      breed: "Siamese Mix",
      species: "Cat",
      age: 3,
      weight: 4.2,
      gender: "Female",
      color: "Cream & Brown",
      photoUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600",
      photos: ["https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600"],
      status: PetStatus.AVAILABLE,
      description: "Luna is a graceful and affectionate Siamese mix. She's quiet, loves to cuddle, and would thrive in a calm household.",
      traits: ["Calm", "Affectionate", "Independent", "Intelligent"],
      vaccinated: true,
      neutered: true,
      houseTrained: true,
      goodWithKids: false,
      goodWithPets: false,
      shelterId: admin.id,
    },
    {
      name: "Max",
      breed: "German Shepherd",
      species: "Dog",
      age: 4,
      weight: 35,
      gender: "Male",
      color: "Black & Tan",
      photoUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600",
      photos: ["https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600"],
      status: PetStatus.PENDING,
      description: "Max is a loyal and intelligent German Shepherd. He needs an experienced owner who can give him plenty of exercise and mental stimulation.",
      traits: ["Loyal", "Intelligent", "Protective", "Active"],
      vaccinated: true,
      neutered: false,
      houseTrained: true,
      goodWithKids: true,
      goodWithPets: false,
      shelterId: admin.id,
    },
    {
      name: "Mochi",
      breed: "Persian",
      species: "Cat",
      age: 1,
      weight: 3.1,
      gender: "Female",
      color: "White",
      photoUrl: "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600",
      photos: ["https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600"],
      status: PetStatus.AVAILABLE,
      description: "Mochi is a fluffy Persian kitten with the sweetest personality. She loves being groomed and will follow you around the house.",
      traits: ["Gentle", "Playful", "Cuddly", "Quiet"],
      vaccinated: true,
      neutered: false,
      houseTrained: true,
      goodWithKids: true,
      goodWithPets: true,
      shelterId: mod.id,
    },
    {
      name: "Rocky",
      breed: "Bulldog",
      species: "Dog",
      age: 5,
      weight: 22,
      gender: "Male",
      color: "Brindle",
      photoUrl: "https://images.unsplash.com/photo-1583511655826-05700442b31b?w=600",
      photos: ["https://images.unsplash.com/photo-1583511655826-05700442b31b?w=600"],
      status: PetStatus.AVAILABLE,
      description: "Rocky is a laid-back bulldog who is great with kids. He loves short walks and long naps on the couch. Perfect apartment dog.",
      traits: ["Calm", "Gentle", "Stubborn", "Lovable"],
      vaccinated: true,
      neutered: true,
      houseTrained: true,
      goodWithKids: true,
      goodWithPets: true,
      shelterId: admin.id,
    },
    {
      name: "Cleo",
      breed: "Tabby",
      species: "Cat",
      age: 7,
      weight: 5.5,
      gender: "Female",
      color: "Orange Tabby",
      photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600",
      photos: ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600"],
      status: PetStatus.ADOPTED,
      description: "Cleo is a mature tabby who loves sunbathing and light play. She's great for someone who wants a mellow companion.",
      traits: ["Mellow", "Independent", "Affectionate", "Wise"],
      vaccinated: true,
      neutered: true,
      houseTrained: true,
      goodWithKids: false,
      goodWithPets: false,
      shelterId: mod.id,
    },
    {
      name: "Peanut",
      breed: "Beagle",
      species: "Dog",
      age: 1.5,
      weight: 10,
      gender: "Male",
      color: "Tricolor",
      photoUrl: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600",
      photos: ["https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600"],
      status: PetStatus.AVAILABLE,
      description: "Peanut is a curious and merry Beagle puppy. He loves sniffing everything and playing fetch. A wonderful family dog.",
      traits: ["Curious", "Merry", "Active", "Gentle"],
      vaccinated: true,
      neutered: false,
      houseTrained: false,
      goodWithKids: true,
      goodWithPets: true,
      shelterId: admin.id,
    },
    {
      name: "Stella",
      breed: "Labrador Mix",
      species: "Dog",
      age: 3,
      weight: 25,
      gender: "Female",
      color: "Chocolate",
      photoUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600",
      photos: ["https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600"],
      status: PetStatus.AVAILABLE,
      description: "Stella is a sweet chocolate lab mix who loves swimming and playing fetch. She's great with kids and very trainable.",
      traits: ["Sweet", "Active", "Trainable", "Friendly"],
      vaccinated: true,
      neutered: true,
      houseTrained: true,
      goodWithKids: true,
      goodWithPets: true,
      shelterId: admin.id,
    },
  ];

  const createdPets: { id: string }[] = [];
  for (const pet of petsData) {
    const created = await prisma.pet.create({ data: pet });
    createdPets.push(created);
  }

  console.log("✅ Pets created");

  // ── Adoption Requests ──────────────────────────────────────────────────────
  await prisma.adoptionRequest.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: alice.id,
        petId: createdPets[0].id, // Buddy
        status: "PENDING",
        message: "I've always wanted a Golden Retriever! I have a big yard and work from home.",
        experience: "I grew up with dogs and had a Labrador for 10 years.",
        homeType: "House",
        hasYard: true,
      },
      {
        userId: bob.id,
        petId: createdPets[2].id, // Max - PENDING pet
        status: "APPROVED",
        message: "I'm an experienced dog owner looking for a loyal companion.",
        experience: "Former police K9 handler.",
        homeType: "House",
        hasYard: true,
        reviewNote: "Excellent match. Bob has great experience with German Shepherds.",
      },
      {
        userId: cara.id,
        petId: createdPets[1].id, // Luna
        status: "PENDING",
        message: "Luna would be perfect for my quiet apartment. I work from home.",
        experience: "I have two senior cats already and they are very calm.",
        homeType: "Apartment",
        hasYard: false,
      },
      {
        userId: alice.id,
        petId: createdPets[3].id, // Mochi
        status: "REJECTED",
        message: "Mochi looks adorable!",
        homeType: "Apartment",
        hasYard: false,
        reviewNote: "Applicant already has a pending request for another pet.",
      },
    ],
  });

  console.log("✅ Adoption requests created");

  // ── Preferences ───────────────────────────────────────────────────────────
  await prisma.petPreference.upsert({
    where: { userId: alice.id },
    update: {},
    create: {
      userId: alice.id,
      species: ["Dog"],
      ageMin: 1,
      ageMax: 4,
      traits: ["Friendly", "Playful", "Active"],
      goodWithKids: true,
      goodWithPets: true,
    },
  });

  await prisma.petPreference.upsert({
    where: { userId: cara.id },
    update: {},
    create: {
      userId: cara.id,
      species: ["Cat"],
      ageMin: 1,
      ageMax: 5,
      traits: ["Calm", "Independent"],
      goodWithPets: true,
    },
  });

  console.log("✅ Preferences created");

  // ── Activity Logs ──────────────────────────────────────────────────────────
  await prisma.activityLog.createMany({
    data: [
      { userId: alice.id, type: "PROFILE_COMPLETE", points: 50, description: "Completed profile setup" },
      { userId: alice.id, type: "FIRST_REQUEST", points: 100, description: "Submitted first adoption request" },
      { userId: bob.id, type: "PROFILE_COMPLETE", points: 50, description: "Completed profile setup" },
      { userId: bob.id, type: "REQUEST_APPROVED", points: 200, description: "Adoption request approved for Max" },
      { userId: cara.id, type: "PROFILE_COMPLETE", points: 50, description: "Completed profile setup" },
      { userId: cara.id, type: "PET_FAVORITED", points: 10, description: "Saved a pet to favorites" },
      { userId: cara.id, type: "DAILY_VISIT", points: 5, description: "Daily visit bonus" },
      { userId: cara.id, type: "FIRST_REQUEST", points: 100, description: "Submitted first adoption request" },
    ],
  });

  // ── Favorites ─────────────────────────────────────────────────────────────
  await prisma.favorite.createMany({
    skipDuplicates: true,
    data: [
      { userId: alice.id, petId: createdPets[4].id }, // Rocky
      { userId: cara.id, petId: createdPets[1].id },  // Luna
      { userId: cara.id, petId: createdPets[3].id },  // Mochi
    ],
  });

  console.log("✅ Activity logs & favorites created");
  console.log("\n🎉 Database seeded successfully!");
  console.log("\nTest credentials:");
  console.log("  Admin:    admin@pawsible.com / admin123");
  console.log("  Mod:      mod@pawsible.com   / admin123");
  console.log("  Adopter:  alice@example.com  / user123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
