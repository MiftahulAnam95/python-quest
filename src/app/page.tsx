import { redirect } from "next/navigation";

// Python Quest adalah website statis (HTML + CSS + Vanilla JS) yang berada di
// public/python-quest sehingga bisa langsung di-upload ke GitHub Pages.
export default function HomePage() {
  redirect("/python-quest/index.html");
}
