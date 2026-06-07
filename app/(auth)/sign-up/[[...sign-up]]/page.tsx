import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-50 to-slate-200">
      
      {/* LEFT SIDE - AUTH */}
      <div className="h-full flex flex-col items-center justify-center px-6">
        
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <h1 className="font-bold text-4xl text-slate-900">
              Create your account
            </h1>
            <p className="text-sm text-slate-500">
              Sign Up to continue
            </p>
          </div>

          {/* Clerk Box */}
          <div className="bg-white rounded-2xl shadow-xl border p-6">
            <ClerkLoaded>
              <SignUp path="/sign-up" />
            </ClerkLoaded>

            <ClerkLoading>
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
              </div>
            </ClerkLoading>
          </div>

          {/* Small footer text */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Secure authentication powered by Clerk
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-b from-indigo-700 via-blue-700 to-slate-900 text-white relative overflow-hidden">
      
      {/* soft background glow */}
      <div className="absolute w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative space-y-6 max-w-md">
        
        <h2 className="text-4xl font-bold leading-tight">
          Your finances, unified in one place
        </h2>

        <p className="text-white/80 text-lg">
          Connect your bank accounts or import your data securely to get a real-time view of your spending, income, and savings.
        </p>

        <div className="space-y-3 text-white/90 mt-6">
          <div>✔ Secure bank-level connections</div>
          <div>✔ Automatic transaction tracking</div>
          <div>✔ Smart insights & spending breakdowns</div>
          <div>✔ Import CSV or connect accounts instantly</div>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10">
          <p className="text-sm text-white/80">
            Built for privacy-first financial tracking. You stay in control of your data.
          </p>
        </div>

      </div>
    </div>
    </div>
  );
}