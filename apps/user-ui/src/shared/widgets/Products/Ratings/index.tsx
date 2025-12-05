import React from "react";
import  {StarHalf, StarEmpty, StarFull } from "./StarFilled";

type RatingProps = {
  rating: number;
};
const Rating: React.FC<RatingProps> = ({ rating }) => {
  const stars = [];
  for(let i = 1 ; i <=5 ; i++){
    if(i<=rating){
        stars.push(<StarFull key={`star-${i}`}/>)
    }else if(i === Math.ceil(rating) && rating % 1 !== 0){
       stars.push(<StarHalf key={`empty-${i}`}/>)
    }else{
        stars.push(<StarEmpty key={`empty-${i}`}/>)
    }
  }
  return <div className="flex gap-1">{stars}</div>;
};

export default Rating;
