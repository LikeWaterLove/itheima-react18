import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./index.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  postArticleAPI,
  getArticleInfoAPI,
  updateArticleAPI,
} from "@/apis/article";
import { useEffect, useState } from "react";
import { useChannel } from "@/hooks/useChannel";

const { Option } = Select;

const Publish = () => {
  const navigate = useNavigate();
  const { channel } = useChannel();
  //提交表单
  const onFinish = async (values) => {
    if (imageList.length !== imageType) return message.warning("请上传封面图");

    const { title, content, channel_id } = values;
    const articleParams = {
      title,
      content,
      cover: {
        type: imageType,
        images: imageList.map((item) => {
          if (item.response) {
            item.response.data.url;
          } else {
            return item.url;
          }
        }),
      },
      channel_id,
    };
    if (articleId) {
      try {
        await updateArticleAPI({ ...articleParams, id: articleId });
        navigate("/article");
        message.success("更新文章成功");
      } catch {
        message.error("更新文章失败");
      }
    } else {
      try {
        await postArticleAPI(articleParams);
        navigate("/article");
        message.success("发布文章成功");
      } catch {
        message.error("发布文章失败");
      }
    }
  };

  //图片上传
  const [imageList, setImageList] = useState([]);
  const onChange = (value) => {
    setImageList(value.fileList);
  };
  //切换图片类型
  const [imageType, setImageType] = useState(0);
  const onImageChange = (e) => {
    setImageType(e.target.value);
  };
  //回填数据
  const [searchParmas] = useSearchParams();
  const articleId = searchParmas.get("id");
  const [form] = Form.useForm(); //获取实例
  useEffect(() => {
    //通过id获取数据
    async function getArticleInfo() {
      const res = await getArticleInfoAPI(articleId);
      const data = res.data;
      form.setFieldsValue({ ...data, type: data.cover.type });
      setImageType(data.cover.type);
      setImageList(
        data.cover.images.map((url) => {
          return { url };
        })
      );
      console.log(data.cover.images);
    }
    if (articleId) {
      getArticleInfo();
    }
  }, [articleId, form]);
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: articleId ? "编辑文章" : "发布文章" },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channel.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onImageChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 && (
              <Upload
                maxCount={imageType}
                listType="picture-card"
                showUploadList
                action={"http://geek.itheima.net/v1_0/upload"}
                name="image"
                onChange={onChange}
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? "更新文章" : "发布文章"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
