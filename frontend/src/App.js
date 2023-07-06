import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import axios from "axios";

const { Item } = Form;

const App = () => {
  const [posts, setPosts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/v1/posts");
      setPosts(response.data);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleAdd = async (values) => {
    try {
      const response = await axios.post("/api/v1/posts", values);
      setPosts((prevPosts) => [, response.data, ...prevPosts]);
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleEdit = async (values) => {
    const { title, body } = values;
    const updatedPost = {
      id: editingPostId,
      title,
      body,
    };

    try {
      const response = await axios.put(
        `/api/v1/posts/${editingPostId}`,
        updatedPost
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editingPostId ? response.data : post
        )
      );
      setVisible(false);
      setEditingPostId(null);
      form.resetFields();
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/posts/${id}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button onClick={() => showEditModal(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </span>
      ),
    },
  ];

  const showAddModal = () => {
    setVisible(true);
  };

  const showEditModal = (record) => {
    form.setFieldsValue(record);
    setVisible(true);
    setEditingPostId(record.id);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Button onClick={showAddModal}>Add Post</Button>
      <Table dataSource={posts} columns={columns} />

      <Modal
        visible={visible}
        title={editingPostId ? "Edit Post" : "Add Post"}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {editingPostId ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={editingPostId ? handleEdit : handleAdd}
          onFinishFailed={(error) => console.error(error)}
        >
          <Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Item>
          <Item
            name="body"
            label="Body"
            rules={[{ required: true, message: "Please enter a body" }]}
          >
            <Input.TextArea />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
