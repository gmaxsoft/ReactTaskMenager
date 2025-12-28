export default function Contact() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kontakt</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Skontaktuj się z nami</h2>
        <div className="prose prose-gray max-w-none">
          <p>
            Jeśli masz pytania, sugestie lub potrzebujesz pomocy technicznej, skontaktuj się z nami.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800">Email</h3>
              <p className="text-gray-700">biuro@maxsoft.pl</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800">Telefon</h3>
              <p className="text-gray-700">+48791821908</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800">Godziny pracy</h3>
              <p className="text-gray-700">
                Poniedziałek - Piątek: 9:00 - 17:00<br />
                Sobota - Niedziela: Zamknięte
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>Uwaga:</strong> W przypadku problemów technicznych, prosimy o podanie szczegółowego opisu problemu oraz informacji o używanym systemie operacyjnym i przeglądarce.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}