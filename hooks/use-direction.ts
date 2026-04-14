import { useEffect, useState } from "react";

export const useDirection = () => {
  const [dir, setDir] = useState(document.documentElement.dir || "ltr");

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDir(document.documentElement.dir)
    );
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return dir;
};
