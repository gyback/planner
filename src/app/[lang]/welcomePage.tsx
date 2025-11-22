import { getDictionary } from "~/lib/dictionaries";

export default async function WelcomePage() {
  const dictionary = await getDictionary();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-4xl font-bold text-blue-600">
          {dictionary.welcomePage.title}
        </h1>
        <p className="mb-4 text-center text-lg text-gray-700">
          {dictionary.welcomePage.subtitle}
        </p>
      </div>
    </div>
  );
}
