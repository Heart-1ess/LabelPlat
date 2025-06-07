import { useState } from "react";
import { Button } from "../../../components";
import { ErrorWrapper } from "../../../components/Error/Error";
import { InlineError } from "../../../components/Error/InlineError";
import { Form, Input, Select, TextArea, Toggle } from "../../../components/Form";
import "./MachineLearningSettings.scss";

const CustomBackendForm = ({ action, backend, project, onSubmit }) => {
  const [selectedAuthMethod, setAuthMethod] = useState("NONE");
  const [, setMLError] = useState();

  return (
    <Form
      action={action}
      formData={{ ...(backend ?? {}) }}
      params={{ pk: backend?.id }}
      onSubmit={async (response) => {
        if (!response.error_message) {
          onSubmit(response);
        }
      }}
    >
      <Input type="hidden" name="project" value={project.id} />

      <Form.Row columnCount={1}>
        <Input name="title" label="名称" placeholder="项目名称" required />
      </Form.Row>

      <Form.Row columnCount={1}>
        <Input name="url" label="机器学习后端接口" required />
      </Form.Row>

      <Form.Row columnCount={2}>
        <Select
          name="auth_method"
          label="选择鉴权方法"
          options={[
            { label: "无", value: "NONE" },
            { label: "基本鉴权方法", value: "BASIC_AUTH" },
          ]}
          value={selectedAuthMethod}
          onChange={setAuthMethod}
        />
      </Form.Row>

      {(backend?.auth_method === "BASIC_AUTH" || selectedAuthMethod === "BASIC_AUTH") && (
        <Form.Row columnCount={2}>
          <Input name="basic_auth_user" label="账号" />
          {backend?.basic_auth_pass_is_set ? (
            <Input name="basic_auth_pass" label="密码" type="password" placeholder="********" />
          ) : (
            <Input name="basic_auth_pass" label="密码" type="password" />
          )}
        </Form.Row>
      )}

      <Form.Row columnCount={1}>
        <TextArea
          name="extra_params"
          label="模型连接期间传递的任何额外参数"
          style={{ minHeight: 120 }}
        />
      </Form.Row>

      <Form.Row columnCount={1}>
        <Toggle
          name="is_interactive"
          label="交互式预注释"
          description="如果启用，一些标记工具将在注释过程中以交互方式向机器学习后端发送请求。"
        />
      </Form.Row>

      <Form.Actions>
        <Button type="submit" look="primary" onClick={() => setMLError(null)}>
          验证并保存
        </Button>
      </Form.Actions>

      <Form.ResponseParser>
        {(response) => (
          <>
            {response.error_message && (
              <ErrorWrapper
                error={{
                  response: {
                    detail: `${backend ? "保存" : "添加新的"}机器学习后端失败。`,
                    exc_info: response.error_message,
                  },
                }}
              />
            )}
          </>
        )}
      </Form.ResponseParser>

      <InlineError />
    </Form>
  );
};

export { CustomBackendForm };
