import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../html/CreatePost.css";
import { addPost } from "../user/post";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [primaryCategory, setPrimaryCategory] = useState("");
  const [secondaryCategory, setSecondaryCategory] = useState("");
  const [showSecondaryCategory, setShowSecondaryCategory] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(selectedImage);
    const postRef = addPost(
      title,
      JSON.stringify(content),
      selectedImage,
      primaryCategory,
      secondaryCategory
    )
      .then(() => {
        console.log("added post!");
        navigate(-1); //placeholder for now, need to figure out what to do in this case
      })
      .catch((error) => {
        console.error(error); //should display this error to user
      });
  };

  const handlePrimaryCategoryChange = (event) => {
    const primaryCategoryValue = event.target.value;
    setPrimaryCategory(primaryCategoryValue); //primary categories can be added
    setShowSecondaryCategory(primaryCategoryValue === "class"); // Show secondary category for 'class'
    setSecondaryCategory(""); // Reset secondary category when primary category changes
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

        <Form.Group controlId="formPrimaryCategory">
          <Form.Label className="form-label">Category</Form.Label>
          <Form.Control
            className="form-class-select"
            as="select"
            value={primaryCategory}
            onChange={handlePrimaryCategoryChange}
          >
            <option value="">Select a Category</option>
            <option value="class">Class</option>
            {/* Add more primary category options as needed */}
          </Form.Control>
        </Form.Group>

        {showSecondaryCategory && (
          <Form.Group controlId="formSecondaryCategory">
            <Form.Label className="form-label">Class</Form.Label>
            <Form.Control
              className="form-class-select"
              as="select"
              value={secondaryCategory}
              onChange={(e) => setSecondaryCategory(e.target.value)}
            >
              <option value="">Select a Class</option>
              <option value="cs35l">CS 35L</option>
              <option value="cs131">CS 131</option>
              <option value="cs180">CS 180</option>
              {/* Add more secondary category options as needed */}
            </Form.Control>
          </Form.Group>
        )}

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

        <Button className="form-submit-button" variant="primary" type="submit">
          Create Post
        </Button>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </Form>
    </div>
  );
};

export default CreatePost;

const quillModules = {
  toolbar: {
    container: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
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

  input.onchange = async () => {
    const file = input.files[0];
    if (/^image\//.test(file.type)) {
      const formData = new FormData();
      formData.append("image", file);

      // Replace 'YOUR_IMAGE_UPLOAD_ENDPOINT' with your actual image upload endpoint
      const response = await fetch("YOUR_IMAGE_UPLOAD_ENDPOINT", {
        method: "POST",
        body: formData,
      });

      const imageUrl = await response.json();
      const range = this.quill.getSelection(true);
      this.quill.insertEmbed(range.index, "image", imageUrl);
    } else {
      console.warn("You could only upload images.");
    }
  };
}
