import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CreatePost.css";
import { useUser } from "../userContext";
import { useForum } from "./forumComponents/forumContext";

const CreatePost = () => {
  const { uid, setUid } = useUser();
  const { course, setShowCreatePost } = useForum();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!uid) {
      alert("Please sign in.");
      return;
    }
    const err = checkValidPost();
    if (err !== null) {
      setErrorMessage(err);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("uid", uid);
      formData.append("title", title);
      formData.append("content", JSON.stringify(content));
      formData.append("image", selectedImage);
      formData.append("course", course);

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/create-post`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setShowCreatePost(false);
        console.log("Post submitted successfully.");
      } else {
        console.log(data.message);
        setErrorMessage("Problem submitting post.");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  const checkValidPost = () => {
    if (title.trim() === "") {
      return "Title must be filled out.";
    } else if (content.trim() === "") {
      return "Content must not be empty.";
    }
    return null;
  };

  return (
    <div className="form-container">
      <Form onSubmit={handleFormSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label className="form-label">Title</Form.Label>
          <Form.Control
            className="form-title-input"
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formContent">
          <Form.Label className="form-label">Content</Form.Label>
          <ReactQuill
            className="form-content-editor"
            theme="snow"
            value={content}
            onChange={(newContent) => setContent(newContent)}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Ask them anything..."
          />
        </Form.Group>

        <Form.Group controlId="formImage">
          <Form.Label className="form-label">Image</Form.Label>
          <Form.Control
            className="form-image-input"
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
        </Form.Group>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <Button className="form-submit-button" variant="primary" type="submit">
          Create Post
        </Button>
        <Button className="form-submit-button" variant="primary" onClick={() => setShowCreatePost(false)}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default CreatePost;

const quillModules = {
  toolbar: {
    container: [
      [{ header: "1" }, { header: "2" }, /*{ font: [] }*/],   //removing fonts for now
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      //["link", "image", "video"],  //disabled for now, embedding an image doesn't really work, so will just use the image upload
      ["clean"],
      ["code-block"],
    ],
    handlers: {
      image: imageHandler,
    },
  },
};

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block",
];

function imageHandler() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    if (/^image\//.test(file.type)) {
      const formData = new FormData();
      formData.append("image", file);

      const imageUrl = URL.createObjectURL(file);
      const range = this.quill.getSelection(true);
      this.quill.insertEmbed(range.index, "image", imageUrl);
    } else {
      console.warn("You could only upload images.");
    }
  };
}
