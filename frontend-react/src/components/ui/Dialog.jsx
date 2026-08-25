import { AlertTriangle, Info, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import Button from './Button';

const DIALOG_ICONS = {
  confirm: { Icon: HelpCircle, color: 'var(--color-primary-600)', bg: 'var(--color-primary-50)' },
  danger: { Icon: AlertTriangle, color: 'var(--color-danger)', bg: 'var(--color-danger-50)' },
  info: { Icon: Info, color: 'var(--color-info)', bg: 'var(--color-primary-50)' },
  success: { Icon: CheckCircle2, color: 'var(--color-success)', bg: 'var(--color-success-50)' },
};

/**
 * Confirmation / alert dialog built on top of Modal.
 * `confirmText`/`cancelText` optional; `onConfirm`/`onCancel` handlers.
 */
export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'confirm',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  size = 'sm',
}) {
  const { Icon, color, bg } = DIALOG_ICONS[variant] || DIALOG_ICONS.confirm;

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      size={size}
      showClose={!loading}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex gap-4 items-start">
        <span
          className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
          style={{ background: bg, color }}
        >
          <Icon size={22} />
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted mt-2">{description}</p>}
        </div>
      </div>
    </Modal>
  );
}

export default Dialog;
