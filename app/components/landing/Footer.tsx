export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <span className="text-sm font-medium text-gray-400">Consultorios</span>
          </div>
          <p className="text-sm text-gray-500">
            Copyright © 2025 Consultorios. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

