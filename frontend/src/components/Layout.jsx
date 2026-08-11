import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

// export default function Layout() {
//   return (
//     <>
//       <Header />
//       <main style={{ minHeight: "70vh" }}>
//         <Outlet />
//       </main>
//       <Footer />
//     </>
//   );
// }