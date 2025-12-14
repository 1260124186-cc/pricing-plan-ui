import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, show, onClose, duration = 2000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // 使用setTimeout确保DOM更新后再显示
      setTimeout(() => setIsVisible(true), 10);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 300); // 等待动画完成
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div className={`toast ${isVisible ? 'show' : 'hide'}`}>
      {message}
    </div>
  );
}
