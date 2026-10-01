import { useEffect } from "react";

function CustomCursor() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cursor = document.getElementById("cursor");
    const root = document.documentElement;
    const interactive = "a, button, input, select, textarea, label, [role=\"button\"], [data-cursor]";

    function handleMouseMove(event) {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add("visible");
      root.classList.add("has-custom-cursor");
      cursor.classList.toggle("hover", event.target instanceof Element && event.target.closest(interactive));
    }

    function handleDocumentLeave() {
      cursor.classList.remove("visible");
    }

    function handleDocumentEnter() {
      cursor.classList.add("visible");
    }

    function handleMouseDown() {
      cursor.classList.add("down");
    }

    function handleMouseUp() {
      cursor.classList.remove("down");
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleDocumentLeave);
    document.addEventListener("mouseenter", handleDocumentEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleDocumentLeave);
      document.removeEventListener("mouseenter", handleDocumentEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return <div id="cursor" aria-hidden="true"><div className="c" /></div>;
}

export default CustomCursor;