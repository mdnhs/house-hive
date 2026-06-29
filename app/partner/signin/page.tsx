"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Building2, ChevronLeft } from "lucide-react";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";

const mobileSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
});

const otpSchema = z.object({
  otp: z
    .array(z.string())
    .length(4)
    .refine((arr) => arr.every((d) => d !== ""), "Enter the complete OTP"),
});

type MobileForm = z.infer<typeof mobileSchema>;
type OtpForm = z.infer<typeof otpSchema>;

export default function PartnerSignInPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<"mobile" | "otp">("mobile");

  const mobileForm = useForm<MobileForm>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: "" },
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: ["", "", "", ""] },
  });

  const otpArray = otpForm.watch("otp");

  const handleSendOtp = mobileForm.handleSubmit(() => {
    setStep("otp");
  });

  const handleSignIn = otpForm.handleSubmit(() => {
    router.push("/partner/dashboard");
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpArray];
    newOtp[index] = value;
    otpForm.setValue("otp", newOtp, { shouldValidate: true });
    if (value && index < 3) {
      document.getElementById(`signin-otp-${index + 1}`)?.focus();
    }
  };

  const toOtpError = () => {
    const error = otpForm.formState.errors.otp;
    return error ? [{ message: error.message }] : undefined;
  };

  return (
    <div className="min-h-dvh bg-white dark:bg-zinc-950 flex flex-col">
      <div className="px-4 pt-6 pb-2">
        <button onClick={() => router.push("/partner/onboarding")} className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <ChevronLeft className="size-5 text-zinc-700 dark:text-zinc-300" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 max-w-lg mx-auto w-full py-12">
        <div className="size-14 rounded-2xl bg-gradient-to-br from-[#FF385C] to-[#BD1E59] flex items-center justify-center mb-6">
          <Building2 className="size-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Sign In</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">Access your partner dashboard</p>

        {step === "mobile" && (
          <form onSubmit={handleSendOtp}>
            <Field orientation="vertical">
              <FieldLabel htmlFor="signin-mobile">Mobile Number</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 dark:text-zinc-400 text-lg font-medium shrink-0">+880</span>
                  <input
                    id="signin-mobile"
                    type="tel"
                    {...mobileForm.register("mobile")}
                    placeholder="1XXXXXXXXX"
                    className="flex-1 h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-lg font-medium outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
                    autoFocus
                  />
                </div>
                <FieldError errors={(() => {
                  const err = mobileForm.formState.errors.mobile;
                  return err ? [{ message: err.message }] : undefined;
                })()} />
              </FieldContent>
            </Field>
            <button
              type="submit"
              className="w-full py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleSignIn}>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              OTP sent to <span className="font-medium text-zinc-700 dark:text-zinc-300">+880 {mobileForm.watch("mobile")}</span>
            </p>
            <Field orientation="vertical">
              <FieldContent>
                <div className="flex items-center justify-center gap-3 mb-2">
                  {otpArray.map((digit, index) => (
                    <input
                      key={index}
                      id={`signin-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && index > 0) {
                          document.getElementById(`signin-otp-${index - 1}`)?.focus();
                        }
                      }}
                      className={cn(
                        "size-12 sm:size-14 text-center text-xl font-bold rounded-xl border outline-none transition-all",
                        digit
                          ? "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      )}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <FieldError errors={toOtpError()} />
              </FieldContent>
            </Field>
            <button
              type="submit"
              className="w-full py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setStep("mobile")}
              className="w-full mt-3 py-3 text-sm font-semibold text-[#FF385C] hover:text-[#BD1E59] transition-colors"
            >
              Change number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
