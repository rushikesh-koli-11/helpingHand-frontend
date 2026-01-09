import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"
import './styles/PostUpdateModel.css'
import Swal from "sweetalert2";

const PostUpdateModal = ({ isOpen, closeModal, postUpdate, fundraiserId }) => {
  const [content, setContent] = useState("");
  if (!isOpen) return null; // Don't render if modal is closed

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(fundraiserId);
    postUpdate({content, fundraiserId}); // Call the parent function to post update
    setContent("");
    closeModal();

    Swal.fire("Success", "Update posted successfully!", "success")
  };

  return (
    <Modal show={isOpen} onHide={closeModal} centered backdrop="static" className="post-update-modal">
    <Modal.Header closeButton>
      <Modal.Title>Post an Update</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter your update..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={closeModal}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        Post
      </Button>
    </Modal.Footer>
  </Modal>
  );
};

export default PostUpdateModal;
