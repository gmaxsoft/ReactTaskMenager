import { useNavigation } from '../../context/NavigationContext';

export default function Footer() {
  const { setCurrentView } = useNavigation();
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="px-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Menadżer Zadań. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('help')}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Pomoc
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Kontakt
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}







