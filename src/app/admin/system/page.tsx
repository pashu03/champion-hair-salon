import {
  Activity,
  CheckCircle2,
  Database,
  FileCode2,
  HardDrive,
  KeyRound,
  LockKeyhole,
  Server,
  ShieldCheck,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const formatNumber = new Intl.NumberFormat("en-IN");

const getDatabaseDetails = () => {
  return {
    engine: "PostgreSQL",
    location: "Supabase hosted database",
    environment: "Production / hosted",
  };
};

export default async function SystemPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [
    appointments,
    customers,
    services,
    staff,
    enquiries,
    testimonials,
    galleryItems,
    admins,
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.customer.count(),
    prisma.service.count(),
    prisma.staff.count(),
    prisma.contactEnquiry.count(),
    prisma.testimonial.count(),
    prisma.galleryItem.count(),
    prisma.adminUser.count(),
  ]);

  const database = getDatabaseDetails();
  const recordCounts = [
    ["Appointments", appointments],
    ["Customers", customers],
    ["Services", services],
    ["Staff", staff],
    ["Enquiries", enquiries],
    ["Testimonials", testimonials],
    ["Gallery items", galleryItems],
    ["Admin users", admins],
  ] as const;

  const architecture = [
    {
      title: "Customer website",
      detail: "Next.js pages collect bookings and contact details.",
      icon: FileCode2,
    },
    {
      title: "Backend APIs",
      detail: "Next.js Route Handlers validate requests on the server.",
      icon: Server,
    },
    {
      title: "Prisma ORM",
      detail: "Prisma safely reads and writes the salon data models.",
      icon: Activity,
    },
    {
      title: database.engine,
      detail: "The database permanently stores operational records.",
      icon: Database,
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
            Technical overview
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            System &amp; Database
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#8E8E8E]">
            See where salon data is stored, how the backend works, and whether
            the main records are available.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          Database connected
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[#D4AF37]/25 bg-[#141414] p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 p-3 text-[#D4AF37]">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8E8E8E]">
                Database engine
              </p>
              <p className="mt-1 text-lg font-bold text-white">{database.engine}</p>
              <p className="mt-1 text-xs text-[#A8A8A8]">{database.environment}</p>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-[#141414] p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-sky-400/20 bg-sky-400/10 p-3 text-sky-300">
              <HardDrive className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-[#8E8E8E]">
                Storage location
              </p>
              <p className="mt-1 break-words text-sm font-bold text-white">
                {database.location}
              </p>
              <p className="mt-1 text-xs text-[#A8A8A8]">
                Booking data is server-side, not localStorage.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-[#141414] p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-[#8E8E8E]">
                Signed-in administrator
              </p>
              <p className="mt-1 truncate text-sm font-bold text-white">{session.name}</p>
              <p className="mt-1 truncate text-xs text-[#A8A8A8]">{session.email}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card className="border-white/10 bg-[#141414] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Server className="h-5 w-5 text-[#D4AF37]" />
            <h3 className="font-display text-lg font-bold text-white">
              How an appointment is stored
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {architecture.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="relative rounded-xl border border-white/10 bg-[#0E0E0E] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-black text-black">
                      {index + 1}
                    </div>
                    <Icon className="h-4 w-4 text-[#D4AF37]" />
                    <p className="text-sm font-bold text-white">{item.title}</p>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[#999]">{item.detail}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4 text-xs leading-5 text-[#C7C7C7]">
            A confirmed booking creates or updates the customer, checks the
            selected service and barber availability, then saves the appointment
            with its reference number, time, price, status, and notes.
          </div>
        </Card>

        <Card className="border-white/10 bg-[#141414] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#D4AF37]" />
            <h3 className="font-display text-lg font-bold text-white">
              Current database records
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {recordCounts.map(([label, count]) => (
              <div key={label} className="flex items-center justify-between py-3">
                <span className="text-sm text-[#A8A8A8]">{label}</span>
                <span className="font-mono text-sm font-bold text-white">
                  {formatNumber.format(count)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="border-white/10 bg-[#141414] p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="flex gap-3">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" />
            <div>
              <h4 className="text-sm font-bold text-white">Passwords</h4>
              <p className="mt-1 text-xs leading-5 text-[#8E8E8E]">
                Admin passwords are stored as bcrypt hashes, never as readable text.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" />
            <div>
              <h4 className="text-sm font-bold text-white">Login sessions</h4>
              <p className="mt-1 text-xs leading-5 text-[#8E8E8E]">
                A signed JWT is kept in a secure HTTP-only cookie for seven days.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" />
            <div>
              <h4 className="text-sm font-bold text-white">Admin APIs</h4>
              <p className="mt-1 text-xs leading-5 text-[#8E8E8E]">
                Every admin data endpoint verifies the session before reading or changing records.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
