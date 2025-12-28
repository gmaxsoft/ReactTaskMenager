export default function Help() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pomoc</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Jak korzystać z aplikacji</h2>
        <div className="prose prose-gray max-w-none">
          <p>
            Witaj w aplikacji Task Manager! Poniżej znajdziesz podstawowe informacje na temat korzystania z systemu.
          </p>

          <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">Zarządzanie zadaniami</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Przejdź do sekcji "Zadania" w menu nawigacyjnym</li>
            <li>Użyj przycisku "Dodaj zadanie" aby utworzyć nowe zadanie</li>
            <li>W tabeli zadań możesz edytować istniejące zadania</li>
            <li>Zadania są automatycznie przypisywane do aktualnie zalogowanego użytkownika</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">Zarządzanie użytkownikami (tylko administratorzy)</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Przejdź do sekcji "Użytkownicy" w menu nawigacyjnym</li>
            <li>Możesz dodawać nowych użytkowników</li>
            <li>Możesz edytować role i status aktywności użytkowników</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">Dashboard</h3>
          <p className="text-gray-700">
            Na stronie głównej znajdziesz statystyki swoich zadań oraz listę ostatnio dodanych zadań.
          </p>
        </div>
      </div>
    </div>
  );
}