"use client";

import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string) {
  const email = value.trim();
  if (!email) return "Please enter your email address.";
  if (!EMAIL_PATTERN.test(email))
    return "Enter a valid email, like you@example.com.";
  return "";
}

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleChange(value: string) {
    setEmail(value);
    // Once an error is shown, re-check while typing so it disappears as soon as it is fixed.
    if (error) setError(validateEmail(value));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateEmail(email);
    setError(message);
    if (message) return;

    // UI-ONLY: the assignment needs no newsletter functionality, so nothing is saved.
    // REPLACE: send the email to your server here if you add a backend later.
    toast.success("You're on the list! We'll email you about new events.");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Label htmlFor="newsletter-email" className="mb-2 text-sm font-semibold">
        Email address
      </Label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => handleChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby="newsletter-error"
          className="h-13 flex-1 rounded-xl bg-background px-4 text-base transition-colors duration-150"
        />
        <Button
          type="submit"
          className="h-13 rounded-full px-7 text-base font-semibold transition-all duration-200 ease-out hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]"
        >
          Subscribe
        </Button>
      </div>

      {/* min-h reserves the space, so showing the error never pushes the layout. */}
      <p
        id="newsletter-error"
        aria-live="polite"
        className="mt-2 flex min-h-6 items-center gap-1.5 text-sm text-destructive"
      >
        {error && (
          <>
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </>
        )}
      </p>
    </form>
  );
}
