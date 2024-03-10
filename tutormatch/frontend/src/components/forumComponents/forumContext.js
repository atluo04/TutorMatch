import React, { createContext, useContext, useState } from "react";

const ForumContext = createContext();

export const ForumProvider = ({ children }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [course, setCourse] = useState(null);


  return (
    <ForumContext.Provider
      value={{
        showCreatePost,
        setShowCreatePost,
        selectedPost,
        setSelectedPost,
        course, 
        setCourse,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};

export const useForum = () => {
  return useContext(ForumContext);
};
