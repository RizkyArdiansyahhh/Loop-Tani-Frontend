import CardProduct from "./card-product";

// 1. Buat array of objects dengan atribut yang persis sesuai kebutuhan CardProduct
const dummyProducts = [
  {
    id: 1,
    image: [
      {
        id: 101,
        url: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783445457/Tongkol_jagung_si2fwa.jpg",
        isPrimary: true,
      },
      {
        id: 102,
        url: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783445457/Tongkol_jagung_si2fwa.jpg",
        isPrimary: false,
      },
    ],
    category: "agricultural-waste",
    name: "Tongkol Jagung",
    rating: 4.5,
    price: 7000,
    location: "Pekanbaru, Riau",
    seller: "Lestari Farm",
  },
  {
    id: 2,
    image: [
      {
        id: 201,
        url: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783445854/images_2_lduzjc.jpg",
        isPrimary: true,
      },
    ],
    category: "processed-product",
    name: "Biochar",
    rating: 4.8,
    price: 15.5,
    location: "Kampar, Riau",
    seller: "Sawa",
  },
  {
    id: 3,
    image: [
      {
        id: 301,
        url: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783446062/d_sxojwe.jpg",
        isPrimary: true,
      },
    ],
    category: "secondhand",
    name: "Mesin Traktor Mini",
    rating: 5.0,
    price: 2210000,
    location: "Pekanbaru, Riau",
    seller: "Ahmad",
  },
];

const CollectionsProduct = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* 2. Map data dummy ke dalam komponen CardProduct */}
      {dummyProducts.map((product) => (
        <CardProduct
          key={product.id}
          image={product.image} // Atribut image mengambil dari array image di dalam object
          category={product.category} // Atribut category
          name={product.name} // Atribut name
          rating={product.rating} // Atribut rating
          price={product.price} // Atribut price
          location={product.location} // Atribut location
          seller={product.seller} // Atribut seller
        />
      ))}
    </div>
  );
};

export default CollectionsProduct;
