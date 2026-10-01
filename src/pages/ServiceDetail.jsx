import React from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import { SERVICES, getServiceBySlug } from "@/lib/services";

function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = getServiceBySlug(slug);

  if (!service) return <Navigate to="/" replace />;

  const Icon = service.icon;
  const others = SERVICES.filter((s) => s.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="app-header flex h-16 items-center justify-between border-border bg-card px-5 sm:px-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Plus className="h-5 w-5" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-none">PatientCare</h2>
            <p className="mt-1 text-[10px] text-muted-foreground">Secure Healthcare Management</p>
          </div>
        </div>

        <div className="w-24 sm:w-28" />
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <FadeIn>
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </span>
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-primary">
            Our Services
          </span>
          <h1 className="text-3xl font-bold sm:text-4xl">{service.title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {service.description}
          </p>

          <Button size="lg" className="mt-7" onClick={() => navigate("/role")}>
            Book {service.title}
          </Button>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-16">
          <h3 className="mb-4 text-sm font-bold text-muted-foreground">Explore other services</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {others.map((s) => {
              const OtherIcon = s.icon;
              return (
                <Link key={s.slug} to={`/services/${s.slug}`}>
                  <Card className="group flex h-full flex-col items-center gap-2 p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <OtherIcon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold">{s.title}</span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </FadeIn>
      </main>
    </div>
  );
}

export default ServiceDetail;
