"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field } from "./Field";
import PasswordStrength from "./PasswordStrength";

type Mode = "in" | "up";
type Provider = "google" | "github";
type Errors = Partial<
  Record<"name" | "email" | "password" | "imageURL", string>
>;

const FEATURES = [
  "Find upcoming events near you",
  "Create and manage your own events",
  "Track every event you have joined",
];

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const AuthShell = ({ mode }: { mode: Mode }) => {
  const router = useRouter();
  const isSignUp = mode === "up";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<Provider | null>(null);

  const busy = loading || socialLoading !== null;

  const validate = () => {
    // Empty Object: Here the validation error will gather
    const e: Errors = {};
    if (isSignUp && !name.trim()) {
      e.name = "Please enter your full name.";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      e.email = "Please enter a valid email address.";
    }
    if (isSignUp) {
      if (
        password.length < 6 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password)
      ) {
        e.password = "Use 6+ characters with upper and lower case letters.";
      }
      if (imageURL && !isValidUrl(imageURL))
        e.imageURL = "Please enter a valid URL.";
    } else if (!password) {
      e.password = "Please enter your password.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Sign Up mode
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          name: name.trim(),
          email,
          password,
          image: imageURL || undefined,
        });
        if (error) {
          toast.error(error.message ?? "Could not create your account.");
          return;
        }
        toast.success("Account created. Welcome to HandsTogether!");
      } else {
        /** Sign In Mode */
        const { error } = await authClient.signIn.email({ email, password });
        if (error) {
          toast.error(error.message ?? "Could not log you in.");
          return;
        }
        toast.success("Welcome back!");
      }
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: Provider) => {
    setSocialLoading(provider);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
    // On success the browser redirects away, so we only handle the failure case.
    if (error) {
      toast.error(error.message ?? "Social login failed.");
      setSocialLoading(null);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#2A2340] dark:bg-secondary lg:grid-cols-[600px_1fr]">
      {/* Left: brand panel (desktop only) */}
      <aside className="hidden flex-col justify-between py-14 pl-16 pr-22 text-white lg:flex">
        <div className="flex flex-col gap-5">
          <h2 className="font-heading text-[44px] font-extrabold leading-[1.1] tracking-tight">
            Small acts, shared with your community.
          </h2>
          <p className="text-lg leading-relaxed text-[#CBB8F0]">
            Join volunteers building a better neighborhood, one event at a time.
          </p>
          <ul className="mt-3 flex flex-col gap-4">
            {FEATURES.map((text) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex size-7 flex-none items-center justify-center rounded-full bg-[#E6A94B]/15">
                  <Check
                    className="size-3.5 text-[#E6A94B]"
                    strokeWidth={3}
                    aria-hidden
                  />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-[#CBB8F0]">
          Plantation · Donation · Cleanup · Education
        </p>
      </aside>

      {/* Right: form panel */}
      <section className="flex flex-col bg-card px-6 py-10 sm:px-10 lg:-ml-12 lg:rounded-l-[48px] lg:px-16">
        <Link
          href="/"
          className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to home
        </Link>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="flex w-full max-w-105 flex-col gap-5">
            <div className="flex text-center flex-col gap-2">
              <h1 className="font-heading text-[34px] font-extrabold leading-tight tracking-tight">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-muted-foreground">
                {isSignUp
                  ? "Start joining and organizing community events today."
                  : "Log in to discover and join events in your community."}
              </p>
            </div>

            {/* Social buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => socialLogin("google")}
                className="h-12 flex-1 rounded-xl font-semibold"
              >
                {socialLoading === "google" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FcGoogle className="size-5" />
                )}
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => socialLogin("github")}
                className="h-12 flex-1 rounded-xl font-semibold"
              >
                {socialLoading === "github" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FaGithub className="size-5" />
                )}
                GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3.5" aria-hidden>
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold tracking-widest text-muted-foreground">
                OR
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            {/* Email form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              {isSignUp && (
                <Field
                  id="name"
                  label="Full name"
                  placeholder="Your full name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />
              )}
              <Field
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              {isSignUp && (
                <Field
                  id="imageURL"
                  label="Photo URL (optional)"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  error={errors.imageURL}
                />
              )}
              <div className="flex flex-col gap-2">
                <Field
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isSignUp ? "At least 6 characters" : "Enter your password"
                  }
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  hint={
                    isSignUp && !password
                      ? "Use upper and lower case letters, 6+ characters."
                      : undefined
                  }
                  rightSlot={
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previousValue) => !previousValue)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  }
                />
                {isSignUp && password && (
                  <PasswordStrength password={password} />
                )}
              </div>

              {!isSignUp && (
                <div className="-mt-1 text-right">
                  <Link
                    href="#"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={busy}
                className="h-12 w-full rounded-xl text-base font-semibold shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {loading && <Loader2 className="animate-spin" />}
                {loading
                  ? isSignUp
                    ? "Creating account…"
                    : "Logging in…"
                  : isSignUp
                    ? "Create account"
                    : "Log in"}
              </Button>
            </form>

            <p className="text-center text-[15px] text-muted-foreground">
              {isSignUp ? "Already have an account?" : "New to HandsTogether?"}{" "}
              <Link
                href={isSignUp ? "/login" : "/register"}
                className="font-semibold text-primary hover:underline"
              >
                {isSignUp ? "Log in" : "Create an account"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthShell;
