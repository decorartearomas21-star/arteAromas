import PagePdp from "./pdp";
const products = [
  {
    id: "1",
    name: "Vela Aromatica Lumière Cimento 1",
    price: 200,
    img: "/imagem1.jpg",
    discont: 0,
    description: "Descrição do produto",
  },
  {
    id: "2",
    name: "Vela Aromatica Lumière Cimento 2",
    price: 130,
    img: "/imagem1.jpg",
    discont: 30,
    description: "Descrição do produto",
  },
  {
    id: "3",
    name: "Vela Aromatica Lumière Cimento 3",
    price: 110,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    id: "4",
    name: "Vela Aromatica Lumière Cimento 4",
    price: 100,
    img: "/imagem1.jpg",
    discont: 3,
    description: "Descrição do produto",
  },
  {
    id: "5",
    name: "Vela Aromatica Lumière Cimento 5",
    price: 100,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    id: "6",
    name: "Vela Aromatica Lumière Cimento 6",
    price: 100,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    id: "7",
    name: "Vela Aromatica Lumière Cimento 7",
    price: 200,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    id: "8",
    name: "Vela Aromatica Lumière Cimento 8",
    price: 130,
    img: "/imagem1.jpg",
    discont: 30,
    description: "Descrição do produto",
  },
  {
    id: "9",
    name: "Vela Aromatica Lumière Cimento 9",
    price: 110,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    id: "10",
    name: "Vela Aromatica Lumière Cimento 10",
    price: 100,
    img: "/imagem1.jpg",
    discont: 3,
    description: "Descrição do produto",
  },
  {
    id: "11",
    name: "Vela Aromatica Lumière Cimento 11",
    price: 100,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    id: "12",
    name: "Vela Aromatica Lumière Cimento 12",
    price: 100,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
];
export default async function Page({ params }) {
  const { id } = await params;
  
  const item = products.find((item) => item.id === id);

  return (
      <PagePdp item={item}/> 
  );
}