import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
  Popconfirm,
  message,
} from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
// 导入资源
import { Table, Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import img404 from "@/assets/error.png";
import { useChannel } from "@/hooks/useChannel";
import { getArticleListAPI, delArticleAPI } from "@/apis/article";
import { useEffect, useState } from "react";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Article = () => {
  const navigate = useNavigate();
  const [params, setParmas] = useState({
    page: 1,
    per_page: 4,
    begin_pubdate: null,
    end_pubdate: null,
    status: null,
    channel_id: null,
  });
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  // 获取频道数据
  useEffect(() => {
    async function getList() {
      const res = await getArticleListAPI(params);
      setList(res.data.results);
      setCount(res.data.total_count);
    }
    getList();
  }, [params]);
  const { channel } = useChannel();
  //定义状态枚举
  const status = {
    1: <Tag color="warning">待审核</Tag>,
    2: <Tag color="green">审核通过</Tag>,
  };
  //筛选功能

  const onFinish = (value) => {
    //收集参数，不可变的方式
    setParmas({
      ...params,
      channel_id: value.channel_id,
      status: value.status,
      begin_pubdate: value.date[0].format("YYYY-MM-DD"),
      end_pubdate: value.date[1].format("YYYY-MM-DD"),
    });
  };

  //分页
  const onPageChange = (page) => {
    //修改数据依赖项
    console.log(page);
    setParmas({
      ...params,
      page: page.current,
    });
  };
  //删除
  const delArticle = async (data) => {
    try {
      await delArticleAPI(data.id);
      //重新渲染
      setParmas({ ...params });
      message.success("删除成功");
    } catch {
      message.error("删除失败");
    }
  };
  const columns = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 120,
      render: (cover) => {
        return (
          <img src={cover.images[0] || img404} width={80} height={60} alt="" />
        );
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      width: 220,
    },
    {
      title: "状态",
      dataIndex: "status",
      //data===1 ->待审核
      //data===2 ->审核通过
      render: (data) => status[data],
    },
    {
      title: "发布时间",
      dataIndex: "pubdate",
    },
    {
      title: "阅读数",
      dataIndex: "read_count",
    },
    {
      title: "评论数",
      dataIndex: "comment_count",
    },
    {
      title: "点赞数",
      dataIndex: "like_count",
    },
    {
      title: "操作",
      render: (data) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              onClick={() => navigate(`/publish?id=${data.id}`)}
              icon={<EditOutlined />}
            />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArticle(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  // 准备表格body数据
  const data = [
    {
      id: "8218",
      comment_count: 0,
      cover: {
        images: [],
      },
      like_count: 0,
      pubdate: "2019-03-11 09:00:00",
      read_count: 2,
      status: 2,
      title: "wkwebview离线化加载h5资源解决方案",
    },
  ];
  return (
    <div>
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: "文章列表" },
            ]}
          />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: "" }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={""}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={2}>审核通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select placeholder="请选择文章频道" style={{ width: 180 }}>
              {channel.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={{ total: count, pageSize: params.per_page }}
          onChange={onPageChange}
        />
      </Card>
    </div>
  );
};

export default Article;
