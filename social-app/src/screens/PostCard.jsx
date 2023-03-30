import { useParams } from "react-router-dom";
import { BiRepost , BiComment} from 'react-icons/bi';
import { FaLevelDownAlt, FaLevelUpAlt} from 'react-icons/fa';

function PostCard({country}) {
  const params = useParams();
  return (
    <div className="postCard">
      <h1 className="font-bold">{country.name.common}</h1>
      <p className="p-4 text-justify">Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
        Id distinctio quam, porro recusandae, fugiat rem ab obcaecati eaque sequi 
        temporibus hic deleniti maiores dicta sunt vel veniam cupiditate aspernatur architecto!</p>
      <div className="flex justify-around">
        <BiRepost/>
        <BiComment/>
        <FaLevelDownAlt/>
        <FaLevelUpAlt/>
      </div>
    </div>
  );
}

export default PostCard;
