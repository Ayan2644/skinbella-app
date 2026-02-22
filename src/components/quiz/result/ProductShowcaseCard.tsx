import productsFlatlay from "@/assets/result/products-flatlay.jpg";

export default function ProductShowcaseCard() {
  return (
    <section className="px-5">
      <div className="result-card-premium overflow-hidden p-0">
        <img
          src={productsFlatlay}
          alt="Produtos do protocolo"
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>
    </section>
  );
}
