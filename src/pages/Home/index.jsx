import BarChart from "./compoents/BarChart";

const Home = () => {
  return (
    <div>
      <BarChart title={"用户活跃度"}></BarChart>
      <BarChart title={"用户喜爱度"}></BarChart>
    </div>
  );
};

export default Home;
