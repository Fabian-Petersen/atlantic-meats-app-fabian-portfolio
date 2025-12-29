import CardItem from "./CardItem";

const Cards = () => {
  return (
    <div
      className="
        grid w-full
        grid-cols-2 lg:grid-cols-4 gap-2"
    >
      <CardItem />
    </div>
  );
};

export default Cards;
