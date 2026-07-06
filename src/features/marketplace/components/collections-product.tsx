import CardProduct from "./card-product";

const images = [
  {
    id: 1,
    url: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783326116/NIKE_ASTROGRABBER_LTHR_SE_er5cdn.avif",
    isPrimary: true,
  },
  {
    id: 2,
    url: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783328318/NIKE_ASTROGRABBER_LTHR_SE_2_hcvk91.avif",
    isPrimary: false,
  },
];

const CollectionsProduct = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
      {Array.from({ length: 8 }).map((_, index) => (
        <CardProduct
          key={index}
          image={images}
          category="Category"
          name="Ampas Kopi"
          rating={4.5}
          price={123456}
          location="Pekanbaru, Riau"
          seller="Seller"
        />
      ))}
    </div>
  );
};

export default CollectionsProduct;
