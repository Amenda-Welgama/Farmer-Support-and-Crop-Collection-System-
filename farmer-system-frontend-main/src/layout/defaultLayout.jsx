import { Outlet } from "react-router-dom";
import SideNav from "../component/sideNav";
import TopNav from "../component/topNav";

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 rounded-b-xl top-0 h-screen w-50 border-r border-green-300 bg-white p-6 shadow-md z-10">
        <SideNav />
      </aside>

      {/* Main content wrapper with left margin equal to sidebar width */}
      <div className="ml-55 mr-5">
        {/* Fixed TopNav */}
        <header className="fixed top-0 left-50  right-0 h-16 bg-white shadow-lg border-b border-green-300 p-4 flex items-center justify-between z-10">
          <TopNav />
        </header>

        {/* Scrollable Content */}
        <main className="pt-20">
          <section className="bg-white p-6 rounded-lg shadow-md border border-green-300 min-h-[calc(100vh-80px)]">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
