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
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(error.message ?? t.auth.errorGeneral);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-10">
        <h1 className="text-display-md text-ink mb-3">{t.auth.loginTitle}</h1>
        <p className="text-body text-muted">{t.auth.loginSub}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
          autoComplete="current-password"
          {...register("password")}
        />

        {serverError && (
          <p className="text-caption text-red-400">{serverError}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            className="text-caption text-dim hover:text-muted transition-colors"
          >
            {t.auth.forgotPassword}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="w-full justify-center mt-2"
        >
          {t.auth.loginButton}
        </Button>

        <p className="text-caption text-center text-dim pt-2">
          <Link
            href="/signup"
            className="text-muted hover:text-ink transition-colors duration-200"
          >
            {t.auth.signupLink}
          </Link>
        </p>
      </form>
    </div>
  );
}
