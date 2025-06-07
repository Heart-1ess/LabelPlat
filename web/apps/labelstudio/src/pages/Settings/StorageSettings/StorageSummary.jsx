import { format } from "date-fns/esm";
import { Button } from "../../../components";
import { DescriptionList } from "../../../components/DescriptionList/DescriptionList";
import { Tooltip } from "@humansignal/ui";
import { modal } from "../../../components/Modal/Modal";
import { Oneof } from "../../../components/Oneof/Oneof";
import { getLastTraceback } from "../../../utils/helpers";

export const StorageSummary = ({ target, storage, className, storageTypes = [] }) => {
  const storageStatus = storage.status.replace(/_/g, " ").replace(/(^\w)/, (match) => match.toUpperCase());
  const last_sync_count = storage.last_sync_count ? storage.last_sync_count : 0;

  const tasks_existed =
    typeof storage.meta?.tasks_existed !== "undefined" && storage.meta?.tasks_existed !== null
      ? storage.meta.tasks_existed
      : 0;
  const total_annotations =
    typeof storage.meta?.total_annotations !== "undefined" && storage.meta?.total_annotations !== null
      ? storage.meta.total_annotations
      : 0;

  // help text for tasks and annotations
  const tasks_added_help = `${last_sync_count}个上次同步期间添加的新任务。`;
  const tasks_total_help = `${tasks_existed}个已经找到并同步的任务将不会再次添加到项目中。\n 此存储总共添加了${
    tasks_existed + last_sync_count
  }个任务`;
  const annotations_help = `上次同步期间已成功保存${last_sync_count}个注释。`;
  const total_annotations_help =
    typeof storage.meta?.total_annotations !== "undefined"
      ? `同步时项目中看到的注释总数为${storage.meta.total_annotations}个。`
      : "";

  const handleButtonClick = () => {
    const msg =
      `从项目${storage.project}和任务${storage.last_sync_job}` +
      `${target === "export" ? "导出到" : ""}${storage.type}存储${storage.id}失败，问题如下：\n\n` +
      `${getLastTraceback(storage.traceback)}\n\n` +
      `meta = ${JSON.stringify(storage.meta)}\n`;

    modal({
      title: "存储报错信息",
      body: (
        <>
          <pre style={{ background: "#eee", borderRadius: 5, padding: 10 }}>{msg}</pre>
          <Button
            size="compact"
            onClick={() => {
              navigator.clipboard.writeText(msg);
            }}
          >
            复制
          </Button>
          {target === "export" ? (
            <a
              style={{ float: "right" }}
              target="_blank"
              href="https://labelstud.io/guide/storage.html#Target-storage-permissions"
              rel="noreferrer"
            >
              检查目标存储文档
            </a>
          ) : (
            <a
              style={{ float: "right" }}
              target="_blank"
              href="https://labelstud.io/guide/storage.html#Source-storage-permissions"
              rel="noreferrer"
            >
              检查源存储文档
            </a>
          )}
        </>
      ),
      style: { width: "700px" },
      optimize: false,
      allowClose: true,
    });
  };

  return (
    <div className={className}>
      <DescriptionList>
        <DescriptionList.Item term="Type">
          {(storageTypes ?? []).find((s) => s.name === storage.type)?.title ?? storage.type}
        </DescriptionList.Item>

        <Oneof value={storage.type}>
          <SummaryS3 case={["s3", "s3s"]} storage={storage} />
          <GSCStorage case="gcs" storage={storage} />
          <AzureStorage case="azure" storage={storage} />
          <RedisStorage case="redis" storage={storage} />
          <LocalStorage case="localfiles" storage={storage} />
        </Oneof>

        <DescriptionList.Item
          term="Status"
          help={[
            "已初始化：存储已添加，但从未同步；足以启动 URI 链接解析",
            "排队：同步作业在队列中，但尚未开始",
            "正在进行：同步作业正在运行",
            "失败：同步作业已停止，出现一些错误",
            "已完成：同步作业已成功完成",
          ].join("\n")}
        >
          {storageStatus === "Failed" ? (
            <span style={{ cursor: "pointer", borderBottom: "1px dashed gray" }} onClick={handleButtonClick}>
              失败
            </span>
          ) : (
            storageStatus
          )}
        </DescriptionList.Item>

        {target === "export" ? (
          <DescriptionList.Item term="Annotations" help={`${annotations_help}\n${total_annotations_help}`}>
            <Tooltip title={annotations_help}>
              <span>{last_sync_count}</span>
            </Tooltip>
            <Tooltip title={total_annotations_help}>
              <span> (共{total_annotations}条)</span>
            </Tooltip>
          </DescriptionList.Item>
        ) : (
          <DescriptionList.Item term="Tasks" help={`${tasks_added_help}\n${tasks_total_help}`}>
            <Tooltip title={`${tasks_added_help}\n${tasks_total_help}`} style={{ whiteSpace: "pre-wrap" }}>
              <span>{last_sync_count + tasks_existed}</span>
            </Tooltip>
            <Tooltip title={tasks_added_help}>
              <span> (新增{last_sync_count}条)</span>
            </Tooltip>
          </DescriptionList.Item>
        )}

        <DescriptionList.Item term="Last Sync">
          {storage.last_sync ? format(new Date(storage.last_sync), "MMMM dd, yyyy ∙ HH:mm:ss") : "Not synced yet"}
        </DescriptionList.Item>
      </DescriptionList>
    </div>
  );
};

const SummaryS3 = ({ storage }) => {
  return <DescriptionList.Item term="Bucket">{storage.bucket}</DescriptionList.Item>;
};

const GSCStorage = ({ storage }) => {
  return <DescriptionList.Item term="Bucket">{storage.bucket}</DescriptionList.Item>;
};

const AzureStorage = ({ storage }) => {
  return <DescriptionList.Item term="Container">{storage.container}</DescriptionList.Item>;
};

const RedisStorage = ({ storage }) => {
  return (
    <>
      <DescriptionList.Item term="Path">{storage.path}</DescriptionList.Item>
      <DescriptionList.Item term="Host">
        {storage.host}
        {storage.port ? `:${storage.port}` : ""}
      </DescriptionList.Item>
    </>
  );
};

const LocalStorage = ({ storage }) => {
  return <DescriptionList.Item term="Path">{storage.path}</DescriptionList.Item>;
};
