import dynamic from "next/dynamic";

const DateTimePicker = dynamic(
  () =>
    import("@/components/picker/datetime").then((mod) => mod.DateTimePicker),
  {
    loading: () => <p>Carregando...</p>,
  }
);

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <DateTimePicker />
    </div>
  );
}
