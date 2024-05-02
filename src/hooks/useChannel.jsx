import { useState, useEffect } from "react";
import { getChannelAPI } from "@/apis/article";
function useChannel() {
  const [channel, setChannel] = useState([]);
  useEffect(() => {
    //封装函数
    const getChanneList = async () => {
      const res = await getChannelAPI();
      setChannel(res.data.channels);
    };
    getChanneList();
  }, []);
  return {
    channel,
  };
}
export { useChannel };
