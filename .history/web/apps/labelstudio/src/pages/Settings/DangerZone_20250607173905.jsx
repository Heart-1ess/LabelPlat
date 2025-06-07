import { useMemo, useState } from "react";
import { useHistory } from "react-router";
import { Button } from "../../components";
import { Label } from "../../components/Form";
import { confirm } from "../../components/Modal/Modal";
import { Spinner } from "../../components/Spinner/Spinner";
import { useAPI } from "../../providers/ApiProvider";
import { useProject } from "../../providers/ProjectProvider";
import { cn } from "../../utils/bem";

export const DangerZone = () => {
  const { project } = useProject();
  const api = useAPI();
  const history = useHistory();
  const [processing, setProcessing] = useState(null);

  const handleOnClick = (type) => () => {
    confirm({
      title: "Action confirmation",
      body: "You're about to delete all things. This action cannot be undone.",
      okText: "Proceed",
      buttonLook: "destructive",
      onOk: async () => {
        setProcessing(type);
        if (type === "annotations") {
          // console.log('delete annotations');
        } else if (type === "tasks") {
          // console.log('delete tasks');
        } else if (type === "predictions") {
          // console.log('delete predictions');
        } else if (type === "reset_cache") {
          await api.callApi("projectResetCache", {
            params: {
              pk: project.id,
            },
          });
        } else if (type === "tabs") {
          await api.callApi("deleteTabs", {
            body: {
              project: project.id,
            },
          });
        } else if (type === "project") {
          await api.callApi("deleteProject", {
            params: {
              pk: project.id,
            },
          });
          history.replace("/projects");
        }
        setProcessing(null);
      },
    });
  };

  const buttons = useMemo(
    () => [
      {
        type: "annotations",
        disabled: true, //&& !project.total_annotations_number,
        label: `删除${project.total_annotations_number}个标注`,
      },
      {
        type: "tasks",
        disabled: true, //&& !project.task_number,
        label: `删除${project.task_number}个任务`,
      },
      {
        type: "predictions",
        disabled: true, //&& !project.total_predictions_number,
        label: `删除${project.total_predictions_number}个预标注`,
      },
      {
        type: "reset_cache",
        help: "如果您由于现有标签的验证错误而无法修改标签配置，但您确信这些标签不存在，则重置缓存可能会有所帮助。您可以使用此操作重置缓存并重试。",
        label: "刷新缓存",
      },
      {
        type: "tabs",
        help: "如果数据管理器未加载，删除所有数据管理器选项卡可能会有所帮助。",
        label: "删除所有选项卡",
      },
      {
        type: "project",
        help: "删除项目将从数据库中删除所有任务、注释和项目数据。",
        label: "删除项目",
      },
    ],
    [project],
  );

  return (
    <div className={cn("simple-settings")}>
      <h1>危险区</h1>
      <Label description="Perform these actions at your own risk. Actions you take on this page can't be reverted. Make sure your data is backed up." />

      {project.id ? (
        <div style={{ marginTop: 16 }}>
          {buttons.map((btn) => {
            const waiting = processing === btn.type;
            const disabled = btn.disabled || (processing && !waiting);

            return (
              btn.disabled !== true && (
                <div className={cn("settings-wrapper")} key={btn.type}>
                  <h3>{btn.label}</h3>
                  {btn.help && <Label description={btn.help} style={{ width: 600, display: "block" }} />}
                  <Button
                    key={btn.type}
                    look="danger"
                    disabled={disabled}
                    waiting={waiting}
                    onClick={handleOnClick(btn.type)}
                    style={{ marginTop: 16 }}
                  >
                    {btn.label}
                  </Button>
                </div>
              )
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <Spinner size={32} />
        </div>
      )}
    </div>
  );
};

DangerZone.title = "危险区";
DangerZone.path = "/danger-zone";
