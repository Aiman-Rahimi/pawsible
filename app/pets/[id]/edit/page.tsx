// app/pets/[id]/edit/page.tsx
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PetForm } from "@/components/PetForm";
import prisma from "@/lib/prisma";

export default async function EditPetPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const user    = session?.user as any;
  if (!session || (user?.role !== "ADMIN" && user?.role !== "MODERATOR")) redirect("/auth/login");

  const pet = await prisma.pet.findUnique({ where: { id: params.id } });
  if (!pet) notFound();

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
      <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>Admin</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,2.8rem)",
        fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.5rem" }}>Edit {pet.name}</h1>
      <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "2rem", fontFamily: "var(--font-body)" }}>
        Update this pet's profile.
      </p>
      <div className="card-white" style={{ padding: "2.5rem" }}>
        <PetForm mode="edit" pet={{ ...pet, age: Number(pet.age), weight: pet.weight ? Number(pet.weight) : undefined } as any} />
      </div>
    </div>
  );
}
