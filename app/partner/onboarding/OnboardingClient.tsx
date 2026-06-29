"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreateListingForm } from "@/features/properties/components/CreateListingForm";
import { Check, Building2, Sofa, ChevronLeft, CheckCircle, Sparkles, Upload } from "lucide-react";

type BusinessType = "housing" | "interior" | null;
type Step =
  | "welcome"
  | "mobile"
  | "otp"
  | "business-type"
  | "business-info"
  | "create-listing"
  | "success"
  | "featured-upsell";

export default function OnboardingClient({ initialStepParam }: { initialStepParam?: string }) {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>(initialStepParam === "create-listing" ? "create-listing" : "welcome");
  const [mobile, setMobile] = React.useState("");
  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = React.useState(false);
  const [businessType, setBusinessType] = React.useState<BusinessType>(null);
  const [businessName, setBusinessName] = React.useState("");
  const [logo, setLogo] = React.useState<File | null>(null);
  const [website, setWebsite] = React.useState("");
  const [facebook, setFacebook] = React.useState("");
  React.useEffect(() => {
    if (initialStepParam === "create-listing") {
      setBusinessType("housing");
      setMobile("1234567890");
      setOtpSent(true);
      setOtp(["1", "2", "3", "4"]);
      setBusinessName("My Business");
    }
  }, [initialStepParam]);

  const steps = ["welcome", "mobile", "otp", "business-type", "business-info", "create-listing", "success"];
  const currentStepIndex = steps.indexOf(step);

  const progressPercent = step === "welcome" ? 0
    : step === "featured-upsell" ? 100
    : Math.round(((currentStepIndex) / (steps.length - 1)) * 100);

  const canGoNext = () => {
    switch (step) {
      case "welcome": return true;
      case "mobile": return mobile.length >= 10;
      case "otp": return otp.every((d) => d !== "") && otpSent;
      case "business-type": return businessType !== null;
      case "business-info": return businessName.trim().length > 0;
      case "create-listing": return true;
      default: return true;
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "BackwardSymbol" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const nextStep = () => {
    if (!canGoNext()) return;
    switch (step) {
      case "welcome": setStep("mobile"); break;
      case "mobile": handleSendOtp(); setStep("otp"); break;
      case "otp": setStep("business-type"); break;
      case "business-type": setStep("business-info"); break;
      case "business-info": setStep("create-listing"); break;
      case "create-listing": setStep("success"); break;
      case "success": setStep("featured-upsell"); break;
      case "featured-upsell": router.push("/partner/dashboard"); break;
    }
  };

  const prevStep = () => {
    switch (step) {
      case "mobile": setStep("welcome"); break;
      case "otp": setStep("mobile"); break;
      case "business-type": setStep("otp"); break;
      case "business-info": setStep("business-type"); break;
      case "create-listing": setStep("business-info"); break;
    }
  };

  const showBack = ["mobile", "otp", "business-type", "business-info", "create-listing"].includes(step);

  return (
    <div className="min-h-dvh bg-white dark:bg-zinc-950 flex flex-col">
      {/* Progress Bar */}
      {step !== "welcome" && step !== "featured-upsell" && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-[#FF385C] to-[#BD1E59] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Header */}
      {step !== "welcome" && (
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          {showBack ? (
            <button onClick={prevStep} className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <ChevronLeft className="size-5 text-zinc-700 dark:text-zinc-300" />
            </button>
          ) : (
            <div />
          )}
          {step !== "featured-upsell" && (
            <button onClick={() => router.push("/")} className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              Skip
            </button>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col px-4 sm:px-6 max-w-lg mx-auto w-full">
        {/* Step 1 - Welcome */}
        {step === "welcome" && (
          <div className="flex-1 flex flex-col justify-center py-12">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-[#FF385C] to-[#BD1E59] flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
              <Building2 className="size-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 leading-tight">
              Become a Partner
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg mb-8 leading-relaxed">
              List your properties and reach thousands of quality buyers looking for their dream home.
            </p>
            <div className="space-y-3 mb-10">
              {[
                { title: "Free Property Listing", desc: "List your properties at zero cost" },
                { title: "Featured Promotion", desc: "Get highlighted placement in search results" },
                { title: "Quality Customer Inquiries", desc: "Receive genuine buyer inquiries" },
              ].map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="size-6 rounded-full bg-[#FF385C]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-3.5 text-[#FF385C]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">{benefit.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={nextStep}
              className="w-full py-4 bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white font-bold rounded-2xl text-base shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Started
            </button>
            <button onClick={() => router.push("/partner/signin")} className="w-full mt-3 py-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Already a Partner? Sign In
            </button>
          </div>
        )}

        {/* Step 2 - Mobile Verification */}
        {step === "mobile" && (
          <div className="flex-1 flex flex-col justify-center py-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Verify your mobile</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">We will send you a one-time password</p>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Mobile Number</label>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-zinc-500 dark:text-zinc-400 text-lg font-medium shrink-0">+880</span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="1XXXXXXXXX"
                className="flex-1 h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-lg font-medium outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
                autoFocus
              />
            </div>
            <button
              onClick={nextStep}
              disabled={!canGoNext()}
              className={cn(
                "w-full py-4 rounded-2xl text-base font-bold transition-all",
                canGoNext()
                  ? "bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
              )}
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Step 3 - OTP Verification */}
        {step === "otp" && (
          <div className="flex-1 flex flex-col justify-center py-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Enter OTP</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
              Sent to <span className="font-medium text-zinc-700 dark:text-zinc-300">+880 {mobile}</span>
            </p>
            <div className="flex items-center justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && index > 0) {
                      const prev = document.getElementById(`otp-${index - 1}`);
                      prev?.focus();
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
            <button
              onClick={nextStep}
              disabled={!canGoNext()}
              className={cn(
                "w-full py-4 rounded-2xl text-base font-bold transition-all",
                canGoNext()
                  ? "bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
              )}
            >
              Verify OTP
            </button>
            <button
              onClick={handleSendOtp}
              className="w-full mt-3 py-3 text-sm font-semibold text-[#FF385C] hover:text-[#BD1E59] transition-colors"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* Step 4 - Business Type */}
        {step === "business-type" && (
          <div className="flex-1 flex flex-col justify-center py-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Choose your business type</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">Select the one that best describes you</p>
            <div className="space-y-4">
              <button
                onClick={() => setBusinessType("housing")}
                className={cn(
                  "w-full p-5 rounded-2xl border-2 text-left transition-all",
                  businessType === "housing"
                    ? "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10 shadow-md shadow-red-500/10"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "size-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    businessType === "housing" ? "bg-[#FF385C] text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  )}>
                    <Building2 className="size-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-zinc-900 dark:text-zinc-50">Property</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">List apartments, flats and residential projects</p>
                  </div>
                  {businessType === "housing" && (
                    <div className="size-6 rounded-full bg-[#FF385C] flex items-center justify-center shrink-0">
                      <Check className="size-3.5 text-white" />
                    </div>
                  )}
                </div>
              </button>
              <button
                onClick={() => setBusinessType("interior")}
                className={cn(
                  "w-full p-5 rounded-2xl border-2 text-left transition-all",
                  businessType === "interior"
                    ? "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10 shadow-md shadow-red-500/10"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "size-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    businessType === "interior" ? "bg-[#FF385C] text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  )}>
                    <Sofa className="size-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-zinc-900 dark:text-zinc-50">Interior</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Showcase interior projects and design services</p>
                  </div>
                  {businessType === "interior" && (
                    <div className="size-6 rounded-full bg-[#FF385C] flex items-center justify-center shrink-0">
                      <Check className="size-3.5 text-white" />
                    </div>
                  )}
                </div>
              </button>
            </div>
            <div className="mt-auto pt-8">
              <button
                onClick={nextStep}
                disabled={!canGoNext()}
                className={cn(
                  "w-full py-4 rounded-2xl text-base font-bold transition-all",
                  canGoNext()
                    ? "bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
                )}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 5 - Business Information */}
        {step === "business-info" && (
          <div className="flex-1 flex flex-col justify-center py-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Business information</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">Tell us about your business</p>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                  Business Name <span className="text-[#FF385C]">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  className="w-full h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Logo (optional)</label>
                <div className="flex items-center gap-3">
                  <div className="size-14 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer">
                    <Upload className="size-5" />
                  </div>
                  <input type="file" accept="image/*" className="hidden" />
                  <span className="text-sm text-zinc-400">Upload your logo</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Website (optional)</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Facebook Page (optional)</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition-all"
                />
              </div>
            </div>
            <div className="mt-auto pt-8">
              <button
                onClick={nextStep}
                disabled={!canGoNext()}
                className={cn(
                  "w-full py-4 rounded-2xl text-base font-bold transition-all",
                  canGoNext()
                    ? "bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
                )}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 6A/6B - Create Listing */}
        {step === "create-listing" && (
          <CreateListingForm
            businessType={businessType || "housing"}
            onSubmit={() => setStep("success")}
          />
        )}

        {/* Step 7 - Success */}
        {step === "success" && (
          <div className="flex-1 flex flex-col justify-center py-8 text-center">
            <div className="size-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="size-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Listing Published!</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
              Your {businessType === "housing" ? "property" : "project"} has been published successfully.
            </p>

            {/* Profile Completion */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-5 mb-8 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Profile Completion</span>
                <span className="text-sm font-bold text-[#FF385C]">35%</span>
              </div>
              <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-4">
                <div className="h-full w-[35%] bg-gradient-to-r from-[#FF385C] to-[#BD1E59] rounded-full" />
              </div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3">Suggested Next Steps</p>
              <div className="space-y-2">
                {[
                  "Upload Logo",
                  "Add Company Description",
                  "Verify Business",
                  "Add Cover Image",
                ].map((stepName) => (
                  <div key={stepName} className="flex items-center gap-3 text-sm">
                    <div className="size-5 rounded-full border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                      <Sparkles className="size-2.5 text-zinc-300 dark:text-zinc-600" />
                    </div>
                    <span className="text-zinc-500 dark:text-zinc-400">{stepName}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full py-4 bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white font-bold rounded-2xl text-base shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Go to Dashboard
            </button>
            <button className="w-full mt-3 py-3 text-sm font-semibold text-[#FF385C] hover:text-[#BD1E59] transition-colors">
              Feature This Listing
            </button>
          </div>
        )}

        {/* Step 8 - Featured Upsell */}
        {step === "featured-upsell" && (
          <div className="flex-1 flex flex-col justify-center py-8">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 mx-auto">
              <Sparkles className="size-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 text-center">Get More Visibility</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 text-center">
              Promote your listing to reach more customers
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Higher Search Ranking",
                "Featured Location Placement",
                "More Customer Views",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                  <Check className="size-4 text-amber-500 shrink-0" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { days: "7", price: "499", popular: false },
                { days: "15", price: "899", popular: true },
                { days: "30", price: "1,499", popular: false },
              ].map((pkg) => (
                <div
                  key={pkg.days}
                  className={cn(
                    "relative rounded-2xl p-4 text-center border-2 transition-all",
                    pkg.popular
                      ? "border-[#FF385C] bg-[#FF385C]/5 shadow-md shadow-red-500/10"
                      : "border-zinc-200 dark:border-zinc-700"
                  )}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                      Popular
                    </div>
                  )}
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{pkg.days}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Days</p>
                  <p className="text-lg font-bold text-[#FF385C]">৳{pkg.price}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-4 bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white font-bold rounded-2xl text-base shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Promote Now
            </button>
            <button
              onClick={() => router.push("/partner/dashboard")}
              className="w-full mt-3 py-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
