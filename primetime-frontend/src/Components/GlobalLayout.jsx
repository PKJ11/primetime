// src/components/GlobalLayout.jsx
import { Outlet } from 'react-router-dom';

function GlobalLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header (optional) */}
      {/* <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Game App</h1>
      </header> */}

      {/* Content area */}
      <main className="flex-1 container mx-auto p-4 ipad-portrait:max-w-[1024px] ipad-landscape:max-w-[1366px]">
  <Outlet />
</main>

      {/* Footer (optional) */}
      {/* <footer className="bg-blue-600 text-white p-4 text-center">
        <p>&copy; 2023 Game App. All rights reserved.</p>
      </footer> */}
    </div>
  );
}

export default GlobalLayout;