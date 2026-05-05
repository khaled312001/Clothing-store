export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-700 animate-spin" />
        <div className="text-sm text-brand-600 font-semibold">جاري التحميل…</div>
      </div>
    </div>
  );
}
