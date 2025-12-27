export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="px-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} IT Task Manager. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Pomoc
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Kontakt
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Dokumentacja
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

