export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-slate-500">Coming soon. We are working hard to bring you this page.</p>
    </div>
  );
}

// We'll use this for several pages to avoid 404s
