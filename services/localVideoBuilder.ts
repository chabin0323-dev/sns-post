import type { AutoVideoResult, BuzzScene } from '../types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
};

const wrapLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) => {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  if (words.length === 1) {
    const chars = text.split('');
    let charLine = '';
    chars.forEach((char) => {
      const test = charLine + char;
      if (ctx.measureText(test).width > maxWidth && charLine) {
        lines.push(charLine);
        charLine = char;
      } else {
        charLine = test;
      }
    });
    if (charLine) lines.push(charLine);
    return lines;
  }

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });

  if (line) lines.push(line);
  return lines;
};

const createSceneImage = (
  scene: BuzzScene,
  index: number,
  total: number
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  const gradients = [
    ['#0f172a', '#1d4ed8'],
    ['#581c87', '#db2777'],
    ['#1f2937', '#f59e0b'],
    ['#111827', '#10b981'],
    ['#312e81', '#ec4899'],
  ];
  const [from, to] = gradients[index % gradients.length];

  const gradient = ctx.createLinearGradient(0, 0, 720, 1280);
  gradient.addColorStop(0, from);
  gradient.addColorStop(1, to);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 12; i += 1) {
    ctx.beginPath();
    ctx.arc(
      ((i * 59) % 700) + 10,
      ((i * 103) % 1200) + 20,
      10 + ((i * 7) % 20),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  drawRoundedRect(ctx, 50, 180, 620, 820, 36);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`SCENE ${index + 1} / ${total}`, 360, 250);

  ctx.font = 'bold 30px sans-serif';
  ctx.fillStyle = '#fde68a';
  ctx.fillText(scene.englishKeyword, 360, 310);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 46px sans-serif';

  const lines = wrapLines(ctx, scene.text, 520);
  let y = 470 - ((lines.length - 1) * 34);

  lines.forEach((line) => {
    ctx.fillText(line, 360, y);
    y += 78;
  });

  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(scene.title, 360, 940);

  return canvas.toDataURL('image/png');
};

export const buildSceneImages = (scenes: BuzzScene[]) => {
  return scenes.map((scene, index) => createSceneImage(scene, index, scenes.length));
};

export const buildAutoVideoFromScenes = async (
  scenes: BuzzScene[]
): Promise<AutoVideoResult | null> => {
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    typeof MediaRecorder === 'undefined'
  ) {
    return null;
  }

  const sceneImages = buildSceneImages(scenes);
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const stream = canvas.captureStream(30);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm';

  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  const drawFrame = (
    img: HTMLImageElement,
    progress: number
  ) => {
    const zoom = 1 + progress * 0.08;
    const dw = canvas.width * zoom;
    const dh = canvas.height * zoom;
    const dx = (canvas.width - dw) / 2;
    const dy = (canvas.height - dh) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  recorder.start();

  for (let i = 0; i < sceneImages.length; i += 1) {
    const img = new Image();
    img.src = sceneImages[i];
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });

    const durationMs = Math.max(3000, scenes[i].durationSec * 1000);
    const start = performance.now();

    await new Promise<void>((resolve) => {
      const render = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        drawFrame(img, progress);

        if (progress < 1) {
          requestAnimationFrame(render);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(render);
    });
  }

  await wait(100);
  recorder.stop();

  const stopped = await new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };
  });

  const videoDataUrl = URL.createObjectURL(stopped);
  const durationSec = scenes.reduce((sum, scene) => sum + scene.durationSec, 0);

  return {
    videoDataUrl,
    videoMimeType: mimeType,
    sceneImages,
    durationSec,
  };
};
