import { useEffect, useRef } from 'react';

export const useCopyWithSource = () => {
  const label = '来源：';

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) {
      return;
    }

    const handler = (e: ClipboardEvent) => {
      const text = window.getSelection()?.toString();
      const url = window.location.href.split('#')[0];
      const extraText = `\n\n${label}${url}`;
      const extraHtml = `<br/><br/>${label}<a href="${url}">${url}</a>`;

      e.preventDefault();
      e.clipboardData?.setData('text/plain', text + extraText);
      e.clipboardData?.setData('text/html', text + extraHtml);
    };

    elem.addEventListener('copy', handler);

    return () => elem.removeEventListener('copy', handler);
  }, []);

  return ref;
};
