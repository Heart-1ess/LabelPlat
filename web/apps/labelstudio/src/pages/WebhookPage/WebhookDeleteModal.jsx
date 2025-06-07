import { Button } from "../../components";
import { modal } from "../../components/Modal/Modal";
import { useModalControls } from "../../components/Modal/ModalPopup";
import { Space } from "../../components/Space/Space";
import { cn } from "../../utils/bem";

export const WebhookDeleteModal = ({ onDelete }) => {
  return modal({
    title: "删除",
    body: () => {
      const ctrl = useModalControls();
      const rootClass = cn("webhook-delete-modal");
      return (
        <div className={rootClass}>
          <div className={rootClass.elem("modal-text")}>
            您确定要删除该 Webhook 吗？此操作无法撤消。
          </div>
        </div>
      );
    },
    footer: () => {
      const ctrl = useModalControls();
      const rootClass = cn("webhook-delete-modal");
      return (
        <Space align="end">
          <Button
            className={rootClass.elem("width-button")}
            onClick={() => {
              ctrl.hide();
            }}
          >
            取消
          </Button>
          <Button
            look="destructive"
            className={rootClass.elem("width-button")}
            onClick={async () => {
              await onDelete();
              ctrl.hide();
            }}
          >
            删除
          </Button>
        </Space>
      );
    },
    style: { width: 512 },
  });
};
