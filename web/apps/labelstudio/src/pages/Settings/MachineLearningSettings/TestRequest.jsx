import { useCallback, useState } from "react";
import { Button } from "../../../components";
import { useAPI } from "../../../providers/ApiProvider";
import { Caption } from "../../../components/Caption/Caption";
import { Block, Elem } from "../../../utils/bem";

export const TestRequest = ({ backend }) => {
  const api = useAPI();
  const [testResponse, setTestResponse] = useState({});

  const sendTestRequest = useCallback(
    async (backend) => {
      const response = await api.callApi("predictWithML", {
        params: {
          pk: backend.id,
          random: true,
        },
      });

      if (response) setTestResponse(response);
    },
    [setTestResponse],
  );

  return (
    <Block name="test-request">
      <Button
        onClick={() => {
          sendTestRequest(backend);
        }}
      >
        发送请求
      </Button>
      <Caption>这将使用随机任务向机器学习后端的预测端点发送测试请求。</Caption>
      <Elem name={"blocks"}>
        <Elem name={"left"}>
          <h4>请求</h4>
          <Elem name={"code"}>
            <pre>
              {testResponse.url && "POST"} {testResponse.url}
              <br />
              <br />
              {JSON.stringify(testResponse.request, null, 2)}
            </pre>
          </Elem>
        </Elem>
        <Elem name={"right"}>
          <h4>返回值</h4>
          <Elem name={"code"}>
            <pre>
              {testResponse.status}
              <br />
              <br />
              {JSON.stringify(testResponse.response, null, 2)}
            </pre>
          </Elem>
        </Elem>
      </Elem>
    </Block>
  );
};
