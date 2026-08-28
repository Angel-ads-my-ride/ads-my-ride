function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}

function StatSkeleton({ tone }: { tone: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className={`w-9 h-9 rounded-xl border mb-3 ${tone}`} />
      <Block className="h-6 sm:h-7 w-20 mb-2" />
      <Block className="h-3 w-24" />
    </div>
  );
}

function ListRowSkeleton({ withProgress = false }: { withProgress?: boolean }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <Block className="h-9 w-9 flex-shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <Block className="h-4 w-2/3" />
        <Block className="h-3 w-1/3" />
      </div>
      {withProgress ? (
        <div className="hidden sm:block w-28 space-y-2">
          <Block className="h-2 w-full" />
          <Block className="h-3 w-12 ml-auto" />
        </div>
      ) : (
        <Block className="h-6 w-20 flex-shrink-0" />
      )}
    </div>
  );
}

export function DashboardPageSkeleton({ advertiser = false }: { advertiser?: boolean }) {
  const statTones = [
    "bg-green-50 border-green-100",
    "bg-blue-50 border-blue-100",
    "bg-purple-50 border-purple-100",
    "bg-zinc-50 border-zinc-100",
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10" role="status" aria-label="Chargement">
      <span className="sr-only">Chargement</span>
      <div className="mb-6 sm:mb-8 space-y-3">
        <Block className="h-7 sm:h-8 w-64 max-w-full" />
        <Block className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statTones.map((tone) => (
          <StatSkeleton key={tone} tone={tone} />
        ))}
      </div>

      {advertiser ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <Block className="h-5 w-28" />
            <Block className="h-5 w-16" />
          </div>
          <div className="divide-y divide-gray-100">
            {["campaign-1", "campaign-2", "campaign-3"].map((key) => (
              <div key={key} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <Block className="h-14 w-full sm:w-20 flex-shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Block className="h-4 w-56 max-w-full" />
                  <Block className="h-3 w-80 max-w-full" />
                </div>
                <div className="w-full sm:w-28 space-y-2">
                  <Block className="h-2 w-full" />
                  <Block className="h-3 w-12 sm:ml-auto" />
                </div>
                <div className="flex gap-2">
                  <Block className="h-8 w-8" />
                  <Block className="h-8 w-8" />
                  <Block className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
              <Block className="h-5 w-36" />
              <Block className="h-5 w-28" />
            </div>
            <div className="space-y-3">
              {["booking-1", "booking-2", "booking-3"].map((key) => (
                <ListRowSkeleton key={key} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {["vehicle", "wallet"].map((key) => (
              <div key={key} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
                <Block className="h-5 w-32" />
                <ListRowSkeleton withProgress />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export function HomePageSkeleton() {
  return (
    <main className="min-h-screen bg-white" role="status" aria-label="Chargement">
      <span className="sr-only">Chargement</span>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 border-b border-gray-100">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Block className="h-10 w-10" />
          <div className="hidden sm:flex gap-8">
            <Block className="h-4 w-16" />
            <Block className="h-4 w-20" />
            <Block className="h-4 w-16" />
          </div>
          <div className="flex gap-3">
            <Block className="h-9 w-24" />
            <Block className="h-9 w-24" />
          </div>
        </div>
      </div>

      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-2xl space-y-6">
          <Block className="h-20 w-20 mx-auto rounded-2xl" />
          <Block className="h-4 w-80 max-w-full mx-auto" />
          <div className="bg-white border-2 border-zinc-200 rounded-2xl p-6 sm:p-7 shadow-xl shadow-zinc-100/60 space-y-5">
            <div className="flex items-center gap-3">
              <Block className="h-8 w-8" />
              <div className="space-y-2 flex-1">
                <Block className="h-4 w-40" />
                <Block className="h-3 w-56 max-w-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Block className="h-12 w-full" />
              <Block className="h-12 w-full" />
            </div>
            <Block className="h-12 w-full" />
          </div>
        </div>
      </section>
    </main>
  );
}

export function AuthPageSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12" role="status" aria-label="Chargement">
      <span className="sr-only">Chargement</span>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 space-y-4">
          <Block className="h-16 w-16 mx-auto rounded-2xl" />
          <Block className="h-7 w-48 mx-auto" />
          <Block className="h-4 w-72 max-w-full mx-auto" />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Block className="h-12 w-full" />
            <Block className="h-12 w-full" />
          </div>
          <Block className="h-12 w-full" />
          <Block className="h-12 w-full" />
          <Block className="h-12 w-full" />
        </div>
      </div>
    </main>
  );
}
