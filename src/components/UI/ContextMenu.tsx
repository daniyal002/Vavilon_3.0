import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  isEditing: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
    x,
    y,
    onEdit,
    onDelete,
    onCopy,
    onSave,
    onCancel,
    onClose,
    isEditing,
  }) => {
    return (
      <div
        className={`fixed bg-purple-900 text-purple-200 rounded-lg shadow-lg z-50
          ${window.innerWidth <= 640 ? 'w-11/12 left-1/2 transform -translate-x-1/2 bottom-4' : 'min-w-[150px]'}
        `}
        style={{ top: y, left: x }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {!isEditing && (
          <>
            {onEdit && (
              <button
                onClick={() => { onEdit(); onClose(); }}
                className="w-full text-left px-4 py-2 hover:bg-purple-800/50 text-sm"
              >
                Редактировать
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => { onDelete(); onClose(); }}
                className="w-full text-left px-4 py-2 hover:bg-purple-800/50 text-sm"
              >
                Удалить
              </button>
            )}
            {onCopy && (
              <button
                onClick={() => { onCopy(); onClose(); }}
                className="w-full text-left px-4 py-2 hover:bg-purple-800/50 text-sm"
              >
                Копировать
              </button>
            )}
          </>
        )}
        {isEditing && (
          <>
            {onSave && (
              <button
                onClick={() => { onSave(); onClose(); }}
                className="w-full text-left px-4 py-2 hover:bg-green-600/50 text-sm"
              >
                Сохранить
              </button>
            )}
            {onCancel && (
              <button
                onClick={() => { onCancel(); onClose(); }}
                className="w-full text-left px-4 py-2 hover:bg-red-600/50 text-sm"
              >
                Отменить
              </button>
            )}
          </>
        )}
      </div>
    );
  };

export default ContextMenu;