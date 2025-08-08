import React, { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

const Tag = ({ setAllTag ,allTag}) => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const tagAddHandler = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const updatedTags = [...tags, trimmedTag];
      setTags(updatedTags);
      setAllTag(updatedTags); 
      setNewTag('');
    }
  };

  const cancelHandler = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setAllTag(updatedTags); 
  };

  useEffect(()=>{
  if(allTag.length > 0){
    setTags(allTag);
  }
  },[])
  

  return (
    <>
      <label className="flex flex-col w-full">
        <p>
          Product Tags (for Search)<sup className="text-pink-400">*</sup>
        </p>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md w-full text-richblack-5"
          placeholder="Enter a tag"
        />
      </label>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-richblack-600 text-yellow-50 rounded-full px-3 py-1 flex items-center gap-2"
            >
              <span>{tag}</span>
              <RxCross2
                onClick={() => cancelHandler(tag)}
                className="cursor-pointer hover:text-pink-400 text-lg"
              />
            </div>
          ))}
        </div>
      )}

      <div
        className={`text-yellow-50 font-semibold cursor-pointer -mt-2 w-fit ${
          !newTag.trim() ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={tagAddHandler}
      >
        Add
      </div>
    </>
  );
};

export default Tag;
