"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setServerError(error.message ?? t.auth.errorGeneral);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-6 text-4xl">✦</div>
        <h1 className="text-display-md text-ink mb-4">
          {t.locale === "es"
            ? "Revisa tu correo."
            : "Check your email."}
        </h1>
        <p className="text-body text-muted leading-relaxed">
          {t.locale === "es"
            ? "Te enviamos un enlace de confirmación. Una vez confirmado, tu práctica comienza."
            : "We sent you a confirmation link. Once confirmed, your practice begins."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-10">
        <h1 className="text-display-md text-ink mb-3">
          {t.auth.signupTitle}
        </h1>
        <p className="text-body text-muted">{t.auth.signupSub}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label={t.auth.nameLabel}
          type="text"
          placeholder={t.auth.namePlaceholder}
          autoComplete="name"
          {...register("name")}
        />

        <Input
          label={t.auth.emailLabel}
          type="email"
          placeholder={t.auth.emailPlaceholder}
          error={errors.email ? t.auth.errorEmail : undefined}
          autoComplete="email"
          {...register("email")}
        />

        <Input
          label={t.auth.passwordLabel}
          type="password"
          placeholder={t.auth.passwordPlaceholder}
          error={errors.password ? t.auth.errorPassword : undefined}
          autoComplete="new-password"
          {...register("password")}
        />

        {serverError && (
          <p className="text-caption text-red-400">{serverError}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="w-full justify-center mt-2"
        >
          {t.auth.signupButton}
        </Button>

        <p className="text-caption text-center text-dim pt-2">
          <Link
            href="/login"
            className="text-muted hover:text-ink transition-colors duration-200"
          >
            {t.auth.loginLink}
          </Link>
        </p>
      </form>
    </div>
  );
}
