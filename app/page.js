import ModelViewer from "./modelViewer";


export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>نمایش مبل سه‌بعدی در محیط خانه</h1>
      <ModelViewer />
      <p>برای مشاهده مدل در محیط واقعی، روی دکمه AR کلیک کنید.</p>
    </main>
  );
}
